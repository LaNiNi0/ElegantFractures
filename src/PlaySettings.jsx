import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, ClipboardCopy, RotateCcw } from 'lucide-react';

// Every input starts empty. Examples only appear as placeholders, never as preselected canon.
const GROUPS = [
  {
    id: 'basic', title: '기본 정보', subtitle: '유저의 직업과 생활',
    fields: [
      {key:'job',label:'직업',required:true,example:'설가 대표 로펌 대표이사'},
      {key:'residence',label:'거주지',required:true,example:'XX동 고급 오피스텔'},
      {key:'health',label:'특이사항',example:'왼손잡이, 특별한 습관 등'},
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
    id:'iheon',title:'이헌과의 관계',subtitle:'플레이 시작 시점의 교류·관계와 재율의 인지 범위',
    fields:[
      {key:'jaeyulAwareness',label:'재율이 유저·이헌 사이를 아는 정도',required:true,options:['개인적 접점 자체를 모름','서로 아는 사이라는 것만 앎','연락·만남까지 알고 있음','흔들림 감지','일부 사건을 구체적으로 앎','상당 부분 알고 있음']},
      {key:'jaeyulKnowledgeDetail',label:'재율이 아는 사실·알게 된 경위',example:'이헌이 연락한다는 사실만 알고, 두 사람의 과거는 모름',long:true},
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
const JAEYUL_AWARENESS_TEXT = {
 '개인적 접점 자체를 모름':'재율은 유저와 이헌의 개인적 접점 자체를 알지 못함',
 '서로 아는 사이라는 것만 앎':'재율은 유저와 이헌이 서로 아는 사이라는 사실만 앎',
 '연락·만남까지 알고 있음':'재율은 유저와 이헌의 연락·만남 사실까지 알지만 관계의 성격은 모름',
 '흔들림 감지':'재율은 유저가 이헌에게 흔들리는 것을 눈치챘지만 구체적 경위는 모름',
 '일부 사건을 구체적으로 앎':'재율은 유저와 이헌 사이의 일부 사건을 구체적으로 알고 있음',
 '상당 부분 알고 있음':'재율은 유저와 이헌 사이의 상당 부분을 알고 있음'
};
const value = (v,k) => String(v[k] || '').replace(/\s+/g,' ').trim();
const include = items => items.filter(Boolean);
const detailedItem=(v,key,prefix)=>value(v,key)?prefix+value(v,key):null;
const detailedSection=(name,parts)=>{
  const facts=include(parts);
  if(!facts.length)return null;
  const body=facts.join('; ');
  return '-'+name+': '+body+(/[.!?。！？]$/.test(body)?'':'.');
};

// Detailed export: a SINGLE line with clear subjects and natural-language clauses.
// A section is separated by " | "; empty fields are omitted without changing user text.
export function buildPlayerSettingText(v){
  const publicity={
    '공개 연애':'두 사람은 공개 연애 중',
    '비공개 연애':'두 사람은 비공개 연애 중(대외공인X·목격·유출 등 근거 없는 소문생성X)',
    '가족에게만 공개':'두 사람의 연애는 가족에게만 공개(대외공인X·목격·유출 등 근거 없는 소문생성X)'
  }[value(v,'visibility')];
  const cohab={
    '동거 중':'유저와 재율은 동거 중',
    '각자 거주':'유저와 재율은 각자 거주'
  }[value(v,'cohab')];
  const loyalty=LOYALTY_TEXT[value(v,'loyalty')];
  const groups=[
    detailedSection('유저',[
      detailedItem(v,'job','직업은 '),detailedItem(v,'residence','거주지는 '),
      detailedItem(v,'health','특이사항은 '),detailedItem(v,'basicOther','그 밖의 설정은 ')
    ]),
    detailedSection('재율과의 관계',[
      cohab,publicity,loyalty,
      value(v,'callJaeyul')?"유저가 재율을 부르는 호칭은 '"+value(v,'callJaeyul')+"'":null,
      value(v,'callMe')?"재율이 유저를 부르는 호칭은 '"+value(v,'callMe')+"'":null
    ]),
    detailedSection('재율과의 추억',[
      detailedItem(v,'gift','재율의 주요 선물은 '),
      detailedItem(v,'restaurant','단골 식당은 '),
      detailedItem(v,'travel','자주 가는 여행지는 '),
      detailedItem(v,'food','자주 먹는 음식은 '),
      detailedItem(v,'memoriesOther','그 밖의 추억은 ')
    ]),
    detailedSection('재율과의 연애 습관',[
      detailedItem(v,'comfort','위로 방식은 '),
      detailedItem(v,'sulk','삐졌을 때는 '),
      detailedItem(v,'angry','화났을 때는 '),
      detailedItem(v,'reconcile','화해할 때는 '),
      detailedItem(v,'contact','연락 습관은 '),
      detailedItem(v,'date','데이트 습관은 '),
      detailedItem(v,'affection','애정 표현은 '),
      detailedItem(v,'special','특별한 날은 '),
      detailedItem(v,'skinship','스킨십은 '),
      detailedItem(v,'intimacy','잠자리·친밀한 관계는 '),
      detailedItem(v,'habitsOther','그 밖의 연애 습관은 ')
    ]),
    detailedSection('이헌과의 관계(플레이 시작 시점)',[
      detailedItem(v,'iheonContact','유저와 이헌의 연락은 '),
      detailedItem(v,'iheonMeeting','만남은 '),
      detailedItem(v,'iheonSkinship','스킨십·관계 진전은 '),
      detailedItem(v,'iheonEvents','기억에 남는 사건은 '),
      detailedItem(v,'iheonOther','그 밖의 관계 설정은 ')
    ]),
    detailedSection('재율의 유저·이헌 관련 초기 인지',[
      JAEYUL_AWARENESS_TEXT[value(v,'jaeyulAwareness')]||null,
      detailedItem(v,'jaeyulKnowledgeDetail','구체적으로 아는 사실과 알게 된 경위는 ')
    ])
  ];
  return include(groups).join(' | ');
}

// Compact notes: copy the user's own profile separately from initial relationships.
// Only include populated inputs; preserve the user's free text and selection meanings.
const compactPart=(key,text)=>text?key+'='+text:null;
const compactFrom=(v,key,name)=>compactPart(name,value(v,key));
const compactLine=(heading,parts)=>{
  const valid=parts.filter(Boolean);
  return valid.length?heading+': '+valid.join('/'):null;
};
const COMPACT_LOYALTY={
  '흔들리지 않는 사랑':'충실·타인연애감정X',
  '감정적 혼란은 가능':'기본충실·심각한갈등시감정흔들림가능(배신확정X)',
  '관계의 균열 가능':'기본충실·심각한위기시흔들림·충동가능(배신필연X)'
};
const COMPACT_AWARENESS={
  '개인적 접점 자체를 모름':'개인적접점모름',
  '서로 아는 사이라는 것만 앎':'서로아는사이만인지',
  '연락·만남까지 알고 있음':'연락·만남인지(관계성격모름)',
  '흔들림 감지':'이헌향한흔들림감지(경위모름)',
  '일부 사건을 구체적으로 앎':'일부사건인지',
  '상당 부분 알고 있음':'상당부분인지'
};
export function buildCompactPlayerProfileText(v){
  const lines=[
    compactFrom(v,'job','직업'),compactFrom(v,'residence','거주지'),
    compactFrom(v,'health','특이사항'),compactFrom(v,'basicOther','기타')
  ].filter(Boolean);
  return lines.length?['#유저프로필',...lines.map(x=>'-'+x)].join('\n'):'';
}
export function buildCompactInitialRelationshipText(v){
  const privacy={
    '공개 연애':'공개',
    '비공개 연애':'비공개(대외공인X·소문도근거필요)',
    '가족에게만 공개':'가족에게만공개(대외공인X·소문도근거필요)'
  }[value(v,'visibility')];
  const cohab={'동거 중':'동거중','각자 거주':'각자거주'}[value(v,'cohab')];
  const re=[
    cohab?'동거: '+cohab:null,
    compactPart('공개범위',privacy),
    compactPart('충실',COMPACT_LOYALTY[value(v,'loyalty')]),
    compactLine('호칭',[
      compactFrom(v,'callJaeyul','유저→재율'),
      compactFrom(v,'callMe','재율→유저')
    ]),
    compactLine('추억',[
      compactFrom(v,'gift','재율선물'),compactFrom(v,'restaurant','단골식당'),
      compactFrom(v,'travel','여행'),compactFrom(v,'food','음식'),
      compactFrom(v,'memoriesOther','기타')
    ]),
    compactLine('연애습관',[
      compactFrom(v,'comfort','위로'),compactFrom(v,'sulk','삐짐'),
      compactFrom(v,'angry','화남'),compactFrom(v,'reconcile','화해'),
      compactFrom(v,'contact','연락'),compactFrom(v,'date','데이트'),
      compactFrom(v,'affection','애정표현'),compactFrom(v,'special','특별한날'),
      compactFrom(v,'skinship','스킨십'),compactFrom(v,'intimacy','친밀관계'),
      compactFrom(v,'habitsOther','기타')
    ])
  ].filter(Boolean);
  const iheon=[
    compactFrom(v,'iheonContact','연락'),compactFrom(v,'iheonMeeting','만남'),
    compactFrom(v,'iheonSkinship','진도'),compactFrom(v,'iheonEvents','사건'),
    [COMPACT_AWARENESS[value(v,'jaeyulAwareness')],compactFrom(v,'jaeyulKnowledgeDetail','인지경위')].filter(Boolean).length
      ? '재율의이헌관련인지='+[COMPACT_AWARENESS[value(v,'jaeyulAwareness')],compactFrom(v,'jaeyulKnowledgeDetail','인지경위')].filter(Boolean).join('/')
      : null,
    compactFrom(v,'iheonOther','기타')
  ].filter(Boolean);
  const lines=['#초기관계'];
  if(re.length)lines.push('##재율',...re.map(x=>'-'+x));
  if(iheon.length)lines.push('', '##이헌',...iheon.map(x=>'-'+x));
  return re.length||iheon.length?lines.join('\n'):'';
}
// Backward-compatible combined export helper.
export function buildCompactPlayerSettingText(v){
  return [buildCompactPlayerProfileText(v),buildCompactInitialRelationshipText(v)].filter(Boolean).join('\n\n');
}
function readSaved(){
  try{
    const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(!v||typeof v!=='object'||Array.isArray(v))return {};
    // Older saved option labels should remain usable after the wording update.
    if(v.jaeyulAwareness==='가까운 사이라고 의심 중')v.jaeyulAwareness='흔들림 감지';
    if(v.jaeyulAwareness==='일부 사정을 구체적으로 앎')v.jaeyulAwareness='일부 사건을 구체적으로 앎';
    return v;
  }catch{return {}}
}
const countGroup=(values,group)=>group.fields.filter(f=>value(values,f.key)).length;

export default function PlaySettings(){
 const [form,setForm]=useState(readSaved);
 const [tab,setTab]=useState('basic');
 const [copyMessage,setCopyMessage]=useState('');
 const [format,setFormat]=useState('compact');
 const previewRef=useRef(null);
 const profilePreviewRef=useRef(null);
 const relationPreviewRef=useRef(null);
 const tabsRef=useRef(null);
 const dragRef=useRef(null);
 const draggedRef=useRef(false);
 const profileText=useMemo(()=>buildCompactPlayerProfileText(form),[form]);
 const relationshipText=useMemo(()=>buildCompactInitialRelationshipText(form),[form]);
 const detailedText=useMemo(()=>buildPlayerSettingText(form),[form]);
 const filled=GROUPS.reduce((n,g)=>n+countGroup(form,g),0);
 const total=GROUPS.reduce((n,g)=>n+g.fields.length,0);
 const missingRequired=REQUIRED_FIELDS.filter(f=>!value(form,f.key));
 const requiredComplete=REQUIRED_FIELDS.length-missingRequired.length;
 const missingProfile=missingRequired.filter(f=>f.group==='basic');
 const missingRelationship=missingRequired.filter(f=>f.group!=='basic');
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
 async function copy(content,ref,target){
   if(!content)return;
   try{
     if(!navigator.clipboard?.writeText)throw new Error('Clipboard API unavailable');
     await navigator.clipboard.writeText(content);
     setCopyMessage(target+':복사 완료');
   }catch{
     ref.current?.focus();ref.current?.select();
     setCopyMessage(target+':문구가 선택됐어. 직접 복사해 줘');
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
           {field.key==='jaeyulAwareness'&&<small className="play-field-hint">시작설정 《사랑의 유예》는 재율이 유저의 흔들림을 눈치챈 상태로 시작합니다. 최소 '흔들림 감지'를 선택해 주세요.</small>}
         </label>)}
       </div>
       <div className="play-panel-foot">
         <span>필수 {REQUIRED_FIELDS.length}개를 작성한 뒤 설정 문구를 복사할 수 있어</span>
         <button type="button" onClick={()=>setTab('summary')}>문구 확인 <ChevronRight size={14}/></button>
       </div>
     </section>
     : <section className="play-settings-panel play-summary-panel">
       <h3>최종 플레이 설정</h3>
       <p>유저 프로필과 초기 관계를 각각 복사해 필요한 설정란에 붙여넣을 수 있어. 상세형도 선택할 수 있어.</p>
       <div className="play-export-modes" role="group" aria-label="설정 문구 형식">
         <button type="button" className={format==='compact'?'active':''} aria-pressed={format==='compact'} onClick={()=>{setFormat('compact');setCopyMessage('')}}>분리형 · 압축 설정</button>
         <button type="button" className={format==='detailed'?'active':''} aria-pressed={format==='detailed'} onClick={()=>{setFormat('detailed');setCopyMessage('')}}>상세형 · 시작 메시지</button>
       </div>
       {missingRequired.length>0&&<div className="play-required-summary" role="status">
         <strong>필수 항목 {missingRequired.length}개 미입력</strong>
         <span>{missingRequired.map(f=>f.label).join(' · ')}</span>
         <button type="button" onClick={()=>setTab(missingRequired[0].group)}>필수 항목 작성하기 <ChevronRight size={14}/></button>
       </div>}
       {format==='compact' ? <div className="play-compact-exports">
         <div className="play-export-section">
           <div className="play-export-section-head">
             <strong>유저 프로필</strong><span>{profileText.length}자</span>
           </div>
           <p>직업·거주지·특이사항 등 유저 개인 설정</p>
           <textarea ref={profilePreviewRef} className="play-export-preview" readOnly spellCheck={false}
             value={profileText} placeholder="기본 정보를 입력하면 여기에 정리돼" rows={Math.max(4,Math.min(10,profileText.split('\n').length+2))}/>
           <button type="button" className="play-copy-button" disabled={!profileText||missingProfile.length>0}
             onClick={()=>copy(profileText,profilePreviewRef,'profile')}>
             {copyMessage==='profile:복사 완료'?<Check size={17}/>:<ClipboardCopy size={17}/>}
             {copyMessage==='profile:복사 완료'?'복사 완료':'유저 프로필 복사'}
           </button>
           {copyMessage.startsWith('profile:')&&<p className="play-copy-message">{copyMessage.split(':').slice(1).join(':')}</p>}
         </div>
         <div className="play-export-section">
           <div className="play-export-section-head">
             <strong>초기 관계</strong><span>{relationshipText.length}자</span>
           </div>
           <p>재율·이헌과의 초기 관계와 인지 범위</p>
           <textarea ref={relationPreviewRef} className="play-export-preview" readOnly spellCheck={false}
             value={relationshipText} placeholder="관계 설정을 입력하면 여기에 정리돼" rows={Math.max(8,Math.min(20,relationshipText.split('\n').length+2))}/>
           <button type="button" className="play-copy-button" disabled={!relationshipText||missingRelationship.length>0}
             onClick={()=>copy(relationshipText,relationPreviewRef,'relationship')}>
             {copyMessage==='relationship:복사 완료'?<Check size={17}/>:<ClipboardCopy size={17}/>}
             {copyMessage==='relationship:복사 완료'?'복사 완료':'초기 관계 복사'}
           </button>
           {copyMessage.startsWith('relationship:')&&<p className="play-copy-message">{copyMessage.split(':').slice(1).join(':')}</p>}
         </div>
       </div> : <>
         <textarea ref={previewRef} className="play-export-preview" readOnly spellCheck={false}
           value={detailedText} placeholder="설정을 작성하면 여기에 자동으로 정리돼" rows={Math.max(7,Math.min(18,detailedText.split('\n').length+5))}/>
         <button type="button" className="play-copy-button" disabled={!detailedText||missingRequired.length>0}
           onClick={()=>copy(detailedText,previewRef,'detailed')}>
           {copyMessage==='detailed:복사 완료'?<Check size={17}/>:<ClipboardCopy size={17}/>}
           {copyMessage==='detailed:복사 완료'?'복사 완료':'상세 설정 복사'}
         </button>
         {copyMessage.startsWith('detailed:')&&<p className="play-copy-message">{copyMessage.split(':').slice(1).join(':')}</p>}
       </>}
       <div className="play-panel-foot">
         <span>{format==='compact'?'프로필 '+profileText.length+'자 · 관계 '+relationshipText.length+'자':'상세 '+detailedText.length+'자'}</span>
         <button type="button" className="play-clear" onClick={reset}><RotateCcw size={13}/> 입력 내용 초기화</button>
       </div>
     </section>}
 </div>;
}
