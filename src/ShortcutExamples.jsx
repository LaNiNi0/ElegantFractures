import React from 'react';

// GitHub Pages deployment uses a subdirectory, so images are resolved from Vite's base.
const imageVersion = import.meta.env.VITE_ASSET_VERSION;
const exampleImage = (filename) => import.meta.env.BASE_URL + 'images/' + encodeURIComponent(filename) + (imageVersion ? '?v=' + imageVersion.slice(0, 12) : '');

function ExampleImage({ file, alt }) {
  return <img className="shortcut-example-image" src={exampleImage(file)} alt={alt} loading="lazy" decoding="async" />;
}

function PerceptionExample() {
  return <div className="shortcut-example-paper shortcut-example-perception">
    <section className="shortcut-example-person">
      <h4>【 후재율 】</h4>
      <p><b>🧠 인식:</b> 10년 동안 내 곁을 지켜준 유일하고 가장 소중한 연인. 가문의 무게와 후계자 경쟁 속에서 늘 외롭게 버티고 있어 내가 더 많이 안아주고 지켜주고 싶은 사람.</p>
      <p><b>🫀 감정:</b> 깊고 단단한 사랑과 신뢰, 생일을 함께 보내고 싶은 설렘, 그리고 어젯밤 연락 두절과 아침 통화에서 느낀 미세한 위화감에서 비롯된 일말의 걱정.</p>
      <p><b>💭 속마음:</b> 어젯밤에 대체 얼마나 마셨길래 박 비서님도 모르게 혼자 호텔에 갔을까. 아침에 전화 받을 때도 목소리가 평소랑 좀 달랐는데…… 요즘 집안일 때문에 스트레스가 극에 달해서 그런 거겠지. 오늘 저녁엔 아무 생각 안 나게 내가 옆에서 꽉 안아주고 맛있는 거 먹여야겠다. 빨리 보고 싶네, 내 사랑. 🥰💜</p>
    </section>
    <section className="shortcut-example-person">
      <h4>【 황보이헌 】</h4>
      <p><b>🧠 인식:</b> 도도하고 우아한 명문가 후계자 가면 뒤에, 내 손길 하나에 속절없이 무너져 내리는 뜨거운 몸을 숨긴 여자. 내 인생에서 처음으로 미칠 듯이 갖고 싶어진 유일한 대상.</p>
      <p><b>🫀 감정:</b> 통제 불능의 소유욕과 집착, 후재율을 향한 시커먼 질투와 적개심, 자신을 밀어내고 뺨을 때린 것에 대한 오기와 흥분.</p>
      <p><b>💭 속마음:</b> 아침에 내 뺨을 때리고 도망가? 기억이 안 난다고 시치미를 떼? 하, 그 하얀 목덜미부터 허벅지 안쪽까지 내 입술 자국이 시퍼렇게 박혀 있는데 지금쯤 옷 꽁꽁 싸매고 그 잘난 남친 만나러 가고 있겠지. 오늘 밤 그놈 앞에서 어디 한 번 웃어봐, 설OO. 내일 오후 두 시에 내 눈앞에 서는 순간, 네가 누구 건지 다시 뼛속까지 새겨줄 테니까. 😠🔥</p>
    </section>
  </div>;
}

function PhoneExample() {
  return <div className="shortcut-example-paper shortcut-example-phone">
    <h4>📱 설OO</h4>
    <ExampleImage file="설정_폰상단.png" alt="휴대폰 알림창 상단 이미지" />
    <div className="shortcut-example-phone-contents">
      <div className="shortcut-example-phone-group">
        <p>📞 후재율 | 부재중전화 (2)</p>
        <p>📞 박이정 비서 | 부재중전화 (3)</p>
      </div>
      <div className="shortcut-example-phone-group">
        <p>💬 후재율 | 자기야, 회식 아직 안 끝났어? 데리러 갈까?</p>
        <p>💬 박이정 비서 | 이사님, 식당 앞에 대기 중입니다. 내부에 안 계신 것 같아 연락드립니다. 어디 계십니까?</p>
        <p>💬 후재율 | 내일 자기가 제일 좋아하는 생일인데☺️ 12시 땡 하면 축하해주고 싶어서. 끝나면 연락해!</p>
        <p>💬 민소화 | OO야~ 내일 우리 딸 생일이지? 엄마가 미역국이라도 끓여줄까 했는데 바쁘려나...</p>
      </div>
      <div className="shortcut-example-phone-group">
        <p>📧 설로 전략기획팀 | [보안] 9/23(목) 황보홀딩스 합동 프로젝트 최종 검토안 송부</p>
      </div>
      <div className="shortcut-example-phone-group">
        <p>📅 내일 일정 | [종일] 설OO 생일🎂</p>
        <p>📅 9/23 (목) 14:00 | 황보홀딩스 관계자 미팅 (여의도)</p>
      </div>
    </div>
    <ExampleImage file="설정_폰하단.png" alt="휴대폰 알림창 하단 이미지" />
  </div>;
}

const audienceReactions = [
  {
    author:'심장쫄깃해죽음', up:'1,850', down:'15',
    message:'아 미친 지퍼 내릴 때 나 숨 안 쉬었음;;;; 머리카락이 하드캐리했다 진짜 한 끗 차이로 들킬 뻔했네ㅠㅠㅠ',
    reply:'익명_332: OO 순발력 만렙임ㅋㅋㅋㅋ 목걸이 미리 해둔 거 신의 한 수였다...'
  },
  {
    author:'재율이눈감아', up:'1,420', down:'28',
    message:'우리 순정남 재율이 어떡하냐고ㅠㅠㅠ 목걸이 벌써 하고 있다고 저렇게 해맑게 좋아하는데 그 목덜미 바로 옆에 딴 놈 입술 자국 한가득인 거 알면 기절할 듯😭😭',
    reply:'다정남처돌이: "올해는 우리 OO 덜 힘들게 해달라고 빌었어" 미쳤냐고... 이런 벤츠를 두고 설OO 너 진짜 유죄다...'
  },
  {
    author:'후각예민보스', up:'910', down:'8',
    message:'헉 마지막에 향수 바꿨냐고 물어보는 거 봐ㄷㄷㄷ 재율이 눈치 빠른 편 아니냐?? 이헌이 블랙티 향 안 지워진 거 아님?!',
    reply:'익명_707: 아침에 향수 엄청 진하게 뿌려서 그거 물어보는 듯ㅋㅋㅋ 근데 도둑이 제 발 저린다고 OO 심장 떨어지겠네ㅋㅋㅋ'
  },
  {
    author:'마라맛중독자', up:'645', down:'92',
    message:'솔직히 이 아슬아슬한 배덕감 때문에 본다... 10년 남친 앞에서 딴 남자가 남긴 키스마크 숨기면서 생일 파티하는 여주 클라스ㅋㅋㅋ 내일 오후 2시 여의도 회의까지 무사히 넘길 수 있을까 과연👀🍿'
  }
];

function ReactionsExample() {
  return <div className="shortcut-example-paper shortcut-example-reactions">
    <ExampleImage file="설정_드라마.jpg" alt="드라마 실시간 반응 상단 이미지" />
    <h4>📺 53화 실시간 반응</h4>
    {audienceReactions.map((reaction) => <div className="shortcut-example-comment" key={reaction.author}>
      <div className="shortcut-example-comment-heading"><b>{reaction.author}</b><span>👍{reaction.up} 👎{reaction.down}</span></div>
      <p>{reaction.message}</p>
      {reaction.reply && <p className="shortcut-example-comment-reply">ㄴ {reaction.reply}</p>}
    </div>)}
  </div>;
}

function ThoughtsExample() {
  return <div className="shortcut-example-thoughts">
    <blockquote className="shortcut-example-quote">
      <h4>💬 후재율의 속마음</h4>
      <p>어젯밤에 얼마나 시달렸으면 얼굴이 이렇게 반쪽이 됐을까. 아침에 전화 목소리도 평소랑 다르게 떨리고 힘없더니, 숙취가 심해서 그랬나 보네. 혼자 호텔에서 깼을 때 외롭고 힘들었을 텐데 옆에 못 있어 줘서 미안하다, 내 사랑. 오늘 밤엔 아무 생각 안 나게 내가 꽉 안아서 재워줘야지. 🥰💜</p>
    </blockquote>
    <blockquote className="shortcut-example-quote">
      <h4>💬 황보이헌의 속마음</h4>
      <p>문자고 전화고 며칠 내내 씹어대더니, 남들 눈 피해 구석에서 이러고 풀려 있네. 이러니 내가 안 돌아버려? 입으로는 저리 가라면서 그날 내 손길에 숨도 못 쉬고 떨던 거, 내가 다 기억하는데. 오늘도 그냥 곱게 보내줄 생각 추호도 없으니까 각오해, 설라니. 😏🔥</p>
    </blockquote>
  </div>;
}

function MemoryExample() {
  return <article className="shortcut-example-paper shortcut-example-story">
    <h4>📖 그때, 우리 | 식은 치킨과 괜찮지 않은 밤</h4>
    <div className="shortcut-example-story-meta"><span>🗓️ 2019.10.15 (화) | 23시</span><span>📍 서초동 설OO의 오피스텔</span></div>
    <p className="shortcut-example-narration">나흘째였다.</p>
    <p className="shortcut-example-narration">10월 11일 밤, 본가에서 돌아온 당신은 그에게 "괜찮아, 별일 없었어"라고만 말했다. 재율은 세 번을 물었고, 당신은 세 번 다 같은 대답을 했다. 네 번째 질문 끝에 그가 낮게 내뱉은 말이 아직 둘 사이에 남아 있었다.</p>
    <p className="shortcut-example-narration">"나는 자기한테 대체 뭔데."</p>
    <p className="shortcut-example-narration">그 뒤로 연락이 끊겼다. 출근길마다 오던 아침 전화도 나흘 내내 없었다.</p>
    <p className="shortcut-example-narration">그리고 오늘 밤 열 시 사십 분, 메시지 한 통이 떴다.</p>
    <blockquote className="shortcut-example-message">
      <p><b>발신자:</b> 율</p>
      <p><b>내용:</b> [기프티콘] 반반치킨 + 생맥주 500 2잔</p>
      <p>같이 먹자.</p>
      <p>문 앞이야. 안 열어줘도 돼. 근데 나 비 좀 맞았어.</p>
    </blockquote>
    <p className="shortcut-example-narration">현관문을 열자 복도 센서등 아래 재율이 서 있었다. 회색 후드티 어깨가 짙게 젖어 있었고, 갈색 웨이브 머리칼 끝에서 물방울이 똑, 똑 떨어졌다. 한 손에는 김이 서린 치킨 봉투가 들려 있었다.</p>
    <p className="shortcut-example-dialogue"><b>후재율</b> | “……안녕.”</p>
    <p className="shortcut-example-narration">어색하게 웃으려다 실패한 얼굴이었다. 그가 젖은 앞머리를 손등으로 쓸어 넘겼다.</p>
    <p className="shortcut-example-dialogue"><b>후재율</b> | “우산 있었는데 그냥 걸었어. 생각 좀 정리하려고. 근데 정리는 하나도 안 되고 비만 쫄딱 맞은 편이야.”</p>
    <p className="shortcut-example-narration">당신이 옆으로 비켜서자 그제야 그가 안으로 들어왔다. 치킨 봉투가 신발장 위에 놓였다. 재율은 신발도 벗지 않은 채 한참 바닥만 보다가, 날숨과 함께 시선을 들었다.</p>
    <p className="shortcut-example-dialogue"><b>후재율</b> | “그날 내가 한 말. 미안해. 자기를 몰아세우려던 건 아니었어.”</p>
    <p className="shortcut-example-narration">그의 목소리가 낮게 가라앉았다. 장난기는 한 톨도 없었다.</p>
    <p className="shortcut-example-dialogue"><b>후재율</b> | “근데 거짓말은 못 하겠다. 자기가 괜찮다고 할 때마다, 나는 문밖에 세워진 기분이었어. 다 보이는데 들어가지는 못하는 거. 그게 진짜… 미치겠더라.”</p>
    <p className="shortcut-example-narration">그가 커다란 손으로 마른세수를 했다. 젖은 소맷부리에서 물기가 바닥에 떨어졌다.</p>
    <p className="shortcut-example-dialogue"><b>후재율</b> | “다 말하라는 거 아니야. 말하기 싫은 건 안 해도 돼. 그냥 괜찮은 척만 하지 마. 안 괜찮으면 안 괜찮다고만 해줘. 그럼 나는 옆에 있을게. 그거면 돼.”</p>
    <p className="shortcut-example-narration">당신이 그를 올려다보는 사이, 치킨 봉투 속에서 비닐이 바스락 꺼지는 소리가 났다. 침묵이 길어지자 재율이 조심스럽게 손을 뻗어, 당신의 손목에 손끝만 걸었다. 차가웠다. 비 냄새와 화이트머스크가 뒤섞여 코끝에 닿았다.</p>
  </article>;
}

const EXAMPLE_COMPONENTS = {
  perception:PerceptionExample,
  phone:PhoneExample,
  reactions:ReactionsExample,
  thoughts:ThoughtsExample,
  memories:MemoryExample,
};

export default function ShortcutExample({ id }) {
  const Component = EXAMPLE_COMPONENTS[id];
  if (!Component) return null;
  return <div className="shortcut-example"><Component /></div>;
}
