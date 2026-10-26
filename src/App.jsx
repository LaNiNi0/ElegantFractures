import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BatteryFull, BookOpen, CalendarDays, Camera, Check, ChevronRight, Clock3, Compass, Contact, FileText, Folder, Globe2, Heart, Home, Image as ImageIcon, Info, LockKeyhole, Mail, Menu, MessageCircle, Moon, NotebookPen, Phone, PhoneIncoming, PhoneMissed, Search, Settings, Shield, Signal, Sparkles, Star, UserRound, Wifi, X } from 'lucide-react';
import { people, houses, notes, events, conversations, calls } from './data/story';

const icons = {notes:NotebookPen,calendar:CalendarDays,contacts:Contact,calls:Phone,messages:MessageCircle,browser:Compass,gallery:ImageIcon,settings:Settings};
const apps = [
 {id:'calls',title:'전화',icon:Phone,color:'#435349'},
 {id:'messages',title:'메시지',icon:MessageCircle,color:'#583640'},
 {id:'browser',title:'브라우저',icon:Compass,color:'#493941'},
 {id:'gallery',title:'사진',icon:ImageIcon,color:'#925664'},
 {id:'notes',title:'메모',icon:NotebookPen,color:'#e8d8c7'},
 {id:'calendar',title:'캘린더',icon:CalendarDays,color:'#66414b'},
 {id:'contacts',title:'연락처',icon:Contact,color:'#e4d7cb'},
 {id:'settings',title:'설정',icon:Settings,color:'#403439'}
];
const initialPrefs = () => {
 try { return {spoilers:false,relationship:'미설정',nickname:'',...(JSON.parse(localStorage.getItem('ef-prefs'))||{})}; }
 catch { return {spoilers:false,relationship:'미설정',nickname:''}; }
};
const formatKorean = (d) => new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(d);
const pageTitle = (id) => apps.find(x=>x.id===id)?.title || '홈';
const imageRoot = '/ElegantFractures/images/';
const portraitOf = id => id==='jaeyul'?imageRoot+'Jaeyoul_profile.jpg':id==='iheon'?imageRoot+'Ehun_profile.png':null;
function Avatar({name,id,large=false}) {
 const portrait=portraitOf(id);
 return <span className={'avatar '+(large?'avatar-large':'')+(portrait?' avatar-photo':'')} aria-label={name+' 프로필'}>
   {name?.slice(0,1)||'?'}
   {portrait&&<img src={portrait} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/>}
 </span>
}
function Empty({children}) {return <div className="empty"><Sparkles size={20}/><p>{children}</p></div>}
function App() {
 const [route,setRoute]=useState('home');
 const [locked,setLocked]=useState(true);
 const [now,setNow]=useState(()=>new Date());
 const swipeOrigin=useRef(null);
 useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),30000);return ()=>clearInterval(timer)},[]);
 const [stack,setStack]=useState([]);
 const [query,setQuery]=useState('');
 const [picked,setPicked]=useState(null);
 const [folder,setFolder]=useState(null);
 const [month,setMonth]=useState(6);
 const [prefs,setPrefs]=useState(initialPrefs);
 const [browserPage,setBrowserPage]=useState('portal');
 const [browserInput,setBrowserInput]=useState('');
 const [callFilter,setCallFilter]=useState('전체');
 const [photosView,setPhotosView]=useState(null);
 const [showSearch,setShowSearch]=useState(false);
 function updatePrefs(value){setPrefs(prev=>{const n={...prev,...value};try{localStorage.setItem('ef-prefs',JSON.stringify(n));}catch{}return n})}
 function navigate(to){if(to===route)return;setStack(old=>[...old,route]);setRoute(to);setPicked(null);setFolder(null);setQuery('');setShowSearch(false)}
 function back(){if(picked){setPicked(null);return}if(photosView){setPhotosView(null);return}if(folder){setFolder(null);return}setRoute(stack.at(-1)||'home');setStack(old=>old.slice(0,-1));setQuery('')}
 function home(){setRoute('home');setStack([]);setPicked(null);setFolder(null);setPhotosView(null);setQuery('');setShowSearch(false)}
 const visible = list => list.filter(x=>!x.spoiler||prefs.spoilers);
 const matched = (value)=>value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
 const time = new Intl.DateTimeFormat('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(now);
 // Story date is an editable placeholder until the narrative's opening day is finalized.
 const storyDate = new Date(2027,8,18);
 const lockDate = new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(storyDate);
 function unlock(){setLocked(false);setRoute('home');setStack([]);setPicked(null);setFolder(null)}
 function lock(){home();setLocked(true)}
 function onSwipeStart(e){swipeOrigin.current=e.clientY}
 function onSwipeEnd(e){if(swipeOrigin.current!==null&&swipeOrigin.current-e.clientY>54)unlock();swipeOrigin.current=null}
 function quickOpen(app){setLocked(false);setRoute(app);setStack(['home']);setPicked(null);setFolder(null);setQuery('')}

 const segments = { '가까운 사람':'MY PEOPLE','설가':'SEOL','황보가':'HWANGBO','선우가':'SEONWOO','차가':'CHA','권가':'KWON' };
 const shownPeople = useMemo(()=>visible(people).filter(p=>matched(p.name+' '+p.label+' '+p.group)),[query,prefs.spoilers]);
 const monthDays = useMemo(()=>{const days=new Date(2027,month+1,0).getDate();const start=new Date(2027,month,1).getDay();return [...Array(start).fill(null),...Array.from({length:days},(_,i)=>i+1)]},[month]);
 const monthEvents=events.filter(e=>Number(e.date.slice(5,7))===month+1);
 const calendarData = day => events.filter(e=>Number(e.date.slice(5,7))===month+1 && Number(e.date.slice(8,10))===day);
 const [day,setDay]=useState(23);
 const appButton=(a)=>{const I=a.icon;return <button key={a.id} className="app-entry" onClick={()=>navigate(a.id)}><span className={'app-icon tile-'+a.id} style={{'--tile':a.color}}><I size={25} strokeWidth={1.6}/></span><span>{a.title}</span></button>};
 const content = () => {
 if(route==='home') return <div className="home-screen">
   <div className="home-apps">{apps.slice(4).map(appButton)}</div>
   <div className="home-pagination" aria-hidden="true"><span className="active"/><span/></div>
   <div className="dock">{apps.slice(0,4).map(appButton)}</div>
 </div>;
 if(route==='notes') return <div className="app-content">
   {!folder&&!picked?<><div className="section-kicker">FOLDERS</div><h2>메모</h2><p className="muted">내가 기억하고 싶은 것들</p>
    <div className="folder-grid">{[{name:'재율과의 기록',count:notes.filter(x=>x.folder==='재율과의 기록').length,sub:'10년의 시간'},{name:'명가 기록',count:notes.filter(x=>x.folder==='명가 기록'&&(!x.spoiler||prefs.spoilers)).length,sub:'다섯 가문'}].map(f=><button className="folder-card" key={f.name} onClick={()=>{setFolder(f.name);setQuery('')}}><Folder size={28} fill="currentColor" strokeWidth={1.2}/><strong>{f.name}</strong><small>{f.sub} · {f.count}개</small><ChevronRight size={16}/></button>)}</div>
    <div className="notice"><LockKeyhole size={15}/> 중요한 비밀은 설정에서 스포일러를 허용한 경우에만 표시됩니다.</div>
   </>:picked?<><div className="section-kicker">{picked.folder} · {picked.date}</div><h2>{picked.title}</h2>{picked.proposal&&<span className="tag proposal">일부 날짜 제안 중</span>}<div className="note-sheet">{picked.body.split('\n').map((line,i)=><p key={i}>{line||'\u00a0'}</p>)}</div><p className="muted small">이 기록은 작품 설정을 기반으로 편집된 아카이브이며 플레이어의 감정과 행동을 확정하지 않습니다.</p></>:
   <><div className="section-kicker">NOTES / {folder}</div><h2>{folder}</h2><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="메모 검색" aria-label="메모 검색"/></div><div className="records">{visible(notes).filter(n=>n.folder===folder&&matched(n.title+' '+n.body)).map(n=><button className="record" key={n.id} onClick={()=>setPicked(n)}><div><strong>{n.title}</strong><small>{n.date} {n.proposal?'· 날짜 기준안':''}</small></div><ChevronRight size={16}/></button>)}</div></>}
 </div>;
 if(route==='contacts') return <div className="app-content"><div className="section-kicker">PEOPLE & CONNECTIONS</div><h2>연락처</h2>{picked?<div className="person-detail"><Avatar name={picked.name} id={picked.id} large/><h2>{picked.name}</h2><span className="muted">{picked.label}</span><div className="detail-grid"><span>소속</span><strong>{picked.group}</strong><span>생년월일</span><strong>{picked.birth}</strong></div><h3>인물 메모</h3><p>{picked.detail}</p><p className="muted small">가상의 연락처 · 실제 전화나 메시지는 발송되지 않습니다.</p></div>:<><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="이름 또는 가문 검색" aria-label="연락처 검색"/></div>{Object.keys(segments).map(group=>{const groupPeople=shownPeople.filter(p=>p.group===group);return groupPeople.length?<section className="group-section" key={group}><div className="section-kicker">{segments[group]} · {group}</div>{groupPeople.map(p=><button className="person-row" key={p.id} onClick={()=>setPicked(p)}><Avatar name={p.name} id={p.id}/><span><strong>{p.name}</strong><small>{p.label}</small></span><ChevronRight size={15}/></button>)}</section>:null})}</>}</div>;
 if(route==='calls')return <div className="app-content">
  <div className="section-kicker">RECENTS · 2027.09.05–09.18</div><h2>최근 통화</h2>
  <div className="pills">{['전체','부재중'].map(v=><button className={callFilter===v?'active':''} onClick={()=>setCallFilter(v)} key={v}>{v}</button>)}</div>
  {visible(calls).filter(x=>callFilter==='전체'||x.kind==='부재중'||x.kind==='거절').map((c,i)=>
   <div className={'person-row no-pointer call-record'+((c.kind==='부재중'||c.kind==='거절')?' is-missed':'')} key={c.date+'-'+c.id+'-'+i}>
    <Avatar name={c.name} id={c.id}/>
    <span><strong>{c.name}</strong><small>{c.kind}{c.duration?' · '+c.duration:''}</small></span>
    <span className="call-time">{c.time}</span>
   </div>
  )}
  <div className="notice"><Info size={15}/> 2027년 9월 5~18일의 창작 예시 통화 기록이야. 실제 발신·수신 기능은 없어.</div>
 </div>;
 if(route==='messages')return <div className="app-content"><div className="section-kicker">INBOX</div><h2>메시지</h2>{picked?<><div className="message-person"><Avatar name={picked.name} id={picked.id}/><div><strong>{picked.name}</strong><small>예시 대화 · 비전송</small></div></div><div className="bubble-area">{picked.messages.map((m,i)=><div className={'bubble '+(m.from==='me'?'mine':'')} key={i}>{m.text}</div>)}</div><div className="fake-compose"><LockKeyhole size={16}/> 읽기 전용 대화 기록</div></>:<><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="대화 검색" aria-label="대화 검색"/></div>{visible(conversations).filter(c=>matched(c.name)).map(c=><button className="person-row" key={c.id} onClick={()=>setPicked(c)}><Avatar name={c.name} id={c.id}/><span><strong>{c.name}</strong><small>{c.preview}</small></span><ChevronRight size={15}/></button>)}<div className="notice"><Info size={15}/> 메시지는 등장인물의 분위기를 보여주기 위한 창작 예시입니다.</div></>}</div>;
 if(route==='calendar')return <div className="app-content"><div className="section-kicker">SCHEDULE / 2027</div><h2>캘린더</h2><div className="calendar-heading"><button aria-label="이전 달" onClick={()=>{setMonth(m=>(m+11)%12);setDay(1)}}>‹</button><strong>2027년 {month+1}월</strong><button aria-label="다음 달" onClick={()=>{setMonth(m=>(m+1)%12);setDay(1)}}>›</button></div><div className="calendar-grid">{['일','월','화','수','목','금','토'].map(x=><span key={x} className="dow">{x}</span>)}{monthDays.map((d,i)=>d?<button className={'day '+(d===day?'selected':'')+(calendarData(d).length?' has-event':'')} key={i} onClick={()=>setDay(d)}>{d}</button>:<span key={i}/>)}</div><div className="section-kicker">선택한 날짜 · {month+1}월 {day}일</div><div className="records">{calendarData(day).length?calendarData(day).map((e,i)=><div className="event-row" key={i}><span className="event-dot"/><div><strong>{e.title}</strong><small>{e.type}</small></div></div>):<Empty>등록된 주요 일정이 없습니다.</Empty>}</div><div className="section-kicker" style={{marginTop:22}}>이달의 주요 일정</div>{monthEvents.length?monthEvents.map((e,i)=><button className="record" key={i} onClick={()=>setDay(Number(e.date.slice(8,10)))}><div><strong>{e.date.slice(8,10)}일 · {e.title}</strong><small>{e.type}</small></div><ChevronRight size={15}/></button>):<p className="muted">등록된 일정 없음</p>}<p className="muted small">일부 날짜는 기준안이며, 30일 관계 유예의 시작일은 아직 확정하지 않았습니다.</p></div>;
 if(route==='browser')return <div className="app-content browser-app"><div className="browser-bar"><Globe2 size={16}/><form onSubmit={e=>{e.preventDefault();setBrowserPage('search')}}><input aria-label="내부 아카이브 검색" value={browserInput} onChange={e=>setBrowserInput(e.target.value)} placeholder="archive.elegant-fractures.local"/></form></div>{browserPage==='portal'?<><div className="section-kicker">PRIVATE INTRANET / FICTIONAL</div><div className="browser-hero"><span>ARCHIVE 2027</span><h2>우아한 균열</h2><p>다섯 가문, 그리고 각자의 이야기.</p></div><h3>즐겨찾기</h3>{[{title:'다섯 명가 기록',desc:'가문 소개와 관계',page:'houses'},{title:'2027년 주요 일정',desc:'공식 행사와 기념일',page:'schedule'},{title:'스토리 소개',desc:'한 편의 관계극',page:'about'}].map(x=><button className="record" key={x.page} onClick={()=>setBrowserPage(x.page)}><div><strong>{x.title}</strong><small>{x.desc}</small></div><ChevronRight size={15}/></button>)}</>:browserPage==='houses'?<><div className="section-kicker">ENCYCLOPEDIA</div><h2>다섯 명가</h2>{houses.map(h=><div className="house-card" key={h.name}><small>{h.en}</small><h3>{h.name}</h3><p>{h.desc}</p><p className="muted small">{h.note}</p></div>)}</>:browserPage==='schedule'?<><h2>2027년 · 주요 기록</h2>{events.filter(e=>e.date.startsWith('2027')).map((e,i)=><div className="event-row" key={i}><Clock3 size={16}/><div><strong>{e.title}</strong><small>{e.date} · {e.type}</small></div></div>)}</>:browserPage==='about'?<><div className="browser-hero"><span>ELEGANT FRACTURES</span><h2>우아한 균열</h2><p>십 년의 사랑, 서른 날의 유예.</p></div><p className="longtext">2027년 현대 대한민국. 다섯 명가의 화려한 질서 아래, 사랑과 가족과 혈통의 균열이 조용히 번져간다.</p><p className="muted small">이 웹사이트는 실재하는 사이트나 인트라넷이 아닌 작품 속 가상의 브라우저입니다.</p></>:<><h2>아카이브 검색</h2><p className="muted">‘{browserInput}’에 대한 내부 검색 결과</p>{houses.filter(h=>h.name.includes(browserInput)).map(h=><div className="house-card" key={h.name}><h3>{h.name}</h3><p>{h.desc}</p></div>)}{people.filter(p=>p.name.includes(browserInput)&&(!p.spoiler||prefs.spoilers)).map(p=><div className="record" key={p.id}><div><strong>{p.name}</strong><small>{p.label}</small></div></div>)}{!houses.some(h=>h.name.includes(browserInput))&&!people.some(p=>p.name.includes(browserInput))&&<Empty>내부 자료를 찾지 못했습니다.</Empty>}</>}<div className="browser-footer"><button onClick={()=>setBrowserPage('portal')}><Home size={16}/> 시작 페이지</button><span>외부 인터넷에 접속하지 않는 가상 브라우저</span></div></div>;
 if(route==='gallery')return <div className="app-content">
 <div className="section-kicker">PHOTOS · PERSONAL</div><h2>사진</h2>
 {photosView?
   <><div className="gallery-detail"><img src={imageRoot+'Jaeyoul_rain.png'} alt="비가 오는 날의 후재율" /><span>{photosView.caption}</span></div>
     <h3>{photosView.title}</h3><p className="muted small">사진첩의 기록 · 2027</p></>:
   <><p className="muted">저장된 사진</p>
     <div className="gallery-grid"><button onClick={()=>setPhotosView({id:'jaeyoul-rain',title:'후재율 · 비 오는 날',caption:'JAEYOUL · RAIN'})} className="gallery-photo"><img src={imageRoot+'Jaeyoul_rain.png'} alt="후재율의 비 오는 날 일러스트" loading="lazy" /><span>재율 · 비 오는 날</span></button></div>
   </>
 }
 </div>;
 if(route==='settings')return <div className="app-content"><div className="section-kicker">PREFERENCES</div><h2>설정</h2><div className="setting-block"><h3>아카이브 공개 범위</h3><label className="setting-row"><span><strong>스포일러 포함</strong><small>출생 비밀 및 숨겨진 과거 일부 표시</small></span><input type="checkbox" checked={prefs.spoilers} onChange={e=>updatePrefs({spoilers:e.target.checked})}/></label></div><div className="setting-block"><h3>내 선택 (이 기기에만 저장)</h3><label className="field-label">연애 공개 여부</label><select value={prefs.relationship} onChange={e=>updatePrefs({relationship:e.target.value})}><option>미설정</option><option>공개 연애</option><option>비공개 연애</option><option>일부에게만 공개</option></select><label className="field-label">재율과 사용하는 애칭 (선택)</label><input className="text-field" value={prefs.nickname} onChange={e=>updatePrefs({nickname:e.target.value})} placeholder="원하는 경우 직접 입력" maxLength={40}/></div><div className="notice"><Shield size={17}/> 선택 항목은 이 브라우저에만 저장되며 GitHub나 서버로 전송하지 않습니다. 다른 기기와 자동으로 동기화되지 않습니다.</div><button className="reset-btn" onClick={()=>updatePrefs({spoilers:false,relationship:'미설정',nickname:''})}>개인 선택 초기화</button><p className="muted small">Elegant Fractures · Prototype 0.1</p></div>;
 return null;
 };
 return <div className="site-shell"><div className="ambient ambient-left"/><div className="ambient ambient-right"/>
 <main className="phone" aria-label="2027년 설가 후계자의 휴대폰">
   <div className="phone-inner">
     <div className="statusbar"><span>{time}</span><span className="island" aria-hidden="true"/><div><Signal size={14}/><Wifi size={14}/><BatteryFull size={18}/></div></div>
     {locked ? <div className="screen screen-lock" onPointerDown={onSwipeStart} onPointerUp={onSwipeEnd} onPointerCancel={()=>{swipeOrigin.current=null}}>
        <div className="lock-timebox"><div className="lock-date">{lockDate}</div><div className="lock-clock">{time}</div></div>
        <div className="lock-notifications" aria-label="잠금화면 알림">
          <button className="lock-notification" onClick={()=>quickOpen('calls')}>
            <span className="notification-icon"><Phone size={17}/></span><span className="notification-copy"><strong>전화 · 부재중</strong><span>후재율 ❤️</span></span><small>20:53</small>
          </button>
          <button className="lock-notification" onClick={()=>quickOpen('calls')}>
            <span className="notification-icon"><Phone size={17}/></span><span className="notification-copy"><strong>전화 · 부재중</strong><span>황보이헌</span></span><small>21:07</small>
          </button>
          <button className="lock-notification" onClick={()=>quickOpen('messages')}>
            <span className="notification-icon"><MessageCircle size={17}/></span><span className="notification-copy"><strong>메시지 · 황보이헌</strong><span>받아.</span></span><small>21:08</small>
          </button>
        </div>
        <div className="lock-bottom">
          <div className="lock-shortcuts">
            <button className="lock-shortcut" onClick={()=>quickOpen('calls')} aria-label="전화 앱 바로가기"><Phone size={22}/></button>
            <button className="lock-shortcut" onClick={()=>quickOpen('gallery')} aria-label="카메라 바로가기: 사진 앱 미리보기"><Camera size={22}/></button>
          </div>
          <button className="unlock-button" onClick={unlock} aria-label="위로 밀거나 클릭해서 잠금 해제"><span className="up-chevron">⌃</span>위로 밀어서 잠금 해제</button>
        </div>
      </div> : <>
        {route!=='home'&&<div className="app-toolbar"><button className="back-btn" onClick={back} aria-label="뒤로 가기"><ArrowLeft size={18}/></button><span>{picked?.name||picked?.title||folder||pageTitle(route)}</span><button className="toolbar-home" onClick={home} aria-label="홈으로"><Home size={17}/></button></div>}
        <div className={'screen '+(route==='home'?'screen-home':'screen-app')} key={route}>{content()}</div>
        <div className="home-indicator"><button onClick={home} aria-label="홈 화면으로 돌아가기"><span/></button></div>
      </>}
     <button className="phone-side-button" onClick={lock} aria-label="화면 잠그기" title="화면 잠그기"/>
   </div>
 </main></div>;
}
export default App;
