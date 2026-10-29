// Fictional Seoul places, plotted at NEIGHBORHOOD REFERENCE POINTS, not specific addresses.
// Source for dong centroids: Seoul administrative dong center coordinates (WGS84).
// These positions only represent the area of the fictional property or office.
export const storyLocations = [
  {id:'seol',type:'house',houseId:'seol',name:'설가 본가',area:'성북동',region:'서울 성북구',lat:37.59668,lng:126.9941,subtitle:'설진표 · 권태린 · 설리원',description:'설가의 서울 본가. 전통 한옥·현대식 복합 대저택.'},
  {id:'hwangbo',type:'house',houseId:'hwangbo',name:'황보가 본가',area:'평창동',region:'서울 종로구',lat:37.61569,lng:126.9681,subtitle:'황보독민 · 황보가',description:'황보가의 서울 본가. 검은 기와와 어두운 석재의 폐쇄적인 대저택.'},
  {id:'seonwoo',type:'house',houseId:'seonwoo',name:'선우가 본가',area:'연희동',region:'서울 서대문구',lat:37.57223,lng:126.9328,subtitle:'선우보령 · 선우해무',description:'선우가의 서울 본가. 조용하고 절제된 고급 대저택.'},
  {id:'cha',type:'house',houseId:'cha',name:'차가 본가',area:'청담동',region:'서울 강남구',lat:37.52439,lng:127.0505,subtitle:'차강신 · 차우도',description:'차가의 서울 본가. 예술 작품처럼 설계된 현대식 대저택.'},
  {id:'kwon',type:'house',houseId:'kwon',name:'권가 본가',area:'한남동',region:'서울 용산구',lat:37.53753,lng:127.0052,subtitle:'권진성 · 권채하',description:'권가의 서울 본가. 한강 조망을 갖춘 현대식 대저택.'},
  {id:'jaeyul-home',type:'home',name:'후재율 자택',area:'성수동 · 서울숲 인근',region:'서울 성동구',lat:37.54079,lng:127.0423,subtitle:'후재율',description:'후재율의 개인 거주지. 고급 주상복합·복층 아파트.'},
  {id:'iheon-home',type:'home',name:'황보이헌 자택',area:'논현동',region:'서울 강남구',lat:37.51524,lng:127.0362,subtitle:'황보이헌',description:'이헌의 독립 주거지. 고급 저층 빌라.'},
  {id:'sohwa-home',type:'home',name:'민소화 자택',area:'부암동',region:'서울 종로구',lat:37.59696,lng:126.9635,subtitle:'민소화',description:'정원이 있는 단독주택.'},
  {id:'jiwan-home',type:'home',name:'설지완 부부 자택',area:'반포동 · 한강변',region:'서울 서초구',lat:37.5075,lng:127.0020,subtitle:'설지완·이홍련',description:'결혼한 설지완 부부가 거주하는 고급 아파트.'},
  {id:'arcnode',type:'work',name:'아크노드(ARCNODE)',area:'역삼동 · 테헤란로',region:'서울 강남구',lat:37.50084,lng:127.0355,subtitle:'기업용 정보보안 소프트웨어 회사',description:'후재율이 설립한 아크노드 본사.'},
  {id:'hwangbo-holdings',type:'work',name:'황보홀딩스',area:'여의도',region:'서울 영등포구',lat:37.52851,lng:126.9285,subtitle:'황보가의 투자·사업 전략 업무 거점',description:'황보이헌이 전략투자실장으로 있는 황보 계열사.'},
  {id:'seol-asset',type:'work',name:'설가 계열 자산운용사',area:'여의도',region:'서울 영등포구',lat:37.5219,lng:126.9235,subtitle:'설가의 투자 전략·사업 확장 업무 거점',description:'설지완이 전략사업본부장으로 있는 설가 계열사.'},
  {id:'seol-foundation',type:'work',name:'설가 장학문화재단',area:'광화문',region:'서울 종로구',lat:37.5716,lng:126.9769,subtitle:'설가의 장학문화재단',description:'설리원이 대외적 체면을 위해 비상임 이사직으로 있으며 주요 후원·홍보 행사에 참석.'}
];

export const mapCategories = [
  {id:'all',name:'전체',description:'모든 장소'},
  {id:'house',name:'오대명가',description:'서울 본가'},
  {id:'home',name:'주거지',description:'독립 거주지'},
  {id:'work',name:'업무지',description:'회사와 사업장'}
];
