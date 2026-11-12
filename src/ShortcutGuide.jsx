import React, { useState } from 'react';
import ShortcutExample from './ShortcutExamples.jsx';
import { ArrowLeft, BookOpenText, ChevronRight, Clock3, Eye, Heart, History, MessageCircle, Newspaper, RefreshCw, Smartphone, Sparkles, Users, Zap } from 'lucide-react';

// Player-facing guide only. Command execution takes place in the Crack story platform.
const COMMANDS = [
  {
    id:'check', name:'/점검', category:'진행 관리', icon:RefreshCw,
    short:"스토리 전반의 오류와 불일치를 점검함.",
    usages:[["/점검","세계관·연표·사건·인물 관계·감정선·정보 인지 범위 등 스토리 전반을 재점검함."]],
    detail:"스토리 전체의 설정과 전개를 종합적으로 점검함. 세계관과 연표, 사건의 인과관계, 인물의 성격·말투·감정선, 관계 변화와 정보 인지 범위, 복선과 비밀의 취급, 유저의 선택권, 서사 속도와 개연성, 설정 충돌이나 모순까지 폭넓게 확인하고 이후 진행에 반영함.",
    cautions:["점검 결과를 별도로 출력하지 않고 이후 스토리 진행에 반영함.","이미 확정된 사실이나 유저의 선택을 임의로 수정하지 않음.","새 사건을 강제로 만들거나 진행을 건너뛰는 용도로 사용하지 않음."],
    silent:true
  },
  {
    id:'phone', name:'/폰', category:'정보 확인', icon:Smartphone,
    short:"스마트폰 알림을 확인함.",
    usages:[["/폰","유저의 휴대폰 알림창을 확인함."],["/폰 재율","재율의 휴대폰 알림창을 확인함."],["/폰 지완","지완의 휴대폰 알림창을 확인함."]],
    detail:"현재 시간과 인물의 직업·관계·일정에 맞춰 부재중 전화, 카톡, 문자, DM, 이메일 등의 알림 미리보기를 확인함.",
    cautions:["알림은 해당 인물이 실제로 알 수 있는 정보 범위 안에서 표시됨.","타인의 휴대폰 알림을 확인해도 극중 유저가 그 내용을 자동으로 알게 되지는 않음."],
    output:'휴대폰 잠금화면 형태의 알림 미리보기'
  },
  {
    id:'rumor', name:'/소문', category:'정보 확인', icon:Newspaper,
    short:"명가·재계·사교계의 소문을 확인함.",
    usages:[["/소문","현재 세계 전반의 소문과 여론을 확인함."],["/소문 설가","설가에 관한 기사·소문·여론을 확인함."],["/소문 황보가","황보가에 관한 소식을 확인함."],["/소문 아크노드","특정 기업의 기사와 반응을 확인함."],["/소문 후계자","사건·주제 키워드로 소문을 검색함."]],
    detail:"인물·가문·기업·사건 등 자유로운 키워드로 소문을 조회함. 내용에 따라 경제 기사, 가십, 찌라시, 커뮤니티 게시물, SNS 등 적합한 매체 형식으로 표현함.",
    cautions:["소문에는 사실뿐 아니라 추측·과장·오해가 섞일 수 있음.","비밀은 합리적인 목격·취재·유출 경로 없이 자동으로 공개되지 않음."],
    output:'매체별 기사·찌라시·게시글과 필요한 경우 댓글'
  },
  {
    id:'skip', name:'/스킵', category:'진행 관리', icon:Clock3,
    short:"원하는 시점으로 이동함.",
    usages:[["/스킵 다음날 아침","다음 날 아침으로 시간을 이동함."],["/스킵 3일 후","현재 시점에서 3일을 건너뜀."],["/스킵 2027.10.16 18:00","지정한 날짜와 시간으로 이동함."],["/스킵 다음 후계자 모임","확정된 후계자 모임 일정으로 이동함."]],
    detail:"날짜·시간·기간 또는 이미 예정된 일정으로 이동함. 건너뛴 시간에도 NPC와 가문·기업·사회는 각자의 생활과 활동을 이어감.",
    cautions:["스킵 중 유저의 미입력 행동·대사·감정이나 중대한 선택을 임의로 확정하지 않음.","이동한 시점을 기준으로 새로운 장면을 자연스럽게 이어감."],
    output:'이동한 시간·장소의 새 장면과 필요한 경과 정보'
  },
  {
    id:'summary', name:'/요약', category:'진행 관리', icon:BookOpenText,
    short:"최근 30턴의 주요 진행을 요약함.",
    usages:[["/요약","최근 사건과 주요 관계 변화를 시간순으로 정리함."]],
    detail:"최근 30턴의 날짜·시간, 주요 사건과 확정된 사실, 인물 관계의 변화를 중심으로 스토리 진행을 정리함.",
    cautions:["요약 과정에서 새로운 사건을 생성하지 않음.","이전 진행 내용을 복기하거나 별도로 보관할 때 활용함."],
    output:'날짜·시간별 최근 사건과 주요 관계 변화 요약'
  },
  {
    id:'interlude', name:'/막간', category:'장면 연출', icon:Users,
    short:"유저가 없는 NPC 장면을 펼침.",
    usages:[["/막간","직전 흐름과 연결된 NPC 장면을 확인함."],["/막간 재율","재율을 중심으로 한 장면을 확인함."],["/막간 황보가","황보가와 관련된 장면을 요청함."],["/막간 이헌 원나잇","이헌을 중심으로 원나잇 관련 장면을 요청함."]],
    detail:"인물·사건·장소 등의 키워드로 유저가 등장하지 않는 장면을 요청함. NPC는 현재까지의 관계·목적·정보 인지 범위에 따라 독립적으로 행동함.",
    cautions:["막간에서 발생한 사건은 실제 서사에 반영됨.","플레이어가 본 장면을 극중 유저가 자동으로 알지는 못함.","막간 종료 후 일반 진행은 기존 유저 시점으로 돌아감.","이어서 보려면 직전 명령어와 동일한 키워드를 바로 다시 입력함. 예: /막간 재율 → /막간 재율."],
    output:'해당 키워드에 맞는 NPC 중심 장면'
  },
  {
    id:'memories', name:'/그때', category:'장면 연출', icon:History,
    short:"재율과의 10년 연애 기억을 회상함.",
    usages:[["/그때","두 사람의 과거 연애 에피소드 하나를 회상함."],["/그때 첫눈","첫눈에 얽힌 두 사람의 기억을 회상함."],["/그때 화해","화해에 얽힌 과거 연애 에피소드를 회상함."],["/그때 2020년 겨울","특정 시기의 에피소드를 요청함."]],
    detail:"시기·감정·장소·사건 등을 키워드로 지정함. 2017년 2월 11일 첫 만남부터 현재까지, 당시 날짜·시간·장소와 재율의 말·행동을 담은 과거 장면 한 편을 보여줌.",
    cautions:["확정된 사건·관계 단계·인물 성격을 지키며, 유저의 대사·내면·중요한 선택을 임의로 정하지 않음.","생성된 에피소드는 실제 과거사로 취급되며 이후 회상과 서사에 반영될 수 있음.","과거를 회상할 뿐 현재 시점의 시간·행동·사건을 강제로 진행하지 않음.","이어서 보려면 직전 명령어와 동일한 키워드를 바로 다시 입력함. 예: /그때 화해 → /그때 화해."],
    output:'「📖 그때, 우리 | 제목」과 날짜·시간·장소, 당시 상황·행동·대사 중심의 회상 장면 1건'
  },
  {
    id:'event', name:'/사건', category:'장면 연출', icon:Zap,
    short:"현재 흐름에 맞는 사건의 계기를 마련함.",
    usages:[["/사건","현재 장면에 개연성 있는 사건의 계기를 마련함."],["/사건 설가","설가와 연관된 사건 방향을 지정함."],["/사건 업무","직업·업무 관련 사건을 요청함."]],
    detail:"소재나 영역을 키워드로 지정해 사건의 계기를 마련함. 기존 설정과 인물 관계, 시간 흐름, 세계관의 인과관계를 고려해 자연스럽게 연결함.",
    cautions:["입력 직후 사건을 출력하지 않고 다음 일반 스토리 진행에 반영함.","대형 사고·폭로·고백 등 극단적인 사건을 억지로 강제하지 않음."],
    silent:true
  },
  {
    id:'serendipity', name:'/우연필연', category:'장면 연출', icon:Heart,
    short:"로맨틱한 상황의 계기를 마련함.",
    usages:[["/우연필연","현재 흐름에 어울리는 인물과 계기를 마련함."],["/우연필연 이헌","이헌과 가까워질 수 있는 우연한 상황을 요청함."],["/우연필연 재율","재율과의 관계에 맞는 상황을 요청함."]],
    detail:"우연한 마주침·도움·춤·근거리 상황 등 로맨틱한 긴장감이 생길 만한 계기를 마련함.",
    cautions:["호감·키스·고백·관계 성립 등을 자동으로 확정하지 않음.","기존 감정이나 성격을 임의로 바꾸거나 유저의 반응을 대신 정하지 않음."],
    output:'현재 상황에 자연스럽게 연결되는 로맨틱한 계기'
  },
  {
    id:'thoughts', name:'/속마음', category:'메타 감상', icon:MessageCircle,
    short:"NPC의 드러나지 않은 속마음을 확인함.",
    usages:[["/속마음","현재 장면에 적합한 NPC의 속마음을 확인함."],["/속마음 재율","재율의 속마음을 확인함."],["/속마음 이헌","이헌의 속마음을 확인함."],["/속마음 재율 이헌","두 사람의 속마음을 각각 확인함."]],
    detail:"한 명 또는 여러 명의 인물을 지정해 현재 감정과 관계에 따른 생각을 인용문 형태로 확인함.",
    cautions:["유저의 속마음을 대신 생성하지 않음.","플레이어를 위한 정보이며 극중 유저가 직접 들은 대사로 처리하지 않음."],
    output:'인물별 인용문 형태의 속마음'
  },
  {
    id:'perception', name:'/인식', category:'메타 감상', icon:Eye,
    short:"인물이 유저에게 품은 인식·감정·속마음을 확인함.",
    usages:[["/인식 재율","재율이 유저를 바라보는 인식·감정·생각을 확인함."],["/인식 재율 이헌","재율과 이헌의 인식·감정·속마음을 각각 확인함."]],
    detail:"지정한 인물이 유저를 어떻게 인식하는지, 유저를 향해 어떤 감정을 느끼는지, 유저에 관해 속으로 무슨 생각을 하는지 각 인물의 관점에서 보여줌. 지금까지의 사건·관계·정보 인지 범위를 반영함.",
    cautions:["명령어 사용만으로 관계 상태가 바뀌지는 않음.","미공개 사건이나 배후의 비밀을 확정된 정답처럼 폭로하지 않음."],
    output:'인물별 인식·감정·속마음 요약'
  },
  {
    id:'reactions', name:'/실시간반응', category:'메타 감상', icon:Sparkles,
    short:"가상 시청자의 실시간 반응을 확인함.",
    usages:[["/실시간반응","현재 장면 전체에 대한 시청자 반응을 확인함."],["/실시간반응 재율","재율과 관련된 행동·장면에 초점을 맞춰 확인함."],["/실시간반응 설가","설가 관련 갈등에 대한 반응을 확인함."]],
    detail:"드라마 시청자처럼 과몰입·추측·응원·비판·농담·밈이 섞인 댓글을 출력함.",
    cautions:["시청자는 공개된 장면만을 기준으로 반응하며 미공개 진실을 알지 못함.","극중 SNS 여론이 아니라 작품 밖 시청자의 메타 반응을 표현함."],
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
      {!['check','skip','event','serendipity'].includes(current.id) && <>
        <h3>출력 예시</h3>
        {['phone','perception','reactions','thoughts','memories','rumor','interlude'].includes(current.id) ? (
          <ShortcutExample id={current.id} />
        ) : (
          <div className="shortcut-preview shortcut-preview-muted">
            <strong>플레이 예시 준비 중</strong>
            <p>예상 형식: {current.output}</p>
          </div>
        )}
      </>}
    </> : <>
      <div className="section-kicker">PLAYER GUIDE · ELEGANT FRACTURES</div>
      <h2>단축어</h2>
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
    </>}
  </div>;
}
