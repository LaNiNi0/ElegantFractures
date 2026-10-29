// Player-facing contact profiles. Only approved public/profile details belong here.
// Author-only motivations, family secrets and future relationship branches stay private.
export const primaryContactProfiles = {
  jaeyul: {
    id:'jaeyul', theme:'jaeyul', tagline:'다정한 여유와 단단한 원칙을 지닌, 십 년을 함께한 연인.',
    gender:'남성', birth:'1993.10.25', identity:'유저의 10년 연인',
    occupation:'아크노드(ARCNODE) 창립자·대표이사, 프로그래머', height:'193cm',
    personality:['다정함','능글맞음','여유','외유내강','높은 자존감','원칙적'],
    romanceExperience:'유저 이전 연애 3회',
    romance:['다정함','헌신적','배려심','연인의 독립성 존중','자연스러운 애정 표현'],
    scent:'화이트 머스크', alcohol:'소주 3병', drinking:['노래 부르기','연인에게 달라붙기'],
    likes:['캠핑','별 보기','힙합','전자기기','맥주','암벽등반','동물','비 맞기'],
    dislikes:['무례함','더위','난잡한 코드','막걸리','나방','신 음식'],
    notesFolder:'재율의 기록'
  },
  iheon: {
    id:'iheon', theme:'iheon', tagline:'가시를 세운 흑장미처럼 위험하고 매혹적인, 황보가의 새로운 후계자.',
    gender:'남성', birth:'1997.02.08', identity:'황보가 직계 후계자',
    occupation:'황보홀딩스 전략투자실장', height:'191cm',
    personality:['반항적','능글맞음','도발적','영리함','눈치 빠름','자유분방'],
    romanceExperience:'연애 경험 다수',
    romance:['적극적','짓궂은 호감 표현','장난스러운 도발','스킨십에 거리낌 없음'],
    scent:'블랙티', alcohol:'소주 1.5병', drinking:['심한 감정 기복','어리광'],
    likes:['위스키','옛 대중가요','농구','빈티지','우유캔디','유행하는 디저트','오락실'],
    dislikes:['민폐','가난','크리스마스','탄산음료','폭설','아버지','쓴 음식'],
    notesFolder:'이헌의 기록'
  },
  ijeong: {
    id:'ijeong', theme:'ijeong', compact:true,
    tagline:'침착하고 냉철한 판단력, 무표정한 얼굴 뒤에 숨겨진 건조한 유머.',
    gender:'남성', birth:'1992.11.12', height:'187cm',
    occupation:'설가 후계자 전담 수행비서', organization:'설가 후계자 직속',
    personality:['침착함','냉철함','책임감','충성심','건조한 유머'],
    memo:'2025년 후계자 선정 이후 내가 직접 발탁한 수행비서. 업무 능력이 뛰어나고 믿을 수 있는 사람이다. 필요할 때는 내 판단에도 주저 없이 반대한다.',
    notesId:'ijeong-protected'
  },
  seon: {
    id:'seon', theme:'seon', compact:true,
    tagline:'사랑스럽고 엉뚱한 사차원. 귀여운 외모와 달리 당돌하고 똑 부러지는 성격.',
    gender:'여성', birth:'1995.07.24', height:'164cm',
    occupation:'프로그래머', organization:'아크노드(ARCNODE) 창립 멤버',
    personality:['사차원','당돌함','명석함','높은 자존감','강한 몰입력'],
    memo:'재율과 2020년 코딩 대회에서 처음 만나 2023년 아크노드를 함께 창립한 동료. 독특한 사고방식과 뛰어난 프로그래밍 실력을 가진 사람이다.',
    relationship:'재율을 오래 짝사랑해 온 사람이라는 것도 나는 알고 있다.',
    notesId:'jaeyul-seon-jealousy'
  }
};
