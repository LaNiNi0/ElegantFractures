import React from 'react';
import { MessageCircle, NotebookPen, Phone } from 'lucide-react';

// Player-facing contact view. All text is supplied by the approved Player Version data.
function Chips({items,variant=''}) {
  return <div className={'contact-rich-chips '+variant}>
    {items.map(item=><span key={item}>{item}</span>)}
  </div>;
}
function Fact({label,value}) {
  return <div className="contact-rich-fact"><span>{label}</span><strong>{value}</strong></div>;
}
export default function ContactProfile({person,profile,avatar,onCalls,onMessages,onRecords}) {
  return <article className={'contact-rich contact-rich-'+profile.theme}>
    <header className="contact-rich-hero">
      <div className="contact-rich-portrait">{avatar}</div>
      <div className="contact-rich-hero-kicker">{profile.theme==='jaeyul'?'MY PERSON · 2027':'HWANGBO · 2027'}</div>
      <h2>{person.name}</h2>
      <div className="contact-rich-label">{person.label}</div>
      <p className="contact-rich-tagline">{profile.tagline}</p>
    </header>
    <nav className="contact-rich-actions" aria-label={person.name+' 바로가기'}>
      <button type="button" onClick={onCalls} aria-label={person.name+' 통화 기록 보기'}>
        <span><Phone size={19}/></span><small>전화</small>
      </button>
      <button type="button" onClick={onMessages} aria-label={person.name+' 메시지 기록 보기'}>
        <span><MessageCircle size={19}/></span><small>메시지</small>
      </button>
      <button type="button" onClick={onRecords} aria-label={person.name+' 관련 메모 보기'}>
        <span><NotebookPen size={19}/></span><small>기록</small>
      </button>
    </nav>
    <section className="contact-rich-card" aria-labelledby="contact-basic-heading">
      <h3 id="contact-basic-heading">기본 정보</h3>
      <div className="contact-rich-facts">
        <Fact label="성별" value={profile.gender}/>
        <Fact label="생년월일" value={profile.birth}/>
        <Fact label="주요 신분" value={profile.identity}/>
        <Fact label="신장" value={profile.height}/>
        <div className="contact-rich-fact full"><span>직업</span><strong>{profile.occupation}</strong></div>
      </div>
    </section>
    <section className="contact-rich-card" aria-labelledby="contact-personality-heading">
      <h3 id="contact-personality-heading">성격과 연애</h3>
      <div className="contact-rich-subtitle">성격</div>
      <Chips items={profile.personality}/>
      <div className="contact-rich-subtitle">연애 경험</div>
      <p className="contact-rich-experience">{profile.romanceExperience}</p>
      <div className="contact-rich-subtitle">연애 스타일</div>
      <Chips items={profile.romance}/>
    </section>
    <section className="contact-rich-card" aria-labelledby="contact-tastes-heading">
      <h3 id="contact-tastes-heading">취향과 습관</h3>
      <div className="contact-rich-facts contact-rich-facts-compact">
        <Fact label="향" value={profile.scent}/>
        <Fact label="주량" value={profile.alcohol}/>
      </div>
      <div className="contact-rich-subtitle">술주정</div>
      <Chips items={profile.drinking}/>
      <div className="contact-rich-subtitle">좋아하는 것</div>
      <Chips items={profile.likes} variant="likes"/>
      <div className="contact-rich-subtitle">싫어하는 것</div>
      <Chips items={profile.dislikes} variant="dislikes"/>
    </section>
    <p className="contact-rich-footnote">전화·메시지는 극중 저장된 기록이며 실제 통화나 문자를 보내지 않아.</p>
  </article>;
}
