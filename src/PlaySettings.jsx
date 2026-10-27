import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, ClipboardCopy, RotateCcw } from 'lucide-react';

// Every input starts empty. Examples only appear as placeholders, never as preselected canon.
const GROUPS = [
  {
    id: 'basic', title: '기본 정보', subtitle: '유저의 직업과 생활',
    fields: [
      {key:'job',label:'직업',example:'설가 대표 로펌 대표이사'},
      {key:'residence',label:'거주지',example:'XX동 고급 오피스텔'},
      {key:'health',label:'건강·특이사항',example:'심한 편두통 있음'},
      {key:'basicOther',label:'기타',example:'추가하고 싶은 기본 정보',long:true}
    ]
  },
  {
    id:'relationship',title:'재율과의 관계',subtitle:'공개 연애 여부와 서로의 애칭',
    fields:[
      {key:'visibility',label:'연애 공개 여부',options:['공개 연애','비공개 연애','가족에게만 공개']},
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
const STORAGE_KEY = 'ef-player-setup-v1';
const value = (v,k) => (v[k] || '').trim();
const pair = (label,content) => content ? label + ': ' + content : null;
const included = values => values.filter(Boolean).join(' / ');

export function buildPlayerSettingText(v) {
  const paragraphs = [];
  const basic = included([
    pair('직업',value(v,'job')),pair('거주지',value(v,'residence')),
    pair('건강·특이사항',value(v,'health')),pair('기타',value(v,'basicOther'))
  ]);
  if(basic) paragraphs.push('유저: ' + basic + '.');

  const relationships = [];
  if(value(v,'visibility')) relationships.push('연애 공개 여부: ' + value(v,'visibility'));
  if(value(v,'callJaeyul')) relationships.push('유저가 재율을 부르는 애칭: ' + value(v,'callJaeyul'));
  if(value(v,'callMe')) relationships.push('재율이 유저를 부르는 애칭: ' + value(v,'callMe'));
  if(relationships.length) paragraphs.push('후재율과의 관계: ' + included(relationships) + '.');

  const memories = included([
    pair('주요 선물',value(v,'gift')),pair('단골 식당',value(v,'restaurant')),
    pair('자주 가는 여행지',value(v,'travel')),pair('자주 먹는 음식',value(v,'food')),
    pair('기타',value(v,'memoriesOther'))
  ]);
  if(memories) paragraphs.push('후재율과의 추억: ' + memories + '.');

  const habits = included([
    pair('위로',value(v,'comfort')),pair('삐졌을 때',value(v,'sulk')),
    pair('화났을 때',value(v,'angry')),pair('화해',value(v,'reconcile')),
    pair('연락',value(v,'contact')),pair('데이트',value(v,'date')),
    pair('애정 표현',value(v,'affection')),pair('특별한 날',value(v,'special')),
    pair('스킨십',value(v,'skinship')),pair('잠자리·친밀한 관계',value(v,'intimacy')),
    pair('기타',value(v,'habitsOther'))
  ]);
  if(habits) paragraphs.push('후재율과의 연애 습관: ' + habits + '.');

  const iheon = included([
    pair('연락',value(v,'iheonContact')),pair('만남',value(v,'iheonMeeting')),
    pair('스킨십·진도',value(v,'iheonSkinship')),
    pair('기억에 남는 사건',value(v,'iheonEvents')),pair('기타',value(v,'iheonOther'))
  ]);
  if(iheon) paragraphs.push('황보이헌과의 관계(플레이 시작 시점): ' + iheon + '.');

  if(!paragraphs.length) return '';
  return '[《우아한 균열》 플레이어 사전 설정]\n'
    + '아래는 플레이 시작 전 확정한 유저의 설정이다. 기재하지 않은 사항은 임의로 확정하지 말 것.\n\n'
    + paragraphs.join('\n');
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
 const text=useMemo(()=>buildPlayerSettingText(form),[form]);
 const filled=GROUPS.reduce((n,g)=>n+countGroup(form,g),0);
 const total=GROUPS.reduce((n,g)=>n+g.fields.length,0);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(form))}catch{}},[form]);
 const current=GROUPS.find(g=>g.id===tab);
 function update(key,input){setForm(old=>({...old,[key]:input}));setCopyMessage('')}
 async function copy(){
   if(!text)return;
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
   <div className="play-settings-progress">
     <span>작성한 항목 <strong>{filled}</strong> / {total}</span>
     <button type="button" onClick={()=>setTab('summary')} aria-label="최종 설정 문구 보기">미리보기 <ChevronRight size={14}/></button>
   </div>
   <div className="play-settings-tabs" role="tablist" aria-label="플레이 설정 항목">
     {GROUPS.map(g=><button key={g.id} type="button" role="tab" aria-selected={tab===g.id}
       className={tab===g.id?'selected':''} onClick={()=>setTab(g.id)}>
       {g.title}{countGroup(form,g)>0&&<span>{countGroup(form,g)}</span>}
     </button>)}
     <button type="button" role="tab" aria-selected={tab==='summary'}
       className={tab==='summary'?'selected':''} onClick={()=>setTab('summary')}>복사하기</button>
   </div>
   {current
     ? <section className="play-settings-panel" key={current.id}>
       <h3>{current.title}</h3><p>{current.subtitle}</p>
       <div className="play-fields">
         {current.fields.map(field=><label className="play-field" key={field.key}>
           <span>{field.label}</span>
           {field.options
             ? <select value={form[field.key]||''} onChange={e=>update(field.key,e.target.value)}>
               <option value="">선택하지 않음</option>
               {field.options.map(option=><option key={option} value={option}>{option}</option>)}
               </select>
             : field.long
             ? <textarea rows={3} value={form[field.key]||''}
                 onChange={e=>update(field.key,e.target.value)}
                 placeholder={'예: '+field.example}/>
             : <input type="text" value={form[field.key]||''}
                 onChange={e=>update(field.key,e.target.value)}
                 placeholder={'예: '+field.example}/>}
         </label>)}
       </div>
       <div className="play-panel-foot">
         <span>선택한 항목만 최종 문구에 포함돼</span>
         <button type="button" onClick={()=>setTab('summary')}>문구 확인 <ChevronRight size={14}/></button>
       </div>
     </section>
     : <section className="play-settings-panel play-summary-panel">
       <h3>최종 플레이 설정</h3>
       <p>입력한 내용만 모아서 AI에게 전달하기 좋은 하나의 문구로 정리했어</p>
       <textarea ref={previewRef} className="play-export-preview" readOnly spellCheck={false}
         value={text} placeholder="설정을 작성하면 여기에 자동으로 정리돼" rows={Math.max(7,Math.min(18,text.split('\n').length+5))}/>
       <button type="button" className="play-copy-button" disabled={!text} onClick={copy}>
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
