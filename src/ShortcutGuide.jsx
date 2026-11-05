import React, { useState } from 'react';
import { ArrowLeft, BookOpenText, ChevronRight, Clock3, Eye, Heart, MessageCircle, Newspaper, RefreshCw, Smartphone, Sparkles, Users, Zap } from 'lucide-react';

// Player-facing guide only. Command execution takes place in the Crack story platform.
const COMMANDS = [
  {
    id:'check', name:'/점검', category:'진행 관리', icon:RefreshCw,
    short:'서사와 설정의 일관성을 다시 확인해요.',
    usages:[['/점검','현재까지의 사건, 인물 관계, 정보 인지 범위와 시간 흐름을 재점검합니다.']],
    detail:'캐릭터 성격과 말투, 관계 변화, 비밀의 전달 경로, 개연성을 확인하도록 요청하는 명령어예요.',
    cautions:['별도 결과는 출력하지 않고 이후 진행에 자연스럽게 반영합니다.','새로운 사건을 만들거나 이미 일어난 일을 마음대로 바꾸는 명령어가 아니에요.'],
    silent:true
  },
  {
    id:'phone', name:'/폰', category:'정보 확인', icon:Smartphone,
    short:'인물의 스마트폰 알림을 살펴봐요.',
    usages:[['/폰','유저의 휴대폰 알림창을 봅니다.'],['/폰 후재율','후재율의 휴대폰 알림창을 봅니다.'],['/폰 설지완','설지완의 휴대폰 알림창을 봅니다.']],
    detail:'현재 시간과 인물의 직업, 관계, 일정에 맞는 부재중 전화·카톡·문자·DM·이메일 등의 미리보기를 확인해요.',
    cautions:['알림은 실제 인물의 정보 범위에 맞춰 표시됩니다.','타인의 폰을 조회해도 극중 유저가 그 내용을 자동으로 알게 되지는 않아요.'],
    output:'휴대폰 잠금화면 형태의 알림 미리보기'
  },
  {
    id:'rumor', name:'/소문', category:'정보 확인', icon:Newspaper,
    short:'오대 명가와 재계·사교계에 도는 이야기를 확인해요.',
    usages:[['/소문','현재 세계 전반의 소문과 여론을 확인합니다.'],['/소문 황보가','황보가에 관한 소식만 살펴봅니다.'],['/소문 아크노드','특정 기업에 대한 기사나 반응을 살펴봅니다.'],['/소문 후계자','사건·주제 키워드로 소문을 검색합니다.']],
    detail:'인물·가문·기업·사건 등 자유 키워드를 사용하세요. 내용에 따라 경제 기사, 가십, 찌라시, 커뮤니티 게시물, SNS 등 적합한 매체로 표현돼요.',
    cautions:['소문은 사실, 추측, 과장, 오해가 섞일 수 있어요.','비밀은 합리적인 목격·취재·유출 경로 없이 자동으로 공개되지 않아요.'],
    output:'매체별 기사·찌라시·게시글과 필요한 경우 댓글'
  },
  {
    id:'skip', name:'/스킵', category:'진행 관리', icon:Clock3,
    short:'원하는 시점으로 이동해 이야기를 이어가요.',
    usages:[['/스킵 다음날 아침','현재 장면의 다음 날 아침으로 이동합니다.'],['/스킵 3일 후','현재 시점에서 3일을 건너뜁니다.'],['/스킵 2027.10.16 18:00','지정한 날짜와 시간으로 이동합니다.'],['/스킵 다음 후계자 모임','확정된 일정이 있다면 그 시점으로 이동합니다.']],
    detail:'날짜, 시간, 기간, 이미 예정된 일정 등을 키워드로 지정하세요. 스킵한 시간에도 NPC·가문·기업과 사회는 각자의 생활을 계속합니다.',
    cautions:['스킵 중 유저의 미입력 행동·대사·감정이나 중대한 선택을 임의로 확정하지 않아요.','이동한 시점에서 새로운 장면이 자연스럽게 이어집니다.'],
    output:'이동한 시간·장소의 새 장면과 필요한 경과 정보'
  },
  {
    id:'summary', name:'/요약', category:'진행 관리', icon:BookOpenText,
    short:'최근 30턴의 중요한 진행 내용을 정리해요.',
    usages:[['/요약','최근 사건과 주요 관계 변화를 시간순으로 정리합니다.']],
    detail:'날짜와 시간, 중요한 사실과 관계 변화에 집중해 현재 스토리를 다시 살펴볼 수 있어요.',
    cautions:['새로운 사건은 생성하지 않아요.','지금까지의 진행 내용을 기억하거나 별도로 보관할 때 유용해요.'],
    output:'날짜·시간별 최근 사건과 주요 관계 변화 요약'
  },
  {
    id:'interlude', name:'/막간', category:'장면 연출', icon:Users,
    short:'유저가 등장하지 않는 NPC 장면을 감상해요.',
    usages:[['/막간','직전 흐름과 이어지는 NPC 장면을 봅니다.'],['/막간 후재율','후재율이 중심이 되는 장면을 봅니다.'],['/막간 황보가','황보가와 관련된 장면을 요청합니다.']],
    detail:'인물 또는 사건·장소 같은 키워드를 지정할 수 있어요. NPC는 현재까지의 관계, 목적, 정보 범위를 바탕으로 독립적으로 행동합니다.',
    cautions:['막간에서 발생한 사건은 실제 서사에 남습니다.','플레이어가 본 장면을 극중 유저가 자동으로 알지는 못해요.','이후 일반 진행은 원래의 유저 시점으로 돌아옵니다.'],
    output:'해당 키워드에 맞는 NPC 중심 장면'
  },
  {
    id:'event', name:'/사건', category:'장면 연출', icon:Zap,
    short:'현재 상황에 어울리는 사건의 계기를 만들어요.',
    usages:[['/사건','현재 장면과 개연성 있는 사건을 준비합니다.'],['/사건 설가','설가와 연관된 사건 방향을 지정합니다.'],['/사건 업무','직업·업무 관련 사건을 요청합니다.']],
    detail:'키워드로 원하는 소재나 영역을 지정할 수 있어요. 사건은 기존 관계와 세계의 흐름을 고려해 이어집니다.',
    cautions:['명령어를 입력한 즉시 사건을 보여주지는 않아요. 다음 일반 스토리 진행에 반영됩니다.','갑작스러운 대형 사고, 폭로, 고백 등을 강제하지 않아요.'],
    silent:true
  },
  {
    id:'serendipity', name:'/우연필연', category:'장면 연출', icon:Heart,
    short:'로맨틱한 가능성이 있는 상황을 만들어요.',
    usages:[['/우연필연','현재 흐름에 적합한 인물과 계기를 만듭니다.'],['/우연필연 황보이헌','이헌과 우연히 가까워질 수 있는 상황을 요청합니다.'],['/우연필연 후재율','재율과의 관계에 맞는 상황을 요청합니다.']],
    detail:'우연한 마주침, 도움, 춤, 근거리 상황 등 로맨틱한 긴장감이 생길 계기만 마련해요.',
    cautions:['상호 호감, 키스, 고백, 관계 성립을 자동 확정하지 않아요.','기존 감정과 성격을 바꾸거나 유저의 반응을 대신 정하지 않아요.'],
    output:'현재 상황에 자연스럽게 연결되는 로맨틱한 계기'
  },
  {
    id:'thoughts', name:'/속마음', category:'메타 감상', icon:MessageCircle,
    short:'NPC의 말하지 않은 감정을 들여다봐요.',
    usages:[['/속마음','현재 장면에서 적절한 NPC의 속마음을 봅니다.'],['/속마음 후재율','재율의 속마음을 봅니다.'],['/속마음 후재율, 황보이헌','두 사람의 속마음을 각각 봅니다.']],
    detail:'캐릭터를 한 명 또는 여러 명 지정할 수 있어요. 인물의 현재 감정과 관계에 맞는 생각이 인용문 형태로 표시됩니다.',
    cautions:['유저의 속마음은 대신 만들지 않아요.','이 출력은 플레이어를 위한 정보이며, 극중 유저가 직접 들은 대사가 아니에요.'],
    output:'인물별 인용문 형태의 속마음'
  },
  {
    id:'perception', name:'/인식', category:'메타 감상', icon:Eye,
    short:'NPC가 현재 유저를 어떻게 보는지 알아봐요.',
    usages:[['/인식 후재율','재율의 유저에 대한 인식·감정·생각을 봅니다.'],['/인식 황보이헌, 설지완','두 인물의 관점을 각각 비교합니다.']],
    detail:'현재까지의 사건, 신뢰, 호감, 경계, 관계 의향 등을 인물마다 다른 관점으로 보여줘요.',
    cautions:['이 명령어만으로 관계 상태가 바뀌지는 않아요.','미공개 사건이나 배후의 비밀을 정답처럼 폭로하지 않아요.'],
    output:'인물별 인식·감정·속마음 요약'
  },
  {
    id:'reactions', name:'/실시간반응', category:'메타 감상', icon:Sparkles,
    short:'현재 장면을 본 가상 시청자들의 댓글을 읽어요.',
    usages:[['/실시간반응','현재 장면 전체에 관한 시청자 반응을 봅니다.'],['/실시간반응 후재율','재율 관련 장면과 행동에 초점을 맞춰 봅니다.'],['/실시간반응 설가','설가 관련 갈등 중심의 반응을 봅니다.']],
    detail:'현실의 드라마 시청자처럼 과몰입, 추측, 응원, 비판, 농담과 밈이 섞인 댓글을 출력해요.',
    cautions:['시청자는 지금까지 보여준 장면을 기준으로 반응하고 미공개 진실을 알지 못해요.','극중 SNS 여론이 아니라 작품 밖 시청자의 메타 반응이에요.'],
    output:'가상 시청자 댓글 5~10개와 필요시 대댓글'
  }
];
const CATEGORIES = ['진행 관리','정보 확인','장면 연출','메타 감상'];

export default function ShortcutGuide(){
  const [selected,setSelected]=useState(null);
  const [category,setCategory]=useState('전체');
  const current=COMMANDS.find(x=>x.id===selected);
  const shown=category==='전체'?COMMANDS:COMMANDS.filter(x=>x.category===category);
  return <div className="app-content shortcuts-app">
    {current ? <>
      <button className="shortcut-return" type="button" onClick={()=>setSelected(null)}><ArrowLeft size={16}/> 단축어 목록</button>
      <div className="shortcut-detail-head">
        <span className="shortcut-icon"><current.icon size={25}/></span>
        <div><span className="section-kicker">{current.category}</span><h2>{current.name}</h2></div>
      </div>
      <p className="shortcut-lead">{current.detail}</p>
      <h3>사용 방법 · 키워드 예시</h3>
      <div className="shortcut-usage-list">
        {current.usages.map(([syntax,explanation])=><div className="shortcut-usage" key={syntax}>
          <code>{syntax}</code><p>{explanation}</p>
        </div>)}
      </div>
      <h3>알아두면 좋아요</h3>
      <div className="shortcut-notes">
        {current.cautions.map(note=><p key={note}>{note}</p>)}
      </div>
      <h3>출력 예시</h3>
      {current.silent
        ? <div className="shortcut-preview shortcut-preview-muted"><strong>별도 출력 없음</strong><p>명령어 실행 후의 동작은 위 설명을 참고해 주세요.</p></div>
        : <div className="shortcut-preview shortcut-preview-muted"><strong>실제 플레이 테스트 결과 준비 중</strong><p>예상 형식: {current.output}</p><p>테스트로 확인한 출력 예시를 추후 추가할 예정이에요.</p></div>}
    </> : <>
      <div className="section-kicker">PLAYER GUIDE · ELEGANT FRACTURES</div>
      <h2>단축어</h2>
      <p className="shortcut-lead">스토리 플레이를 돕는 단축어 {COMMANDS.length}개를 소개해요. 실제 명령어는 크랙 플랫폼에서 사용하세요.</p>
      <div className="shortcut-filters" aria-label="단축어 분류">
        {['전체',...CATEGORIES].map(c=><button type="button" key={c} className={category===c?'active':''} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}
      </div>
      <div className="shortcut-list">
        {shown.map(item=><button type="button" className="shortcut-entry" key={item.id} onClick={()=>setSelected(item.id)}>
          <span className="shortcut-icon"><item.icon size={20}/></span>
          <span className="shortcut-entry-text"><strong>{item.name}</strong><small>{item.short}</small></span>
          <ChevronRight size={16} className="shortcut-chevron"/>
        </button>)}
      </div>
      <p className="shortcut-footer-note">출력 내용은 현재 장면과 설정에 따라 달라져요. 예시는 실제 테스트 후 차례로 추가할 예정이에요.</p>
    </>}
  </div>;
}
