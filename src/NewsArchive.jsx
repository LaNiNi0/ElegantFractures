import React from 'react';
import { ArrowLeft, ChevronRight, MessageCircle, Newspaper, ThumbsUp } from 'lucide-react';

// A growing in-world archive. Articles may be unreliable from the characters' perspective.
export function NewsArchive({articles,onRead,filter,onFilterChange}){
 const categories=['전체','오대명가','아크노드','사교계'];
 const filtered=filter==='아크노드'?articles.filter(a=>a.family==='아크노드')
   :filter==='사교계'?articles.filter(a=>a.tone==='rumor')
   :filter==='오대명가'?articles.filter(a=>a.family!=='아크노드')
   :articles;
 return <div className="seol-news-archive">
   <header className="seol-news-heading">
     <span className="news-eyebrow">SOCIETY & BUSINESS · 2027</span>
     <div className="news-title-row"><h2>뉴스</h2><Newspaper size={23} strokeWidth={1.5}/></div>
   </header>
   <nav className="seol-news-categories" aria-label="뉴스 가문 필터">
     {categories.map(c=><button key={c} type="button" aria-pressed={c===filter} className={c===filter?'active':''} onClick={()=>onFilterChange(c)}>{c}</button>)}
   </nav>
   <div className="seol-news-list">
     {filtered.map((a,i)=><button type="button" className={'seol-news-card'+(i===0?' lead':'')} data-news-id={a.id} key={a.id} onClick={()=>onRead(a.id)}>
       <span className="news-card-eyebrow"><span>{a.family} · {a.desk}</span><span>{a.date}</span></span>
       {a.tone==='rumor'&&<span className="news-type news-type-gossip">사교계 찌라시</span>}
       {a.tone==='breaking'&&<span className="news-type news-type-breaking">긴급 속보</span>}
       <strong>{a.headline}</strong>
       <span className="news-card-summary">{a.subtitle}</span>
       <span className="news-card-footer">{a.source}{a.comments?.length>0&&<span className="news-comment-counter"><MessageCircle size={12}/>{a.comments.length}</span>}<ChevronRight size={15}/></span>
     </button>)}
   </div>
 </div>;
}

export function NewsArticle({article,onBack}){
 if(!article)return null;
 return <article className="seol-news-article">
   <button type="button" className="seol-news-back" onClick={onBack}><ArrowLeft size={16}/> 뉴스 목록</button>
   <div className="news-article-masthead"><span>{article.source}</span><small>{article.desk}</small></div>
   {article.tone==='breaking'&&<p className="news-source-context breaking">속보 · 당시 발표된 내용에 기초한 기사입니다.</p>}
   <div className="news-article-meta">{article.family} <span>·</span> {article.date}</div>
   <h2>{article.headline}</h2>
   <h3>{article.subtitle}</h3>
   <p className="news-article-lead">{article.lead}</p>
   {article.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
   <div className="news-article-end">{article.source} · {article.desk}</div>
   {article.tone==='rumor'&&Array.isArray(article.comments)&&article.comments.length>0&&
     <section className="news-comment-section" aria-label="이 기사에 달린 댓글">
       <div className="news-comment-title"><MessageCircle size={17}/><h4>댓글 <span>{article.comments.length}</span></h4></div>
       <div className="news-comment-list">
         {article.comments.map((comment,i)=><div className="news-comment" key={i}>
           <span className="news-comment-avatar" aria-hidden="true">{comment.name.slice(0,1)}</span>
           <div className="news-comment-main">
             <strong>{comment.name}</strong>
             <p>{comment.text}</p>
             <span className="news-comment-likes"><ThumbsUp size={12}/> 공감 {comment.likes}</span>
           </div>
         </div>)}
       </div>
     </section>}
 </article>;
}
