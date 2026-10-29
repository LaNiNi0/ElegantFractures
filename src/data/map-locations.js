// Fictional Seoul places, plotted at NEIGHBORHOOD REFERENCE POINTS, not specific addresses.
// Source for dong centroids: Seoul administrative dong center coordinates (WGS84).
// These positions only represent the area of the fictional property or office.
export const storyLocations = [
  {id:'seol',type:'house',houseId:'seol',name:'설가 본가',area:'성북동',region:'서울 성북구',lat:37.59668,lng:126.9941,subtitle:'설진표 · 권태린 · 설리원',description:'전통과 질서를 중시하는 설가의 본가. 가주 부부와 설리원이 거주한다.'},
  {id:'hwangbo',type:'house',houseId:'hwangbo',name:'황보가 본가',area:'평창동',region:'서울 종로구',lat:37.61569,lng:126.9681,subtitle:'황보독민 · 황보가',description:'황보가의 서울 본가. 이헌은 후계자이지만 이곳이 아닌 별도 주거지에서 생활한다.'},
  {id:'seonwoo',type:'house',houseId:'seonwoo',name:'선우가 본가',area:'연희동',region:'서울 서대문구',lat:37.57223,lng:126.9328,subtitle:'선우보령 · 선우해무',description:'의료·학술·문화재단에 기반을 둔 선우가의 서울 본가.'},
  {id:'cha',type:'house',houseId:'cha',name:'차가 본가',area:'청담동',region:'서울 강남구',lat:37.52439,lng:127.0505,subtitle:'차강신 · 차우도',description:'언론·엔터테인먼트·유통 분야에서 영향력을 가진 차가의 서울 본가.'},
  {id:'kwon',type:'house',houseId:'kwon',name:'권가 본가',area:'한남동',region:'서울 용산구',lat:37.53753,lng:127.0052,subtitle:'권진성 · 권채하',description:'정계·법조·금융에 뿌리를 둔 권가의 서울 본가. 설가와 혼인으로 연결되어 있다.'},
  {id:'jaeyul-home',type:'home',name:'후재율 자택',area:'성수동 · 서울숲 인근',region:'서울 성동구',lat:37.54079,lng:127.0423,subtitle:'고급 주상복합 · 복층 아파트',description:'아크노드 대표 후재율의 개인 거주지. 유저와의 동거 여부는 플레이어의 선택이다.'},
  {id:'iheon-home',type:'home',name:'황보이헌 자택',area:'논현동',region:'서울 강남구',lat:37.51524,lng:127.0362,subtitle:'프라이빗 고급 저층 복층 빌라',description:'황보가 후계자인 이헌의 독립 주거지. 평창동 본가와 별도로 생활한다.'},
  {id:'sohwa-home',type:'home',name:'민소화 자택',area:'부암동',region:'서울 종로구',lat:37.59696,lng:126.9635,subtitle:'정원이 있는 단독주택',description:'꽃을 좋아하는 소화가 생활하는 정원 있는 단독주택.'},
  {id:'jiwan-home',type:'home',name:'설지완 부부 자택',area:'반포동 · 한강변',region:'서울 서초구',lat:37.5075,lng:127.0020,subtitle:'한강변 고급 아파트',description:'결혼한 설지완이 부부와 함께 분가해 거주하는 고급 아파트.'},
  {id:'arcnode',type:'work',name:'아크노드(ARCNODE)',area:'역삼동 · 테헤란로',region:'서울 강남구',lat:37.50084,lng:127.0355,subtitle:'기업용 정보보안 소프트웨어 회사',description:'후재율이 2023년 설립한 아크노드의 본사. 윤세온도 창립멤버로 일하고 있다.'},
  {id:'hwangbo-holdings',type:'work',name:'황보홀딩스',area:'여의도',region:'서울 영등포구',lat:37.52851,lng:126.9285,subtitle:'황보이헌 · 전략투자실장',description:'황보가의 투자·사업 전략 업무 거점. 이헌은 2027년 7월 후계자 발표 직후 전략투자실장에 취임했다.'}
];

export const mapCategories = [
  {id:'all',name:'전체',description:'모든 장소'},
  {id:'house',name:'오대명가',description:'다섯 본가'},
  {id:'home',name:'주거지',description:'독립 거주지'},
  {id:'work',name:'업무지',description:'회사와 사업장'}
];
