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
    tagline:'무표정한 얼굴 뒤에 숨겨진 건조한 유머.',
    gender:'남성', birth:'1992.11.12', height:'187cm',
    occupation:'설가 후계자 전담 수행비서', organization:'설가 후계자 직속',
    personality:['침착함','냉철함','책임감','충성심','건조한 유머'],
    memo:'후계자 선정 이후 직접 발탁한 수행비서.\n업무 능력이 뛰어나고 믿을 수 있는 사람이다. 필요할 때는 주저 없이 반대 의견을 말할 수 있다.',
    notesId:'ijeong-protected'
  },
  seon: {
    id:'seon', theme:'seon', compact:true,
    tagline:'똑 부러지는 사랑스럽고 엉뚱한 사차원.',
    gender:'여성', birth:'1995.07.24', height:'164cm',
    occupation:'프로그래머', organization:'아크노드(ARCNODE) 창립 멤버',
    personality:['사차원','당돌함','명석함','높은 자존감','강한 몰입력'],
    memo:'재율과 아크노드를 함께 창립한 동료.\n독특한 사고방식과 뛰어난 프로그래밍 실력을 가졌다. 재율을 남몰래 오래 짝사랑해 왔다.',
    notesId:'jaeyul-seon-jealousy'
  },

  // Shorter player-facing cards for the Seol family; no height/romance/taste details.
  jinpyo: {
    id:'jinpyo', theme:'seol-family', family:true,
    tagline:'감정보다 질서와 계산을 우선하는, 냉정하고 권위적인 가부장.',
    birth:'1958.08.03', relation:'아버지', position:'설가 가주',
    personality:['냉정함','권위적','과묵함','계산적','원칙주의'],
    memo:'가족에게도 좀처럼 감정을 드러내지 않는 아버지. 가문의 이익과 질서를 최우선으로 여기며, 자녀들 역시 능력과 성과로 평가한다.',
    notesId:'jinpyo-distance'
  },
  taerin: {
    id:'taerin', theme:'seol-family', family:true,
    tagline:'정제된 우아함과 강한 통제욕을 지닌, 설가의 서늘한 안주인.',
    birth:'1960.11.23', relation:'계모', position:'설가 안주인',
    personality:['우아함','체면 중시','통제욕','냉정함','절제됨'],
    memo:'가문의 체면과 질서를 무엇보다 중요하게 여기는 사람. 자신의 자식들에게는 각별하지만 내게는 언제나 냉담했다. 내가 후계자로 선정된 뒤로 그 관계는 더욱 악화되었다.',
    notesId:'taelin-formal'
  },
  sohwa: {
    id:'sohwa', theme:'seol-family', family:true,
    tagline:'보호본능을 자극하는, 한 떨기 장미처럼 가녀리고 여린 사람.',
    birth:'1970.04.08', relation:'생모',
    personality:['유약함','순진함','의존적','감성적','생활력 부족'],
    memo:'마음이 여리고 사람을 쉽게 믿는 엄마. 늘 누군가에게 기대야 할 것처럼 위태롭고, 크고 작은 문제를 일으키곤 한다. 답답하고 지칠 때도 많지만, 차마 외면할 수 없는 사람이다.',
    notesId:'sohwa-spending'
  },
  jiwan: {
    id:'jiwan', theme:'seol-family', family:true,
    tagline:'유능하지만 오만함과 다혈질적인 성격이 치명적인 설가의 장남.',
    birth:'1990.01.30', relation:'오빠', position:'설가 계열 자산운용사 전략사업본부장·전무',
    personality:['다혈질','분노 조절 취약','선민의식','오만함','심한 바람기'],
    memo:'일할 능력은 충분하지만 성격과 품행 때문에 후계자가 되지 못한 오빠. 내가 자신의 자리를 빼앗았다고 생각한다. 2025년 이홍련과 결혼했지만 바람기는 여전하다.',
    notesId:'jiwan-conflict'
  },
  riwon: {
    id:'riwon', theme:'seol-family', family:true,
    tagline:'사랑스럽고 배려 깊은 얼굴 뒤에 욕심과 질투를 감춘 설가의 막내딸.',
    birth:'1998.07.19', relation:'여동생', position:'설가 장학문화재단 비상임 이사',
    personality:['사랑스러움','사교성','이중성','허영심','욕심','질투심'],
    memo:'누구에게나 착하고 다정해 보이지만, 남이 가진 것은 언제나 더 좋아 보이는 동생. 자신의 욕망마저 자연스럽고 사랑스러운 말로 포장하는 데 능숙하다.',
    notesId:'riwon-overheard'
   },

  // Hwangbo house contacts: public-facing temperament, not unrevealed lineage.
  dokmin: {
    id:'dokmin', theme:'hwangbo-family', family:true, familyKicker:'HWANGBO · 2027',
    tagline:'강한 자존심과 고집을 지닌, 호방한 황보가의 독불장군.',
    birth:'1957.07.17', relationLabel:'신분', relation:'황보가 가주',
    personality:['호방함','강한 자존심','고집','독립적','독단적'],
    memo:'황보가의 독립성과 자존심을 무엇보다 중요하게 여기는 가주. 호탕하고 시원시원한 성격이지만, 한번 정한 뜻은 좀처럼 굽히지 않는다.'
  },
  seogyeong: {
    id:'seogyeong', theme:'hwangbo-family', family:true, familyKicker:'HWANGBO · 2027',
    tagline:'기품 있는 태도와 신중한 판단력을 지닌 황보가의 안주인.',
    birth:'1963.03.22', relationLabel:'신분', relation:'황보가 안주인',
    positionLabel:'가족 관계', position:'황보독민의 두 번째 부인',
    personality:['기품','신중함','관찰력','침착함','사교성'],
    memo:'황보독민의 두 번째 부인. 조용하고 침착한 성격으로, 사람과 상황을 세심하게 관찰한다. 쉽게 속내를 드러내지 않지만 타인에게 예의를 갖추는 사람이다.'
   },

  // Other houses: compact worldbuilding contacts, with intentional generic avatars.
  boryeong: {
    id:'boryeong', theme:'seonwoo-family', family:true, worldOnly:true, familyKicker:'SEONWOO · 2027',
    tagline:'인간적인 따뜻함과 다정한 카리스마로 사람을 이끄는 선우가의 가주.',
    birth:'1972.05.01', relationLabel:'신분', relation:'선우가 가주',
    personality:['다정함','인간미','부드러운 카리스마','배려심']
  },
  haemu: {
    id:'haemu', theme:'seonwoo-family', family:true, worldOnly:true, familyKicker:'SEONWOO · 2027',
    tagline:'세상만사가 심드렁하고 귀찮아 보이는, 무기력하고 엉뚱한 후계자.',
    birth:'2000.09.09', relationLabel:'신분', relation:'선우가 후계자',
    personality:['심드렁함','사차원','무기력','무심함']
  },
  gangsin: {
    id:'gangsin', theme:'cha-family', family:true, worldOnly:true, familyKicker:'CHA · 2027',
    tagline:'장난스럽고 여유로운데도 좀처럼 흠잡을 데가 없는 남자.',
    birth:'1966.04.25', relationLabel:'신분', relation:'차가 가주',
    personality:['장난기','여유','유쾌함','무결점']
  },
  udo: {
    id:'udo', theme:'cha-family', family:true, worldOnly:true, familyKicker:'CHA · 2027',
    tagline:'신선놀음하듯 세상을 즐기지만, 속에는 꿍꿍이가 가득한 장난꾸러기.',
    birth:'1995.06.07', relationLabel:'신분', relation:'차가 후계자',
    personality:['넘치는 자기애','능청스러움','장난기','숨은 속셈']
  },
  jinseong: {
    id:'jinseong', theme:'kwon-family', family:true, worldOnly:true, familyKicker:'KWON · 2027',
    tagline:'권력을 제멋대로 휘두르는, 다혈질에 부패한 독불장군.',
    birth:'1951.06.30', relationLabel:'신분', relation:'권가 가주',
    personality:['다혈질','독불장군','오만함','부패']
  },
  chaeha: {
    id:'chaeha', theme:'kwon-family', family:true, worldOnly:true, familyKicker:'KWON · 2027',
    tagline:'겉으로는 나긋하게 순종하지만, 아버지가 권좌에서 내려오길 기다리는 야망가.',
    birth:'1985.10.16', relationLabel:'신분', relation:'권가 후계자',
    personality:['나긋함','순종적인 겉모습','치밀함','지능적','야망']
  }
};
