import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BatteryFull, BookOpen, CalendarDays, Camera, Check, ChevronRight, Clock3, Compass, Contact, FileText, Folder, Globe2, Heart, Home, Image as ImageIcon, Info, LockKeyhole, Mail, Menu, MessageCircle, Moon, NotebookPen, Phone, PhoneIncoming, PhoneMissed, Search, Settings, MapPinned, Shield, Signal, Sparkles, Star, UserRound, Wifi, X } from 'lucide-react';
import { people, houses, omunAnnualEvents, notes, events, conversations, calls, galleryPhotos } from './data/story';
import { newsArticles } from './data/news';
import { NewsArchive, NewsArticle } from './NewsArchive.jsx';
import PlaySettings from './PlaySettings.jsx';
import MapApp from './MapApp.jsx';
import ContactProfile from './ContactProfile.jsx';
import { primaryContactProfiles } from './data/contact-profiles.js';

const icons = {notes:NotebookPen,calendar:CalendarDays,contacts:Contact,calls:Phone,messages:MessageCircle,browser:Compass,gallery:ImageIcon,settings:Settings};
const apps = [
 {id:'calls',title:'전화',icon:Phone,color:'#5C7A62'},
 {id:'messages',title:'메시지',icon:MessageCircle,color:'#79927C'},
 {id:'browser',title:'브라우저',icon:Compass,color:'#607977'},
 {id:'gallery',title:'사진',icon:ImageIcon,color:'#B5A17A'},
 {id:'contacts',title:'연락처',icon:Contact,color:'#E4E8DB'},
 {id:'calendar',title:'캘린더',icon:CalendarDays,color:'#C5AF80'},
 {id:'notes',title:'메모',icon:NotebookPen,color:'#F0E5CC'},
 {id:'settings',title:'설정',icon:Settings,color:'#8B9184'},
 {id:'map',title:'지도',icon:MapPinned,color:'#8EAA9A'}
];
const formatKorean = (d) => new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'long'}).format(d);
const pageTitle = (id) => apps.find(x=>x.id===id)?.title || '홈';
const imageRoot = '/ElegantFractures/images/';
const portraits = {
 jaeyul: 'Jaeyoul_profile.jpg',
 iheon: 'Ehun_profile.png',
 jinpyo: 'Jinpyo_profile.png',
 taerin: 'Taelin_profile.png',
 sohwa: 'Sohwa_profile.png',
 jiwan: 'Jiwan_profile.png',
 riwon: 'Leewon_profile.jpg',
 ijeong: 'Ejeong_profile.png',
 dokmin: 'Dockmin_profile.png',
 seogyeong: 'Seogyeong_pofile.png',
 seon: 'Seon_profile.png',
};
const portraitOf = id => portraits[id] ? imageRoot + portraits[id] : null;
function Avatar({name,id,large=false}) {
 const portrait=portraitOf(id);
 return <span className={'avatar '+(large?'avatar-large':'')+(portrait?' avatar-photo':'')} aria-label={name+' 프로필'}>
   {name?.slice(0,1)||'?'}
   {portrait&&<img src={portrait} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display='none'}}/>}
 </span>
}
function PhotosGallery({photos,activeIndex,onSelect,onClose}) {
 const touchX=useRef(null);
 if(activeIndex!==null){
  const photo=photos[activeIndex];
  if(!photo)return null;
  const move=(direction)=>onSelect(Math.max(0,Math.min(photos.length-1,activeIndex+direction)));
  return <div className="ios-photo-viewer">
    <header className="ios-photo-viewer-header">
      <button onClick={onClose} aria-label="사진 목록으로" className="ios-gallery-back"><ArrowLeft size={19}/><span>모든 사진</span></button>
      <span className="ios-photo-position">{activeIndex+1} / {photos.length}</span>
    </header>
    <div className="ios-full-photo-stage" role="group" aria-label={photo.title}
      tabIndex={0}
      onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}}
      onTouchStart={e=>{touchX.current=e.touches[0].clientX}}
      onTouchEnd={e=>{if(touchX.current===null)return;const dx=e.changedTouches[0].clientX-touchX.current;touchX.current=null;if(dx>48)move(-1);else if(dx< -48)move(1)}}
    >
      <img key={photo.id} src={imageRoot+encodeURIComponent(photo.file)} alt={photo.title} decoding="async"/>
      <button className="ios-photo-nav ios-photo-prev" onClick={()=>move(-1)} disabled={activeIndex===0} aria-label="이전 사진"><ArrowLeft size={22}/></button>
      <button className="ios-photo-nav ios-photo-next" onClick={()=>move(1)} disabled={activeIndex===photos.length-1} aria-label="다음 사진"><ChevronRight size={22}/></button>
    </div>
    <div className="ios-photo-filmstrip" aria-label="사진 미리보기">
      {photos.map((p,i)=><button key={p.id} className={'ios-film-thumb'+(i===activeIndex?' selected':'')}
         onClick={()=>onSelect(i)} aria-label={p.title} aria-pressed={i===activeIndex}>
          <img src={imageRoot+encodeURIComponent(p.file)} alt="" loading="lazy" decoding="async"/>
        </button>)}
    </div>
  </div>;
 }
 return <div className="app-content ios-photos-app">
   <div className="ios-gallery-heading"><span className="ios-gallery-overline">보관함</span><h2>사진</h2><span className="ios-gallery-count">{photos.length}장의 사진</span></div>
   <div className="ios-photos-grid">
     {photos.map((p,i)=><button className="ios-photo-tile" key={p.id} onClick={()=>onSelect(i)} aria-label={p.title}>
       <img src={imageRoot+encodeURIComponent(p.file)} alt="" loading="lazy" decoding="async"/>
     </button>)}
   </div>
   <div className="ios-gallery-footer"><span>전체 사진</span><span>{photos.length}장</span></div>
 </div>;
}

function Empty({children}) {return <div className="empty"><Sparkles size={20}/><p>{children}</p></div>}
function HousesGuide({selectedHouse,onSelect,onPerson}) {
 const current=houses.find(h=>h.id===selectedHouse);
 const openPerson=(id)=>{if(id)onPerson(id)};
 return <div className="houses-guide">
  <section className="houses-intro">
    <div className="houses-intro-kicker">FIVE GREAT HOUSES · 2027</div>
    <h2>오대명가 <span>五大名家</span></h2>
    <p>오랜 세월 대한민국의 부와 권력, 사회적 영향력을 유지해 온 다섯 가문.</p>
    <p>통칭 <strong>오문(五門)</strong> 또는 <strong>오가(五家)</strong>. 각기 다른 기반과 전통을 갖고 있으나, 그 관계는 혼인과 이해관계, 오랜 경쟁으로 복잡하게 얽혀 있다.</p>
  </section>
  <div className="house-tabs" role="tablist" aria-label="오대명가 가문 선택">
    <button role="tab" aria-selected={!current} className={!current?'active':''} onClick={()=>onSelect(null)}>총람</button>
    {houses.map(h=><button role="tab" aria-selected={current?.id===h.id} className={current?.id===h.id?'active':''} key={h.id} onClick={()=>onSelect(h.id)}>{h.name}</button>)}
  </div>
  {!current
   ? <div className="houses-overview">
       <h3>다섯 가문</h3>
       {houses.map(h=><button key={h.id} className="house-overview-row" onClick={()=>onSelect(h.id)}>
         <span className="house-overview-art"><img src={imageRoot+encodeURIComponent(h.banner)} alt={h.name+' 문장 배너'} loading="lazy" decoding="async"/></span>
         <span className="house-overview-label"><strong>{h.name} <small>{h.en}</small></strong><span>{h.domains.join(' · ')}</span></span>
         <ChevronRight size={17}/>
       </button>)}
       <div className="houses-network">
         <h3>오문의 관계</h3>
         <p><strong>설가 × 권가</strong> · 혼인을 통한 우호 관계</p>
         <p><strong>황보가 × 차가</strong> · 비교적 가까운 사이</p>
         <p><strong>황보가 × 권가</strong> · 긴장 관계</p>
         <p><strong>선우가</strong> · 어느 편에도 깊이 치우치지 않는 중립적 입장</p>
         <p><strong>차가</strong> · 여러 가문을 연결하는 폭넓은 사교 관계</p>
       </div>
       <section className="omun-annual" aria-label="오문의 연례 모임">
         <div className="omun-annual-heading">
           <span className="section-kicker">OMUN · ANNUAL GATHERINGS</span>
           <h3>오문의 연례 모임</h3>
           <p>오문은 공식 모임과 사교 행사를 통해 오랜 질서와 관계를 이어 간다. 신년례와 가주 정례회는 참석의 관례가 강하고, 후계자 연회는 사교적인 성격이 두드러진다.</p>
         </div>
         <div className="omun-event-list">
           {omunAnnualEvents.map(event=><div className="omun-annual-event" key={event.date}>
             <span className="omun-event-date">2027<span>{event.date}</span></span>
             <div className="omun-event-text">
               <span className="omun-event-kind">{event.kind}</span>
               <strong>{event.title}</strong>
               <p>{event.detail}</p>
             </div>
           </div>)}
         </div>
       </section>
     </div>
   : <div className="house-profile" key={current.id}>
       <div className="house-banner"><img src={imageRoot+encodeURIComponent(current.banner)} alt={current.name+' 문장과 대표 상징 배너'} loading="lazy" decoding="async"/></div>
       <header className="house-profile-header" style={{'--house-tint':current.tint}}>
         <span className="house-profile-roman">{current.en} · {current.color}</span>
         <div className="house-profile-heading"><span className="house-crest house-crest-large">{current.name.charAt(0)}</span><div><h3>{current.name} <small>{current.hanja}</small></h3><p>{current.domains.join(' · ')}</p></div></div>
       </header>
       <p className="house-profile-description">{current.desc}</p>
       <div className="family-info-grid">
         <div><span>대표 색</span><strong><i className="family-color-swatch" style={{background:current.tint}}/>{current.color}</strong></div>
         <div><span>대표 식물</span><strong>{current.plant}</strong></div>
         <div><span>대표 동물</span><strong>{current.animal}</strong></div>
         <div><span>뿌리 지역</span><strong>{current.root}</strong></div>
         <div className="family-wide"><span>서울 본가</span><strong>{current.residence}</strong></div>
       </div>
       <div className="house-nicknames">
         <div><span>통용되는 별칭</span><strong>{current.nickname}</strong></div>
         <div><span>비꼬는 별명</span><strong>{current.teasingNickname}</strong></div>
       </div>
       <h3 className="family-subhead">가주와 후계자</h3>
       <div className="family-leaders">
         {[{role:'가주',id:current.headId,name:current.head},{role:'후계자',id:current.heirId,name:current.heir}].map(x=>
           x.id
           ? <button className="family-leader" key={x.role} onClick={()=>openPerson(x.id)}>
               <Avatar name={x.name} id={x.id}/>
               <span><small>{x.role}</small><strong>{x.name}</strong></span><ChevronRight size={16}/>
             </button>
           : <div className="family-leader" key={x.role}><span className="avatar family-you">我</span><span><small>{x.role}</small><strong>{x.name}</strong></span></div>
         )}
       </div>
       <h3 className="family-subhead">다른 가문과의 관계</h3>
       <p className="house-relationship">{current.note}</p>
     </div>}
 </div>;
}

function App() {
 const [route,setRoute]=useState('home');
 const [locked,setLocked]=useState(true);
 const [now,setNow]=useState(()=>new Date());
 const swipeOrigin=useRef(null);
 useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),30000);return ()=>clearInterval(timer)},[]);
 const [stack,setStack]=useState([]);
 const [query,setQuery]=useState('');
 const [picked,setPicked]=useState(null);
 const chatScrollRef=useRef(null);
 const noteListScrollRef=useRef(0);
 const restoreNoteScrollRef=useRef(false);
 const [folder,setFolder]=useState(null);
 const [month,setMonth]=useState(6);
 const [calendarFilter,setCalendarFilter]=useState('전체');
 const [browserPage,setBrowserPage]=useState('portal');
 const [activeNewsId,setActiveNewsId]=useState('seol-successor');
 const [newsFilter,setNewsFilter]=useState('전체');
 const browserScrollRef=useRef(null);
 const newsScrollRef=useRef(0);
 const restoreNewsScrollRef=useRef(false);
 const [selectedHouse,setSelectedHouse]=useState(null);
 const [browserInput,setBrowserInput]=useState('');
 const [callFilter,setCallFilter]=useState('전체');
 const [callPersonId,setCallPersonId]=useState(null);
 const [photosView,setPhotosView]=useState(null);
 const [showSearch,setShowSearch]=useState(false);
 useEffect(()=>{if(route==='messages'&&picked&&chatScrollRef.current){chatScrollRef.current.scrollTop=chatScrollRef.current.scrollHeight}},[route,picked]);
 // Keep the exact list position when returning from a diary entry.
 // Fresh folders and freshly opened entries still begin at the top.
 useLayoutEffect(()=>{
   if(route!=='notes'||!chatScrollRef.current)return;
   if(!picked&&folder&&restoreNoteScrollRef.current){
     chatScrollRef.current.scrollTop=noteListScrollRef.current;
     restoreNoteScrollRef.current=false;
   }else{
     chatScrollRef.current.scrollTop=0;
   }
 },[route,folder,picked]);
 function openNote(note){
   noteListScrollRef.current=chatScrollRef.current?.scrollTop||0;
   restoreNoteScrollRef.current=false;
   setPicked(note);
 }
 function navigate(to){if(to===route)return;setStack(old=>[...old,route]);setRoute(to);setPicked(null);setFolder(null);setQuery('');setShowSearch(false);if(to!=='calls')setCallPersonId(null)}
 function openNewsArticle(id){
  newsScrollRef.current=route==='browser'&&browserPage==='news' ? (browserScrollRef.current?.scrollTop||0) : 0;
  restoreNewsScrollRef.current=false;
  setActiveNewsId(id);
  setBrowserPage('article');
 }
 function closeNewsArticle(){
  restoreNewsScrollRef.current=true;
  setBrowserPage('news');
 }
 useLayoutEffect(()=>{
  if(route!=='browser'||!browserScrollRef.current)return;
  const scroll=browserScrollRef.current;
  if(browserPage==='news'&&restoreNewsScrollRef.current){
    scroll.scrollTop=newsScrollRef.current;
    restoreNewsScrollRef.current=false;
  }else{
    scroll.scrollTop=0;
  }
 },[route,browserPage]);
 function back(){
  if(picked){
    if(route==='notes')restoreNoteScrollRef.current=true;
    setPicked(null);
    return;
  }
  if(photosView!==null){setPhotosView(null);return}
  if(folder){noteListScrollRef.current=0;restoreNoteScrollRef.current=false;setFolder(null);return}
  if(route==='browser'&&browserPage==='houses'&&selectedHouse){setSelectedHouse(null);return}
  if(route==='browser'&&browserPage==='article'){closeNewsArticle();return}
  if(route==='browser'&&browserPage!=='portal'){setBrowserPage('portal');setSelectedHouse(null);return}
  setRoute(stack.at(-1)||'home');setStack(old=>old.slice(0,-1));setQuery('');
 }
 function home(){setRoute('home');setStack([]);setPicked(null);setFolder(null);setPhotosView(null);setQuery('');setShowSearch(false);setCallPersonId(null)}
 const visible = list => list;
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
 const shownPeople = useMemo(()=>visible(people).filter(p=>matched(p.name+' '+p.label+' '+p.group)),[query]);
 const monthDays = useMemo(()=>{const days=new Date(2027,month+1,0).getDate();const start=new Date(2027,month,1).getDay();return [...Array(start).fill(null),...Array.from({length:days},(_,i)=>i+1)]},[month]);
 const calendarCategories=['전체','❤️ 재율','가족','업무'];
 const calendarTypeKey=e=>e.type==='❤️'?'jaeyul':e.type==='가족'?'family':'work';
 const calendarTypeLabel=e=>e.type==='❤️'?'❤️ 재율':e.type;
 const calendarMatches=e=>calendarFilter==='전체'||calendarTypeLabel(e)===calendarFilter;
 const monthEvents=events.filter(e=>e.date.startsWith('2027-')&&Number(e.date.slice(5,7))===month+1&&calendarMatches(e));
 const calendarData=day=>monthEvents.filter(e=>Number(e.date.slice(8,10))===day);
 const [day,setDay]=useState(23);
 const notesFolders=[
   {name:'재율의 기록',emoji:'❤️',sub:'함께한 10년의 추억'},
   {name:'이헌의 기록',emoji:'🖤',sub:'예상치 못한 균열'},
   {name:'가족의 기록',emoji:'🌿',sub:'가족이라는 존재'}
 ];
 const appButton=(a)=>{const I=a.icon;return <button key={a.id} className="app-entry" onClick={()=>navigate(a.id)}><span className={'app-icon tile-'+a.id} style={{'--tile':a.color}}><I size={25} strokeWidth={1.6}/></span><span>{a.title}</span></button>};
 const content = () => {
 if(route==='home') return <div className="home-screen">
   <div className="home-apps">{apps.slice(4).map(appButton)}</div>
   <div className="home-pagination" aria-hidden="true"><span className="active"/><span/></div>
   <div className="dock">{apps.slice(0,4).map(appButton)}</div>
 </div>;
 if(route==='notes') return <div className="app-content notes-app">
   {!folder&&!picked?<><div className="section-kicker">PERSONAL NOTES</div><h2>메모</h2><p className="muted">함께한 사람들, 그 기억들</p>
     <div className="folder-grid notes-folder-grid">
       {notesFolders.map(f=><button className="folder-card notes-folder-card" key={f.name} onClick={()=>{noteListScrollRef.current=0;restoreNoteScrollRef.current=false;setFolder(f.name);setQuery('')}}>
         <span className="notes-folder-icon" aria-hidden="true">{f.emoji}</span>
         <span className="notes-folder-info"><strong>{f.name}</strong><small>{f.sub} · {notes.filter(n=>n.folder===f.name).length}개의 메모</small></span>
         <ChevronRight size={17}/>
       </button>)}
     </div>
   </>:picked?<><div className="section-kicker">{notesFolders.find(x=>x.name===picked.folder)?.emoji} {picked.folder} · {picked.date}</div><h2>{picked.title}</h2><div className="note-sheet">{picked.body.split('\n').map((line,i)=><p key={i}>{line||'\u00a0'}</p>)}{picked.image&&<figure className="note-memory-photo"><img src={imageRoot+encodeURIComponent(picked.image)} alt={picked.imageAlt||picked.title+' 관련 이미지'} loading="lazy" decoding="async"/></figure>}</div></>:
   <><div className="section-kicker">NOTES / {folder}</div><h2>{notesFolders.find(x=>x.name===folder)?.emoji} {folder}</h2><div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="메모 검색" aria-label="메모 검색"/></div><div className="records">{visible(notes).filter(n=>n.folder===folder&&matched(n.title+' '+n.body)).map(n=><button className="record" key={n.id} onClick={()=>openNote(n)}><div><strong>{n.title}</strong><small>{n.date}</small></div><ChevronRight size={16}/></button>)}</div></>}
 </div>;
 if(route==='contacts') return <div className="app-content">
   <div className="section-kicker">PEOPLE & CONNECTIONS</div>
   {!picked&&<h2>연락처</h2>}
   {picked
    ? primaryContactProfiles[picked.id]
      ? <ContactProfile person={picked} profile={primaryContactProfiles[picked.id]}
          avatar={<Avatar name={picked.name} id={picked.id} large/>}
          onCalls={()=>{navigate('calls');setCallPersonId(picked.id);setCallFilter('전체')}}
          onMessages={()=>{const conversation=conversations.find(c=>c.id===picked.id);navigate('messages');if(conversation)setPicked(conversation)}}
          onRecords={()=>{navigate('notes');setFolder(primaryContactProfiles[picked.id].notesFolder)}}/>
      : <div className="person-detail"><Avatar name={picked.name} id={picked.id} large/><h2>{picked.name}</h2><span className="muted">{picked.label}</span><div className="detail-grid"><span>소속</span><strong>{picked.group}</strong><span>생년월일</span><strong>{picked.birth}</strong></div><h3>인물 메모</h3><p>{picked.detail}</p></div>
    : <>
      <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="이름 또는 가문 검색" aria-label="연락처 검색"/></div>
      {Object.keys(segments).map(group=>{const groupPeople=shownPeople.filter(p=>p.group===group);return groupPeople.length?<section className="group-section" key={group}><div className="section-kicker">{segments[group]} · {group}</div>{groupPeople.map(p=><button className="person-row" key={p.id} onClick={()=>setPicked(p)}><Avatar name={p.name} id={p.id}/><span><strong>{p.name}</strong><small>{p.label}</small></span><ChevronRight size={15}/></button>)}</section>:null})}
     </>}
  </div>;
 if(route==='calls')return <div className="app-content">
  <div className="section-kicker">RECENTS · 2027.09.05–09.18</div>
  <h2>{callPersonId ? (people.find(p=>p.id===callPersonId)?.name || '연락처')+' · 통화 기록' : '최근 통화'}</h2>
  {callPersonId&&<button type="button" className="contact-call-clear" onClick={()=>{setCallPersonId(null);setCallFilter('전체')}}>전체 통화 기록 보기 <ChevronRight size={14}/></button>}
  <div className="pills">{['전체','부재중'].map(v=><button className={callFilter===v?'active':''} onClick={()=>setCallFilter(v)} key={v}>{v}</button>)}</div>
  {visible(calls).filter(x=>(!callPersonId||x.id===callPersonId)&&(callFilter==='전체'||x.kind==='부재중'||x.kind==='거절')).map((c,i)=>
   <div className={'person-row no-pointer call-record'+((c.kind==='부재중'||c.kind==='거절')?' is-missed':'')} key={c.date+'-'+c.id+'-'+i}>
    <Avatar name={c.name} id={c.id}/>
    <span><strong>{c.name}</strong><small>{c.kind}{c.duration?' · '+c.duration:''}</small></span>
    <span className="call-time">{c.time}</span>
   </div>
  )}
 </div>;
 if(route==='messages')return <div className="app-content messages-app">
  <div className="section-kicker">MESSAGES</div><h2>메시지</h2>
  {picked
   ? <>
     <div className="message-person"><Avatar name={picked.name} id={picked.id}/><div><strong>{picked.name}</strong></div></div>
     <div className="bubble-area">
       {picked.messages.map((m,i)=><React.Fragment key={i}>
         {(i===0||m.date!==picked.messages[i-1].date)&&<div className="message-date">{Number(m.date.slice(5,7))}월 {Number(m.date.slice(8,10))}일</div>}
         <div className={'message-line '+(m.from==='me'?'mine':'theirs')}>
           <div className={'bubble '+(m.from==='me'?'mine':'')+(m.image?' message-photo-bubble':'')}>
             {m.link
              ? <button className="message-article-link" onClick={()=>{newsScrollRef.current=0;restoreNewsScrollRef.current=false;setActiveNewsId(m.link.id);navigate('browser');setBrowserPage('article')}} aria-label="보낸 뉴스 기사 열기">
                  <span className="article-source">{m.link.source}</span>
                  <strong>{m.link.title}</strong>
                  <span className="article-action">기사 보기 <ChevronRight size={13}/></span>
                </button>
              : m.image
                ? <img className="message-attached-image"
                    src={imageRoot+encodeURIComponent(m.image)}
                    alt={m.alt||'대화에서 받은 사진'}
                    loading="lazy" decoding="async"/>
                : m.text}
           </div>
           <span className="bubble-time">{m.time}</span>
         </div>
       </React.Fragment>)}
     </div>
     <div className="message-compose" aria-hidden="true"><span>메시지</span><span className="compose-arrow">↑</span></div>
   </>
   : <>
      <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="대화 검색" aria-label="대화 검색"/></div>
      {visible(conversations).filter(c=>matched(c.name)).map(c=><button className="person-row message-list-row" key={c.id} onClick={()=>setPicked(c)}>
        <Avatar name={c.name} id={c.id}/>
        <span><strong>{c.name}</strong><small>{c.preview}</small></span>
        <span className="message-row-time">{c.time}</span>
        <ChevronRight size={14}/>
      </button>)}
   </>}
 </div>;
 if(route==='calendar')return <div className="app-content calendar-app">
  <div className="section-kicker">SCHEDULE / 2027</div>
  <h2>캘린더</h2>
  <p className="calendar-info-note">2027년 일정</p>
  <div className="calendar-categories" role="group" aria-label="일정 분류">
    {calendarCategories.map(category=><button key={category} type="button" className={calendarFilter===category?'active':''} aria-pressed={calendarFilter===category} onClick={()=>setCalendarFilter(category)}>{category}</button>)}
  </div>
  <div className="calendar-heading">
    <button aria-label="이전 달" onClick={()=>{setMonth(m=>(m+11)%12);setDay(1)}}>‹</button>
    <strong>2027년 {month+1}월</strong>
    <button aria-label="다음 달" onClick={()=>{setMonth(m=>(m+1)%12);setDay(1)}}>›</button>
  </div>
  <div className="calendar-grid">
    {['일','월','화','수','목','금','토'].map(x=><span key={x} className="dow">{x}</span>)}
    {monthDays.map((d,i)=>d?<button type="button" className={'day calendar-day'+(d===day?' selected':'')+(calendarData(d).length?' has-event':'')} key={i} onClick={()=>setDay(d)} aria-label={`2027년 ${month+1}월 ${d}일, 일정 ${calendarData(d).length}개`}>
      <span>{d}</span>
      {calendarData(d).length>0&&<span className="calendar-day-markers" aria-hidden="true">
        {[...new Set(calendarData(d).map(calendarTypeKey))].map(kind=><span key={kind} className={'calendar-category-dot '+kind}/>)}
      </span>}
    </button>:<span key={'blank-'+i}/>)}
  </div>
  <div className="section-kicker">선택한 날짜 · {month+1}월 {day}일</div>
  <div className="records">
    {calendarData(day).length?calendarData(day).map((e,i)=><div className="event-row calendar-event-row" key={e.date+'-'+e.title+i}>
      <span className={'event-dot calendar-category-dot '+calendarTypeKey(e)}/>
      <div><strong>{e.title}</strong><small>{calendarTypeLabel(e)}</small></div>
    </div>):<Empty>선택한 분류에 해당하는 일정이 없습니다.</Empty>}
  </div>
  <div className="section-kicker" style={{marginTop:22}}>이달의 주요 일정</div>
  {monthEvents.length?monthEvents.map((e,i)=><button className="record calendar-month-event" key={e.date+'-'+e.title+i} onClick={()=>setDay(Number(e.date.slice(8,10)))}>
    <span className={'calendar-category-dot '+calendarTypeKey(e)} aria-hidden="true"/>
    <div><strong>{Number(e.date.slice(8,10))}일 · {e.title}</strong><small>{calendarTypeLabel(e)}</small></div>
    <ChevronRight size={15}/>
  </button>):<p className="muted">선택한 분류에 해당하는 일정이 없습니다.</p>}
</div>;
 if(route==='browser')return <div className="app-content browser-app"><div className="browser-bar"><Globe2 size={16}/><form onSubmit={e=>{e.preventDefault();setBrowserPage('search')}}><input aria-label="내부 아카이브 검색" value={browserInput} onChange={e=>setBrowserInput(e.target.value)} placeholder="archive.elegant-fractures.local"/></form></div><div className="browser-page-scroll" key={browserPage} ref={browserScrollRef}>{browserPage==='portal'?<><div className="section-kicker">BOOKMARKS</div><button type="button" className="browser-hero world-hero-button" onClick={()=>setBrowserPage('about')} aria-label="우아한 균열 세계관 소개 열기">
 <span>ELEGANT FRACTURES · 2027</span><h2>우아한 균열</h2>
 <p>오래된 우아함 아래 감춰진 균열, 그리고 새롭게 시작되는 균열.</p>
 <span className="world-hero-link">세계관 소개 보기 <ChevronRight size={15}/></span>
 </button><h3>즐겨찾기</h3>{[{title:'오대명가 · 五大名家',desc:'오문 총람과 각 가문의 기록',page:'houses'},{title:'뉴스',desc:'오대명가 · 아크노드 · 사교계 소식',page:'news'}].map(x=><button className="record" key={x.page} onClick={()=>{setBrowserPage(x.page);if(x.page==='houses')setSelectedHouse(null)}}><div><strong>{x.title}</strong><small>{x.desc}</small></div><ChevronRight size={15}/></button>)}</>:browserPage==='news'?<NewsArchive articles={newsArticles} filter={newsFilter} onFilterChange={setNewsFilter} onRead={openNewsArticle}/>:browserPage==='article'?<NewsArticle article={newsArticles.find(n=>n.id===activeNewsId)||newsArticles[0]} onBack={closeNewsArticle}/>:browserPage==='houses'?<HousesGuide selectedHouse={selectedHouse} onSelect={setSelectedHouse} onPerson={(id)=>{const person=people.find(p=>p.id===id);if(person){navigate('contacts');setPicked(person)}}}/>:browserPage==='schedule'?<><h2>2027년 · 주요 기록</h2>{events.filter(e=>e.date.startsWith('2027')).map((e,i)=><div className="event-row" key={i}><Clock3 size={16}/><div><strong>{e.title}</strong><small>{e.date} · {e.type}</small></div></div>)}</>:browserPage==='about'?<div className="world-intro-page">
 <div className="section-kicker">ELEGANT FRACTURES · WORLD</div>
 <h2>우아한 균열</h2>
 <p className="world-intro-tagline">오래된 우아함 아래 감춰진 균열, 그리고 새롭게 시작되는 균열.</p>
 <div className="world-intro-divider" aria-hidden="true"/>
 <p className="world-intro-year">2027년, 대한민국.</p>
 <p>오랜 세월 부와 권력, 영향력을 이어 온 다섯 명가.</p>
 <p>그중 하나인 <strong>설가(薛家)의 후계자, 당신.</strong></p>
 <p>능력으로 자신의 자리를 증명하며 완벽한 후계자로 인정받았지만, 세상이 알고 있는 당신의 출생에는 감춰진 진실이 있다.</p>
 <p>정실의 자녀로 알려진 당신의 친모는 사실 민소화.</p>
 <p>당신에게 가족은 안식처가 아니다. 오래도록 벗어나지 못한 족쇄이자, 숨통을 조여 오는 목줄과도 같은 존재다.</p>
 <div className="world-intro-divider" aria-hidden="true"/>
 <p>그런 당신 곁에는 십 년의 시간을 함께한 연인, <strong>후재율</strong>이 있다.</p>
 <p>당신의 출생에 얽힌 진실까지 알고도 변함없이 곁을 지켜 온 사람. 차가운 가문의 울타리 밖에서 당신에게 가장 익숙하고 따뜻한 안식처가 되어 준 사람.</p>
 <p>그러나 어느 여름, 당신과 악연으로 얽혔던 남자 <strong>서이헌</strong>이 황보가의 유일한 후계자, <strong>황보이헌</strong>으로 다시 나타난다.</p>
 <div className="world-intro-divider" aria-hidden="true"/>
 <p className="world-intro-lead">오랫동안 이어져 온 사랑.</p>
 <p className="world-intro-lead">새롭게 시작된 끌림.</p>
 <p className="world-intro-lead">그리고 그 사이에서 서서히 벌어지는 균열.</p>
 <p>모든 비밀과 과거를 알고 시작하는 이야기.</p>
 <p className="world-intro-ending">그들이 어떤 사람인지는 이미 알고 있다.</p>
 <p className="world-intro-ending">이제 남은 것은, 그들과 어떤 관계를 만들어 갈 것인가.</p>
 </div>:<><h2>아카이브 검색</h2><p className="muted">‘{browserInput}’에 대한 내부 검색 결과</p>{houses.filter(h=>h.name.includes(browserInput)).map(h=><div className="house-card" key={h.name}><h3>{h.name}</h3><p>{h.desc}</p></div>)}{people.filter(p=>p.name.includes(browserInput)).map(p=><div className="record" key={p.id}><div><strong>{p.name}</strong><small>{p.label}</small></div></div>)}{!houses.some(h=>h.name.includes(browserInput))&&!people.some(p=>p.name.includes(browserInput))&&<Empty>내부 자료를 찾지 못했습니다.</Empty>}</>}<div className="browser-footer"><button onClick={()=>setBrowserPage('portal')}><Home size={16}/> 시작 페이지</button></div></div></div>;
 if(route==='gallery')return <PhotosGallery photos={galleryPhotos} activeIndex={photosView} onSelect={setPhotosView} onClose={()=>setPhotosView(null)}/>;
 if(route==='settings')return <PlaySettings/>;
 if(route==='map')return <MapApp/>;
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
            <span className="notification-icon"><MessageCircle size={17}/></span><span className="notification-copy"><strong>메시지 · 황보이헌</strong><span>받아</span></span><small>21:08</small>
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
        <div ref={chatScrollRef} className={'screen '+(route==='home'?'screen-home':'screen-app')+(['contacts','calls','settings','messages','calendar','notes','map'].includes(route)||(route==='gallery'&&photosView===null)?' screen-contained':'')} key={route}>{content()}</div>
        <div className="home-indicator"><button onClick={home} aria-label="홈 화면으로 돌아가기"><span/></button></div>
      </>}
     <button className="phone-side-button" onClick={lock} aria-label="화면 잠그기" title="화면 잠그기"/>
   </div>
 </main></div>;
}
export default App;
