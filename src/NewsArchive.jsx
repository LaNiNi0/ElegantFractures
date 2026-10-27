import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Newspaper } from 'lucide-react';

// A growing in-world archive. Articles may be unreliable from the characters' perspective.
export function NewsArchive({articles,onRead}){
 const [family,setFamily]=useState('전체');
 const categories=['전체',...new Set(articles.map(a=>a.family))];
 const filtered=family==='전체'?articles:articles.filter(a=>a.family===family);
 return <div className="seol-news-archive">
   <header className="seol-news-heading">
     <span className="news-eyebrow">THE FIVE HOUSES · 2027</span>
     <div className="news-title-row"><h2>오대명가 뉴스</h2><Newspaper size={23} strokeWidth={1.5}/></div>
     <p>명가의 후계 구도와 재계 인사들을 둘러싼 소식</p>
   </header>
   <nav className="seol-news-categories" aria-label="뉴스 가문 필터">
     {categories.map(c=><button key={c} type="button" aria-pressed={c===family} className={c===family?'active':''} onClick={()=>setFamily(c)}>{c}</button>)}
   </nav>
   <div className="seol-news-list">
     {filtered.map((a,i)=><button type="button" className={'seol-news-card'+(i===0?' lead':'')} key={a.id} onClick={()=>onRead(a.id)}>
       <span className="news-card-eyebrow"><span>{a.family} · {a.desk}</span><span>{a.date}</span></span>
       {a.tone==='rumor'&&<span className="news-type news-type-gossip">사교계 찌라시</span>}
       {a.tone==='breaking'&&<span className="news-type news-type-breaking">긴급 속보</span>}
       <strong>{a.headline}</strong>
       <span className="news-card-summary">{a.subtitle}</span>
       <span className="news-card-footer">{a.source}<ChevronRight size={15}/></span>
     </button>)}
   </div>
 </div>;
}

export function NewsArticle({article,onBack}){
 if(!article)return null;
 return <article className="seol-news-article">
   <button type="button" className="seol-news-back" onClick={onBack}><ArrowLeft size={16}/> 오대명가 뉴스</button>
   <div className="news-article-masthead"><span>{article.source}</span><small>{article.desk}</small></div>
   {article.tone==='rumor'&&<p className="news-source-context">사교계에 퍼진 미확인 소문을 다룬 기사입니다.</p>}
   {article.tone==='breaking'&&<p className="news-source-context breaking">속보 · 당시 발표된 내용에 기초한 기사입니다.</p>}
   <div className="news-article-meta">{article.family} <span>·</span> {article.date}</div>
   <h2>{article.headline}</h2>
   <h3>{article.subtitle}</h3>
   <p className="news-article-lead">{article.lead}</p>
   {article.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
   <div className="news-article-end">{article.source} · {article.desk}</div>
 </article>;
}
