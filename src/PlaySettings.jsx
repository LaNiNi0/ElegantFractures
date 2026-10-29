import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, ClipboardCopy, RotateCcw } from 'lucide-react';

// Every input starts empty. Examples only appear as placeholders, never as preselected canon.
const GROUPS = [
  {
    id: 'basic', title: '기본 정보', subtitle: '유저의 직업과 생활',
    fields: [
      {key:'job',label:'직업',required:true,example:'설가 대표 로펌 대표이사'},
      {key:'residence',label:'거주지',required:true,example:'XX동 고급 오피스텔'},
      {key:'health',label:'건강·특이사항',example:'심한 편두통 있음'},
      {key:'basicOther',label:'기타',example:'추가하고 싶은 기본 정보',long:true}
    ]
  },
  {
    id:'relationship',title:'재율과의 관계',subtitle:'동거·연애 공개·충실함과 서로의 애칭',
    fields:[
      {key:'cohab',label:'동거 여부',required:true,options:['동거 중','각자 거주']},
      {key:'visibility',label:'연애 공개 여부',required:true,options:['공개 연애','비공개 연애','가족에게만 공개']},
      {key:'loyalty',label:'재율의 충실함',required:true,options:['흔들리지 않는 사랑','감정적 혼란은 가능','관계의 균열 가능']},
      {key:'callJaeyul',label:'나 → 재율',example:'율'},
      {key:'callMe',label:'재율 → 나',example:'자기'}
    ]
  },
  {
    id:'memories',title:'함께한 추억',subtitle:'십 년 동안 쌓아온 기억',
    fields:[
      {key:'gift',label:'주요 선물',example:'재율이 처음 선물한 별 모양 펜던트 목걸이'},
      {key:'restaurant',label:'단골 식당',example:'재율 집 근처 한식집'},
      {key:'travel',label:'자주 가는 여행지',example:'제주도'},
      {key:'food',label:'자주 먹는 음식',example:'스트레스 풀 때 먹는 매운 떡볶이'},
      {key:'memoriesOther',label:'기타 추억',example:'특별한 장소나 추억을 자유롭게 작성',long:true}
    ]
  },
  {
    id:'habits',title:'연애 습관',subtitle:'둘만의 위로, 다툼, 화해와 친밀함',
    fields:[
      {key:'comfort',label:'위로',example:'힘들 때 민트 초코 아이스크림을 사줌'},
      {key:'sulk',label:'삐졌을 때',example:'💩 문자를 보냄'},
      {key:'angry',label:'화났을 때',example:'아침에 전화하지 않음'},
      {key:'reconcile',label:'화해 방식',example:'같이 먹자는 의미로 음식 기프티콘을 보냄'},
      {key:'contact',label:'연락 습관',example:'매일 아침 출근할 때 재율이 전화함'},
      {key:'date',label:'데이트 습관',example:'밤에 한강 산책을 즐김'},
      {key:'affection',label:'애정 표현',example:'자주 사랑한다고 말하거나 놀림'},
      {key:'special',label:'특별한 날',example:'생일, 기념일, 발렌타인데이'},
      {key:'skinship',label:'스킨십',example:'재율이 틈만 나면 안아 줌'},
      {key:'intimacy',label:'잠자리·친밀한 관계',example:'보통 주 1회, 원할 때 🫦 문자를 보냄'},
      {key:'habitsOther',label:'기타 습관',example:'추가하고 싶은 둘만의 습관',long:true}
    ]
  },
  {
    id:'iheon',title:'이헌과의 관계',subtitle:'플레이 시작 시점까지의 연락과 관계 진도',
    fields:[
      {key:'iheonContact',label:'연락',example:'이헌의 연락은 대부분 무시함'},
      {key:'iheonMeeting',label:'만남',example:'황보가와의 협업으로 2주에 한 번 관계자 미팅'},
      {key:'iheonSkinship',label:'스킨십·진도',example:'술에 취한 상태에서 키스'},
      {key:'iheonEvents',label:'기억에 남는 사건',example:'파파라치에게 쫓길 때 이헌이 구해줌',long:true},
      {key:'iheonOther',label:'기타',example:'이헌과의 관계에 관해 추가할 내용',long:true}
    ]
  }
];
// Reuse existing storage: preserve existing selections and notes.
const STORAGE_KEY = 'ef-player-setup-v1';
const REQUIRED_FIELDS = GROUPS.flatMap(g=>g.fields.filter(f=>f.required).map(f=>({...f,group:g.id})));
const LOYALTY_TEXT = {
 '흔들리지 않는 사랑':'재율은 연인에게 충실하며 다른 사람에게 연애 감정으로 흔들리지 않음',
 '감정적 혼란은 가능':'재율은 기본적으로 충실하려 하지만 심각한 관계 갈등 시 다른 사람의 호의에 감정적으로 흔들릴 수 있음(실제 배신은 확정 아님)',
 '관계의 균열 가능':'재율은 기본적으로 충실하려 하지만 심각한 관계 위기 시 다른 사람에게 흔들리거나 충동적 선택을 할 수 있음(배신은 필연 아님)'
};
const value = (v,k) => String(v[k] || '').replace(/\s+/g,' ').trim();
const include = items => items.filter(Boolean);
const item = (values,key,prefix) => value(values,key) ? prefix + value(values,key) : null;
const section = (name,clauses) => {
  const text=include(clauses);
  if(!text.length)return null;
  const body=text.join(' / ');
  return '- ' + name + ': ' + body + (/[.!?。！？]$/.test(body) ? '' : '.');
};

// One continuous, AI-readable line. Only the section heading gets a colon;
// empty inputs disappear, and the user's original details are preserved.
export function buildPlayerSettingText(v) {
  const visibility=value(v,'visibility');
  const publicity=visibility==='공개 연애' ? '후재율과 공개 연애 중'
    : visibility==='비공개 연애' ? '후재율과 비공개 연애 중'
    : visibility==='가족에게만 공개' ? '후재율과의 연애는 가족에게만 공개'
    : null;
  const cohab=value(v,'cohab');
  const together=cohab==='동거 중'?'후재율과 동거 중':cohab==='각자 거주'?'후재율과 각자 거주':null;
  const loyalty=LOYALTY_TEXT[value(v,'loyalty')]||null;
  const groups=[
    section('유저',[
      item(v,'job','직업은 '),item(v,'residence','거주지는 '),
      item(v,'health','건강·특이사항은 '),value(v,'basicOther')||null
    ]),
    section('후재율과의 관계',[
      together,publicity,loyalty,
      value(v,'callJaeyul') ? "유저는 재율을 '" + value(v,'callJaeyul') + "'이라고 부름" : null,
      value(v,'callMe') ? "재율은 유저를 '" + value(v,'callMe') + "'이라고 부름" : null
    ]),
    section('후재율과의 추억',[
      item(v,'gift','주요 선물은 '),item(v,'restaurant','단골 식당은 '),
      item(v,'travel','자주 가는 여행지는 '),item(v,'food','자주 먹는 음식은 '),
      value(v,'memoriesOther')||null
    ]),
    section('후재율과의 연애 습관',[
      item(v,'comfort','위로할 때 '),item(v,'sulk','삐졌을 때 '),
      item(v,'angry','화났을 때 '),item(v,'reconcile','화해할 때 '),
      item(v,'contact','연락은 '),item(v,'date','데이트는 '),
      item(v,'affection','애정 표현은 '),item(v,'special','특별한 날은 '),
      item(v,'skinship','스킨십은 '),item(v,'intimacy','잠자리·친밀한 관계는 '),
      value(v,'habitsOther')||null
    ]),
    section('황보이헌과의 관계 (플레이 시작 시점)',[
      item(v,'iheonContact','연락은 '),item(v,'iheonMeeting','만남은 '),
      item(v,'iheonSkinship','스킨십·진도는 '),
      item(v,'iheonEvents','기억에 남는 사건은 '),
      value(v,'iheonOther')||null
    ])
  ];
  return include(groups).join(' | ');
}
function readSaved(){
  try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}
}
const countGroup=(values,group)=>group.fields.filter(f=>value(values,f.key)).length;

export default function PlaySettings(){
 const [form,setForm]=useState(readSaved);
 const [tab,setTab]=useState('basic');
 const [copyMessage,setCopyMessage]=useState('');
 const previewRef=useRef(null);
 const tabsRef=useRef(null);
 const dragRef=useRef(null);
 const draggedRef=useRef(false);
 const text=useMemo(()=>buildPlayerSettingText(form),[form]);
 const filled=GROUPS.reduce((n,g)=>n+countGroup(form,g),0);
 const total=GROUPS.reduce((n,g)=>n+g.fields.length,0);
 const missingRequired=REQUIRED_FIELDS.filter(f=>!value(form,f.key));
 const requiredComplete=REQUIRED_FIELDS.length-missingRequired.length;
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(form))}catch{}},[form]);
 const current=GROUPS.find(g=>g.id===tab);
 function update(key,input){setForm(old=>({...old,[key]:input}));setCopyMessage('')}
 function scrollTabs(distance){
   tabsRef.current?.scrollBy({left:distance,behavior:'smooth'});
 }
 function onTabsPointerDown(e){
   if(e.pointerType!=='mouse'||e.button!==0)return;
   draggedRef.current=false;
   dragRef.current={id:e.pointerId,x:e.clientX,left:e.currentTarget.scrollLeft,dragging:false};
 }
 function onTabsPointerMove(e){
   const drag=dragRef.current;
   if(!drag||drag.id!==e.pointerId||!(e.buttons&1))return;
   const dx=e.clientX-drag.x;
   if(Math.abs(dx)>5)drag.dragging=true;
   if(!drag.dragging)return;
   e.preventDefault();
   if(!e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.setPointerCapture(e.pointerId);
   e.currentTarget.scrollLeft=drag.left-dx;
 }
 function onTabsPointerUp(e){
   const drag=dragRef.current;
   if(!drag||drag.id!==e.pointerId)return;
   draggedRef.current=drag.dragging;
   dragRef.current=null;
   if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
 }
 function onTabsClickCapture(e){
   if(!draggedRef.current)return;
   draggedRef.current=false;
   e.preventDefault();
   e.stopPropagation();
 }
 async function copy(){
   if(!text||missingRequired.length)return;
   try{
     if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');
     await navigator.clipboard.writeText(text);
     setCopyMessage('설정 문구가 복사됐어');
   }catch{
     previewRef.current?.focus();previewRef.current?.select();
     setCopyMessage('복사할 문구가 선택됐어. 직접 복사해 줘');
   }
 }
 function reset(){
   if(!window.confirm('직접 작성한 모든 플레이 설정을 지울까?'))return;
   setForm({});setCopyMessage('');setTab('basic');
 }
 return <div className="app-content play-settings-app">
   <div className="section-kicker">PLAYER PROFILE · 2027</div>
   <h2>플레이 설정</h2>
   <p className="play-settings-subtitle">플레이를 시작하기 전, 내 관계와 일상을 자유롭게 정리해 봐</p>
   <p className="play-settings-required-note"><span aria-hidden="true">*</span> 표시는 플레이 시작 전 꼭 선택하거나 작성할 항목이야.</p>
   <div className="play-settings-progress">
     <span>작성한 항목 <strong>{filled}</strong> / {total}<small className="play-required-progress">필수 {requiredComplete}/{REQUIRED_FIELDS.length} 완료</small></span>
     <button type="button" onClick={()=>setTab('summary')} aria-label="최종 설정 문구 보기">미리보기 <ChevronRight size={14}/></button>
   </div>
   <div className="play-settings-tab-shell">
     <button type="button" className="play-settings-tab-arrow" aria-label="이전 설정 탭 보기" onClick={()=>scrollTabs(-176)}>‹</button>
     <div className="play-settings-tabs" ref={tabsRef} role="tablist" aria-label="플레이 설정 항목"
       onPointerDown={onTabsPointerDown} onPointerMove={onTabsPointerMove}
       onPointerUp={onTabsPointerUp} onPointerCancel={onTabsPointerUp}
       onClickCapture={onTabsClickCapture}>
       {GROUPS.map(g=><button key={g.id} type="button" role="tab" aria-selected={tab===g.id}
         className={tab===g.id?'selected':''} onClick={()=>setTab(g.id)}>
         {g.title}{countGroup(form,g)>0&&<span>{countGroup(form,g)}</span>}
       </button>)}
       <button type="button" role="tab" aria-selected={tab==='summary'}
         className={tab==='summary'?'selected':''} onClick={()=>setTab('summary')}>복사하기</button>
     </div>
     <button type="button" className="play-settings-tab-arrow" aria-label="다음 설정 탭 보기" onClick={()=>scrollTabs(176)}>›</button>
   </div>
   {current
     ? <section className="play-settings-panel" key={current.id}>
       <h3>{current.title}</h3><p>{current.subtitle}</p>
       <div className="play-fields">
         {current.fields.map(field=><label className="play-field" key={field.key}>
           <span>{field.label}{field.required&&<span className="play-required-star" aria-label="필수 항목"> *</span>}</span>
           {field.options
             ? <select value={form[field.key]||''} aria-required={!!field.required} onChange={e=>update(field.key,e.target.value)}>
               <option value="">선택하지 않음</option>
               {field.options.map(option=><option key={option} value={option}>{option}</option>)}
               </select>
             : field.long
             ? <textarea rows={3} aria-required={!!field.required} value={form[field.key]||''}
                 onChange={e=>update(field.key,e.target.value)}
                 placeholder={'예: '+field.example}/>
             : <input type="text" aria-required={!!field.required} value={form[field.key]||''}
                 onChange={e=>update(field.key,e.target.value)}
                 placeholder={'예: '+field.example}/>}
         </label>)}
       </div>
       <div className="play-panel-foot">
         <span>필수 5개를 작성한 뒤 설정 문구를 복사할 수 있어</span>
         <button type="button" onClick={()=>setTab('summary')}>문구 확인 <ChevronRight size={14}/></button>
       </div>
     </section>
     : <section className="play-settings-panel play-summary-panel">
       <h3>최종 플레이 설정</h3>
       <p>입력한 내용을 줄바꿈 없이 한 줄로 정리했어. 필수 항목을 모두 채운 뒤 플레이 시작 메시지에 붙여넣어 봐</p>
       {missingRequired.length>0&&<div className="play-required-summary" role="status">
         <strong>필수 항목 {missingRequired.length}개 미입력</strong>
         <span>{missingRequired.map(f=>f.label).join(' · ')}</span>
         <button type="button" onClick={()=>setTab(missingRequired[0].group)}>필수 항목 작성하기 <ChevronRight size={14}/></button>
       </div>}
       <textarea ref={previewRef} className="play-export-preview" readOnly spellCheck={false}
         value={text} placeholder="설정을 작성하면 여기에 자동으로 정리돼" rows={Math.max(7,Math.min(18,text.split('\n').length+5))}/>
       <button type="button" className="play-copy-button" disabled={!text||missingRequired.length>0} onClick={copy}>
         {copyMessage.startsWith('설정 문구가')?<Check size={17}/>:<ClipboardCopy size={17}/>}
         {copyMessage.startsWith('설정 문구가')?'복사 완료':'설정 문구 복사'}
       </button>
       {copyMessage&&<p className="play-copy-message" role="status">{copyMessage}</p>}
       <div className="play-panel-foot">
         <span>{text.length}자</span>
         <button type="button" className="play-clear" onClick={reset}><RotateCcw size={13}/> 입력 내용 초기화</button>
       </div>
     </section>}
 </div>;
}
