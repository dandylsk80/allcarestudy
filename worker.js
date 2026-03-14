// ============================================================
// ── URL 영문 매핑 ─────────────────────────────────────────
const SIDO_MAP = {
  'seoul':'서울','gyeonggi':'경기','incheon':'인천',
  'busan':'부산','daegu':'대구','gwangju':'광주','daejeon':'대전'
};
const SIDO_EN = Object.fromEntries(Object.entries(SIDO_MAP).map(([k,v])=>[v,k]));

const DISTRICT_MAP = {
  'gangnam':'강남구','seocho':'서초구','songpa':'송파구','gangdong':'강동구',
  'mapo':'마포구','yangcheon':'양천구','nowon':'노원구','gangseo':'강서구',
  'dongjak':'동작구','gwanak':'관악구','seongbuk':'성북구','yongsan':'용산구',
  'junggu':'중구','jongno':'종로구','jungnang':'중랑구','gwangjin':'광진구',
  'dongdaemun':'동대문구','seongdong':'성동구','eunpyeong':'은평구',
  'seodaemun':'서대문구','dobong':'도봉구','gangbuk':'강북구',
  'geumcheon':'금천구','guro':'구로구',
  'suwon':'수원시','seongnam':'성남시','yongin':'용인시','goyang':'고양시',
  'bucheon':'부천시','anyang':'안양시','hwaseong':'화성시','namyangju':'남양주시',
  'yeonsu':'연수구','namdong':'남동구','bupyeong':'부평구',
  'haeundae':'해운대구','suyeong':'수영구','dongrae':'동래구',
  'suseong':'수성구','dalseo':'달서구'
};
const DISTRICT_EN = Object.fromEntries(Object.entries(DISTRICT_MAP).map(([k,v])=>[v,k]));

const DONG_MAP = {
  'gaepo':'개포동','nonhyeon':'논현동','daichi':'대치동','dogok':'도곡동',
  'samsung':'삼성동','segok':'세곡동','suseo':'수서동','sinsa':'신사동',
  'apgujeong':'압구정동','yeoksam':'역삼동','ilwon':'일원동','jagok':'자곡동',
  'cheongdam':'청담동','yulhyeon':'율현동'
};
const DONG_EN = Object.fromEntries(Object.entries(DONG_MAP).map(([k,v])=>[v,k]));

const GRADE_MAP = {'elementary':'초등','middle':'중등','high':'고등'};
const GRADE_EN = Object.fromEntries(Object.entries(GRADE_MAP).map(([k,v])=>[v,k]));

const SUBJECT_MAP = {
  'math':'수학','english':'영어','korean':'국어','science':'과학',
  'social':'사회','coding':'코딩','essay':'논술'
};
const SUBJECT_EN = Object.fromEntries(Object.entries(SUBJECT_MAP).map(([k,v])=>[v,k]));

function toKr(sido,district,dong,grade,subject){
  return {
    sido: SIDO_MAP[sido]||sido,
    district: DISTRICT_MAP[district]||district,
    dong: dong ? (DONG_MAP[dong]||dong) : null,
    grade: GRADE_MAP[grade]||grade,
    subject: SUBJECT_MAP[subject]||subject,
  };
}
function enUrl(sido,district,dong,grade,subject){
  const s=SIDO_EN[sido]||sido, d=DISTRICT_EN[district]||district,
        dg=dong?(DONG_EN[dong]||dong):null,
        g=GRADE_EN[grade]||grade, sb=SUBJECT_EN[subject]||subject;
  if(dg) return `/${s}/${d}/${dg}/${g}/${sb}`;
  return `/${s}/${d}/${g}/${sb}`;
}

// 올케어스터디 Cloudflare Worker v3
// 강남구 전체 동 × 학년 × 과목 SEO 페이지 자동 생성
// ============================================================

const GANGNAM_DONGS = [
  '개포동','논현동','대치동','도곡동','삼성동','세곡동',
  '수서동','신사동','압구정동','역삼동','일원동','자곡동',
  '청담동','율현동'
];

const CENTERS = [{"name":"하남풍산점","officialName":"하남풍산점와와학습코칭학원","regNo":"경기도광주하남교육지원청 제 하남314호","sido":"경기","sido_en":"gyeonggi","district":"하남시","address":"경기 하남시 덕풍동로 119  하남프라자 501호 와와학습코칭학원","directions":"경기도 하남시 덕풍동로119 하남프라자501호 \n 스타벅스 맞은편 건물입니다\n 주차 1시간 가능합니다","target_elem":"나룰초, 하남풍산초","target_mid":"덕풍중, 신평중, 동부중","target_high":"풍산고, 남한고, 신장고, 감일고, 미사고, 애니고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"사동점","officialName":"사동점와와학습코칭학원","regNo":"경상북도경산교육지원청 제1276호","sido":"경북","sido_en":"gyeongbuk","district":"경산시","address":"경북 경산시 백자로10길 1  402호 와와학습코칭학원","directions":"경산시 백자로 10길 1 402호(사동 공차건물)","target_elem":"사동초, 삼성현초, 평산초, 동부초","target_mid":"사동중, 문명중, 삼성현중, 경산중, 경산여중, 장산중","target_high":"사동고, 경산여고, 경산고, 문명고, 경북체고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"하계점","officialName":"하계점와와학습코칭학원","regNo":"서울북부교육청 등록 제 2016-12호","sido":"서울","sido_en":"seoul","district":"노원구","address":"서울 노원구 노원로 257  401호","directions":"혜성여고 건너편, 하계중 바로 옆, 1층에 메가커피가 있는 건물의 4층 맨 안쪽","target_elem":"","target_mid":"하계중, 녹천중, 상명중, 태릉중, 공릉중","target_high":"혜성여고, 대진고, 상명고, 월계고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수지점","officialName":"수지점와와학습코칭학원","regNo":"용인교육지원청 등록 제4774호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 수지구 문정로 13  중수프라자 503호","directions":"수지구청 맞으면 우리은행 건물 / 수지구청역 2번출구에서 2분거리","target_elem":"풍천초, 정평초, 이현초","target_mid":"이현중, 수지중, 정평중","target_high":"상현고, 신봉고, 홍천고, 성복고, 풍덕고, 수지고, 죽전고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"이곡점","officialName":"이곡점와와학습코칭학원","regNo":"대구남부교육지원청 등록 제2016-13호","sido":"대구","sido_en":"daegu","district":"달서구","address":"대구광역시 달서구 이곡동 달구벌대로259길 33  제일빌딩 5층","directions":"대구시 달서구 달구벌대로259길 33 제일빌딩 5층 (1층이 현풍닭칼국수 음식점이 있는 빌딩)","target_elem":"와룡초","target_mid":"성산중","target_high":"성서고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"탄현점","officialName":"탄현점와와학습코칭학원","regNo":"고양교육지원청 등록 제5930호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산서구 산현로17번길 23  은행프라자 4","directions":"✅주차장 주소: 경기도 고양시 일산서구 산현로17번길 35 탄현제2공영주차장\n(간판은 아파트쪽에서 보이기 때문에 혹시 간판이 보이지 않으면 농협 간판 보고 건물 확인 해주시면 됩니다) \n\n(차량 이용 시 주차는 탄현제2공영주차장 이용 부탁드립니다)\n(죄송하지만 주차비는 따로 지원하고 있지 않습니다)","target_elem":"상탄초","target_mid":"일산동중, 일산중, 호곡중","target_high":"일산동고, 덕이고, 중산고, 일산동고, 중산고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"철산점","officialName":"철산점와와학습코칭학원","regNo":"광명교육지원청 등록 제1781호","sido":"경기","sido_en":"gyeonggi","district":"광명시","address":"경기도 광명시 철산동 도덕공원로 27  삼우빌딩 2층","directions":"경기도 광명시 도덕공원로27 삼우빌딩 2층 (주차장이 없습니다 인근 철산성당이나 인근 아파트에 주차가능합니다)","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"치평점","officialName":"와와학습코칭학원","regNo":"광주서부교육지원청 등록 제6027호","sido":"광주","sido_en":"gwangju","district":"서구","address":"광주 서구 치평로 76  대한빌딩 403호","directions":"상무지구 이디야커피 건물4층이나 맥도널드 옆에 있다고 전달드립니다.","target_elem":"운천초, 계수초","target_mid":"전남중, 동명중","target_high":"전남고, 상무고, 광주여고, 상일여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"지족점","officialName":"와와학습코칭학원","regNo":"대전서부교육지원청 등록 제 서4241호","sido":"대전","sido_en":"daejeon","district":"유성구","address":"대전 유성구 지족동  910-7번지 401","directions":"노은역 동광장 다이소 맞은편 와플대학, BYC건물 4층","target_elem":"상지초, 지족초, 노은초, 수정초","target_mid":"지족중, 노은중","target_high":"반석고, 지족고, 노은고, 유성여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수완점","officialName":"와와학습코칭수완학원","regNo":"광주서부교육지원청 등록 제6778호","sido":"광주","sido_en":"gwangju","district":"광산구","address":"광주 광산구 임방울대로 310  아이비타워 406","directions":"텃밭 건물로 들어와서 4층으로 올라오시면 바로 아발론 어학원이 있습니다.\n그대로 오른쪽을 바라보시면 복도 안쪽에 수완센터가 자리하고 있습니다.","target_elem":"","target_mid":"수완중, 장덕중","target_high":"수완고, 장덕고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"호매실점","officialName":"와와학습코칭센터호매실학원","regNo":"수원교육지원청 등록 제6830호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기 수원시 권선구 금곡로 116  유동빌딩  602호","directions":"금곡동 유동타워 6층입니다.(채선당,아이온 소아과건물)","target_elem":"","target_mid":"","target_high":"호매실고, 영신여고, 동원고, 동우여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신곡점","officialName":"와와학습코칭센터학원","regNo":"의정부교육지원청 등록 제2071호","sido":"경기","sido_en":"gyeonggi","district":"의정부시","address":"경기도 의정부시 신곡동 장곡로 626  금오종합상가 A동 302,303호","directions":"경기북부청사경전철역 건너편 금오종합상가 3층(1층 페리카나)","target_elem":"","target_mid":"천보중, 효자중","target_high":"효자고, 경민it고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"행신점","officialName":"행신점와와학습코칭센터학원","regNo":"경기도고양교육지원청 등록 제6408호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 중앙로 442  아성프라자 305호 와와학습코칭학원","directions":"경기도 고양시 중앙로 442, 아성프라자 305호(홈플러스 건물 3층)","target_elem":"아람초, 행신초, 덕은초, 서정초","target_mid":"서정중, 행신중, 무원중, 가람중, 덕양중","target_high":"서정고, 행신고, 무원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"서신점","officialName":"와와학습코칭학원","regNo":"전주교육지원청 등록 제6457호","sido":"전북","sido_en":"jeonbuk","district":"전주시","address":"전북특별자치도 전주시 완산구 서신로 5  4층 와와학습코칭학원","directions":"서신로5 4층(본병원 사거리에 있습니다)","target_elem":"중산초","target_mid":"","target_high":"한일고, 근영고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"센트럴점","officialName":"센트럴점와와학습코칭학원","regNo":"광주하남교육지원청 등록 제1894호","sido":"경기","sido_en":"gyeonggi","district":"하남시","address":"경기 하남시 미사강변대로 84  미사탑프라자 601호","directions":"미사탑프라자 6층( 빽다방 건물/ 자이아파트 정문)","target_elem":"한홀초, 청하초","target_mid":"윤슬중, 미사중","target_high":"미사강변고, 미사고, 신장고, 남한고, 풍산고, 강일고, 특성화고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"미금점","officialName":"금곡점와와학습코칭학원","regNo":"성남교육지원청 등록 제5313호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기도 성남시 분당구 금곡동 돌마로 87  골드프라자 402호","directions":"미금역 2번출구 150m 앞 국민은행 건물4층","target_elem":"미금초, 청솔초, 늘푸른초","target_mid":"불곡중, 청솔중, 늘푸른중","target_high":"불곡고, 늘푸른고, 분당중앙고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"야탑점","officialName":"야탑와와학습코칭학원","regNo":"성남교육지원청 등록 제6056호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기 성남시 중원구 양현로 461  4층","directions":"","target_elem":"여수초, 야탑초, 중탑초","target_mid":"야탑중","target_high":"아람고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"갈매점","officialName":"갈매점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제4331호","sido":"경기","sido_en":"gyeonggi","district":"구리시","address":"경기 구리시 갈매중앙로 79  에스엠타워 602호","directions":"안녕하세요, OO학생 학부모님~갈매점. 위치는 (구리시 갈매동79, 에스엠타워602호)입니다. 1층에 새마을금고, 베스킨라빈스 건물 6층입니다.","target_elem":"갈매초, 산마루초","target_mid":"갈매중","target_high":"갈매고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"마두점","officialName":"마두점와와학습코칭센터학원","regNo":"고양교육지원청 등록 제6135호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산동구 중앙로 1191  굿모닝법조타운 1 604호","directions":"스타벅스 마두역점 건물 6층","target_elem":"백신초, 호수초","target_mid":"백석중, 저동중","target_high":"백신고, 정발고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"첨단점","officialName":"첨단점와와학습코칭센터학원","regNo":"광주서부교육지원청 등록 제7200호","sido":"광주","sido_en":"gwangju","district":"광산구","address":"광주 광산구 월계로 191  404호","directions":"광주광역시 광산구 월계로191 첨단메디컬빌딩 4층 404호\n1층에 김가네와 쿼드커피 사이에 입구가 있습니다\n엘리베이터에서 내리셔서 바로 오른쪽에 센터가 위치합니다","target_elem":"월봉초","target_mid":"천곡중, 월봉중","target_high":"장덕고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송정점","officialName":"송정점와와학습코칭학원","regNo":"울산강북교육지원청 등록 제5652호","sido":"울산","sido_en":"ulsan","district":"북구","address":"울산 북구 화산로 123  골드테라스 404호","directions":"울산 북구 화산로 123 골드테라스건물 4층 404호\n1층에 백소정건물있습니다.","target_elem":"고헌초, 송정초, 화봉초","target_mid":"고헌중, 화봉중, 연암중","target_high":"화봉고, 매곡고, 무룡고, 울산공고, 에너지고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"석동점","officialName":"석동점와와학습코칭학원","regNo":"창원교육지원청 등록 제1933호","sido":"경남","sido_en":"gyeongnam","district":"창원시","address":"경남 창원시 진해구 석동로 51  세븐코아 504호","directions":"진해구 석동로 51 세븐코아빌딩 5층 와와학습코칭센터","target_elem":"","target_mid":"석동중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수진점","officialName":"수진점와와학습코칭학원","regNo":"성남교육지원청 등록 제6533호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기 성남시 중원구 원터로 95  2층","directions":"성남중앙초 후문 앞 cu 옆 건물, 행복한성적표 위층","target_elem":"성남중앙초","target_mid":"성일중, 성남중, 동광중, 풍생중","target_high":"성남여고, 성남고, 성일고, 동광고, 효성고, 숭신여고, 복정고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수성2가점","officialName":"수성2가점와와학습코칭학원","regNo":"대구광역시동부교육지원청 제6704호","sido":"대구","sido_en":"daegu","district":"수성구","address":"대구 수성구 명덕로 404  1동 404호 와와학습코칭학원","directions":"_x0008_대구 수성고 명덕로 404, 404호 3호선 수성시장역 2번출구에서 대봉교방향으로, 금손아귀 건물 4층","target_elem":"동일초, 동도초, 동성초","target_mid":"대구동중, 신명여중, 중앙중, 황금중","target_high":"남산고, 경북고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"기흥구청점","officialName":"기흥구청점와와학습코칭학원","regNo":"경기도용인교육지원청 등록 제 5253호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 기흥구 구갈로60번길 15  경영빌딩 3층 와와학습코칭학원","directions":"기흥구청 앞 신협 건물 3층, 한양수자인 103동 건너편","target_elem":"구갈초, 산양초, 관곡초","target_mid":"구갈중, 신갈중, 신릉중","target_high":"기흥고, 신갈고, 성지고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"대구도남점","officialName":"대구도남점와와학습코칭학원","regNo":"대구광역시서부교육지원청 제2023-4500호","sido":"대구","sido_en":"daegu","district":"북구","address":"대구 북구 도남중앙로7길 20-3  위너프라자 402호 와와학습코칭학원","directions":"대구 북구 도남중앙로 7길, 20-3. 402호","target_elem":"국우초, 도남초","target_mid":"학남중","target_high":"학남고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"반석점","officialName":"반석점와와학습코칭학원","regNo":"대전서부교육지원청 등록 제 서4638호","sido":"대전","sido_en":"daejeon","district":"유성구","address":"대전 유성구 지족로 282  코오롱타워2 303,304","directions":"와이식자재마트 대각선, 브래드홀릭 건물 3층","target_elem":"새미래초, 반석초","target_mid":"새미래중, 외삼중, 하기중","target_high":"반석고, 노은고, 지족고, 유성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"화성태안점","officialName":"화성태안점와와학습코칭학원","regNo":"경기도화성오산교육지원청 제4750호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 병점중앙로 87  408호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"봉담점","officialName":"봉담점와와학습코칭학원","regNo":"경기도화성오산교육지원청 제 5025호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 봉담읍 상리중심상가길 28-8  713호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"삼각산점","officialName":"삼각산점와와학습코칭학원","regNo":"성북강북교육지원청 등록 제2017-58호","sido":"서울","sido_en":"seoul","district":"강북구","address":"서울 강북구 미아동  811-9 두산위브테라스파크 상가 402/403호","directions":"","target_elem":"길음초, 송천초, 미양초","target_mid":"삼각산중, 길음중, 미양중","target_high":"삼각산고, 미양고, 영훈고, 혜화여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"당산점","officialName":"당산점와와학습코칭학원","regNo":"서울남부교육지원청 등록 제 5746호","sido":"서울","sido_en":"seoul","district":"영등포구","address":"서울 영등포구 당산로44길 3  삼성타운 504","directions":"당산역 10번 출구, 2호선 지나는 도로 따라 레미안4차 지나면 크로미빵집있는 건물 5층입니다.","target_elem":"당서초, 영동초, 당중초","target_mid":"당산중, 당산서중, 선유중","target_high":"선유고, 여의도고, 여의도여고, 영등포여고, 관악고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"은평점","officialName":"와와학습코칭학원","regNo":"서울서부교육지원청 등록 제02201700112호","sido":"서울","sido_en":"seoul","district":"은평구","address":"서울특별시 은평구 진관동 진관2로 29-21  드림스퀘어 제 8층 804호 805호","directions":"구파발역 2번출구,구파발성당 맞은편 1층 이디야,서브웨이 건물입니다.","target_elem":"은진초, 은빛초, 진관초, 신도초","target_mid":"진관중, 신도중, 연천중","target_high":"진관고, 신도고, 대성고, 선일여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"화정점","officialName":"화정점와와학습코칭학원","regNo":"고양교육지원청 등록 제5768호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 화신로 263  브릿지타워 213호, 214호 와와학습코칭학원","directions":"경기도 고양시 덕양구 화신로 263 브릿지타워 2층 214호 (한방병원 건물)","target_elem":"","target_mid":"화정중, 지도중, 신능중","target_high":"화정고, 화수고, 백양고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"인창점","officialName":"와와학습코칭센터학원","regNo":"구리남양주교육지원청 등록 제3467호","sido":"경기","sido_en":"gyeonggi","district":"구리시","address":"경기 구리시 건원대로 36  제 407호 와와학습코칭학원","directions":"화성골드프라자( 1층에 베스킨라빈스)  4층","target_elem":"건원초, 동구초, 구지초","target_mid":"인창중, 동구중","target_high":"인창고, 수택고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"염창점","officialName":"와와코칭보습학원","regNo":"강서양천교육지원청 등록 제 5716호","sido":"서울","sido_en":"seoul","district":"강서구","address":"서울 강서구 양천로67길 15  한희빌딩 2층 202호  와와학습코칭학원","directions":"등촌역 2번출구 직진 500미터 염창중앙교회옆건물, 강서구 염창동 242-11 한히빌딩 5층","target_elem":"염경초, 염동초, 백석초","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"인천삼산점","officialName":"인천삼산점와와학습코칭학원","regNo":"인천북부교육지원청 등록 제4641호","sido":"인천","sido_en":"incheon","district":"부평구","address":"인천 부평구 체육관로 32  하이존빌딩 8층 802","directions":"인천 부평구 체육관로 32 하이존 8층 (삼산체육관에서 도보 5분)\nor 굴포천역 도보 5분 or 삼산타운 7단지 정문 맞은편","target_elem":"굴포초, 진산초, 영선초","target_mid":"진산중, 삼산중, 구산중","target_high":"영선고, 삼산고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"이매점","officialName":"이매점와와학습코칭학원","regNo":"성남교육지원청 등록 제5320호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기도 성남시 분당구 이매동 이매로 49  4층 와와학습코칭센터","directions":"수인 분당선 이매역 6번 출구 바로 앞 1층 쿠쿠매장 주영빌딩 4층","target_elem":"이매초, 안말초","target_mid":"매송중, 이매중, 송림중","target_high":"이매고, 송림고, 태원고, 돌마고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"침산점","officialName":"침산점와와학습코칭학원","regNo":"대구서부교육지원청 등록 제2019-4229호","sido":"대구","sido_en":"daegu","district":"북구","address":"대구 북구 침산남로 140  엠비프라자 901","directions":"","target_elem":"침산초, 달산초","target_mid":"침산중, 대구일중, 경명여중, 산격중, 대구북중","target_high":"경명여고, 칠성고, 청구고, 사대부고, 경상고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"오산점","officialName":"와와학습코칭학원","regNo":"화성오산교육지원청 등록 제2840호","sido":"경기","sido_en":"gyeonggi","district":"오산시","address":"경기 오산시 성호대로 121  월드타워 505호","directions":"오산시청 우리은행 건물 5층","target_elem":"운천초, 성호초, 운산초","target_mid":"운암중, 운천중, 성호중","target_high":"운암고, 운천고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"별내점","officialName":"별내점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제4170호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 순화궁로 349  삼광프라자 501호","directions":"별내 카페거리 건너편 메가커피 건물5층","target_elem":"샛별초, 화접초, 별가람초, 한별초, 덕송초","target_mid":"별가람중, 한별중, 한삼중","target_high":"별가람고, 별내고, 한삼고, 퇴계원고, 청학고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"영통구청점","officialName":"영통구청점와와학습코칭학원","regNo":"수원교육지원청 등록 제6824-1호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기 수원시 영통구 매탄로108번길 10  모닝프라자 602호","directions":"영통구청 옆 중심상가 내 맘스터치 건물 6층","target_elem":"매탄초,매현초","target_mid":"매탄중,매현중","target_high":"매탄고,효원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"부평점","officialName":"와와학습코칭센터부평학원","regNo":"인천북부교육지원청 등록 제4371호","sido":"인천","sido_en":"incheon","district":"부평구","address":"인천광역시 부평구 부평동 부흥로 264  5층 와와학습코칭센터","directions":"부평시장역3번출구에서 도보5분거리/쿠우쿠우 있는 건물 5층","target_elem":"부평서초,부평동초","target_mid":"부원중,부원여중","target_high":"부평고,부평여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"풍동점","officialName":"풍동와와학습코칭학원","regNo":"고양교육지원청 등록 제5785호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산동구 숲속마을로 44  미래타워 6","directions":"풍동상가 미래타워6층(빽다방,이삭토스트건물)","target_elem":"풍산초, 다솜초, 은행초","target_mid":"풍동중, 풍산중, 양일중","target_high":"풍동고, 세원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송천점","officialName":"와와학습코칭송천점학원","regNo":"전주교육지원청 등록 제6679호","sido":"전북","sido_en":"jeonbuk","district":"전주시","address":"전북특별자치도 전주시 덕진구 솔내로 129  송천열방빌딩 501호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"태평점","officialName":"태평와와학습코칭학원","regNo":"대전동부교육지원청등록 제 2동3247호","sido":"대전","sido_en":"daejeon","district":"중구","address":"대전 중구 태평로 15  버드내마을아파트 상가 308","directions":"","target_elem":"버드내초","target_mid":"버드내중, 태평중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"목감점(모두)","officialName":"목감점모두오름학습코칭학원","regNo":"시흥교육지원청 등록 제 시1311호","sido":"경기","sido_en":"gyeonggi","district":"시흥시","address":"경기 시흥시 수풀안길 14-23  4층 402호","directions":"시흥시 수풀안길 14-23 메트로타워2 4층(1층에 원할머니보쌈있습니다)","target_elem":"조남초, 목감초","target_mid":"조남중","target_high":"목감고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송촌점","officialName":"송촌와와학습코칭학원","regNo":"대전동부교육지원청등록 제 2동3248호","sido":"대전","sido_en":"daejeon","district":"대덕구","address":"대전 대덕구 동춘당로94번길 11-7  4층 402","directions":"","target_elem":"송촌초","target_mid":"매봉중, 법동중, 송촌중","target_high":"송촌고, 명석고, 우송고, 대전여고, 동대전고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"중동점","officialName":"와와학습코칭보습학원","regNo":"부천교육지원청 등록 제5918호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 원미구 길주로 191  금영프라자 제 4층 401호","directions":"","target_elem":"부흥초, 중흥초","target_mid":"중흥중, 부명중","target_high":"증흥고, 중원고, 경기예고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"중동점(W+)","officialName":"중동점더블유플러스보습학원","regNo":"부천교육지원청 등록 제6516호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 원미구 길주로 219  드림빌딩 401호","directions":"","target_elem":"부흥초, 중흥초","target_mid":"중흥중, 부명중","target_high":"증흥고, 중원고, 경기예고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신중동점","officialName":"와와학습코칭신중동보습학원","regNo":"부천교육지원청 등록 제6330호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 원미구 조마루로291번길 25  센터프라자 405호, 406호","directions":"","target_elem":"부곡초, 계남초, 심원초","target_mid":"심원중, 계남중, 부곡중","target_high":"계남고, 심원고, 원미고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"화정점(W+)","officialName":"화정점더블유플러스학원","regNo":"고양교육지원청 등록 제6077호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 화중로 32-31  효원빌딩 401호 일부","directions":"","target_elem":"지도초","target_mid":"화정중, 신능중","target_high":"화정고, 서정고, 백양고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"양덕점","officialName":"양덕점와와학습코칭학원","regNo":"포항교육지원청 등록 제2584호","sido":"경북","sido_en":"gyeongbuk","district":"포항시","address":"경북 포항시 북구 천마로 66  환호빌딩 402호","directions":"양덕 하나로마트 근처, 양덕 농협사거리 롯데리아 사이 건물,  이디야 건물 4층,","target_elem":"양덕초 양서초 장흥초","target_mid":"양덕중 장흥중 대도중 환호여중","target_high":"장성고 포고 포여고 유성여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"옥정점","officialName":"옥정점와와학습코칭학원","regNo":"경기도동두천양주교육지원청 제1331호","sido":"경기","sido_en":"gyeonggi","district":"양주시","address":"경기 양주시 옥정로 218  신운정튼튼프라자 305호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"은평점(글로리드)","officialName":"은평점글로리드학습코칭학원","regNo":"서울특별시 서부교육지원청 제 02202300049호","sido":"서울","sido_en":"seoul","district":"은평구","address":"서울 은평구 진관2로 29-21  드림스퀘어 609호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"다산점(W+)","officialName":"다산점더블유플러스학원","regNo":"경기도구리남양주교육지원청 제4711호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 다산순환로 350  KB골든타워 310호 더블유플러스학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"옥길스타점","officialName":"옥길스타점와와학습코칭보습학원","regNo":"경기도부천교육지원청 등록 제6775호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 소사구 범안로 231-15  옥길중앙타워 제2층 201호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"광장점","officialName":"와와학습코칭학원","regNo":"성동광진교육지원청 등록 제 2316호","sido":"서울","sido_en":"seoul","district":"광진구","address":"서울 광진구 광나루로 584  동서울빌딩 5","directions":"올림픽대교북단사거리 바로 앞, 광진구 광나루로 584 동서울빌딩5층","target_elem":"","target_mid":"양진중, 광장중","target_high":"광남고, 단대부고, 건대부고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"반월당점","officialName":"반월당점와와학습코칭학원","regNo":"대구광역시동부교육지원청 제6834호","sido":"대구","sido_en":"daegu","district":"중구","address":"대구 중구 대봉로 253  3층 와와학습코칭학원","directions":"대구 중구 대봉로 253 3층 와와학습코칭학원(센트로팰리스 대백마트 맞은편)","target_elem":"대구초, 사대부초","target_mid":"대구제일중, 사대부중","target_high":"사대부고, 경북여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"배곧점","officialName":"배곧점와와학습코칭학원","regNo":"경기도시흥교육지원청 제 시1653 호","sido":"경기","sido_en":"gyeonggi","district":"시흥시","address":"경기 시흥시 배곧4로 22  배곧타운2 217호 와와학습코칭학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"명지대역점","officialName":"명지대역점와와학습코칭학원","regNo":"경기도용인교육지원청 제 5578 호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 처인구 명지로40번길 4  링크 153 502호 와와학습코칭학원","directions":"","target_elem":"함박초, 서룡초","target_mid":"용신중, 용인중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"칠금점","officialName":"칠금점와와학습코칭학원","regNo":"충주교육지원청 등록 제1469호","sido":"충북","sido_en":"chungbuk","district":"충주시","address":"충청북도 충주시 칠금동 계명대로 29  3층","directions":"","target_elem":"탄금초, 칠금초","target_mid":"탄금중, 칠금중, 중앙중, 미덕중, 여중, 북여중, 충주중","target_high":"국원고, 예성여고, 충주여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"세교점","officialName":"세교점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제4098호","sido":"경기","sido_en":"gyeonggi","district":"오산시","address":"경기 오산시 수청로 193  P&P세교프라자 402호","directions":"오산세교종합사회복지관 앞 스타벅스 건물 4층","target_elem":"","target_mid":"문시중, 세마중","target_high":"세교고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수지점(글로리드)","officialName":"수지점글로리드학습코칭학원","regNo":"경기도용인교육지원청 제5340호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 수지구 풍덕천로 114  3층 글로리드학습코칭학원","directions":"수지구청역 2번출구 바로 앞에 미스터피자 건물 3층","target_elem":"풍천초, 정평초, 이현초","target_mid":"이현중, 수지중, 정평중","target_high":"상현고, 신봉고, 홍천고, 성복고, 풍덕고, 수지고, 죽전고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"마포2호점","officialName":"마포2호점와와학습코칭학원","regNo":"서울특별시 서부교육지원청 제02202300102호","sido":"서울","sido_en":"seoul","district":"마포구","address":"서울 마포구 토정로 252  승지빌딩 3층","directions":"서울특별시 마포구 토정로 252 승지빌딩 3층 와와학습코칭학원\n(대흥역 3번출구 5분거리이며 1층 기아자동차 AS센터 건물입니다.)","target_elem":"신석초, 염리초, 용강초, 서강초, 우이초","target_mid":"서울여중, 동도중, 신수중","target_high":"서울여고, 숭문고, 광성고, 한성고, 배문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"다산도농점","officialName":"다산도농점와와학습코칭학원","regNo":"경기도구리남양주교육지원청 제4749호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 도농로 29  604호 와와학습코칭센터","directions":"다산도농 이마트앞 부영프라자 604호","target_elem":"도농초, 금교초, 미금초,","target_mid":"동화중, 도농중, 가운중","target_high":"도농고, 가운고, 다산고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"별가람점","officialName":"별가람점와와학습코칭학원","regNo":"경기도구리남양주교육지원청 제4785호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 덕송1로55번길 20  503호","directions":"경기도 남양주시 별내동 824-2 별내프라자-2 503호                                                                                   별내별가람역 3번출구에서 189m","target_elem":"덕송초, 샛별초","target_mid":"별가람중, 화접중, 한별중","target_high":"별내고, 별가람고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동탄목동점","officialName":"동탄목동점와와학습코칭학원","regNo":"경기도화성오산교육지원청 제4752호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 동탄신리천로 408  M메디칼 212호","directions":"경기도 화성시 신리천로 408 M메디컬프라자 212호 와와학습코칭학원","target_elem":"동탄목동초, 한율초","target_mid":"동탄목동중, 세정중","target_high":"창의고, 정현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"두호점","officialName":"와와학습코칭센터학원","regNo":"포항교육지원청 등록 제2124호","sido":"경북","sido_en":"gyeongbuk","district":"포항시","address":"경상북도 포항시 북구 용두산길 32  3층","directions":"파리 바게트 맞은편 건물 3층","target_elem":"","target_mid":"환호여중, 대도중","target_high":"두호고, 포여고, 장성고, 포고, 중앙고, 중앙여고, 대동고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"선운점","officialName":"선운점와와학습코칭학원","regNo":"광주광역시서부교육지원청 제7446호","sido":"광주","sido_en":"gwangju","district":"광산구","address":"광주 광산구 선운로20번길 55-1  402호 와와학습코칭학원","directions":"선운로 20번길 55-1 4층 (배가마트 옆 우산신협 건물)","target_elem":"선운초, 본량초","target_mid":"선운중","target_high":"정광고, 보문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"교하점","officialName":"교하점와와학습코칭학원","regNo":"경기도파주교육지원청 제1975호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기 파주시 청석로 272  센타프라자1 제8층 제803","directions":"와와학습코칭학원 파주 교하점\n경기도 파주시 청석로272 /센터프라자 803호(파리바게트 건물)","target_elem":"청석초, 석곶초, 두일초","target_mid":"교하중, 두일중, 심학중","target_high":"교하고, 심학고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송파위례점","officialName":"송파위례점와와학습코칭학원","regNo":"서울특별시강동송파교육지원청 제8296호","sido":"서울","sido_en":"seoul","district":"송파구","address":"서울 송파구 위례광장로 188  아이온스퀘어 8층 816호 와와학습코칭학원","directions":"와와학습코칭센터 송파위례점 위례 아이온스퀘어 8층 816호","target_elem":"송례초, 위례별초","target_mid":"위례중, 송례중","target_high":"위례고, 문현고, 문정고, 덕수고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"산본점","officialName":"산본점와와학습코칭학원","regNo":"경기도군포의왕교육지원청 제2444호","sido":"경기","sido_en":"gyeonggi","district":"군포시","address":"경기 군포시 산본로 394  대림프라자 제 6층 제602호 와와학습코칭학원","directions":"경기 군포시 산본로394 602-2호( 대림프라자 6층)\n주차장입구가 노란색입니다.\n1층에 빽다방,이삭토스트, 본죽\n산본학원가 스타벅스 옆 건물\n하나로마트 옆","target_elem":"광정초","target_mid":"산본중, 궁내중, 수리중, 도장중, 금정중","target_high":"흥진고, 산본고, 군포고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"구월점","officialName":"구월점와와학습코칭학원","regNo":"인천광역시동부교육지원청 제4031호","sido":"인천","sido_en":"incheon","district":"남동구","address":"인천 남동구 선수촌공원로23번길 6-29  다복타워 401호 와와학습코칭학원","directions":"아시아드 로터리, 농협 건물 근처 세무소 방향 바로 옆 건물","target_elem":"성리초","target_mid":"성리중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"고잔점","officialName":"와와학습코칭센터안산학원","regNo":"안산교육지원청 등록 제4176호","sido":"경기","sido_en":"gyeonggi","district":"안산시","address":"경기 안산시 단원구 광덕대로 130  폴리타운 B동 513호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"가좌점","officialName":"가좌점와와학습코칭학원","regNo":"서울서부교육지원청 등록 제02202000014호","sido":"서울","sido_en":"seoul","district":"서대문구","address":"서울 서대문구 가재울로 52  승우빌딩 301호","directions":"","target_elem":"가재울초, 연가초","target_mid":"","target_high":"가재울고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"호평점","officialName":"호평점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제4177호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 늘을3로 65-6  테마프라자 205호","directions":"경기 남양주시 늘을3로 65-6 (호평동 617-3) \n테마프라자2층 205호\n건물 지하 무료주차 가능합니다","target_elem":"구룡초, 호평초, 판곡초","target_mid":"판곡중, 호평중","target_high":"판곡고, 호평고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"평내점","officialName":"평내점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제3712호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 경춘로 1256번길 9  501호","directions":"평내상가지역 1층 메가커피건물 2층 아지트떡볶이","target_elem":"","target_mid":"장내초, 중","target_high":"고, 호평초, 중, 고, 금곡초, 중, 고, 판곡고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"부발점","officialName":"와와학습코칭부발학원","regNo":"이천교육지원청 등록 제1222호","sido":"경기","sido_en":"gyeonggi","district":"이천시","address":"경기 이천시 부발읍 경충대로2092번길 39-19  이천하이클래스 207,208","directions":"","target_elem":"아미초, 신하초","target_mid":"효양중, 사동중","target_high":"효양고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"율하점","officialName":"율하점와와학습코칭학원","regNo":"대구동부교육지원청 등록 제6183호","sido":"대구","sido_en":"daegu","district":"동구","address":"대구 동구 율하동로 32  4층 와와학습코칭센터","directions":"대구 동구 율하동로 32 대은빌딩 4층 (119센터 근처, 율원중 근처)","target_elem":"숙천초, 율원초, 율금초, 안일초","target_mid":"율원중, 강동중, 안심중, 새론중, 신기중, 동원중","target_high":"동부고, 강동고, 정동고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"비전점","officialName":"와와학습코칭센터학원","regNo":"평택교육지원청 등록 제 2126호","sido":"경기","sido_en":"gyeonggi","district":"평택시","address":"경기도 평택시 비전동 평남로 937  폴리프라자 602호, 603호","directions":"리더스하임 후문 맞은편또는 센텀정형외과 건물 6층","target_elem":"이화초 가내초 자란초","target_mid":"비전중 한광중 한광여중 평택여중 소사벌중","target_high":"비전고 한광고 한광여고 평택여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"옥길점","officialName":"옥길점와와학습코칭보습학원","regNo":"부천교육지원청 등록 제6454호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 소사구 옥길로 116  퀸즈파크 A동 7층 718호~719","directions":"","target_elem":"버들초","target_mid":"옥길중","target_high":"범박고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"후곡점","officialName":"후곡점와와학습코칭학원","regNo":"고양교육지원청 등록 제5985호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산서구 일산로 511  태성상가 2층 201,202","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"단구점","officialName":"와와학습코칭학원","regNo":"원주교육지원청 등록 제2412호","sido":"강원","sido_en":"gangwon","district":"원주시","address":"강원특별자치도 원주시 서원대로 406  리더스빌딩 402","directions":"단구동 롯데시네마 근처에 우리은행 건물 4층","target_elem":"구곡초등학교, 서원주초등학교","target_mid":"남원주중학교, 단구중학교","target_high":"치악고등학교, 원주고등학교","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"복대점","officialName":"복대점와와학습코칭학원","regNo":"청주교육지원청 등록 제5298호","sido":"충북","sido_en":"chungbuk","district":"청주시","address":"충북 청주시 흥덕구 진재로 37  3","directions":"증안초에서 하복대 방향 도보로 5분 / 아인동물병원 옆 건물 3층","target_elem":"증안초, 진흥초","target_mid":"복대중, 서원중, 솔밭중","target_high":"흥덕고, 세광고, 사대부고, 청주고, 중앙여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"단대점","officialName":"단대점와와학습코칭학원","regNo":"성남교육지원청 등록 제6183호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기 성남시 수정구 산성대로 423  5층","directions":"","target_elem":"단대초","target_mid":"서중, 은행중","target_high":"성남고, 성일고, 숭신여고, 동광고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"은평점(W+)","officialName":"은평점더블유플러스수학보습학원","regNo":"서울서부교육지원청 등록 제02202100037호","sido":"서울","sido_en":"seoul","district":"은평구","address":"서울 은평구 진관2로 19  휴먼프라자 312호","directions":"","target_elem":"진관초, 신도초, 은진초","target_mid":"진관중, 신도중, 연천중","target_high":"진관고, 신도고, 대성고, 선일여고, 동명여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"산내점","officialName":"산내점와와학습코칭학원","regNo":"파주교육지원청 등록 제1713호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기 파주시 청암로17번길 21  월드타워5차 405호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동춘점","officialName":"동춘점와와학습코칭학원","regNo":"인천동부교육지원청 등록 제3723호","sido":"인천","sido_en":"incheon","district":"연수구","address":"인천 연수구 앵고개로264번길 40  남지빌딩 4층 와와학습코칭센터","directions":"","target_elem":"","target_mid":"","target_high":"대건고, 연수여고, 연수고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"후곡점(W+)","officialName":"후곡점더블유플러스학원","regNo":"경기도고양교육지원청 등록 제6354호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산서구 일산로 524  202호 더블유플러스학원","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"알파시티점","officialName":"알파시티점와와학습코칭학원","regNo":"대구광역시동부교육지원청 제6562호","sido":"대구","sido_en":"daegu","district":"수성구","address":"대구 수성구 알파시티2로 19  알파N시티 2층 201호 와와학습코칭학원","directions":"대구 수성구 알파시티2로19 와와학습코칭학원 201호","target_elem":"노변초, 고산초","target_mid":"노변중, 고산중","target_high":"시지고, 덕원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신월성점","officialName":"신월성와와학습코칭학원","regNo":"대구남부교육지원청 등록 제2017-120호","sido":"대구","sido_en":"daegu","district":"달서구","address":"대구 달서구 월성동  1848번지 그루타워 702호","directions":"","target_elem":"조암초, 신월초, 월암초, 월성초","target_mid":"조암중, 월암중, 월서중, 효성중, 영남중, 대건중, 학산중","target_high":"영남고, 상원고, 효성여고, 송현여고, 상인고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"대구역점","officialName":"대구역점와와학습코칭학원","regNo":"대구광역시동부교육지원청 제6571호","sido":"대구","sido_en":"daegu","district":"중구","address":"대구 중구 서성로 99  대구역센트럴자이 상가 302호 와와학습코칭학원","directions":"수창공원 맞은편\n1층 몬스터커피에서 왼쪽 건물 3층","target_elem":"수창초, 달성초, 종로초","target_mid":"계성중, 성명여중, 사대부중","target_high":"사대부고, 경북여고, 신명고, 대구고, 경북예고, 칠성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신방화점","officialName":"신방화점와와학습코칭학원","regNo":"강서양천교육지원청 등록 제 5879호","sido":"서울","sido_en":"seoul","district":"강서구","address":"서울 강서구 방화대로 294  마곡더블유타워 505","directions":"신방화역 6번출구에서 나와서 바로 왼쪽 마곡 더블유타워","target_elem":"송화초, 공항초","target_mid":"공항중, 송정중","target_high":"한서고, 공항고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"청라점","officialName":"와와학습코칭청라학원","regNo":"인천서부교육지원청 등록 서부 제1903호","sido":"인천","sido_en":"incheon","district":"서구","address":"인천 서구 중봉대로 588  청라센트럴프라자 609","directions":"","target_elem":"","target_mid":"청라중, 해원중","target_high":"청라고, 해원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"소하점","officialName":"소하점와와학습코칭학원","regNo":"광명교육지원청 등록 제1965호","sido":"경기","sido_en":"gyeonggi","district":"광명시","address":"경기 광명시 오리로 346  행운드림프라자 4층 405호","directions":"","target_elem":"충현초, 서면초","target_mid":"충현중, 빛가온중","target_high":"충현고, 광휘고, 소하고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"복산점","officialName":"복산점와와학습코칭학원","regNo":"울산강북교육지원청 등록 제5462호","sido":"울산","sido_en":"ulsan","district":"중구","address":"울산 중구 번영로 461  B2동 7","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동탄호수점","officialName":"동탄호수와와학습코칭학원","regNo":"화성오산교육지원청 등록 제3775호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 동탄순환대로 127-19  에스비타운 907호","directions":"우성 상가촌 동탄성모병원 건물 9층","target_elem":"방교초, 서연초","target_mid":"청림중, 서연중, 방교중","target_high":"정현고, 서연고, 창의고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동백점","officialName":"동백점와와학습코칭학원","regNo":"용인교육지원청 등록 제3918호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기도 용인시 기흥구 중동 동백3로11번길 3  2층 201호","directions":"경기도 용인시 기흥구 중동 851-4 동백역타워 2층 201호. 1층에 파찌내 만둣가게가 있는 건물 2층 입니다. 동백역2번 출구 50m 이내 입니다.","target_elem":"석성초, 초당초","target_mid":"초당중, 백현중, 동백중, 성지중, 어정중, 용인중","target_high":"초당고, 백현고, 동백고, 성지고, 용인고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"노형점","officialName":"와와학습코칭학원","regNo":"제주시교육지원청 등록 제2163호","sido":"제주","sido_en":"jeju","district":"제주시","address":"제주특별자치도 제주시 노형동 727-3 대안빌딩  3층","directions":"제주은행 연북로지점 주차장 뒷편 cu건물3층","target_elem":"노형초","target_mid":"서중, 중앙중","target_high":"지역내 모든 고등학교 가능","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"장기점","officialName":"와와학습코칭센터김포학원","regNo":"김포교육지원청 등록 제1237호","sido":"경기","sido_en":"gyeonggi","district":"김포시","address":"경기도 김포시 장기동 김포한강4로 162  한강메트로 503호, 504호","directions":"","target_elem":"푸른솔초, 운유초","target_mid":"장기중, 푸른솔중, 고창중","target_high":"솔터고, 제일고, 운양고, 통진고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"좌동점","officialName":"와와학습코칭센터학원","regNo":"해운대교육지원청 등록 제3142호","sido":"부산","sido_en":"busan","district":"해운대구","address":"부산광역시 해운대구 좌동 좌동로 88  울트라타워 5층 508호","directions":"부산 2호선 장산역 10번 출구 도보 10분 거리, 1층 장독대(반찬)/호두과자 가게 있습니다.","target_elem":"동백초, 부흥초, 신도초","target_mid":"신도중, 부흥중, 신곡중, 해운대중, 해강중","target_high":"신도고, 양운고, 부흥고, 해운대여고, 해강고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신방점","officialName":"와와학습코칭학원","regNo":"천안교육지원청 등록 제3413호","sido":"충남","sido_en":"chungnam","district":"천안시","address":"충청남도 천안시 동남구 신방동 886 학산프라자  A동 3층 304호,305호","directions":"세종약국(이석훈내과와 늘푸른이비인후과가 있는 건물) 3층입니다. 신방점 리처드헤어본점 맞은편 학산프라자 5층건물 3층에 있습니다.","target_elem":"신용초","target_mid":"용곡중, 신방중","target_high":"청수고, 쌍용고, 천안여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"쌍용점","officialName":"와와학습코칭쌍용점학원","regNo":"천안교육지원청 등록 제3502호","sido":"충남","sido_en":"chungnam","district":"천안시","address":"충청남도 천안시 서북구 쌍용동 불당대로 260  319호 318호(1/2)","directions":"고3  영어 수업은 어렵습니다","target_elem":"쌍용초","target_mid":"쌍용중","target_high":"쌍용고, 월봉고, 중앙고, 천안여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"병점점","officialName":"병점점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제4050호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 병점1로 221  화인메디컬프라자 2층 203호","directions":"병점 중심상가 사거리 롯데리아 건물 2층 (엘리베이터 내리면 바로 위치)  설빙과 같은 층입니다. \n와와 병점점 031) 297 - 7325","target_elem":"진안초, 안화초, 병점초, 송화초, 구봉초","target_mid":"진안중, 병점중, 안화중","target_high":"병점고, 안화고, 능동고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"불당점","officialName":"불당점와와학습코칭학원","regNo":"천안교육지원청 등록 제4191호","sido":"충남","sido_en":"chungnam","district":"천안시","address":"충남 천안시 서북구 불당33길 22  고은타워 805호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"웰카운티점","officialName":"웰카운티점와와학습코칭학원","regNo":"인천광역시동부교육지원청 등록 제3877호","sido":"인천","sido_en":"incheon","district":"연수구","address":"인천 연수구 인천타워대로54번길 15-5  북일프라자 2층 와와학습코칭학원","directions":"북일프라자 1차가 아닌 MUZE건물 2층 북일프라자 2층입니다 \n북일프라자 2층, 뮤즈카페 건물위 2층입니다","target_elem":"해송초등학교","target_mid":"해송중학교, 능허대중학교, 박문중학교","target_high":"해송고등학교, 연송고등학교, 대건고등학교","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"중산점","officialName":"중산점와와학습코칭학원","regNo":"경기도고양교육지원청 제 6727호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산동구 중산로 103  거풍프라자 202호","directions":"일산동구 중산로 103 거풍프라자 202호","target_elem":"모당초, 안곡초, 중산초","target_mid":"안곡중, 중산중, 일산중","target_high":"안곡고, 중산고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"가경점","officialName":"가경점와와학습코칭학원","regNo":"충청북도청주교육지원청 제 5888호","sido":"충북","sido_en":"chungbuk","district":"청주시","address":"충북 청주시 흥덕구 서현북로 18  2층 와와학습코칭학원","directions":"서현북로 대원칸타빌과 가경 e편한세상 사이 편의점 CU맞은편","target_elem":"서현초, 서경초","target_mid":"서현중, 경덕중, 서현중","target_high":"사대부고, 서원고, 청주외고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"탕정점(모두)","officialName":"탕정점모두오름학습코칭학원","regNo":"충청남도아산교육지원청 제 1560호","sido":"충남","sido_en":"chungnam","district":"아산시","address":"충남 아산시 탕정면 한들물빛5로 5  605호 모두오름학습코칭학원","directions":"한들물빛도시 지웰시티 센트럴 프루지오 206동 맞은편 젤존 메디컬시티 605호","target_elem":"한들물빛초","target_mid":"한들물빛중","target_high":"설화고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"이시아폴리스점","officialName":"이시아폴리스점\n와와학습코칭학원","regNo":"대구동부교육지원청 제 6935호","sido":"대구","sido_en":"daegu","district":"동구","address":"대구 동구 팔공로51길 33  A-503호 와와학습코칭학원","directions":"이시아폴리스 더샵3차아파트 맞은편 이스트 애플빌딩 5층","target_elem":"봉무초, 영신초","target_mid":"영신중, 팔공중, 복현중, 성광중, 성화중, 동촌중","target_high":"영신고, 경상고, 영진고, 성광고, 성화여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신봉점","officialName":"신봉점와와학습코칭학원","regNo":"경기도용인교육지원청 제 5625호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 수지구 신봉2로 60  웰스톤시티엔웰스톤에비뉴 1동 103호 와와학습코칭학원","directions":"신봉 LG자이2차 옆 웰스톤시티상가 1층, 농협복도 끝에 위치","target_elem":"신봉초, 신일초, 홍천초, 신리초, 성복초","target_mid":"신봉중, 성복중, 홍천중","target_high":"신봉고, 용인홍천고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"퇴계원점","officialName":"퇴계원점와와학습코칭학원","regNo":"경기도구리남양주교육지원청 제4787호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 퇴계원읍 퇴계원로 29  202호","directions":"경기도 남양주시 퇴계원로 29 송백타운 202호 와와학습코칭학원 퇴계원점\n 판다팜건물 2층 \n 퇴계원역 4거리에서 2분거리","target_elem":"퇴계원초, 도제원초, 태강삼육초","target_mid":"퇴계원중, 진건중","target_high":"퇴계원고, 진건고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"마포점","officialName":"마포점와와학습코칭학원","regNo":"서울서부교육지원청 등록 제02201800007호","sido":"서울","sido_en":"seoul","district":"마포구","address":"서울특별시 마포구 염리동 독막로42길 7  173-3 2층","directions":"지하철5호선 마포역, 6호선 공덕역 하차후 염리초등학교 방향으로 10분도보","target_elem":"염리초","target_mid":"서울여중, 동도중, 신수중, 숭문중","target_high":"서울여고, 숭문고, 광성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"용인백현점(모두)","officialName":"용인백현점\n모두오름학습코칭학원","regNo":"경기도용인교육지원청 제5632호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 기흥구 동백7로 83  백현마을중앙프라자 제 2층 제 208호","directions":"동백고등학교 건너편 상가 중에 중앙프라자 2층에 위치한 모두오름 학습코칭학원","target_elem":"동막초, 동백초, 용인백현초","target_mid":"동백중, 용인백현중","target_high":"동백고, 용인백현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"대구역점2호관","officialName":"대구역점2호관\n와와학습코칭학원","regNo":"대구동부교육지원청 제 6950 호","sido":"대구","sido_en":"daegu","district":"중구","address":"대구 중구 서성로 99  대구역센트럴자이 상가 203호 와와학습코칭학원","directions":"수창공원 맞은편 대구역센트릴자이아파트 상가 2층","target_elem":"수창초, 종로초","target_mid":"계성중, 성명여중, 대구제일중, 사대부중","target_high":"사대부고, 경북여고, 신명고, 칠성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"운정중앙점","officialName":"운정중앙점\n와와학습코칭학원","regNo":"파주교육지원청 제2139호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기도 파주시 양지로 131, 운정SB타워 509호,510호 (동패동)","directions":"초롱꽃마을 12단지(대림이편한세상아파트)와 13단지(디에트르아파트) 사이 상가건물들 중 버거킹건물 5층","target_elem":"초롱초","target_mid":"심학중","target_high":"심학고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"충주용산점","officialName":"충주용산점\n와와학습코칭학원","regNo":"충주교육지원청 제 1693호","sido":"충북","sido_en":"chungbuk","district":"충주시","address":"충북 충주시 형설로 54-10,2층 (용산동)","directions":"충주중학교 정문으로 오세요","target_elem":"남산초, 용산초","target_mid":"예성여중, 미덕중","target_high":"충주여고, 예성여고, 충주고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"진천점(모두)","officialName":"진천점 모두오름학습코칭학원","regNo":"대구남부교육지원청 제 2025-53호","sido":"대구","sido_en":"daegu","district":"달서구","address":"대구광역시 달서구 조암남로 158,301호(유천동)","directions":"AK그랑폴리스와 쌍용예가 사이에 있는 건물(그랑에비뉴) 3층 가장 왼쪽 학원","target_elem":"한솔초, 한샘초","target_mid":"월서중, 조암중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"별내중앙점(모두)","officialName":"별내중앙점 \n모두오름학습코칭학원","regNo":"경기도구리남양주교육지원청 제 5006 호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기도 남양주시 별내3로 66,401호","directions":"우체국과 홈플러스 사이건물 4층입니다!","target_elem":"한별초","target_mid":"화접중, 한별중","target_high":"별내고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"목동점","officialName":"와와학습코칭학원","regNo":"강서양천교육지원청 등록 제 5353호","sido":"서울","sido_en":"seoul","district":"양천구","address":"서울 양천구 목동동로8길 23  메리트윈 3층 305","directions":"","target_elem":"신목초, 서정초","target_mid":"목일중, 신목중, 양강중, 금옥중","target_high":"양천고, 신목고, 한광고, 서울영상고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신도림점","officialName":"와와학습코칭신도림학원","regNo":"서울남부교육지원청 등록 제 5525호","sido":"서울","sido_en":"seoul","district":"구로구","address":"서울특별시 구로구 신도림동 신도림로 20  397-2 해동빌딩 402호","directions":"구로구 신도림로 20 해동빌딩4층(신미림초등학교옆)","target_elem":"신미림초","target_mid":"신도림중","target_high":"신도림고, 구현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"제기점","officialName":"제기와와학습코칭학원","regNo":"서울동부교육지원청 등록 제 3066호","sido":"서울","sido_en":"seoul","district":"동대문구","address":"서울 동대문구 왕산로 61  302호 와와학습코칭학원","directions":"","target_elem":"용두초, 종암초, 기타사립초","target_mid":"대광중, 성일중","target_high":"대광고, 청량리고, 경희고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"종암점","officialName":"종암와와학습코칭학원","regNo":"성북강북교육지원청 등록 제2019-56호","sido":"서울","sido_en":"seoul","district":"성북구","address":"서울 성북구 종암로27길 13  도원프라자 501","directions":"종암로27길 13 도원프라자 5층 (메가커피 건물) 성북소방서와 GS 주유소 사이길로 들어오시면 소방서 바로 옆 건물입니다~","target_elem":"","target_mid":"종암중, 사대부중, 개운중","target_high":"사대부고, 용문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"명일점","officialName":"명일점와와학습코칭학원","regNo":"서울강동교육지원청 등록 제 7641호","sido":"서울","sido_en":"seoul","district":"강동구","address":"서울 강동구 양재대로 1606  3층","directions":"","target_elem":"","target_mid":"천호중, 배재중, 명일중","target_high":"명일여고, 강동고, 광문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"구산점","officialName":"구산점와와학습코칭학원","regNo":"서울서부교육지원청 등록 제02201700143호","sido":"서울","sido_en":"seoul","district":"은평구","address":"서울특별시 은평구 역촌동 연서로 130  4층","directions":"","target_elem":"","target_mid":"구산중, 은평중","target_high":"예일여중고, 선일여중고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"내발산점","officialName":"내발산점와와학습코칭학원","regNo":"강서양천교육지원청 등록 제 5444호","sido":"서울","sido_en":"seoul","district":"강서구","address":"서울 강서구 마곡중앙4로 74  이웰메디파크 제4층 401,402호","directions":"내발산역에서 우장산역 방향으로 걸어오시다보면 소방서 앞에 육교가 있는데 육교앞 건물입니다.\n1층에 커피숍과 딤채가 있습니다.","target_elem":"가곡초, 내발산초","target_mid":"등명중, 화곡중, 명덕중, 덕원중","target_high":"화곡고, 명덕고, 덕원여고, 마포고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"금천점","officialName":"금천점와와학습코칭학원","regNo":"서울남부교육지원청 등록 제 5726호","sido":"서울","sido_en":"seoul","district":"금천구","address":"서울 금천구 금하로 763  벽산아파트 제중심상가동 3층 306-2,307,308","directions":"금천구 시흥2동 주민센터 건너편 벽산중심상가 3층","target_elem":"탑동초","target_mid":"동일중, 세일중","target_high":"매그넷고, 동일여고, 금천고, 문일고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"위례점","officialName":"위례와와학습코칭학원","regNo":"성남교육지원청 등록 제6054호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기 성남시 수정구 위례광장로 320  315호","directions":"","target_elem":"고운초, 위례중앙초, 송례초","target_mid":"위례한빛중, 위례중앙중, 송례중","target_high":"위례한빛고, 복정고, 문현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"상현점","officialName":"상현점와와학습코칭학원","regNo":"용인교육지원청 등록 제4241-1호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기도 용인시 수지구 상현동 만현로 120  4층 410호 와와학습코칭학원","directions":"상현동 sr프라자 4층","target_elem":"솔개초, 상현초, 이현초","target_mid":"서원중, 소현중, 이현중, 성복중","target_high":"상현고, 서원고, 풍덕고, 이의고, 홍천고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"사우점","officialName":"사우점와와학습코칭학원","regNo":"김포교육지원청 등록 제1769호","sido":"경기","sido_en":"gyeonggi","district":"김포시","address":"경기 김포시 사우중로 77  삼정사이버프라자 304","directions":"","target_elem":"금파초, 향산초","target_mid":"금파중, 김포중","target_high":"사우고, 풍무고, 고촌고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수지점(W+)","officialName":"수지점더블유플러스학원","regNo":"용인교육지원청 등록 제5126호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 수지구 진산로 106  훼미리빌딩 512호,513호,514호","directions":"","target_elem":"","target_mid":"이현중, 수지중, 정평중","target_high":"성복고, 풍덕고, 수지고, 죽전고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"새롬점","officialName":"새롬와와학습코칭학원","regNo":"세종특별자치시교육청 등록 제1211호","sido":"세종","sido_en":"sejong","district":"","address":"세종특별자치시 새롬중앙로 62-15  해피라움W 305호","directions":"","target_elem":"새뜸초, 새롬초","target_mid":"새뜸중, 새롬중","target_high":"새롬고, 다정고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"삼산점","officialName":"삼산점와와학습코칭학원","regNo":"울산강남교육지원청 등록 제6001호","sido":"울산","sido_en":"ulsan","district":"남구","address":"울산광역시 남구 삼산동 돋질로 300  4층","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"상남점","officialName":"상남점와와학습코칭학원","regNo":"창원교육지원청 등록 제1020호","sido":"경남","sido_en":"gyeongnam","district":"창원시","address":"경남 창원시 성산구 마디미동로 25  비전빌딩 302호","directions":"상남동 한마음병원 횡단보도 맞은편 건물 3층에 위치","target_elem":"외동초","target_mid":"상남중, 토월중, 웅남중","target_high":"창원중앙여고, 남고, 신월고, 토월고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"향남점","officialName":"향남점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제3567호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 향남읍 발안로 103-6  J&H빌딩 402호","directions":"","target_elem":"한울초, 도이초","target_mid":"발안중, 향남중, 하길중, 화성중","target_high":"향남고, 향일고, 하길고, 발안바이오고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동래점","officialName":"동래점와와학습코칭학원","regNo":"동래교육지원청 등록 제4888호","sido":"부산","sido_en":"busan","district":"동래구","address":"부산광역시 동래구 온천동 충렬대로 129-1  한야빌딩 3","directions":"건강검진센터와 동래맥도널드 사이 / 횡단보도 근처 / 건겅검진센터에서 미남역으로 한 블럭","target_elem":"내산초","target_mid":"내성중,유락여중,동래중,동해중","target_high":"내성고,중앙여고,동래고,부산전자고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"장곡점","officialName":"와와학습코칭학원","regNo":"시흥교육지원청 등록 제 시871호","sido":"경기","sido_en":"gyeonggi","district":"시흥시","address":"경기 시흥시 진말로 7  중앙프라자 3층 305호, 306호","directions":"장곡동 에이스마트 맞은편 '미소신협'건물 3층 와와학습코칭학원","target_elem":"장곡초, 진말초","target_mid":"응곡중, 장곡중, 가온중","target_high":"장곡고, 능곡고, 시흥고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"갈산점","officialName":"와와학습코칭갈산학원","regNo":"이천교육지원청 등록 제1127호","sido":"경기","sido_en":"gyeonggi","district":"이천시","address":"경기도 이천시 갈산동 영창로 314  629-2외 2필지 주공프라자 504호","directions":"","target_elem":"안흥초, 설봉초","target_mid":"이천중, 설봉중, 증포중","target_high":"제일고, 이현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"금릉점","officialName":"와와학습코칭학원(금릉점)","regNo":"파주교육지원청 등록 제1594호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기 파주시 금빛로 24-27  제일메디컬 502","directions":"1층 용우동,복호두있는 건물 5층입니다. 눈높이 옆에있습니다.","target_elem":"금릉초, 금화초, 새금초, 금촌초","target_mid":"금릉중, 금촌중, 문산중","target_high":"금촌고, 문산제일고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"반달점","officialName":"반달점와와학습코칭보습학원","regNo":"부천교육지원청 등록 제6730호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 원미구 상일로 69  반달마을 제상가동 제 3층 제 304호 와와학습코칭학원","directions":"경기도 부천시 상일로 69 반달마을 상가동 304호\n (주차는 아파트 입구에서 상가 304호 방문이라고 하면 됩니다)","target_elem":"부인초, 상도초","target_mid":"부인중, 상동중","target_high":"상원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"관평점","officialName":"관평점와와학습코칭학원","regNo":"대전서부교육지원청 등록 제 서4761호","sido":"대전","sido_en":"daejeon","district":"유성구","address":"대전 유성구 관평2로 46  밸리타운 501","directions":"지도 사진과 함께 동화중학교 맞은편/ 주민센터 뒷 건물 로 설명 드립니다.","target_elem":"동화초, 관평초","target_mid":"동화중, 관평중","target_high":"중일고, 용산고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"개신점","officialName":"와와학습코칭센터학원","regNo":"청주교육지원청 등록 제4620호","sido":"충북","sido_en":"chungbuk","district":"청주시","address":"충청북도 청주시 서원구 개신동 경신로 31-1  402호","directions":"청주시 서원구 경신로 31-1 스타타워빌딩 4층\n(개신동 농협사거리, 1층에 롯데리아 개신점이 있는 건물의 4층입니다.)","target_elem":"개신초, 서경초, 가경초, 죽림초, 서원초","target_mid":"가경중, 서경중, 경덕중, 사대부중, 성화중, 서원중","target_high":"서원고, 사대부고, 청주고, 중앙여고, 운호고, 봉명고, 흥덕고, 세광고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"상동점","officialName":"와와학습코칭상동보습학원","regNo":"부천교육지원청 등록 제5950호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 원미구 송내대로265번길 67  월드컵타운 305호 와와학습코칭센터","directions":"진달래마을 정문 앞  청담 어학원 옆건물","target_elem":"석천초  상인초","target_mid":"석천중 상동중 상일중 부인중","target_high":"상동고 상일고 상원고 중흥고 중원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"논현점","officialName":"와와학습코칭인천논현학원","regNo":"인천동부교육지원청 등록 제3283호","sido":"인천","sido_en":"incheon","district":"남동구","address":"인천 남동구 청능대로 559  2","directions":"인천 논현역 3번 출구에서 직진 200M 논현 메디컬 센터 2층","target_elem":"동방초, 원동초","target_mid":"고잔중","target_high":"고잔고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"광명점","officialName":"광명점와와학습코칭학원","regNo":"광명교육지원청 등록 제1964호","sido":"경기","sido_en":"gyeonggi","district":"광명시","address":"경기 광명시 광명로 823  광명현대타운 7층 701호","directions":"","target_elem":"","target_mid":"광남중, 광문중","target_high":"광문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"정평점","officialName":"와와학습코칭학원","regNo":"경산교육지원청 등록 제941호","sido":"경북","sido_en":"gyeongbuk","district":"경산시","address":"경북 경산시 대학로 23  월드스퀘어 302","directions":"","target_elem":"사월초","target_mid":"경산중, 사동중, 경산여중","target_high":"경산고, 사동고, 경산여고, 문경고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"영천점","officialName":"영천점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제2851호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기 화성시 동탄순환대로 704  성산에이타워 제4층 제 403호 와와학습코칭학원","directions":"","target_elem":"한백초, 다원초","target_mid":"한백중, 다원중","target_high":"한백고, 이산고, 창의고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송도점","officialName":"WAWA와와학습코칭인천송도점학원","regNo":"인천동부교육지원청 등록 제3284호","sido":"인천","sido_en":"incheon","district":"연수구","address":"인천 연수구 해돋이로 165  차오름프라자 302","directions":"백제원 근처, 채드윅 근처, 1공구 학원가","target_elem":"신정초","target_mid":"신정중","target_high":"연송고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"둔산점","officialName":"와와학습코칭센터학원","regNo":"대전서부교육지원청 등록 제 서4002호","sido":"대전","sido_en":"daejeon","district":"서구","address":"대전광역시 서구 둔산동 둔산로 142  신화빌딩 401호","directions":"시청역 7번 출구쪽 스타벅스&올리브영 건물 4층.","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"관저점","officialName":"관저점와와학습코칭학원","regNo":"대전서부교육지원청 등록 제 서4277호","sido":"대전","sido_en":"daejeon","district":"서구","address":"대전 서구 구봉로 133  1542번지 205호","directions":"마치광장 신협건물 2층","target_elem":"","target_mid":"","target_high":"서일고, 서일여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"전주혁신점","officialName":"전주혁신점와와학습코칭학원","regNo":"완주교육지원청 제 454호","sido":"전북","sido_en":"jeonbuk","district":"완주군","address":"전북특별자치도 완주군 이서면 출판로 42  제 4층 제 402호 와와학습코칭학원","directions":"전주 혁신도시 호반 베르디움 1차 맞은편 상가 / 굽네치킨 건물 4층","target_elem":"","target_mid":"양현중, 삼우중, 만성중","target_high":"양현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"주엽점","officialName":"주엽점와와학습코칭학원","regNo":"고양교육지원청 등록 제5403호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기도 고양시 일산서구 주엽동 주화로 88  502호","directions":"","target_elem":"강선초","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"주엽2호점","officialName":"주엽2호와와학습코칭학원","regNo":"고양교육지원청 등록 제5826호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산서구 중앙로 1413  동영빌딩 10층 1003","directions":"","target_elem":"강선초","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"다산점","officialName":"다산점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제4125호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 다산중앙로146번길 12-14  다산메트로타워 604호","directions":"","target_elem":"다산초","target_mid":"다산중","target_high":"다산고, 도농고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"비산점","officialName":"와와학습코칭비산센터학원","regNo":"안양과천교육지원청 등록 제 2017-063호","sido":"경기","sido_en":"gyeonggi","district":"안양시","address":"경기 안양시 동안구 관악대로 91  대림타워 1102호 와와학습코칭학원","directions":"경기 안양시 동안구 관악대로 91 대림타워 1102호 와와학습코칭학원","target_elem":"중앙초","target_mid":"비산중, 부흥중, 부림중, 신성중","target_high":"양명여고, 양명고, 관양고, 성문고, 동안고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"두정점","officialName":"와와학습코칭두정점학원","regNo":"천안교육지원청 등록 제3444호","sido":"충남","sido_en":"chungnam","district":"천안시","address":"충청남도 천안시 서북구 두정동 봉정로 382  성광빌딩 3층","directions":"두정초 정문 앞, 8단지 맞은편 피자마루 건물 3층,","target_elem":"두정초, 신대초","target_mid":"두정중, 성성중, 성정중,","target_high":"오성고, 두정고, 신당고, 업성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"원주시청점","officialName":"와와학습코칭학원원주시청점","regNo":"원주교육지원청 등록 제2605호","sido":"강원","sido_en":"gangwon","district":"원주시","address":"강원특별자치도 원주시 시청로 22  2층 201","directions":"원주시청 등지고 오른쪽 첫번째 버스정류장 옆건물(1층에 피자알볼로)","target_elem":"만대초, 무실초","target_mid":"대성중, 평원중, 원주여중, 남원주중","target_high":"대성고, 육민관고, 북원여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"오산대역점","officialName":"오산대역점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제3851호","sido":"경기","sido_en":"gyeonggi","district":"오산시","address":"경기 오산시 내삼미로 85  우정프라자 2","directions":"","target_elem":"세미초, 화성초, 수청초","target_mid":"매홀중, 세마중, 문시중, 대호중","target_high":"매홀고, 세교고, 오산고, 운천고, 운암고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"신창점","officialName":"와와학습코칭신창학원","regNo":"광주서부교육지원청 등록 제6884호","sido":"광주","sido_en":"gwangju","district":"광산구","address":"광주 광산구 신창로 129  상민빌딩 302","directions":"신창동 파리바게트 1호점 3층입니다.","target_elem":"신창초, 수문초","target_mid":"진흥중, 신창중, 진흥중","target_high":"숭덕고, 성덕고, 운남고, 장덕고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"칠곡점","officialName":"칠곡점와와학습코칭학원","regNo":"대구서부교육지원청 등록 제2020-4298호","sido":"대구","sido_en":"daegu","district":"북구","address":"대구 북구 구암로 149  6층","directions":"","target_elem":"관음초","target_mid":"구암중, 관천중, 운암중","target_high":"구암고, 함지고, 영송여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"운정점","officialName":"운정점와와학습코칭학원","regNo":"파주교육지원청 등록 제1424호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기 파주시 동패동  1758-1 삼융프라자2 302호","directions":"","target_elem":"한가람초","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"다산지금점","officialName":"다산지금점와와학습코칭학원","regNo":"구리남양주교육지원청 등록 제4349-1호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 다산지금로 139  3층 308호, 309호","directions":"스타벅스 다산지금점 건물 3층(영신프라자)입니다.","target_elem":"다산한강초","target_mid":"다산한강중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"수성만촌점","officialName":"수성만촌점와와학습코칭학원","regNo":"대구동부교육지원청 등록 제6028호","sido":"대구","sido_en":"daegu","district":"수성구","address":"대구 수성구 화랑로8길 11-11  7층","directions":"","target_elem":"","target_mid":"동중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"천천점","officialName":"천천와와학습코칭학원","regNo":"수원교육지원청 등록 제6090-1호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기 수원시 장안구 덕영대로535번길 34  천천그린프라자 제5층 제 502호 와와학습코칭학원","directions":"롯데마트 천천점 옆건물(건강과 행복 약국& 봉구스밥버거 1층)그린프라자 5층","target_elem":"천천초 정천초","target_mid":"천천중 대평중","target_high":"천천고 영생고 대평고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"산남점","officialName":"산남점와와학습코칭학원","regNo":"청주교육지원청 등록 제4696호","sido":"충북","sido_en":"chungbuk","district":"청주시","address":"충청북도 청주시 서원구 산남동 산남로 18  이화빌딩 5층","directions":"하나로 마트 건물 옆 1층 조은약국 건물","target_elem":"샛별초","target_mid":"수곡중 산남중","target_high":"충북고 운호고 충북여고 산남고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"석사점","officialName":"석사2호점와와학습코칭학원","regNo":"춘천교육지원청 등록 제1593호","sido":"강원","sido_en":"gangwon","district":"춘천시","address":"강원특별자치도 춘천시 지석로 85  703호","directions":"지석로 85 강남프라자 7층 ( 투탑시티 카펠라 휘트니스 건너편 건물)","target_elem":"성림초, 성원초, 봄내초","target_mid":"대룡중, 우석중, 남춘천중, 남춘천여중, 춘천중, 강원중","target_high":"강원고, 사대부고, 춘고, 춘여고, 봉의고, 성수여고, 유봉여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"후평점","officialName":"후평점와와학습코칭학원","regNo":"춘천교육지원청 등록 제1741호","sido":"강원","sido_en":"gangwon","district":"춘천시","address":"강원특별자치도 춘천시 춘천로 316  춘천더샵아파트상가2동 304.305","directions":"후평사거리 포스코상가 3층 (정육점 건물 3층으로 말하시면 많이들 아십니다)","target_elem":"","target_mid":"후평중, 봉의중, 강원중","target_high":"강원고, 춘천여고, 봉의고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"옥계점","officialName":"옥계점와와학습코칭학원","regNo":"구미교육지원청 등록 제2536호","sido":"경북","sido_en":"gyeongbuk","district":"구미시","address":"경북 구미시 산호대로31길 16  2","directions":"구미시 산호대로 31길 16 2층","target_elem":"원당초, 옥계동부초, 해마루초","target_mid":"옥계동부중, 해마루중, 옥계중","target_high":"산동고, 오상고, 금오여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"당진중앙점","officialName":"당진중앙와와학습코칭학원","regNo":"당진교육지원청 등록 제617호","sido":"충남","sido_en":"chungnam","district":"당진시","address":"충남 당진시 당진중앙2로 211-5  효명프라자 404호","directions":"","target_elem":"탑동초","target_mid":"호서중, 당진중","target_high":"호서고, 당진고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"미사점","officialName":"미사점와와학습코칭학원","regNo":"광주하남교육지원청 등록 제1913호","sido":"경기","sido_en":"gyeonggi","district":"하남시","address":"경기 하남시 미사강변대로 212  미사센트럴프라자 309","directions":"https://naver.me/xhHGgP9o  학원 위치 안내드립니다^^~미사도서관이나 보건센터에서 도보로 2분 거리입니다.","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"영통점","officialName":"와와학습코칭학원","regNo":"수원교육지원청 등록 제6117호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기도 수원시 영통구 영통동 봉영로 1623  드림피아빌딩 301호, 302호 1/2","directions":"영통역과 청명역 중간에 버거킹 건물 3층입니다.","target_elem":"영덕초","target_mid":"흥덕중, 서천중","target_high":"영덕고, 청명고, 태장고, 흥덕고, 서천고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"망포점","officialName":"망포와와학습코칭학원","regNo":"수원교육지원청 등록 제6338호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기도 수원시 영통구 망포동 영통로 127  센터프라자 401호","directions":"","target_elem":"잠원초, 망포초, 대선초","target_mid":"영동중, 잠원중, 망포중, 동학중","target_high":"태장고, 망포고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"강릉교동점","officialName":"와와학습코칭학원","regNo":"강릉교육지원청 등록 제1386호","sido":"강원","sido_en":"gangwon","district":"강릉시","address":"강원특별자치도 강릉시 정원로 44  202호 와와학습코칭학원","directions":"","target_elem":"율곡초, 경포초","target_mid":"관동중, 율곡중, 해람중, 솔올중, 경포중","target_high":"강여고, 강일여고, 명륜고, 제일고, 강릉고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"서수원점","officialName":"서수원와와학습코칭학원","regNo":"수원교육지원청 등록 제6949호","sido":"경기","sido_en":"gyeonggi","district":"수원시","address":"경기 수원시 권선구 호매실로104번길 90  JD타워 205호","directions":"","target_elem":"능실초, 금호초","target_mid":"오현초호매실중, 능실중, 영신중, 고색중","target_high":"호매실고, 영신여고, 고색고, 율천고, 동우여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"원당점","officialName":"원당점와와학습코칭학원","regNo":"고양교육지원청 등록 제5951호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 고양대로1384번길 7-5  서강프라자 502호","directions":"","target_elem":"","target_mid":"성사중, 화수중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"송도점(W+)","officialName":"송도점더블유플러스학원","regNo":"인천동부교육지원청 등록 제3518호","sido":"인천","sido_en":"incheon","district":"연수구","address":"인천 연수구 해돋이로 160-6  꿈에계단 702호 일부(송도동)","directions":"백제원 근처, 백제원 앞 랜드로버 방향 옆건물, 1층에 명월카츠","target_elem":"신정초","target_mid":"신정중","target_high":"연송고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"운양점","officialName":"운양점와와학습코칭학원","regNo":"김포교육지원청 등록 제1913호","sido":"경기","sido_en":"gyeonggi","district":"김포시","address":"경기 김포시 김포한강11로 288-37  헤리움리버테라스 205호","directions":"경기 김포시 운양동 1296-7 헤리움'리버테라스' 205호입니다 엘레베이터 열리고 바로 왼쪽으로 오시면 됩니다~","target_elem":"하늘빛초, 청수초","target_mid":"하늘빛중, 운양중, 푸른솔중","target_high":"제일고, 운양고, 운유고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"도안점","officialName":"도안점와와학습코칭학원","regNo":"대전서부교육지원청 등록 제 서4790호","sido":"대전","sido_en":"daejeon","district":"서구","address":"대전 서구 동서대로 692  에프엠프라임 1차 501","directions":"","target_elem":"흥도초","target_mid":"유성중, 봉명중, 도안중","target_high":"유성고, 도안고, 서대전여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"시흥대야점","officialName":"시흥대야점와와학습코칭학원","regNo":"시흥교육지원청 등록 제 시1277호","sido":"경기","sido_en":"gyeonggi","district":"시흥시","address":"경기 시흥시 은행로167번길 7  크리스탈 빌딩 503호,504호","directions":"","target_elem":"은계초, 은행초","target_mid":"은행중, 은계중","target_high":"은행고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"둔산점(W+)","officialName":"둔산점더블유플러스학원","regNo":"대전서부교육지원청 등록 제 서4833호","sido":"대전","sido_en":"daejeon","district":"서구","address":"대전 서구 둔산로 130  803호","directions":"시청역 7번 출구쪽 30m","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"반여점","officialName":"반여점와와학습코칭학원","regNo":"해운대교육지원청 등록 제3955호","sido":"부산","sido_en":"busan","district":"해운대구","address":"부산 해운대구 반여로 102  경성빌딩 501호","directions":"아시아선수촌 정문 건너편 깨비블럭있는 건물 5층","target_elem":"인지초, 장산초, 무정초","target_mid":"장산중, 인지중","target_high":"반여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"화명점","officialName":"화명점와와학습코칭학원","regNo":"부산북부교육지원청 등록 제2830호","sido":"부산","sido_en":"busan","district":"북구","address":"부산 북구 금곡대로285번길 19  리버사이드빌딩 504","directions":"일방통행길 빽다방 건물 5층, 또는 코오롱하늘채 2차 정문 앞 상가","target_elem":"와석초","target_mid":"명진중, 화명중","target_high":"화명고,  성도고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"보라점","officialName":"보라점와와학습코칭학원","regNo":"용인교육지원청 등록 제4991호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 기흥구 사은로126번길 6  신원프라자 303호","directions":"쌍용아파트 입구 줄넘기 학원 건물 3층","target_elem":"나곡초","target_mid":"나곡중/보라중/상갈중","target_high":"보라고/신갈고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"대구장기점","officialName":"대구장기점와와학습코칭학원","regNo":"대구남부교육지원청 등록 제2020-80호","sido":"대구","sido_en":"daegu","district":"달서구","address":"대구 달서구 장기로 252  장기협성휴포레 2층 209,210","directions":"버스정류장(장동초등학교앞) 바로 앞 대로변에 있습니다.\n 장기협성휴포레 상가 2층 (1층에 한솥 도시락이 있습니다)","target_elem":"장동초, 장기초, 성당초","target_mid":"원화중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"범박점","officialName":"범박점와와학습코칭보습학원","regNo":"부천교육지원청 등록 제6495호","sido":"경기","sido_en":"gyeonggi","district":"부천시","address":"경기 부천시 소사구 은성로 132  5층","directions":"부천 은성로132 제일프라자 501호 (세븐일레븐건물 5층)","target_elem":"창영초, 소안초, 소사초, 복사초","target_mid":"일신중, 소사중, 부일중","target_high":"시온고, 소사고, 범박고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"위례창곡점","officialName":"위례창곡점와와학습코칭학원","regNo":"성남교육지원청 등록 제6458호","sido":"경기","sido_en":"gyeonggi","district":"성남시","address":"경기 성남시 수정구 위례동로 141  우성메디피아 401호","directions":"경기도 성남시 수정구 위례동로 141 우성메디피아 401호  1층컴포즈커피","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"혁신점","officialName":"혁신점와와학습코칭학원","regNo":"원주교육지원청 등록 제2762호","sido":"강원","sido_en":"gangwon","district":"원주시","address":"강원특별자치도 원주시 입춘로 110  파라다이스프라자 305호","directions":"","target_elem":"버들초, 반고초","target_mid":"버들중, 반곡중","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"원흥점","officialName":"원흥점와와학습코칭학원","regNo":"고양교육지원청 등록 제6096호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 권율대로 672  원흥역봄오피스텔 217호","directions":"원흥역 1번 출구 앞 1층 베스킨 라빈스 있는 건물 2층 217호","target_elem":"원흥초, 삼송초","target_mid":"원흥중, 고양중","target_high":"신원고, 서정고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"거제수월점","officialName":"거제수월점와와학습코칭학원","regNo":"거제교육지원청 등록 제1558호","sido":"경남","sido_en":"gyeongnam","district":"거제시","address":"경남 거제시 수양로 462  3층","directions":"수월사거리 파리바게트 맞은편 skT월드 건물 3층","target_elem":"수월초, 제산초","target_mid":"수월중, 거제중앙중","target_high":"거제중앙고, 연초고, 상문고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"덕이점","officialName":"덕이점와와학습코칭학원","regNo":"고양교육지원청 등록 제6169호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 일산서구 하이파크2로 40  금문프라자 804호","directions":"금문프라자(농협 옆건물, 1층에 컴포즈 카페있는 건물, 7층 헬스장 바로 위 8층입니다)","target_elem":"한산초, 덕이초, 백송초","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"삼송점","officialName":"삼송점와와학습코칭학원","regNo":"고양교육지원청 등록 제6173호","sido":"경기","sido_en":"gyeonggi","district":"고양시","address":"경기 고양시 덕양구 신원로 36  명승세도나3 701호","directions":"신원마을6단지 맞은편 상가-명승세도나3차 맘스터치있는 건물 7층","target_elem":"신원초","target_mid":"신원중","target_high":"신원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"진월점","officialName":"진월점와와학습코칭센터학원","regNo":"광주서부교육지원청 등록 제7193호","sido":"광주","sido_en":"gwangju","district":"남구","address":"광주 남구 광복마을길 47  4층","directions":"광주광역시 남구 광복마을길 47 4층","target_elem":"진월초, 주월초","target_mid":"동성여중, 주월중","target_high":"대광여고, 동성고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"이충점","officialName":"이충점와와학습코칭학원","regNo":"평택교육지원청 등록 제 2599호","sido":"경기","sido_en":"gyeonggi","district":"평택시","address":"경기 평택시 이충로 49-31  삼원프라자 201호","directions":"이충상가 농협 옆건물 삼원프라자 2층, 1층 정관장 건물","target_elem":"","target_mid":"효명중, 이충중, 은혜중","target_high":"이충고, 은혜고, 효명고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"루원시티점","officialName":"루원시티점와와학습코칭학원","regNo":"인천서부교육지원청 등록 서부 제2212호","sido":"인천","sido_en":"incheon","district":"서구","address":"인천 서구 새오개로111번안길 23  대릉빌딩 302호","directions":"","target_elem":"가현초","target_mid":"신형중, 신현여중, 가현중","target_high":"신현고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"복현점","officialName":"복현점와와학습코칭학원","regNo":"대구광역시서부교육지원청 제2024-4559호","sido":"대구","sido_en":"daegu","district":"북구","address":"대구 북구 동북로 247  이편한세상복현 상가동 305호 와와학습코칭학원","directions":"대구 북구 복현동 713 e편한세상복현 상가동 305호","target_elem":"복현초","target_mid":"북중, 성광중, 산격중","target_high":"경상고, 성광고, 영진고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"진접점","officialName":"진접점와와학습코칭학원","regNo":"경기도구리남양주교육지원청등록 제4552호","sido":"경기","sido_en":"gyeonggi","district":"남양주시","address":"경기 남양주시 진접읍 해밀예당1로 171  제일프라자 203호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"사직점","officialName":"사직점와와학습코칭학원","regNo":"동래교육지원청 등록 제5468호","sido":"부산","sido_en":"busan","district":"동래구","address":"부산 동래구 사직로 80  222동 311호 (사직쌍용예가아파트 상가)","directions":"부산시 동래구 사직로 80 쌍용예가상가 222동 311호 (상가 두개 중 맑은샘사우나가 있는 상가 3에 위치)","target_elem":"예원초, 사직초","target_mid":"사직중, 사직여중","target_high":"사직고, 사직여고, 동인고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"운정호수점","officialName":"운정호수점와와학습코칭센터학원","regNo":"경기도파주교육지원청 등록 제1878호","sido":"경기","sido_en":"gyeonggi","district":"파주시","address":"경기 파주시 경의로1240번길 37-1  명품프라자3차 605호","directions":"운정역1번출구에서 걸어서 7분, 가람도서관 건너편, 할리스건물","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"탄벌점","officialName":"탄벌점와와학습코칭학원","regNo":"광주하남교육지원청 등록 제2007호","sido":"경기","sido_en":"gyeonggi","district":"광주시","address":"경기 광주시 벌원길 61  2층","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"남외점","officialName":"남외점와와학습코칭학원","regNo":"울산강북교육지원청 등록 제5626호","sido":"울산","sido_en":"ulsan","district":"중구","address":"울산 중구 남외3길 15  남외프라자 401호","directions":"남외초앞 파리바게트 사거리 마트위 4층","target_elem":"남외초","target_mid":"남외중,울산중","target_high":"울산고,가온고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"흥덕점","officialName":"흥덕점와와학습코칭학원","regNo":"용인교육지원청 등록 제4989호","sido":"경기","sido_en":"gyeonggi","district":"용인시","address":"경기 용인시 기흥구 흥덕2로 85  우연프라자 201호","directions":"용인 흥덕 이마트 뒷편 세차장 옆건물 2층입니다.(경기도 용인시 흥덕2로 85 우연프라자 201호)","target_elem":"샘말초, 석현초, 흥덕초, 매원초","target_mid":"흥덕중, 다산중, 광교호수중, 상현중","target_high":"흥덕고, 기흥고, 신갈고, 상현고, 매원고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"반송점","officialName":"반송점와와학습코칭학원","regNo":"화성오산교육지원청 등록 제3130호","sido":"경기","sido_en":"gyeonggi","district":"화성시","address":"경기도 화성시 반송동 동탄원천로 163  503호","directions":"","target_elem":"","target_mid":"","target_high":"","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"돈암점","officialName":"돈암점와와학습코칭학원","regNo":"성북강북교육지원청 등록 제2017-43호","sido":"서울","sido_en":"seoul","district":"성북구","address":"서울특별시 성북구 돈암동 동소문로 190  중앙빌딩 201호","directions":"성신여대역 1번출구, 직진 버스 1정거장  기아자동차 건물 2층","target_elem":"개운초","target_mid":"개운중, 성신여중, 고명중","target_high":"용문고, 사대부고, 성신여고, 고대부고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"동소문점","officialName":"동소문점와와학습코칭학원","regNo":"성북강북교육지원청 등록 제2017-39호","sido":"서울","sido_en":"seoul","district":"성북구","address":"서울 성북구 아리랑로7길 5  4층 와와학습코칭학원","directions":"할머니문방구 사거리 건물 4층","target_elem":"정덕초, 우촌초, 정수초","target_mid":"성신여중, 동구여중, 삼선중, 고명중","target_high":"성신여고, 홍대부고, 고대부고, 한성여고","strength":"","price_elem":0,"price_mid":0,"price_high":0},{"name":"상암점","officialName":"와와학습코칭센터학원","regNo":"서울서부교육지원청 등록 제022015001127호","sido":"서울","sido_en":"seoul","district":"마포구","address":"서울특별시 마포구 상암동 상암산로1길 73  202호","directions":"","target_elem":"중동초, 상지초, 상암초","target_mid":"상암중, 중암중, 성산중, 성사중, 덕은한강중","target_high":"상암고, 예일여고, 대성고, 숭실고, 가재울고","strength":"","price_elem":0,"price_mid":0,"price_high":0}];

const DONG_IMAGES = {
  '개포동': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&q=80',
  '논현동': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&q=80',
  '대치동': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=900&q=80',
  '도곡동': 'https://images.unsplash.com/photo-1532153955177-f59af40d6472?w=900&q=80',
  '삼성동': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&q=80',
  '세곡동': 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=900&q=80',
  '수서동': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=900&q=80',
  '신사동': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
  '압구정동': 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=80',
  '역삼동': 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=900&q=80',
  '일원동': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=900&q=80',
  '자곡동': 'https://images.unsplash.com/photo-1598620617148-c9e8ddee4b27?w=900&q=80',
  '청담동': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&q=80',
  '율현동': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&q=80',
};

const GANGNAM_DONG_INFO = {
  '대치동': '대치동은 전국 최고의 교육특구로, 수백 개의 학원이 밀집한 대치동 학원가를 중심으로 치열한 학업 경쟁이 펼쳐집니다. 대명중, 은광중, 휘문고, 단대부고 등 명문 학교들이 포진해 있으며, 내신 시험 난이도가 전국 최상위권입니다.',
  '압구정동': '압구정동은 현대아파트와 갤러리아 백화점 인근의 고급 주거지역으로, 압구정중, 신사중 학군이 형성되어 있습니다. 학부모들의 교육열이 매우 높으며 외국어·예술 계열 과외 수요도 풍부합니다.',
  '청담동': '청담동은 청담중 학군을 중심으로 고급 주거지와 교육이 공존하는 지역입니다. 외국계 기업 임원 가정이 많아 영어 원어민 수업 수요가 높고, 예술·문화 계열 과외도 활발합니다.',
  '역삼동': '역삼동은 강남 IT 업무지구와 주거지역이 공존하는 곳입니다. 언주중, 역삼중 학군이 있으며 테헤란로 인근 직장인 자녀들의 교육 수요가 꾸준합니다.',
  '개포동': '개포동은 재건축 이후 신축 아파트 단지가 들어서며 젊은 학부모층이 대거 유입된 지역입니다. 개포중, 개포고 학군을 중심으로 내신 관리 수요가 빠르게 증가하고 있습니다.',
  '도곡동': '도곡동은 타워팰리스를 비롯한 고급 아파트 밀집 지역으로, 도곡중, 숙명여고 학군이 형성되어 있습니다. 학업 수준이 높고 1:1 심화 과외 수요가 많습니다.',
  '삼성동': '삼성동은 코엑스 인근 업무·주거 복합지역으로, 영동중, 삼성고 학군이 있습니다. 외국계 기업 밀집으로 영어 조기교육 수요가 높습니다.',
  '논현동': '논현동은 강남 중심부의 주거·상업 복합지역으로 논현중 학군이 형성되어 있습니다. 다양한 계층이 거주하며 실속형 내신 관리 과외 수요가 꾸준합니다.',
  '신사동': '신사동은 가로수길 인근의 감각적인 주거지역으로, 신사중 학군이 있습니다. 패션·디자인 업계 종사자 가정이 많아 예체능·어학 과외 수요가 높습니다.',
  '일원동': '일원동은 삼성서울병원 인근 의료·주거 복합지역으로, 일원중, 중동고 학군이 형성되어 있습니다. 의대 준비 학생들의 과학·수학 심화 과외 수요가 높습니다.',
  '수서동': '수서동은 강남 동부의 주거지역으로 수서중 학군이 있습니다. 재건축·재개발로 교육 환경이 개선되고 있으며 초등 조기교육 수요가 증가하고 있습니다.',
  '세곡동': '세곡동은 강남구 남단의 신흥 주거지역으로, 신규 아파트 단지 입주로 젊은 가족층이 늘고 있습니다. 초등학생 대상 수학·영어 기초 과외 수요가 빠르게 성장 중입니다.',
  '자곡동': '자곡동은 강남구 남부의 주택가로 조용한 교육 환경을 갖추고 있습니다. 경쟁이 치열한 도심과 달리 여유 있는 분위기에서 집중적인 1:1 과외가 이루어집니다.',
  '율현동': '율현동은 강남구의 주거 지역으로 초등·중등 학생들의 기초 학력 강화 수요가 높습니다. 소규모 주거 환경 덕분에 선생님과 학생 간 밀착 관리가 잘 이루어집니다.',
};

const SUBJECT_INFO = {
  '수학': {
    emoji: '📐',
    intro: '수학은 모든 이공계 진학의 핵심 과목으로, 강남구 학교들의 수학 내신 시험은 경시대회 수준의 문제가 출제됩니다.',
    고등: '고등학교 수학은 수학Ⅰ, 수학Ⅱ, 확률과 통계, 미적분, 기하 등 다양한 과목으로 나뉩니다. 내신과 수능을 동시에 대비해야 하므로 체계적인 학습 전략이 필수입니다.',
    중등: '중학교 수학은 고등학교 수학의 기초를 다지는 시기입니다. 개념을 확실히 이해하고 응용력을 키우는 것이 중요합니다.',
    초등: '초등학교 수학은 수의 개념, 연산, 도형, 측정 등 기초 수학 능력을 형성하는 시기입니다. 올바른 수학적 사고 습관을 만드는 것이 핵심입니다.',
  },
  '영어': {
    emoji: '📖',
    intro: '영어는 대입과 취업 모두에서 필수 역량입니다. 강남구 영어 과외는 내신·수능·회화를 체계적으로 다루며 실질적인 영어 실력을 높여드립니다.',
    고등: '고등학교 영어 내신은 지문 분석과 변형 문제 대비가 핵심입니다. 수능 영어 1등급을 목표로 독해력과 듣기 능력을 집중 훈련합니다.',
    중등: '중학교 영어는 문법 기초와 독해력을 동시에 키우는 시기입니다. 내신 시험 대비와 함께 영어에 대한 흥미를 유지하는 것이 중요합니다.',
    초등: '초등학교 영어는 알파벳부터 기초 회화까지 영어에 대한 흥미를 높이는 것이 목표입니다. 자연스러운 영어 환경 속에서 실력을 키워드립니다.',
  },
  '국어': {
    emoji: '✍️',
    intro: '국어는 수능에서 변별력이 가장 높은 과목 중 하나입니다. 문학, 비문학 독해력과 화법·작문 능력을 종합적으로 키워드립니다.',
    고등: '고등 국어는 문학 작품 분석, 비문학 독해, 화법·작문·언어 영역을 모두 다룹니다. 수능 국어 1등급을 위한 독해 속도와 정확성을 집중 훈련합니다.',
    중등: '중학교 국어는 독서 습관 형성과 글쓰기 능력 개발이 핵심입니다. 교과서 문학 작품 분석과 서술형·논술형 대비를 병행합니다.',
    초등: '초등학교 국어는 올바른 읽기·쓰기 습관을 형성하는 시기입니다. 독서 능력과 어휘력을 키우고 창의적 글쓰기 능력을 개발합니다.',
  },
  '과학': {
    emoji: '🔬',
    intro: '과학은 이공계 진학의 필수 과목입니다. 물리, 화학, 생명과학, 지구과학을 과목별로 전문적으로 지도하여 개념 이해와 문제 풀이 능력을 키워드립니다.',
    고등: '고등 과학은 물리학Ⅰ·Ⅱ, 화학Ⅰ·Ⅱ, 생명과학Ⅰ·Ⅱ, 지구과학Ⅰ·Ⅱ 등 선택과목이 다양합니다. 개념 이해와 수능 문제 풀이 전략을 동시에 훈련합니다.',
    중등: '중학교 과학은 물질, 에너지, 생명, 지구 4개 영역을 통합적으로 배웁니다. 암기보다 원리 이해 중심으로 학습하면 고등 과학의 기초가 탄탄해집니다.',
    초등: '초등학교 과학은 자연 현상에 대한 관찰과 탐구 능력을 키우는 시기입니다. 실험과 관찰 활동을 통해 과학적 사고 능력을 자연스럽게 개발합니다.',
  },
  '사회': {
    emoji: '🌏',
    intro: '사회 과목은 한국사부터 지리, 경제, 정치까지 폭넓은 내용을 다룹니다. 체계적인 개념 정리와 암기 전략으로 내신과 수능을 동시에 준비합니다.',
    고등: '고등 사회 계열은 한국사, 통합사회, 한국지리, 세계지리, 경제, 정치와법 등 다양합니다. 수능 선택과목에 따라 맞춤 전략을 수립합니다.',
    중등: '중학교 사회는 역사, 지리, 일반사회를 통합적으로 학습합니다. 개념 정리와 함께 시사 연계 학습으로 흥미를 높입니다.',
    초등: '초등학교 사회는 우리 지역, 우리나라, 세계 이해를 단계적으로 배웁니다. 지도 읽기, 역사 이야기 등 다양한 방법으로 쉽고 재미있게 지도합니다.',
  },
  '코딩': {
    emoji: '💻',
    intro: '코딩 교육은 미래 사회의 핵심 역량입니다. 스크래치 기초부터 파이썬 심화, 알고리즘 대회 준비까지 수준별 맞춤 지도를 제공합니다.',
    고등: '고등학교 코딩은 정보 교과 내신과 대입 소프트웨어 특기자 전형을 동시에 준비합니다. 파이썬, 알고리즘, 자료구조 등을 체계적으로 지도합니다.',
    중등: '중학교 코딩은 스크래치와 파이썬 기초를 익히며 논리적 사고력을 키우는 시기입니다. 정보 교과 내신 대비와 코딩 대회 준비를 병행합니다.',
    초등: '초등학교 코딩은 스크래치, 엔트리 등 블록 코딩으로 컴퓨팅 사고력을 키웁니다. 게임처럼 재미있는 프로젝트를 통해 코딩의 기초를 닦습니다.',
  },
  '논술': {
    emoji: '📝',
    intro: '논술은 주요 대학 수시 전형의 핵심 평가 요소입니다. 논리적 사고와 글쓰기 능력을 종합적으로 키워 대입 논술 전형 합격을 도와드립니다.',
    고등: '고등 논술은 인문 논술, 자연 논술로 나뉩니다. 지원 대학의 기출 문제 분석과 함께 논리적 글쓰기 능력을 집중 훈련합니다.',
    중등: '중학교 논술은 대입 준비의 기초를 다지는 시기입니다. 독서와 글쓰기를 연계하여 논리적 사고와 표현력을 키웁니다.',
    초등: '초등 논술은 창의적 글쓰기와 독서 능력을 기르는 시기입니다. 다양한 주제로 생각을 정리하고 표현하는 능력을 자연스럽게 개발합니다.',
  },
};

const REGIONS = {
  '서울': {
    label: '서울특별시', emoji: '🏙',
    areas: {
      '강남구': {
        dongs: GANGNAM_DONGS,
        feature: '대한민국 최고의 교육 특구입니다. 대치동 학원가를 중심으로 전국 최고 수준의 교육 인프라가 갖춰져 있으며, 학교 내신 난이도도 전국 최상위권입니다.',
        schools: '휘문고, 단대부고, 중동고, 숙명여고, 경기고, 개포고'
      },
      '서초구': { dongs:['방배동','반포동','잠원동','서초동','양재동','우면동','내곡동'], feature:'강남구와 함께 서울 최고의 교육 지역. 반포, 방배, 잠원 지역 우수 학교 밀집.', schools:'세화고, 반포고, 상문고' },
      '송파구': { dongs:['잠실동','문정동','가락동','방이동','오금동','거여동','마천동'], feature:'잠실을 중심으로 교육 수요가 높은 지역.', schools:'잠실고, 방산고, 송파고' },
      '강동구': { dongs:['천호동','암사동','명일동','고덕동','강일동','둔촌동'], feature:'강남권 인접 신흥 교육 지역.', schools:'한영고, 강동고' },
      '마포구': { dongs:['합정동','홍대앞','상수동','망원동','연남동'], feature:'홍대·합정 문화지구와 교육이 공존하는 지역.', schools:'마포고, 서강고' },
      '양천구': { dongs:['목동','신정동','신월동'], feature:'목동 학원가로 유명한 서울 서부 최대 교육 특구.', schools:'양천고, 목동고, 신목고' },
      '노원구': { dongs:['상계동','중계동','하계동','공릉동','월계동'], feature:'중계동 학원가로 유명한 강북 최대 교육 특구.', schools:'상계고, 불암고, 노원고' },
      '강서구': { dongs:['화곡동','방화동','마곡동','발산동','등촌동'], feature:'마곡 산업단지 성장으로 교육 수요 급증.', schools:'강서고, 공항고' },
      '동작구': { dongs:['사당동','상도동','노량진동','대방동','흑석동'], feature:'노량진 고시촌으로 유명. 수험 교육 집중 지역.', schools:'동작고, 중앙대부고' },
      '관악구': { dongs:['신림동','봉천동','낙성대동'], feature:'서울대 인근 교육 밀집 지역.', schools:'관악고, 인헌고' },
      '성북구': { dongs:['돈암동','길음동','정릉동','석관동'], feature:'고려대·성신여대 인근 교육 특화 지역.', schools:'성북고, 고려고' },
      '용산구': { dongs:['이태원동','한남동','서빙고동','이촌동'], feature:'한남·이촌 고급 주거지. 외국어 교육 수요 높음.', schools:'용산고, 용문고' },
      '중구': { dongs:['명동','충무로','신당동','황학동','을지로'], feature:'서울 도심 중심부. 역사·문화·상업이 공존하는 교육 지역.', schools:'중구고, 이화여고' },
      '종로구': { dongs:['혜화동','명륜동','창신동','부암동'], feature:'서울 대학로 인근. 예술·인문 특화 교육 수요 높음.', schools:'경복고, 종로고' },
      '중랑구': { dongs:['면목동','신내동','묵동','망우동'], feature:'동북권 주거 밀집 지역. 실용적 교육 수요 높음.', schools:'중랑고, 면목고' },
      '광진구': { dongs:['화양동','군자동','구의동','자양동'], feature:'건국대·세종대 인근. 대학가 주변 교육 인프라 발달.', schools:'광진고, 건대부고' },
      '동대문구': { dongs:['회기동','전농동','답십리동','장안동'], feature:'경희대·한국외대 인근. 어학·인문계 과외 수요 높음.', schools:'동대문고, 장안고' },
      '성동구': { dongs:['왕십리동','행당동','금호동','옥수동'], feature:'한양대 인근 교육 특화 지역. 성수동 성장으로 젊은층 유입 증가.', schools:'성동고, 한대부고' },
      '은평구': { dongs:['응암동','녹번동','불광동','수색동'], feature:'서북권 주거 밀집 지역. 실속형 1:1 과외 수요 꾸준.', schools:'은평고, 대진고' },
      '서대문구': { dongs:['신촌동','홍제동','북가좌동','남가좌동'], feature:'연세대·이화여대·서강대 인근. 어학·이공계 과외 수요 높음.', schools:'서대문고, 연희고' },
      '도봉구': { dongs:['쌍문동','방학동','창동','도봉동'], feature:'강북 주거 밀집 지역. 내신 관리 중심 과외 수요 꾸준.', schools:'도봉고, 창동고' },
      '강북구': { dongs:['미아동','수유동','번동','우이동'], feature:'북부 주거 지역. 학원 접근성 낮아 1:1 방문 과외 선호도 높음.', schools:'강북고, 미양고' },
      '금천구': { dongs:['가산동','독산동','시흥동'], feature:'G밸리 인근 산업지역. IT 코딩 과외 수요 빠르게 성장.', schools:'금천고, 시흥고' },
      '구로구': { dongs:['구로동','신도림동','개봉동','오류동'], feature:'디지털단지 인접. 다양한 교육 수요가 공존하는 지역.', schools:'구로고, 개봉고' },
    }
  },
  '경기': {
    label: '경기도', emoji: '🌿',
    areas: {
      '수원시': { dongs:['팔달구','영통구','권선구','장안구'], feature:'경기도청 소재지. 이공계 특화 교육 수요 높음.', schools:'수원고, 수원외고' },
      '성남시': { dongs:['분당구','수정구','중원구'], feature:'분당 신도시 중심 경기 최대 교육 특구.', schools:'분당고, 낙생고' },
      '용인시': { dongs:['수지구','기흥구','처인구'], feature:'수지·기흥 신도시 중심 급성장 교육 지역.', schools:'용인고, 흥덕고' },
      '고양시': { dongs:['일산동구','일산서구','덕양구'], feature:'일산 신도시 중심. 문화·교육 인프라 우수.', schools:'고양고, 일산동고' },
      '부천시': { dongs:['소사구','오정구','원미구'], feature:'서울 근접 교육 수요 높은 지역.', schools:'부천고, 부천북고' },
      '안양시': { dongs:['만안구','동안구'], feature:'평촌 신도시 중심 교육 밀집 지역.', schools:'안양고, 평촌고' },
      '화성시': { dongs:['동탄1신도시','동탄2신도시','봉담읍'], feature:'동탄 신도시 대규모 개발. 신규 교육 수요 폭증.', schools:'동탄고, 능동고' },
      '남양주시': { dongs:['화도읍','다산동','별내동','오남읍'], feature:'다산 신도시 성장으로 교육 수요 급증.', schools:'남양주고, 별내고' },
    }
  },
  '인천': {
    label: '인천광역시', emoji: '✈️',
    areas: {
      '연수구': { dongs:['송도동','연수동','청학동','옥련동'], feature:'송도 국제도시 중심. 글로벌 교육 환경 우수.', schools:'연수고, 인천외고' },
      '남동구': { dongs:['구월동','만수동','논현동','간석동'], feature:'인천 최대 주거지역. 교육 수요 높음.', schools:'남동고, 인명여고' },
      '부평구': { dongs:['부평동','삼산동','갈산동','산곡동'], feature:'부평 상권 중심. 교육 인프라 발달.', schools:'부평고, 인천고' },
    }
  },
  '부산': {
    label: '부산광역시', emoji: '🌊',
    areas: {
      '해운대구': { dongs:['해운대동','우동','좌동','재송동'], feature:'부산 최고 교육 특구. 해운대·좌동 학원가 밀집.', schools:'해운대고, 센텀고' },
      '수영구': { dongs:['광안동','민락동','수영동','남천동'], feature:'광안리 인근 교육 지역.', schools:'수영고, 남천고' },
      '동래구': { dongs:['동래동','온천동','사직동','명장동'], feature:'전통적 교육 명문 지역.', schools:'동래고, 동래여고' },
    }
  },
  '대구': {
    label: '대구광역시', emoji: '🔵',
    areas: {
      '수성구': { dongs:['범어동','만촌동','황금동','수성동'], feature:'대구 최고 교육 특구. 범어·만촌 학원가.', schools:'경신고, 영남고' },
      '달서구': { dongs:['월성동','용산동','감삼동','죽전동'], feature:'대구 서부 최대 주거지역.', schools:'달서고, 계성고' },
    }
  },
};

const GRADES = {
  '초등': { label: '초등학교', years: ['1학년','2학년','3학년','4학년','5학년','6학년'] },
  '중등': { label: '중학교', years: ['1학년','2학년','3학년'] },
  '고등': { label: '고등학교', years: ['1학년','2학년','3학년','수능준비'] },
};

const SUBJECTS = {
  '수학': { emoji: '📐' },
  '영어': { emoji: '📖' },
  '국어': { emoji: '✍️' },
  '과학': { emoji: '🔬' },
  '사회': { emoji: '🌏' },
  '코딩': { emoji: '💻' },
  '논술': { emoji: '📝' },
};

const CSS = `
:root{--navy:#0F2044;--navy-mid:#1E3A6E;--blue:#3B82F6;--blue-pale:#EFF6FF;--blue-border:#BFDBFE;--sky:#60A5FA;--text-dark:#0F2044;--text-mid:#374151;--text-muted:#9CA3AF;--bg:#F8FAFF;--border:#E5E7EB;--shadow:0 4px 24px rgba(0,0,0,0.09);--radius:14px}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Pretendard',-apple-system,sans-serif;background:var(--bg);color:var(--text-dark)}a{text-decoration:none;color:inherit}
header{position:fixed;top:0;left:0;right:0;z-index:300;background:#ffffff;border-bottom:1px solid rgba(15,32,68,0.1);box-shadow:0 2px 16px rgba(15,32,68,0.06)}


.wrap{max-width:900px;margin:0 auto;padding:160px 24px 80px}
.bc{font-size:12px;color:var(--text-muted);margin-bottom:20px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.bc a{color:var(--text-muted)}.bc a:hover{color:var(--blue)}
.art-tag{display:inline-block;background:var(--blue-pale);color:var(--blue);font-size:12px;font-weight:700;padding:4px 12px;border-radius:6px;margin-bottom:14px}
.art-title{font-size:clamp(22px,3.5vw,34px);font-weight:900;letter-spacing:-1px;color:var(--navy);line-height:1.25;margin-bottom:16px}
.art-meta{display:flex;align-items:center;gap:16px;font-size:13px;color:var(--text-muted);flex-wrap:wrap;margin-bottom:32px}
.art-thumb{width:100%;height:240px;border-radius:var(--radius);margin-bottom:36px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;align-items:center;justify-content:center;font-size:72px}
.art-body h2{font-size:20px;font-weight:900;color:var(--navy);margin:36px 0 14px;padding-bottom:10px;border-bottom:2px solid var(--blue-pale)}
.art-body h3{font-size:16px;font-weight:800;color:var(--navy);margin:24px 0 10px}
.art-body p{font-size:15px;color:var(--text-mid);line-height:1.85;margin-bottom:14px}
.art-body strong{color:var(--navy);font-weight:800}
.tag-wrap{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin:20px 0}
.tag-label{font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:12px;letter-spacing:1px}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tag{padding:7px 16px;background:var(--blue-pale);border:1px solid var(--blue-border);border-radius:8px;font-size:13px;font-weight:600;color:var(--blue);transition:all .2s;text-decoration:none;display:inline-block}
.tag:hover{background:var(--blue);color:white}
.subj-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
.subj-link{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-weight:700;color:var(--text-dark);transition:all .2s;text-decoration:none}
.subj-link:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-pale)}
.info-box{background:white;border:1px solid var(--blue-border);border-radius:var(--radius);padding:20px 24px;margin:20px 0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.info-item{text-align:center}.info-num{font-size:26px;font-weight:900;color:var(--blue)}.info-label{font-size:11px;color:var(--text-muted);margin-top:4px}
.keyword-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin:32px 0}
.keyword-title{font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:12px}
.keyword-tags{display:flex;flex-wrap:wrap;gap:6px}
.keyword-tag{padding:5px 12px;background:white;border:1px solid var(--border);border-radius:6px;font-size:12px;color:var(--text-mid)}
.cta-box{background:linear-gradient(135deg,var(--navy),var(--navy-mid));border-radius:20px;padding:36px 40px;text-align:center;margin:48px 0}
.cta-box h3{font-size:22px;font-weight:900;color:white;margin-bottom:8px}
.cta-box p{font-size:14px;color:rgba(255,255,255,.65);margin-bottom:24px}
.cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.btn-p{background:var(--blue);color:white;border:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
.btn-o{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.3);padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block}
.related-title{font-size:18px;font-weight:900;color:var(--navy);margin-bottom:16px;margin-top:48px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.rel-card{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:18px;transition:all .2s;display:block}
.rel-card:hover{border-color:var(--blue-border);transform:translateY(-2px);box-shadow:var(--shadow)}
.rc-tag{font-size:11px;font-weight:700;color:var(--blue);margin-bottom:8px}
.rc-title{font-size:14px;font-weight:800;color:var(--navy);line-height:1.4}
footer{background:var(--navy);padding:28px 48px;margin-top:60px}
.fi{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.fl{font-size:14px;font-weight:900;color:white}.fl em{font-style:normal;color:var(--sky)}
.fr{font-size:12px;color:rgba(255,255,255,.35)}
.floats{position:fixed;right:24px;bottom:60px;display:flex;flex-direction:column;gap:10px;z-index:500}
.fbtn{display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;border:none;font-size:13px;font-weight:700;box-shadow:0 8px 32px rgba(15,32,68,.2);transition:all .25s;cursor:pointer;white-space:nowrap;text-decoration:none}
.fbtn:hover{transform:translateX(-4px)}.fb1{background:var(--blue);color:white}.fb2{background:var(--navy);color:white}
@media(max-width:768px){header{padding:0 16px}.gnav{display:none}.wrap{padding:32px 16px 60px}.subj-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr 1fr}.info-box{grid-template-columns:1fr 1fr}.cta-box{padding:24px 20px}footer{padding:20px 16px}.floats{right:12px;bottom:20px}.art-thumb{height:160px;font-size:56px}}
header{position:fixed;top:0;left:0;right:0;z-index:300;background:#ffffff;border-bottom:1px solid rgba(15,32,68,0.1);box-shadow:0 2px 16px rgba(15,32,68,0.06)}
.hw{max-width:1280px;margin:0 auto;padding:0 48px;height:136px;display:flex;align-items:center;gap:32px}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none}
.logo-mark{width:44px;height:44px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(29,78,216,0.35);flex-shrink:0}
.logo-name{display:flex;flex-direction:column;line-height:1.15}
.logo-main{font-size:20px;font-weight:900;letter-spacing:2px;color:#0A1628}
.logo-main em{font-style:normal;color:var(--sky)}
.logo-sub{font-size:10px;color:rgba(15,32,68,0.6);font-weight:700;letter-spacing:3px}
.vpill{border:1.5px solid rgba(15,32,68,0.2);border-radius:999px;padding:6px 18px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(15,32,68,0.04)}
.vpill .vl{font-size:10px;color:rgba(15,32,68,0.5);font-weight:600}
.vpill .vc{font-size:15px;font-weight:900;color:#1D4ED8;letter-spacing:-0.5px}
.gnb{margin-left:auto;display:flex;align-items:center;gap:4px}
.gnb-link{padding:8px 18px;font-size:14px;font-weight:700;color:#0F2044;border-radius:8px;text-decoration:none;transition:all .18s}
.gnb-link:hover{background:rgba(15,32,68,0.08);color:#1D4ED8}
.gnb-drop-wrap{position:relative;display:inline-block}
.gnb-drop{display:none;position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);background:white;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);padding:8px;min-width:130px;z-index:1000}
.gnb-drop::before{content:'';position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid white}
.gnb-drop-wrap:hover .gnb-drop{display:block}
.gnb-drop-item{display:block;padding:9px 16px;font-size:13px;font-weight:700;color:#374151;text-decoration:none;border-radius:8px;white-space:nowrap}
.gnb-drop-item:hover{background:#EFF6FF;color:#1D4ED8}
@media(max-width:768px){.hw{padding:0 16px;height:72px;gap:10px}.logo-sub{display:none}.logo-main{font-size:15px}.logo-mark{width:32px;height:32px}.vpill{padding:4px 10px}.vpill .vc{font-size:13px}.gnb{display:none}}
`;

const HEADER = `<header>
  <div class="hw">
    <a href="/" class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="logo-name">
        <span class="logo-main"><em>올케어</em>스터디</span>
        <span class="logo-sub">ALLCARE STUDY</span>
      </div>
    </a>
    <div class="vpill">
      <span class="vl">누적 방문자</span>
      <span class="vc">353,112명</span>
    </div>
    <nav class="gnb">
      <a href="/seoul" class="gnb-link">지역별수업</a>
      <a href="/seoul/gangnam/daichi/high/math" class="gnb-link">과목수업</a>
      <div class="gnb-drop-wrap"><a href="/academy/all" class="gnb-link gnb-has-drop">학원수업 <svg style="width:12px;height:12px;vertical-align:middle;margin-left:2px" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></a><div class="gnb-drop"><a href="/academy/intro" class="gnb-drop-item">학원소개</a><a href="/academy/all" class="gnb-drop-item">센터찾기</a></div></div>
    </nav>
  </div>
</header>`;

const HEADER_DARK = `<header style="background:rgba(15,32,68,0.97)!important;border-bottom:1px solid rgba(255,255,255,0.08)!important;box-shadow:none!important">
  <div class="hw">
    <a href="/" class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="logo-name">
        <span class="logo-main" style="color:white"><em>올케어</em>스터디</span>
        <span class="logo-sub" style="color:rgba(255,255,255,0.45)">ALLCARE STUDY</span>
      </div>
    </a>
    <div class="vpill" style="border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.06)">
      <span class="vl" style="color:rgba(255,255,255,0.5)">누적 방문자</span>
      <span class="vc" style="color:#60A5FA">353,112명</span>
    </div>
    <nav class="gnb">
      <a href="/seoul" class="gnb-link" style="color:rgba(255,255,255,0.85)">지역별수업</a>
      <a href="/seoul/gangnam/daichi/high/math" class="gnb-link" style="color:rgba(255,255,255,0.85)">과목수업</a>
      <div class="gnb-drop-wrap"><a href="/academy/all" class="gnb-link gnb-has-drop" style="color:rgba(255,255,255,0.85)">학원수업 <svg style="width:12px;height:12px;vertical-align:middle;margin-left:2px" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></a><div class="gnb-drop"><a href="/academy/intro" class="gnb-drop-item">학원소개</a><a href="/academy/all" class="gnb-drop-item">센터찾기</a></div></div>
    </nav>
  </div>
</header>`;

const FOOTER = `<footer style="background:#0F2044;padding:40px 0 28px">
  <div style="max-width:1100px;margin:0 auto;padding:0 48px">
    <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px 16px;margin-bottom:32px;font-size:12px;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:8px">
      <span>⚠️</span><span>안내사항 · 본 사이트의 모든 콘텐츠는 정보 제공 목적이며, 학습 효과를 보장하지 않습니다.</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:28px;border-bottom:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;gap:24px">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:34px;height:34px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span style="font-size:20px;font-weight:900;letter-spacing:2px;color:white"><em style="font-style:normal;color:#60A5FA">올케어</em>스터디</span>
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7">초등학생부터 고등학생까지<br>학습에 필요한 모든 정보를 한곳에서</p>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px">📞 무료 상담 전화</div>
        <div style="font-size:22px;font-weight:900;color:white;white-space:nowrap">010-6834-8080</div>
        <a href="tel:01068348080" style="display:inline-block;margin-top:10px;background:#3B82F6;color:white;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none">전화 상담</a>
      </div>
    </div>
    <div style="padding-top:20px;font-size:11px;color:rgba(255,255,255,0.3)">
      © 2026 올케어스터디. All rights reserved.
    </div>
  </div>
</footer>
<div class="floats" id="float-btns">
  <a class="fbtn fb1" href="tel:01068348080">📞 전화상담</a>
  <a class="fbtn fb2" href="/contact">✉️ 문의하기</a>
</div>
<script>
(function(){
  var el = document.getElementById('float-btns');
  var footer = document.querySelector('footer');
  if(!el || !footer) return;
  function update(){
    var footerTop = footer.getBoundingClientRect().top;
    var winH = window.innerHeight;
    var gap = 40;
    if(footerTop < winH){
      el.style.position = 'absolute';
      el.style.bottom = 'auto';
      el.style.top = (window.scrollY + footerTop - el.offsetHeight - 60) + 'px';
    } else {
      el.style.position = 'fixed';
      el.style.bottom = gap + 'px';
      el.style.top = 'auto';
    }
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update, {passive:true});
  update();
})();
</script>`;

function today(){
  const d=new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

function wrap(title, desc, canonical, body){
  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://allcarestudy.com${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://allcarestudy.com${canonical}">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${desc}","publisher":{"@type":"Organization","name":"올케어스터디","url":"https://allcarestudy.com"},"dateModified":"2026-03-07"}</script>
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
<style>${CSS}</style>
</head><body>${HEADER}${body}${FOOTER}</body></html>`;
}

function wrapDark(title,desc,canonical,body){
  const page = wrap(title,desc,canonical,body);
  return page.replace(HEADER, HEADER_DARK);
}

// ── 강남구 동별 × 학년 × 과목 SEO 아티클 (2000자) ──────────────

function makeDongArticle(dong, grade, subject) {
  const sInfo = SUBJECT_INFO[subject];
  const gInfo = GRADES[grade];
  if (!sInfo || !gInfo) return null;

  const dongDesc = GANGNAM_DONG_INFO[dong] || `${dong}은 서울 강남구에 위치한 지역으로, 우수한 교육 환경을 갖추고 있습니다.`;
  const gradeDesc = sInfo[grade] || sInfo['고등'];

  const title = `${dong} ${grade} ${subject}과외 | 강남구 ${dong} ${gInfo.label} ${subject} 맞춤 1:1 과외 - 올케어스터디`;
  const desc = `${dong} ${grade} ${subject}과외 전문. 강남구 ${dong} 지역 ${gInfo.label} ${subject} 검증된 선생님과 1:1 맞춤 수업. 내신·수능 완벽 대비. 무료 상담 010-6834-8080`;
  const canonical = `/seoul/gangnam/${DONG_EN[dong]||dong}/${GRADE_EN[grade]||grade}/${SUBJECT_EN[subject]||subject}`;

  // 관련 과목 링크
  const otherSubjects = Object.keys(SUBJECTS).filter(s => s !== subject).slice(0, 6)
    .map(s => `<a class="subj-link" href="/seoul/gangnam/${DONG_EN[dong]||dong}/${GRADE_EN[grade]||grade}/${SUBJECT_EN[s]||s}"><span>${SUBJECTS[s].emoji} ${dong} ${grade} ${s}과외</span><span>→</span></a>`)
    .join('');

  // 관련 동 링크
  const otherDongs = GANGNAM_DONGS.filter(d => d !== dong).slice(0, 3)
    .map(d => `<a class="rel-card" href="/seoul/gangnam/${DONG_EN[d]||d}/${GRADE_EN[grade]||grade}/${SUBJECT_EN[subject]||subject}"><div class="rc-tag">강남구 · ${d}</div><div class="rc-title">${d} ${grade} ${subject}과외 | 강남구 맞춤 1:1 과외</div></a>`)
    .join('');

  // 학년 태그
  const yearTags = gInfo.years.map(y => `<span class="tag">${y}</span>`).join('');

  // SEO 키워드 태그 10개
  const keywords = [
    `${dong} ${subject}과외`,
    `강남구 ${subject}과외`,
    `${dong} ${grade} ${subject}`,
    `강남 ${grade} ${subject}과외`,
    `${dong} 1:1과외`,
    `강남구 ${gInfo.label} ${subject}`,
    `${dong} 과외 추천`,
    `강남구 내신 ${subject}`,
    `${dong} ${subject} 선생님`,
    `강남 ${subject} 과외비`
  ];
  const keywordTags = keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');

  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/seoul">서울특별시</a> › <a href="/seoul/gangnam">강남구</a> › <a href="/seoul/gangnam/${DONG_EN[dong]||dong}/${GRADE_EN[grade]||grade}">${dong} ${grade}</a> › <span>${subject}과외</span></div>

  <div class="art-tag">${SUBJECTS[subject].emoji} 강남구 · ${dong} · ${grade} · ${subject}</div>
  <h1 class="art-title">${dong} ${grade} ${subject}과외 | 강남구 ${dong} ${gInfo.label} ${subject} 맞춤 1:1 과외</h1>
  <div class="art-meta">
    <span>✏️ 올케어스터디 편집팀</span>
    <span>📅 ${today()}</span>
    <span>⏱ 4분 읽기</span>
  </div>

  <div class="info-box">
    <div class="info-item"><div class="info-num">247명</div><div class="info-label">강남구 ${subject} 선생님</div></div>
    <div class="info-item"><div class="info-num">98%</div><div class="info-label">수업 만족도</div></div>
    <div class="info-item"><div class="info-num">무료</div><div class="info-label">상담 신청</div></div>
  </div>

  <div style="width:100%;height:260px;border-radius:14px;margin-bottom:36px;overflow:hidden;position:relative">
    <img src="${DONG_IMAGES[dong] || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80'}" alt="${dong} ${grade} ${subject}과외" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='linear-gradient(135deg,#EFF6FF,#DBEAFE)';this.remove()">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(15,32,68,0.6),transparent);display:flex;align-items:center;padding:32px">
      <div style="color:white"><div style="font-size:13px;opacity:.7;margin-bottom:6px">강남구 · ${dong} · ${grade}</div><div style="font-size:26px;font-weight:900">${dong} ${subject}과외</div></div>
    </div>
  </div>

  <div class="art-body">
    <h2>${dong} ${grade} ${subject}과외 안내</h2>
    <p>${dongDesc}</p>
    <p>${sInfo.intro}</p>
    <p>올케어스터디는 <strong>강남구 ${dong}</strong> 지역에서 검증된 ${subject} 과외 선생님을 연결해드립니다. ${gInfo.label} ${subject} 내신부터 수능까지 학생의 수준과 목표에 맞는 최적의 1:1 맞춤 수업을 제공합니다.</p>

    <h2>${grade} ${subject}과외 커리큘럼</h2>
    <p>${gradeDesc}</p>
    <p>강남구 ${dong} 지역 학교들의 출제 경향을 철저히 분석하여 <strong>내신 1등급</strong>을 목표로 맞춤 전략을 수립합니다. 단순 암기식 학습이 아닌 개념 이해를 바탕으로 한 응용력 훈련으로 어떤 문제 유형에도 대응할 수 있는 실력을 키워드립니다.</p>

    <h3>학년별 수업 안내</h3>
    <div class="tag-wrap"><div class="tag-label">🎓 학년 선택</div><div class="tags">${yearTags}</div></div>

    <h2>올케어스터디 ${subject}과외 5가지 특징</h2>
    <p><strong>① 검증된 선생님 매칭</strong> — 모든 선생님은 학력·경력·수업 시연을 거쳐 엄선됩니다. 강남구 학교 내신 출제 경향을 잘 아는 선생님을 배정합니다.</p>
    <p><strong>② 학교 맞춤 내신 대비</strong> — ${dong} 인근 학교의 기출 문제와 출제 경향을 분석해 시험에 최적화된 수업을 진행합니다.</p>
    <p><strong>③ 매주 학습 보고서 제공</strong> — 수업 내용, 성취도, 보완 사항을 주간 보고서로 학부모님께 공유합니다.</p>
    <p><strong>④ 취약점 집중 보완</strong> — AI 학습 분석을 통해 학생의 약점을 파악하고 집중 보완합니다.</p>
    <p><strong>⑤ 언제든 선생님 교체 가능</strong> — 수업이 맞지 않으면 부담 없이 선생님을 바꿀 수 있습니다.</p>

    <h2>강남구 ${dong} 학습 환경</h2>
    <p>강남구는 전국에서 가장 높은 교육열을 자랑하는 지역으로, ${dong}도 예외가 아닙니다. 우수한 학생들이 밀집해 있어 내신 등급 경쟁이 매우 치열하며, 학원 수업만으로는 개별적인 약점 보완이 어렵습니다.</p>
    <p>1:1 과외는 이러한 환경에서 <strong>가장 효과적인 학습 방법</strong>입니다. 선생님이 학생 한 명에게만 집중하여 이해도를 즉각 확인하고, 모르는 부분을 바로 짚어줄 수 있기 때문입니다. 올케어스터디의 ${subject} 선생님들은 강남구 학교들의 시험 경향을 누구보다 잘 알고 있습니다.</p>

    <h2>${dong} ${subject}과외 수업 방식</h2>
    <p>올케어스터디는 단순히 선생님을 연결하는 것을 넘어, <strong>학생의 성적 향상</strong>을 목표로 수업 전 과정을 체계적으로 관리합니다. 첫 상담에서 학생의 현재 학력 수준과 목표를 정확히 파악한 뒤, 최적의 선생님을 매칭합니다.</p>
    <p>수업은 주 2~3회 진행되며, 학생의 학교 일정과 학원 스케줄을 고려하여 유연하게 조정합니다. 매 수업 후 선생님이 수업 내용과 학생의 이해도를 기록하여 학부모님께 공유드립니다. 시험 전에는 집중 특강 형태로 내신 대비를 강화합니다.</p>

    <h2>${grade} ${subject} 과외 비용 안내</h2>
    <p>강남구 ${dong} 지역 ${grade} ${subject} 과외 비용은 선생님의 경력, 학력, 수업 방식에 따라 다릅니다. 올케어스터디는 학부모님의 예산과 학생의 필요에 맞는 선생님을 합리적인 비용으로 연결해드립니다.</p>
    <p>수업 시작 전 선생님과 충분히 상담하여 수업료를 협의하며, 숨겨진 추가 비용 없이 투명하게 운영됩니다. 첫 상담은 완전히 무료이며, 매칭 후에도 수업이 맞지 않으면 부담 없이 선생님을 교체할 수 있습니다.</p>

    <h2>자주 묻는 질문 (FAQ)</h2>
    <p><strong>Q. 첫 수업 전에 선생님을 미리 만나볼 수 있나요?</strong><br>네, 가능합니다. 정식 수업 전 무료 체험 수업을 통해 선생님의 수업 방식과 학생과의 케미를 확인하실 수 있습니다.</p>
    <p><strong>Q. ${dong}에서 ${subject} 선생님을 찾는 데 얼마나 걸리나요?</strong><br>보통 상담 신청 후 24시간 이내에 코디네이터가 연락드리며, 빠르면 당일에도 매칭이 가능합니다.</p>
    <p><strong>Q. 학교 교과서 외에 추가 교재가 필요한가요?</strong><br>기본적으로 학교 교과서와 기출문제를 활용합니다. 필요에 따라 선생님이 추가 교재를 추천해드리지만 강요하지 않습니다.</p>
    <p><strong>Q. ${grade} ${subject} 성적이 많이 낮아도 괜찮나요?</strong><br>물론입니다. 오히려 기초부터 차근차근 다져야 할 학생일수록 1:1 과외가 효과적입니다. 수준에 맞는 선생님을 매칭해드립니다.</p>

    <h2>다른 과목도 함께 준비하세요</h2>
    <div class="subj-grid">${otherSubjects}</div>

    <div class="keyword-box">
      <div class="keyword-title">🔍 관련 검색 키워드</div>
      <div class="keyword-tags">${keywordTags}</div>
    </div>
  </div>

  <div class="cta-box">
    <h3>${dong} ${grade} ${subject}과외 무료 상담</h3>
    <p>지금 상담 신청 시 전문 코디네이터가 24시간 내 최적의 선생님을 연결해드립니다</p>
    <div class="cta-btns">
      <a class="btn-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-o" href="/contact">✉️ 문의하기</a>
    </div>
  </div>

  <div class="related-title">🔗 강남구 인근 동 ${subject}과외</div>
  <div class="related-grid">${otherDongs}</div>
</div>`;

  return wrap(title, desc, canonical, body);
}

// ── 강남구 페이지 ──────────────────────────────────────────

function makeGangnamPage() {
  const gradeLinks = Object.keys(GRADES).map(g =>
    `<a href="/seoul/gangnam/${GRADE_EN[g]||g}" class="tag" style="font-size:14px;padding:10px 20px">${g}</a>`
  ).join('');

  const dongCards = GANGNAM_DONGS.map(dong =>
    `<a href="/seoul/gangnam/${DONG_EN[dong]||dong}/high/math" class="rel-card"><div class="rc-tag">강남구 · ${dong}</div><div class="rc-title">${dong} 과외 | 강남구 ${dong} 맞춤 1:1 과외</div></a>`
  ).join('');

  const subjLinks = Object.entries(SUBJECTS).map(([s, v]) =>
    `<a class="subj-link" href="/seoul/gangnam/daichi/high/${SUBJECT_EN[s]||s}"><span>${v.emoji} 강남구 고등 ${s}과외</span><span>→</span></a>`
  ).join('');

  const title = '강남구 과외 | 서울 강남구 대치동·압구정·역삼 맞춤 1:1 과외 - 올케어스터디';
  const desc = '강남구 과외 전문. 대치동, 압구정동, 역삼동, 청담동 등 강남구 전 지역 검증된 선생님. 수학, 영어, 국어, 과학 내신·수능 완벽 대비. 무료 상담 010-6834-8080';

  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/seoul">서울특별시</a> › <span>강남구</span></div>

  <div class="art-tag">🏙 서울특별시 · 강남구</div>
  <h1 class="art-title">강남구 과외 | 대치동·압구정·역삼 맞춤 1:1 과외</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span><span>⏱ 3분</span></div>

  <div class="info-box">
    <div class="info-item"><div class="info-num">247명</div><div class="info-label">등록 선생님</div></div>
    <div class="info-item"><div class="info-num">98%</div><div class="info-label">만족도</div></div>
    <div class="info-item"><div class="info-num">무료</div><div class="info-label">상담 신청</div></div>
  </div>

  <div style="width:100%;height:260px;border-radius:14px;margin-bottom:36px;overflow:hidden;position:relative">
    <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80" alt="강남구 과외" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='linear-gradient(135deg,#EFF6FF,#DBEAFE)';this.remove()">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(15,32,68,0.65),transparent);display:flex;align-items:center;padding:32px">
      <div style="color:white"><div style="font-size:13px;opacity:.7;margin-bottom:6px">서울특별시 · 강남구</div><div style="font-size:28px;font-weight:900">강남구 과외</div></div>
    </div>
  </div>

  <div class="art-body">
    <h2>강남구 과외 안내</h2>
    <p>강남구는 대한민국 최고의 교육 특구입니다. 대치동 학원가를 중심으로 전국 최고 수준의 교육 인프라가 갖춰져 있으며, 내신 시험 난이도도 전국 최상위권입니다. 올케어스터디는 강남구 전 지역에서 검증된 과외 선생님을 연결해드립니다.</p>

    <h2>동별 과외 정보</h2>
    <div class="related-grid">${dongCards}</div>

    <h2>학년별 과외 선택</h2>
    <div class="tag-wrap"><div class="tag-label">🎓 학년 선택</div><div class="tags">${gradeLinks}</div></div>

    <h2>과목별 과외 바로가기</h2>
    <div class="subj-grid">${subjLinks}</div>
  </div>

  <div class="cta-box">
    <h3>강남구 맞춤 과외 선생님 찾기</h3>
    <p>지금 바로 무료 상담을 신청하시면 전문 코디네이터가 연결해드립니다</p>
    <div class="cta-btns">
      <a class="btn-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-o" href="/contact">✉️ 문의하기</a>
    </div>
  </div>
</div>`;

  return wrap(title, desc, '/서울/강남구', body);
}

// ── 시도 페이지 ──────────────────────────────────────────

function makeSidoPage(rk) {
  const r = REGIONS[rk];
  if (!r) return null;
  const distCards = Object.keys(r.areas).map(dist => {
    const en = DISTRICT_EN[dist]||dist;
    return `<a href="/${SIDO_EN[rk]||rk}/${en}" style="display:inline-block;padding:10px 18px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-weight:700;color:var(--text-dark);text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-dark)'">${dist}</a>`;
  }).join('');
  const title = `${r.label} 과외 | ${r.label} 지역별 맞춤 1:1 과외 - 올케어스터디`;
  const desc = `${r.label} 과외 전문. ${r.label} 전 지역 검증된 선생님. 수학, 영어, 국어, 과학 내신·수능 완벽 대비. 무료 상담 010-6834-8080`;
  const heroImg = rk==='서울' ? 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&q=80' : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80';
  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <span>${r.label}</span></div>
  <div class="art-tag">${r.emoji} ${r.label}</div>
  <h1 class="art-title">${r.label} 과외 | 지역별 맞춤 1:1 과외 안내</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span></div>
  <div style="width:100%;height:260px;border-radius:14px;margin-bottom:36px;overflow:hidden;position:relative">
    <img src="${heroImg}" alt="${r.label} 과외" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='linear-gradient(135deg,#EFF6FF,#DBEAFE)';this.remove()">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(15,32,68,0.6),transparent);display:flex;align-items:center;padding:32px">
      <div style="color:white"><div style="font-size:13px;opacity:.7;margin-bottom:6px">${r.label} 전 지역</div><div style="font-size:28px;font-weight:900">${r.label} 과외</div></div>
    </div>
  </div>
  <div class="art-body">
    <h2>구/군 선택</h2>
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin:20px 0">${distCards}</div>
  </div>
  <div style="background:linear-gradient(135deg,#0F2044,#1E3A6E);border-radius:20px;padding:40px 48px;margin:48px 0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px">
    <div>
      <div style="font-size:22px;font-weight:900;color:white;margin-bottom:6px">${r.label} 맞춤 과외 신청</div>
      <div style="font-size:14px;color:rgba(255,255,255,.6)">무료 상담을 신청하시면 전문 코디네이터가 연결해드립니다</div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
      <div style="text-align:right">
        <div style="font-size:11px;color:rgba(255,255,255,.4);margin-bottom:2px">📞 무료 상담 전화</div>
        <div style="font-size:24px;font-weight:900;color:white">010-6834-8080</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a href="tel:01068348080" style="background:#3B82F6;color:white;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;white-space:nowrap">📞 전화 상담</a>
        <a href="/contact" style="background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.25);padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;text-align:center">✉️ 문의하기</a>
      </div>
    </div>
  </div>
</div>`;
  return wrap(title, desc, `/${SIDO_EN[rk]||rk}`, body);
}

// ── 구/군 페이지 ──────────────────────────────────────────

function makeAreaPage(rk, ak) {
  const region = REGIONS[rk];
  const area = region?.areas[ak];
  if (!region || !area) return null;

  // 강남구는 전용 페이지
  if (rk === '서울' && ak === '강남구') return makeGangnamPage();

  const dongTags = area.dongs.map(d => `<span class="tag">${d}</span>`).join('');
  const subjLinks = Object.entries(SUBJECTS).slice(0, 6).map(([s, v]) =>
    `<a class="subj-link" href="/${SIDO_EN[rk]||rk}/${DISTRICT_EN[ak]||ak}/high/${SUBJECT_EN[s]||s}"><span>${v.emoji} ${ak} 고등 ${s}과외</span><span>→</span></a>`
  ).join('');
  const relAreas = Object.keys(region.areas).filter(a => a !== ak).slice(0, 3)
    .map(a => `<a class="rel-card" href="/${SIDO_EN[rk]||rk}/${DISTRICT_EN[a]||a}"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} 과외 | ${a} 맞춤 과외</div></a>`).join('');

  const title = `${ak} 과외 | ${region.label} ${ak} 맞춤 1:1 과외 - 올케어스터디`;
  const desc = `${ak} 과외 전문. ${area.feature} 수학, 영어 등 전과목 검증된 선생님. 무료 상담 010-6834-8080`;
  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/${rk}">${region.label}</a> › <span>${ak}</span></div>
  <div class="art-tag">${region.emoji} ${region.label} · ${ak}</div>
  <h1 class="art-title">${ak} 과외 | ${ak} 맞춤 1:1 과외 안내</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span></div>
  <div class="info-box">
    <div class="info-item"><div class="info-num">247명</div><div class="info-label">등록 선생님</div></div>
    <div class="info-item"><div class="info-num">98%</div><div class="info-label">만족도</div></div>
    <div class="info-item"><div class="info-num">무료</div><div class="info-label">상담</div></div>
  </div>
  <div class="art-thumb">${region.emoji}</div>
  <div class="art-body">
    <h2>${ak} 과외 안내</h2>
    <p>${area.feature}</p>
    <h3>주요 학교: ${area.schools}</h3>
    <div class="tag-wrap"><div class="tag-label">📍 동별 과외 정보</div><div class="tags">${dongTags}</div></div>
    <h2>과목별 과외 바로가기</h2>
    <div class="subj-grid">${subjLinks}</div>
  </div>
  <div class="cta-box">
    <h3>${ak} 맞춤 과외 신청</h3>
    <p>무료 상담을 신청하시면 전문 코디네이터가 연결해드립니다</p>
    <div class="cta-btns">
      <a class="btn-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-o" href="/contact">✉️ 문의하기</a>
    </div>
  </div>
  <div class="related-title">🔗 주변 지역 과외</div>
  <div class="related-grid">${relAreas}</div>
</div>`;
  return wrap(title, desc, `/${SIDO_EN[rk]||rk}/${DISTRICT_EN[ak]||ak}`, body);
}

// ── 기존 구/학년/과목 페이지 (강남구 외) ─────────────────────

function makeArticlePage(rk, ak, gk, sk) {
  const region = REGIONS[rk];
  const area = region?.areas[ak];
  const grade = GRADES[gk];
  const subj = SUBJECTS[sk];
  if (!region || !area || !grade || !subj) return null;

  const otherSubj = Object.entries(SUBJECTS).filter(([s]) => s !== sk).slice(0, 6)
    .map(([s, v]) => `<a class="subj-link" href="/${SIDO_EN[rk]||rk}/${DISTRICT_EN[ak]||ak}/${GRADE_EN[gk]||gk}/${SUBJECT_EN[s]||s}"><span>${v.emoji} ${ak} ${gk} ${s}과외</span><span>→</span></a>`).join('');
  const relLinks = Object.keys(region.areas).filter(a => a !== ak).slice(0, 3)
    .map(a => `<a class="rel-card" href="/${SIDO_EN[rk]||rk}/${DISTRICT_EN[a]||a}/${GRADE_EN[gk]||gk}/${SUBJECT_EN[sk]||sk}"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} ${gk} ${sk}과외</div></a>`).join('');
  const yearTags = grade.years.map(y => `<span class="tag">${y}</span>`).join('');

  const title = `${ak} ${gk} ${sk}과외 | ${region.label} ${ak} ${grade.label} ${sk} 맞춤 과외 - 올케어스터디`;
  const desc = `${ak} ${gk} ${sk}과외. ${area.feature} ${grade.label} ${sk} 검증된 선생님과 1:1 맞춤 수업. 무료 상담 010-6834-8080`;
  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/${rk}">${region.label}</a> › <a href="/${rk}/${ak}">${ak}</a> › <span>${gk} ${sk}과외</span></div>
  <div class="art-tag">${subj.emoji} ${ak} · ${gk} · ${sk}</div>
  <h1 class="art-title">${ak} ${gk} ${sk}과외 | ${region.label} ${ak} ${grade.label} ${sk} 맞춤 1:1 과외</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span><span>⏱ 4분</span></div>
  <div class="info-box">
    <div class="info-item"><div class="info-num">247명</div><div class="info-label">${sk} 선생님</div></div>
    <div class="info-item"><div class="info-num">98%</div><div class="info-label">만족도</div></div>
    <div class="info-item"><div class="info-num">무료</div><div class="info-label">상담</div></div>
  </div>
  <div class="art-thumb">${subj.emoji}</div>
  <div class="art-body">
    <h2>${ak} ${gk} ${sk}과외 안내</h2>
    <p>${area.feature}</p>
    <p>올케어스터디는 ${region.label} <strong>${ak}</strong> 지역 ${grade.label} ${sk} 검증된 선생님을 연결해드립니다.</p>
    <h3>학년별 수업 안내</h3>
    <div class="tag-wrap"><div class="tag-label">🎓 학년 선택</div><div class="tags">${yearTags}</div></div>
    <h2>올케어스터디 ${sk}과외 특징</h2>
    <p><strong>검증된 선생님</strong>: 학력·경력·수업시연 검증 완료</p>
    <p><strong>학교 맞춤</strong>: ${ak} 학교 기출 분석 특화 수업</p>
    <p><strong>매주 보고서</strong>: 학습 현황 주간 리포트 제공</p>
    <h3>다른 과목도 함께</h3>
    <div class="subj-grid">${otherSubj}</div>
  </div>
  <div class="cta-box">
    <h3>${ak} ${gk} ${sk}과외 무료 상담</h3>
    <p>24시간 내 전문 코디네이터가 연락드립니다</p>
    <div class="cta-btns">
      <a class="btn-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-o" href="/contact">✉️ 문의하기</a>
    </div>
  </div>
  <div class="related-title">🔗 주변 지역 ${sk}과외</div>
  <div class="related-grid">${relLinks}</div>
</div>`;
  return wrap(title, desc, `/${rk}/${ak}/${gk}/${sk}`, body);
}

// ── 홈페이지 ──────────────────────────────────────────────

// ── 학원 찾기 페이지 ──────────────────────────

function makeAcademyIntroPage() {
  const introStyle = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--navy:#0F2044;--blue:#1D4ED8;--blue2:#3B82F6;--blue-light:#EFF6FF;--border:#E5E7EB;--gray:#6B7280;--light:#F8FAFC}
body{font-family:'Noto Sans KR',sans-serif;color:#1F2937;background:#fff;overflow-x:hidden}

/* ─ 히어로 ─ */
.hero{background:var(--navy);min-height:500px;padding:140px 48px 100px;text-align:center;position:relative;overflow:hidden}

.hero-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px);background-size:32px 32px}
.hero-glow{position:absolute;top:20%;left:50%;transform:translateX(-50%);width:600px;height:300px;background:radial-gradient(ellipse,rgba(59,130,246,.25) 0%,transparent 70%);pointer-events:none}
.hero-inner{position:relative;z-index:1;max-width:760px;margin:0 auto}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:7px 18px;font-size:13px;color:rgba(255,255,255,.8);font-weight:600;margin-bottom:24px}
.hero-badge b{color:#60A5FA}
.hero-title{font-size:52px;font-weight:900;color:white;line-height:1.15;letter-spacing:-1.5px;margin-bottom:20px}
.hero-title em{color:#60A5FA;font-style:normal}
.hero-desc{font-size:17px;color:rgba(255,255,255,.65);line-height:1.8;margin-bottom:36px}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-white{background:white;color:var(--navy);padding:14px 32px;border-radius:12px;font-size:15px;font-weight:800;border:none;cursor:pointer;transition:.2s}
.btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.25)}
.btn-outline{background:transparent;border:1.5px solid rgba(255,255,255,.3);color:white;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:.2s}
.btn-outline:hover{background:rgba(255,255,255,.1)}
.breadcrumb{background:white;padding:14px 48px;font-size:13px;color:#9CA3AF;border-bottom:1px solid var(--border)}
.breadcrumb a{color:var(--blue)}

/* ─ 통계 ─ */
.stats-wrap{background:white;padding:48px 48px 80px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border:1.5px solid var(--border);border-radius:20px;overflow:hidden;max-width:900px;margin:0 auto;background:white;box-shadow:0 8px 40px rgba(15,32,68,.08)}
.stat{padding:36px 32px;text-align:center;border-right:1px solid var(--border)}
.stat:last-child{border-right:none}
.stat-num{font-size:42px;font-weight:900;color:var(--navy);line-height:1}
.stat-num sup{font-size:20px;vertical-align:super}
.stat-label{font-size:13px;color:var(--gray);margin-top:6px;font-weight:500}

/* ─ 공통 태그/타이틀 ─ */
.tag{display:inline-block;background:var(--blue-light);color:var(--blue);font-size:11px;font-weight:800;padding:4px 12px;border-radius:999px;letter-spacing:.5px;margin-bottom:14px}
.sec-title{font-size:34px;font-weight:900;color:var(--navy);line-height:1.3;margin-bottom:16px;letter-spacing:-.5px}
.sec-title em{color:var(--blue);font-style:normal}
.sec-desc{font-size:15px;color:var(--gray);line-height:1.9}
.sec-desc strong{color:var(--navy)}

/* ─ 학습법: 좌텍스트 + 우포인트카드 ─ */
.method-section{padding:100px 48px 80px;background:white}
.method-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.method-cards{display:flex;flex-direction:column;gap:14px}
.method-card{background:var(--light);border:1px solid var(--border);border-radius:14px;padding:20px 22px;display:flex;gap:14px;align-items:flex-start;transition:.2s}
.method-card:hover{border-color:#93C5FD;background:var(--blue-light)}
.mc-icon{width:40px;height:40px;background:var(--navy);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.mc-title{font-size:14px;font-weight:800;color:var(--navy);margin-bottom:4px}
.mc-desc{font-size:13px;color:var(--gray);line-height:1.6}

/* ─ 차별화: 네이비 풀배경 3카드 ─ */
.diff-section{background:#EFF6FF;padding:80px 48px}
.diff-inner{max-width:1100px;margin:0 auto}
.diff-header{text-align:center;margin-bottom:56px}
.diff-title{font-size:36px;font-weight:900;color:#0F2044;line-height:1.3}
.diff-title em{color:#1D4ED8;font-style:normal}
.diff-desc{font-size:16px;color:#374151;margin-top:12px;line-height:1.8}
.diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.diff-card{background:white;border:1px solid #BFDBFE;border-radius:20px;padding:32px 24px;transition:all .3s;box-shadow:0 2px 0 #BFDBFE,0 8px 32px rgba(29,78,216,.12),0 2px 8px rgba(0,0,0,.06)}
.diff-card:hover{background:#F0F7FF;border-color:#60A5FA;transform:translateY(-6px);box-shadow:0 2px 0 #93C5FD,0 20px 56px rgba(29,78,216,.15)}
.diff-num{font-size:13px;font-weight:900;color:#60A5FA;margin-bottom:12px;letter-spacing:1px}
.diff-card-title{font-size:18px;font-weight:900;color:#0F2044;margin-bottom:10px}
.diff-card-desc{font-size:14px;color:#6B7280;line-height:1.75}

/* ─ 학습목표: 회색 배경 3분할 ─ */
.goal-section{padding:80px 48px;background:var(--light)}
.goal-inner{max-width:1100px;margin:0 auto}
.goal-header{text-align:center;margin-bottom:48px}
.goal-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--border);border-radius:20px;overflow:hidden}
.goal-card{background:white;padding:40px 32px;text-align:center;position:relative}
.goal-card::before{content:attr(data-num);position:absolute;top:24px;right:24px;font-size:11px;font-weight:900;color:#E5E7EB;letter-spacing:1px}
.goal-icon{width:64px;height:64px;border-radius:16px;background:var(--navy);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 20px}
.goal-card-title{font-size:18px;font-weight:900;color:var(--navy);margin-bottom:10px}
.goal-card-desc{font-size:14px;color:var(--gray);line-height:1.75}

/* ─ 4C 프로세스: 흰 배경, 좌텍스트+우그리드 ─ */
.process-section{padding:80px 48px;background:white}
.process-inner{max-width:1000px;margin:0 auto}
.process-header{text-align:center;margin-bottom:48px}
.process-layout{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.process-text ul{margin-top:20px;display:flex;flex-direction:column;gap:10px;list-style:none}
.process-text li{display:flex;gap:10px;font-size:14px;color:var(--gray);line-height:1.6}
.process-text li::before{content:'';width:6px;height:6px;background:var(--blue);border-radius:50%;flex-shrink:0;margin-top:7px}
.process-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative}
.p-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:88px;height:88px;background:white;border-radius:50%;border:3px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:var(--navy);text-align:center;line-height:1.3;box-shadow:0 4px 20px rgba(0,0,0,.1);z-index:2}
.pc{border-radius:16px;padding:28px 22px;color:white}
.pc-1{background:#1E3A6E}.pc-2{background:#1E40AF}.pc-3{background:#1D4ED8}.pc-4{background:#2563EB}
.pc-en{font-size:15px;font-weight:900;margin-bottom:4px}
.pc-en span{opacity:.5}
.pc-kr{font-size:13px;font-weight:700;opacity:.85}

/* ─ 3대 관리: 회색 배경, 탭 전환 ─ */
.manage-section{padding:80px 48px;background:var(--light)}
.manage-inner{max-width:1000px;margin:0 auto}
.manage-header{text-align:center;margin-bottom:40px}
.manage-tabs{display:flex;border:1.5px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:28px;background:white}
.mtab{flex:1;padding:16px;text-align:center;font-size:14px;font-weight:700;color:var(--gray);cursor:pointer;border:none;background:white;transition:.2s;border-right:1px solid var(--border)}
.mtab:last-child{border-right:none}
.mtab.active{background:var(--navy);color:white}
.manage-panel{display:none;background:white;border:1.5px solid var(--border);border-radius:16px;padding:40px;gap:48px;align-items:start}
.manage-panel.active{display:grid;grid-template-columns:1fr 1fr}
.mp-tag{display:inline-block;background:var(--blue-light);color:var(--blue);font-size:11px;font-weight:800;padding:4px 12px;border-radius:999px;margin-bottom:10px}
.mp-title{font-size:26px;font-weight:900;color:var(--navy);margin-bottom:14px}
.mp-desc{font-size:14px;color:var(--gray);line-height:1.9}
.mp-desc strong{color:var(--navy)}
.mp-visual{background:var(--light);border-radius:14px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;font-size:72px;border:1px solid var(--border)}
.mp-points{margin-top:20px;display:flex;flex-direction:column;gap:8px}
.mp-point{display:flex;gap:10px;font-size:13px;color:var(--gray)}
.mp-point::before{content:'✓';color:var(--blue);font-weight:900;flex-shrink:0}
.mp-img-grid{position:relative;border-radius:14px;overflow:hidden}
.mp-img-grid .mslide{display:none;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px}
.mp-img-grid .mslide.active{display:block}
.mp-img-dots{display:flex;justify-content:center;gap:6px;margin-top:10px}
.mp-img-dots button{width:7px;height:7px;border-radius:50%;border:none;background:var(--border);cursor:pointer;padding:0;transition:.2s}
.mp-img-dots button.active{background:var(--navy);width:20px;border-radius:4px}
.mp-img-nav{position:absolute;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15);z-index:2;transition:.2s}
.mp-img-nav:hover{background:white;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.mp-img-nav.prev{left:8px}.mp-img-nav.next{right:8px}

/* ─ AI: 다크 네이비, 배경 워터마크 ─ */
.ai-section{padding:80px 48px;background:#EFF6FF;position:relative;overflow:hidden}
.ai-section::before{content:'';position:absolute;right:-20px;bottom:-20px;width:380px;height:480px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 280'%3E%3C!-- 안테나 --%3E%3Cline x1='100' y1='10' x2='100' y2='35' stroke='%231D4ED8' stroke-width='4' stroke-linecap='round'/%3E%3Ccircle cx='100' cy='8' r='6' fill='%231D4ED8'/%3E%3C!-- 머리 --%3E%3Crect x='55' y='35' width='90' height='70' rx='18' fill='%231D4ED8'/%3E%3C!-- 눈 --%3E%3Ccircle cx='80' cy='62' r='14' fill='white'/%3E%3Ccircle cx='120' cy='62' r='14' fill='white'/%3E%3Ccircle cx='83' cy='65' r='7' fill='%230F2044'/%3E%3Ccircle cx='123' cy='65' r='7' fill='%230F2044'/%3E%3Ccircle cx='85' cy='63' r='2.5' fill='white'/%3E%3Ccircle cx='125' cy='63' r='2.5' fill='white'/%3E%3C!-- 입 --%3E%3Crect x='78' y='88' width='44' height='8' rx='4' fill='white' opacity='.6'/%3E%3Crect x='85' y='89' width='8' height='6' rx='2' fill='%230F2044' opacity='.4'/%3E%3Crect x='96' y='89' width='8' height='6' rx='2' fill='%230F2044' opacity='.4'/%3E%3Crect x='107' y='89' width='8' height='6' rx='2' fill='%230F2044' opacity='.4'/%3E%3C!-- 목 --%3E%3Crect x='88' y='105' width='24' height='18' rx='4' fill='%231D4ED8'/%3E%3C!-- 몸통 --%3E%3Crect x='40' y='123' width='120' height='95' rx='20' fill='%231D4ED8'/%3E%3C!-- 몸통 패널 --%3E%3Crect x='60' y='138' width='80' height='50' rx='10' fill='white' opacity='.12'/%3E%3Ccircle cx='80' cy='155' r='10' fill='white' opacity='.25'/%3E%3Ccircle cx='80' cy='155' r='5' fill='%2360A5FA'/%3E%3Crect x='95' y='148' width='35' height='5' rx='2.5' fill='white' opacity='.3'/%3E%3Crect x='95' y='158' width='25' height='5' rx='2.5' fill='white' opacity='.2'/%3E%3Crect x='95' y='168' width='30' height='5' rx='2.5' fill='white' opacity='.25'/%3E%3C!-- 왼팔 --%3E%3Crect x='10' y='125' width='28' height='80' rx='14' fill='%231D4ED8'/%3E%3Ccircle cx='24' cy='210' r='14' fill='%231E40AF'/%3E%3C!-- 오른팔 --%3E%3Crect x='162' y='125' width='28' height='80' rx='14' fill='%231D4ED8'/%3E%3Ccircle cx='176' cy='210' r='14' fill='%231E40AF'/%3E%3C!-- 다리 --%3E%3Crect x='65' y='218' width='32' height='55' rx='14' fill='%231D4ED8'/%3E%3Crect x='103' y='218' width='32' height='55' rx='14' fill='%231D4ED8'/%3E%3C!-- 발 --%3E%3Crect x='58' y='260' width='44' height='16' rx='8' fill='%231E40AF'/%3E%3Crect x='98' y='260' width='44' height='16' rx='8' fill='%231E40AF'/%3E%3C/svg%3E") center bottom/contain no-repeat;opacity:0.07;pointer-events:none;z-index:0;line-height:1;pointer-events:none}
.ai-stars{display:none}
.ai-glow1{position:absolute;top:-100px;left:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(37,99,235,.08) 0%,transparent 70%);pointer-events:none}
.ai-glow2{position:absolute;bottom:-100px;right:-100px;width:350px;height:350px;background:radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 70%);pointer-events:none}
.ai-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1}
.ai-header{margin-bottom:48px}
.ai-title{font-size:40px;font-weight:900;color:#0F2044;letter-spacing:-1px;margin-bottom:10px;text-shadow:0 1px 2px rgba(0,0,0,.1)}
.ai-title span{color:#1D4ED8}
.ai-sub{font-size:15px;color:#1F2937;line-height:1.8;font-weight:500}
.ai-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.ai-card{background:white;border:1px solid #BFDBFE;border-radius:20px;padding:28px 24px;transition:all .3s;box-shadow:0 2px 0 #BFDBFE,0 8px 32px rgba(29,78,216,.12),0 2px 8px rgba(0,0,0,.06);transform:translateY(0)}
.ai-card:hover{background:#F0F7FF;border-color:#60A5FA;transform:translateY(-8px);box-shadow:0 2px 0 #93C5FD,0 20px 56px rgba(29,78,216,.18),0 8px 16px rgba(0,0,0,.08)}
.ai-card-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.ai-card-icon{width:44px;height:44px;background:linear-gradient(135deg,#DBEAFE,#EDE9FE);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;border:1px solid #BFDBFE;box-shadow:0 4px 12px rgba(37,99,235,.1)}
.ai-card-name{font-size:18px;font-weight:900;color:#0F2044;letter-spacing:-.3px}
.ai-card-range{font-size:11px;color:#9CA3AF;margin-top:2px}
.ai-card-desc{font-size:13px;color:#374151;line-height:1.75;margin-bottom:16px;font-weight:500}
.ai-steps{display:flex;gap:6px;flex-wrap:wrap}
.ai-step{background:#DBEAFE;border:1px solid #93C5FD;border-radius:999px;padding:4px 12px;font-size:11px;color:#1E40AF;font-weight:800}

/* ─ 후기: 슬라이더 ─ */
.review-section{padding:80px 0;background:white}
.review-inner{max-width:900px;margin:0 auto;padding:0 48px}
.review-header{text-align:center;margin-bottom:40px}
.slider-wrap{position:relative;display:flex;align-items:center;gap:0;margin-bottom:24px}
.slider-viewport{overflow:hidden;flex:1}
.slider-track{display:flex;gap:20px;transition:transform .4s cubic-bezier(.4,0,.2,1);will-change:transform}
.review-card{flex:0 0 calc(33.333% - 14px);border:1.5px solid var(--border);border-radius:16px;padding:28px 26px;transition:border-color .2s,box-shadow .2s;background:white}
.review-card:hover{border-color:#93C5FD;box-shadow:0 4px 20px rgba(29,78,216,.08)}
.review-quotes{font-size:48px;font-weight:900;color:#DBEAFE;line-height:.8;margin-bottom:8px;font-family:Georgia,serif}
.review-badges{display:flex;gap:8px;margin-bottom:10px}
.rb{padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700}
.rb-h{background:#FEE2E2;color:#DC2626}
.rb-m{background:#DBEAFE;color:#1D4ED8}
.rb-e{background:#FEF3C7;color:#D97706}
.rb-s{background:var(--light);color:var(--gray)}
.review-title{font-size:14px;font-weight:800;color:var(--navy);margin-bottom:8px}
.review-text{font-size:13px;color:var(--gray);line-height:1.8}
.slider-btn{width:44px;height:44px;border-radius:50%;border:1.5px solid var(--border);background:white;font-size:16px;cursor:pointer;flex-shrink:0;transition:.2s;color:var(--navy);display:flex;align-items:center;justify-content:center;margin:0 12px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.slider-btn:hover{background:var(--navy);color:white;border-color:var(--navy)}
.slider-dots{display:flex;justify-content:center;gap:8px}
.sdot{width:8px;height:8px;border-radius:50%;background:var(--border);cursor:pointer;transition:.2s;border:none}
.sdot.active{background:#1D4ED8;width:24px;border-radius:4px}

/* ─ CTA ─ */
.cta-section{background:linear-gradient(135deg,var(--navy) 0%,#1D4ED8 100%);padding:80px 48px;text-align:center;position:relative;overflow:hidden}
.cta-section::before{
  content:'';position:absolute;inset:0;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 260'%3E%3Crect x='20' y='30' width='90' height='70' rx='5' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='20' y='30' width='90' height='14' rx='5' fill='none' stroke='white' stroke-width='2'/%3E%3Cline x1='32' y1='58' x2='98' y2='58' stroke='white' stroke-width='1.2'/%3E%3Cline x1='32' y1='70' x2='98' y2='70' stroke='white' stroke-width='1.2'/%3E%3Cline x1='32' y1='82' x2='82' y2='82' stroke='white' stroke-width='1.2'/%3E%3Crect x='130' y='50' width='8' height='55' rx='2' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='130,105 138,105 134,118' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='130' y='50' width='8' height='10' rx='1' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='30' y='140' width='65' height='80' rx='4' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='40' y='155' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpolyline points='41,158 43,161 47,156' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='158' x2='85' y2='158' stroke='white' stroke-width='1.2'/%3E%3Crect x='40' y='170' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpolyline points='41,173 43,176 47,171' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='173' x2='83' y2='173' stroke='white' stroke-width='1.2'/%3E%3Crect x='40' y='185' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='188' x2='80' y2='188' stroke='white' stroke-width='1.2'/%3E%3Crect x='115' y='155' width='60' height='40' rx='7' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='125,195 138,195 132,207' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cline x1='124' y1='168' x2='166' y2='168' stroke='white' stroke-width='1.2'/%3E%3Cline x1='124' y1='179' x2='158' y2='179' stroke='white' stroke-width='1.2'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 260'%3E%3Crect x='20' y='30' width='90' height='70' rx='5' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='20' y='30' width='90' height='14' rx='5' fill='none' stroke='white' stroke-width='2'/%3E%3Cline x1='32' y1='58' x2='98' y2='58' stroke='white' stroke-width='1.2'/%3E%3Cline x1='32' y1='70' x2='98' y2='70' stroke='white' stroke-width='1.2'/%3E%3Cline x1='32' y1='82' x2='82' y2='82' stroke='white' stroke-width='1.2'/%3E%3Crect x='130' y='50' width='8' height='55' rx='2' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='130,105 138,105 134,118' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='130' y='50' width='8' height='10' rx='1' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='30' y='140' width='65' height='80' rx='4' fill='none' stroke='white' stroke-width='1.5'/%3E%3Crect x='40' y='155' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpolyline points='41,158 43,161 47,156' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='158' x2='85' y2='158' stroke='white' stroke-width='1.2'/%3E%3Crect x='40' y='170' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpolyline points='41,173 43,176 47,171' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='173' x2='83' y2='173' stroke='white' stroke-width='1.2'/%3E%3Crect x='40' y='185' width='7' height='7' rx='1' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cline x1='52' y1='188' x2='80' y2='188' stroke='white' stroke-width='1.2'/%3E%3Crect x='115' y='155' width='60' height='40' rx='7' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cpolygon points='125,195 138,195 132,207' fill='none' stroke='white' stroke-width='1.5'/%3E%3Cline x1='124' y1='168' x2='166' y2='168' stroke='white' stroke-width='1.2'/%3E%3Cline x1='124' y1='179' x2='158' y2='179' stroke='white' stroke-width='1.2'/%3E%3C/svg%3E");
  background-size:180px,180px;
  background-position:left center, right center;
  background-repeat:no-repeat,no-repeat;
  opacity:0.08;
  pointer-events:none;
}
.cta-title{font-size:34px;font-weight:900;color:white;margin-bottom:10px;letter-spacing:-.5px}
.cta-sub{font-size:16px;color:rgba(255,255,255,.65);margin-bottom:32px;line-height:1.7}
.cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

@media(max-width:900px){
  .hero{padding:100px 24px 80px}.hero-title{font-size:34px}
  .stats-wrap{padding:0 24px 60px}.stats{grid-template-columns:1fr}
  .stat{border-right:none;border-bottom:1px solid var(--border)}.stat:last-child{border-bottom:none}
  .method-inner,.diff-grid,.ai-cards,.process-layout,.goal-cards{grid-template-columns:1fr}
  .manage-panel.active{grid-template-columns:1fr}
  .method-section,.diff-section,.goal-section,.process-section,.manage-section,.ai-section,.review-section,.cta-section{padding:60px 24px}
  .breadcrumb{padding:14px 24px}
}`;
  const introScript = `function switchTab(idx){
  document.querySelectorAll('.mtab').forEach((t,i)=>t.classList.toggle('active',i===idx));
  document.querySelectorAll('.manage-panel').forEach((p,i)=>p.classList.toggle('active',i===idx));
}

// 이미지 슬라이더 (탭 내)
function mslideGo(sid, idx) {
  const wrap = document.getElementById('ms-'+sid);
  const dotsWrap = document.getElementById('msd-'+sid);
  if(!wrap) return;
  const slides = wrap.querySelectorAll('.mslide');
  const dots = dotsWrap.querySelectorAll('button');
  slides.forEach((s,i) => s.classList.toggle('active', i===idx));
  dots.forEach((d,i) => d.classList.toggle('active', i===idx));
  wrap._cur = idx;
}
function mslideMove(sid, dir) {
  const wrap = document.getElementById('ms-'+sid);
  if(!wrap) return;
  const total = wrap.querySelectorAll('.mslide').length;
  const cur = wrap._cur || 0;
  const next = (cur + dir + total) % total;
  mslideGo(sid, next);
}
// 자동 슬라이드
['plan','study','life'].forEach(sid => {
  let cur = 0;
  setInterval(() => {
    const wrap = document.getElementById('ms-'+sid);
    if(!wrap) return;
    const total = wrap.querySelectorAll('.mslide').length;
    cur = (cur + 1) % total;
    mslideGo(sid, cur);
  }, 3000);
});

// 카운트업
(function(){
  const targets = [
    {id:'cnt-1', end:200, duration:1800},
    {id:'cnt-2', end:15,  duration:1200},
    {id:'cnt-3', end:98,  duration:1600},
  ];
  let started = false;

  function countUp(el, end, duration){
    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * end);
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = end;
    }
    requestAnimationFrame(step);
  }

  function startAll(){
    if(started) return;
    started = true;
    targets.forEach((t, i) => {
      setTimeout(() => {
        const el = document.getElementById(t.id);
        if(el) countUp(el, t.end, t.duration);
      }, i * 150);
    });
  }

  // IntersectionObserver로 화면에 보일 때 시작
  const statsEl = document.querySelector('.stats');
  if(statsEl && 'IntersectionObserver' in window){
    new IntersectionObserver((entries, obs) => {
      if(entries[0].isIntersecting){ startAll(); obs.disconnect(); }
    }, {threshold: 0.3}).observe(statsEl);
  } else {
    startAll();
  }
})();

// 슬라이더
(function(){
  const track = document.getElementById('sliderTrack');
  const dotsEl = document.getElementById('sliderDots');
  if(!track) return;

  const cards = track.querySelectorAll('.review-card');
  const total = cards.length;
  let perView = window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3;
  let cur = 0;
  const maxIdx = total - perView;

  // 도트 생성
  for(let i=0;i<=maxIdx;i++){
    const d = document.createElement('button');
    d.className = 'sdot' + (i===0?' active':'');
    d.onclick = ()=>goTo(i);
    dotsEl.appendChild(d);
  }

  function getCardW(){
    const gap = 20;
    const vw = track.parentElement.offsetWidth;
    return (vw - gap*(perView-1)) / perView;
  }

  function goTo(idx){
    cur = Math.max(0, Math.min(idx, maxIdx));
    const w = getCardW() + 20;
    track.style.transform = \`translateX(-\${cur * w}px)\`;
    document.querySelectorAll('.sdot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  }

  window.slideMove = function(dir){ goTo(cur+dir); };

  // 카드 너비 동적 적용
  function resize(){
    perView = window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3;
    const w = getCardW();
    cards.forEach(c=>c.style.flex=\`0 0 \${w}px\`);
    goTo(cur);
  }
  resize();
  window.addEventListener('resize', resize);

  // 자동 슬라이드
  let auto = setInterval(()=>{ cur >= maxIdx ? goTo(0) : goTo(cur+1); }, 4000);
  track.parentElement.addEventListener('mouseenter',()=>clearInterval(auto));
  track.parentElement.addEventListener('mouseleave',()=>{ auto=setInterval(()=>{ cur>=maxIdx?goTo(0):goTo(cur+1); },4000); });

  // 터치 스와이프
  let sx=0;
  track.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  track.addEventListener('touchend',e=>{ const dx=sx-e.changedTouches[0].clientX; if(Math.abs(dx)>40) slideMove(dx>0?1:-1); },{passive:true});
})();`;
  const introBody = `<section class="hero">
  <div class="hero-dots"></div>
  <div class="hero-glow"></div>
  <div class="hero-inner">
    <div class="hero-badge"><b>학원소개</b> 올케어스터디 코칭센터</div>
    <h1 class="hero-title">검증된 학습코칭으로<br><em>성과를 만듭니다</em></h1>
    <p class="hero-desc">전국 200여 개 직영센터, 15년의 노하우.<br>올케어스터디가 검증한 학습코칭 시스템을 소개합니다.</p>
    <div class="hero-btns">
      <a href="/academy/all" class="btn-white">📍 센터 찾기</a>
      <a href="/contact" class="btn-outline">✉️ 무료 상담</a>
    </div>
  </div>
</section>

<div class="breadcrumb"><a href="/">홈</a> &nbsp;/&nbsp; <a href="/academy/all">학원수업</a> &nbsp;/&nbsp; <span>학원소개</span></div>

<!-- 통계 -->
<div class="stats-wrap">
  <div class="stats">
    <div class="stat"><div class="stat-num"><span id="cnt-1">0</span><sup>+</sup></div><div class="stat-label">전국 직영 코칭센터</div></div>
    <div class="stat"><div class="stat-num"><span id="cnt-2">0</span><sup>년+</sup></div><div class="stat-label">학습코칭 전문 노하우</div></div>
    <div class="stat"><div class="stat-num"><span id="cnt-3">0</span><sup>%</sup></div><div class="stat-label">학부모 재등록률</div></div>
  </div>
</div>

<!-- 학습법: 좌텍스트 + 우카드 -->
<section class="method-section">
  <div class="method-inner">
    <div>
      <div class="tag">개인별 최적 학습법</div>
      <h2 class="sec-title">개별 진단 기반의<br><em>맞춤형 학습 설계</em></h2>
      <p class="sec-desc">상위권 학생들의 공통점은 자신에게 맞는 학습 방법을 정확히 알고 있다는 것입니다.<br><br>올케어스터디는 <strong>개별 진단검사를 통해 학생의 학습 유형과 취약점을 분석</strong>하고, 데이터 기반의 최적 학습 방법을 설계합니다.</p>
      <p style="margin-top:14px;font-size:13px;color:#9CA3AF">* 세부 운영 방식은 센터마다 다를 수 있습니다.</p>
    </div>
    <div class="method-cards">
      <div class="method-card"><div class="mc-icon">🔍</div><div><div class="mc-title">학습 유형 진단</div><div class="mc-desc">시각형·청각형·읽기형 등 아이의 학습 스타일을 정밀 분석합니다.</div></div></div>
      <div class="method-card"><div class="mc-icon">📊</div><div><div class="mc-title">취약점 데이터 분석</div><div class="mc-desc">단원별·유형별 취약점을 파악하여 집중 보완 전략을 수립합니다.</div></div></div>
      <div class="method-card"><div class="mc-icon">✏️</div><div><div class="mc-title">맞춤 학습 루틴 설계</div><div class="mc-desc">분석 결과를 바탕으로 아이에게 최적화된 학습 일정을 설계합니다.</div></div></div>
      <div class="method-card"><div class="mc-icon">📈</div><div><div class="mc-title">주기적 성과 모니터링</div><div class="mc-desc">월별 학습 성취도를 점검하고 방향을 지속적으로 보완합니다.</div></div></div>
    </div>
  </div>
</section>

<!-- 차별화: 네이비 풀배경 -->
<section class="diff-section">
  <div class="diff-inner">
    <div class="diff-header">
      <div class="tag" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.7)">올케어스터디의 차별점</div>
      <h2 class="diff-title">일반 학원과는<br><em>근본적으로 다릅니다</em></h2>
      <p class="diff-desc">TLC 국가공인 자격을 취득한 전문 코치가<br>학습 습관 형성부터 성적 향상까지 체계적으로 관리합니다.</p>
    </div>
    <div class="diff-grid">
      <div class="diff-card"><div class="diff-num">POINT 01</div><div class="diff-card-title">1:1 전문 코칭 시스템</div><div class="diff-card-desc">과외식 수업 방식을 도입해 개별 맞춤 교재를 활용한 1:1 학습 코칭을 제공합니다. 단순 진도 관리가 아닌 완전한 이해를 목표로 합니다.</div></div>
      <div class="diff-card"><div class="diff-num">POINT 02</div><div class="diff-card-title">둥지형 참여 학습 구조</div><div class="diff-card-desc">교사를 중심으로 학생들이 둘러 앉는 둥지형 구조로 수업 참여도와 학습 몰입도를 실질적으로 향상시킵니다.</div></div>
      <div class="diff-card"><div class="diff-num">POINT 03</div><div class="diff-card-title">전방위 생활 밀착 관리</div><div class="diff-card-desc">성적은 물론 수행평가, 생활 습관, 심리적 상태까지 관리합니다. 학교생활과 학습이 선순환 구조를 이루도록 지원합니다.</div></div>
    </div>
  </div>
</section>

<!-- 학습목표: 회색 배경 3분할 -->
<section class="goal-section">
  <div class="goal-inner">
    <div class="goal-header">
      <div class="tag">학습목표</div>
      <h2 class="sec-title" style="text-align:center">올바른 학습 습관 형성으로<br><em>자기주도적 학습 역량을 완성</em>합니다</h2>
    </div>
    <div class="goal-cards">
      <div class="goal-card" data-num="01"><div class="goal-icon">🔍</div><div class="goal-card-title">나만의 공부 방법 완성</div><div class="goal-card-desc">학습 취약점 분석을 통한 최적 공부 스타일 완성</div></div>
      <div class="goal-card" data-num="02"><div class="goal-icon">📖</div><div class="goal-card-title">자기주도학습 능력 강화</div><div class="goal-card-desc">1:1 맞춤 코칭으로 학습동기와 지속성 강화</div></div>
      <div class="goal-card" data-num="03"><div class="goal-icon">🏆</div><div class="goal-card-title">학습 자신감 향상</div><div class="goal-card-desc">지속적 성취 경험을 통한 학습 자신감 및 도전 의식 고취</div></div>
    </div>
  </div>
</section>

<!-- 4C 프로세스: 좌텍스트 + 우다이어그램 -->
<section class="process-section">
  <div class="process-inner">
    <div class="process-header">
      <div class="tag">4C 프로세스</div>
      <h2 class="sec-title" style="text-align:center">관리가 되는 학원,<br><em>올케어스터디의 체계</em></h2>
    </div>
    <div class="process-layout">
      <div class="process-text">
        <p class="sec-desc">올케어스터디의 4C 프로세스는 <strong>학생 개개인의 학습 성향과 수준을 정밀 진단</strong>하여 최적화된 맞춤 학습을 설계하는 체계적인 관리 시스템입니다.</p>
        <ul>
          <li>주기적인 진단과 상담으로 학습 방향을 지속적으로 조정합니다</li>
          <li>학생 스스로 학습의 주도권을 갖고 성장할 수 있도록 체계적으로 관리합니다</li>
          <li>4단계가 순환되며 학습 완성도를 점진적으로 높여갑니다</li>
        </ul>
      </div>
      <div class="process-grid">
        <div class="pc pc-1"><div class="pc-en"><span>C</span>heck</div><div class="pc-kr">맞춤 진단</div></div>
        <div class="pc pc-2"><div class="pc-en"><span>C</span>urriculum</div><div class="pc-kr">맞춤 처방</div></div>
        <div class="pc pc-3"><div class="pc-en"><span>C</span>onsulting</div><div class="pc-kr">맞춤 상담</div></div>
        <div class="pc pc-4"><div class="pc-en"><span>C</span>oaching</div><div class="pc-kr">맞춤 지도</div></div>
        <div class="p-center">4C<br>프로세스</div>
      </div>
    </div>
  </div>
</section>

<!-- 3대 관리: 탭 전환 -->
<section class="manage-section">
  <div class="manage-inner">
    <div class="manage-header">
      <div class="tag">3대 관리 시스템</div>
      <h2 class="sec-title" style="text-align:center">성과를 만드는<br><em>올케어스터디의 체계적 관리</em></h2>
    </div>
    <div class="manage-tabs">
      <button class="mtab active" onclick="switchTab(0)">📋 플랜관리</button>
      <button class="mtab" onclick="switchTab(1)">✏️ 학습관리</button>
      <button class="mtab" onclick="switchTab(2)">💬 생활관리</button>
    </div>
    <div class="manage-panel active" id="tab-0">
      <div>
        <div class="mp-tag">계획 · 실행 · 점검</div>
        <div class="mp-title">플랜관리</div>
        <p class="mp-desc">단순히 공부를 독려하는 데 그치지 않습니다.<br><br>전담 코치가 학생과 함께 학습 목표를 설정하고 우선순위를 수립하여, <strong>학습 시간과 분량을 스스로 관리하는 역량</strong>을 체계적으로 길러줍니다.</p>
        <div class="mp-points">
          <div class="mp-point">주간 · 월간 학습 목표 공동 수립</div>
          <div class="mp-point">계획-실행-점검 반복 사이클 운영</div>
          <div class="mp-point">자기주도학습 핵심 역량 단계적 강화</div>
        </div>
      </div>
      <div>
        <div class="mp-img-grid" id="ms-plan">
          <button class="mp-img-nav prev" onclick="mslideMove('plan',-1)">&#8592;</button>
        <img class="mslide active" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/11.png" alt="img1">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/12.png" alt="img2">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/13.png" alt="img3">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/14.png" alt="img4">
          <button class="mp-img-nav next" onclick="mslideMove('plan',1)">&#8594;</button>
        </div>
        <div class="mp-img-dots" id="msd-plan">
        <button class="active" onclick="mslideGo('plan',0)"></button>
        <button class="" onclick="mslideGo('plan',1)"></button>
        <button class="" onclick="mslideGo('plan',2)"></button>
        <button class="" onclick="mslideGo('plan',3)"></button>
        </div>
      </div>
    </div>
    <div class="manage-panel" id="tab-1">
      <div>
        <div class="mp-tag">수준별 · 유형별 맞춤</div>
        <div class="mp-title">학습관리</div>
        <p class="mp-desc">학생의 현재 수준과 이해도에 정확히 맞춘 교재와 학습법을 적용합니다.<br><br><strong>기초부터 단계적으로 완성도 있게 지도</strong>하며, 취약 개념은 반복 학습을 통해 완전히 이해할 때까지 관리합니다.</p>
        <div class="mp-points">
          <div class="mp-point">개별 수준별 맞춤 교재 및 커리큘럼</div>
          <div class="mp-point">오답노트 · 백지노트 · 마인드맵 활용</div>
          <div class="mp-point">취약 개념 완전 이해까지 반복 관리</div>
        </div>
      </div>
      <div>
        <div class="mp-img-grid" id="ms-study">
          <button class="mp-img-nav prev" onclick="mslideMove('study',-1)">&#8592;</button>
        <img class="mslide active" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/21.png" alt="img1">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/22.png" alt="img2">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/23.png" alt="img3">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/24.png" alt="img4">
          <button class="mp-img-nav next" onclick="mslideMove('study',1)">&#8594;</button>
        </div>
        <div class="mp-img-dots" id="msd-study">
        <button class="active" onclick="mslideGo('study',0)"></button>
        <button class="" onclick="mslideGo('study',1)"></button>
        <button class="" onclick="mslideGo('study',2)"></button>
        <button class="" onclick="mslideGo('study',3)"></button>
        </div>
      </div>
    </div>
    <div class="manage-panel" id="tab-2">
      <div>
        <div class="mp-tag">학원 밖에서도 이어지는</div>
        <div class="mp-title">생활관리</div>
        <p class="mp-desc">학습 성과는 수업 시간만으로 완성되지 않습니다.<br><br><strong>학생과의 정기적 소통, 학부모와의 체계적 피드백</strong>을 통해 학습 습관, 생활 리듬, 심리적 상태까지 전방위로 관리합니다.</p>
        <div class="mp-points">
          <div class="mp-point">학생 일상 소통 및 심리 상태 모니터링</div>
          <div class="mp-point">학부모 정기 피드백 리포트 제공</div>
          <div class="mp-point">학교생활-학습 선순환 구조 지원</div>
        </div>
      </div>
      <div>
        <div class="mp-img-grid" id="ms-life">
          <button class="mp-img-nav prev" onclick="mslideMove('life',-1)">&#8592;</button>
        <img class="mslide active" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/31.png" alt="img1">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/32.png" alt="img2">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/33.png" alt="img3">
        <img class="mslide" src="https://raw.githubusercontent.com/dandylsk80/allcarestudy/main/images/34.png" alt="img4">
          <button class="mp-img-nav next" onclick="mslideMove('life',1)">&#8594;</button>
        </div>
        <div class="mp-img-dots" id="msd-life">
        <button class="active" onclick="mslideGo('life',0)"></button>
        <button class="" onclick="mslideGo('life',1)"></button>
        <button class="" onclick="mslideGo('life',2)"></button>
        <button class="" onclick="mslideGo('life',3)"></button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- AI 학습클래스 -->
<section class="ai-section">
  <div class="ai-stars"></div><div class="ai-glow1"></div><div class="ai-glow2"></div>
  <div class="ai-inner">
    <div class="ai-header">
      <div class="tag" style="background:rgba(255,255,255,.1);color:rgba(255,255,255,.7)">AI 학습클래스</div>
      <h2 class="ai-title"><span>AI</span> 학습클래스</h2>
      <p class="ai-sub">데이터 기반 정밀 학습 설계와 전문 코치의 1:1 지도.<br>AI와 교사의 듀얼 케어로 학습 효율을 극대화합니다.</p>
    </div>
    <div class="ai-cards">
      <div class="ai-card">
        <div class="ai-card-head"><div class="ai-card-icon">📐</div><div><div class="ai-card-name">AI 수학</div><div class="ai-card-range">대상: 초1~고3</div></div></div>
        <div class="ai-card-desc">성취도 기반 맞춤 문제·시험지 제작과 체계적 오답 클리닉을 통해 취약점을 신속히 보완하고 핵심 개념을 심화합니다.</div>
        <div class="ai-steps"><span class="ai-step">01 진단</span><span class="ai-step">02 분석</span><span class="ai-step">03 트레이닝</span></div>
      </div>
      <div class="ai-card">
        <div class="ai-card-head"><div class="ai-card-icon">🔤</div><div><div class="ai-card-name">AI 영어</div><div class="ai-card-range">대상: 초1~고3</div></div></div>
        <div class="ai-card-desc">레벨테스트 기반 영역별 정밀 진단으로 학생의 현재 수준을 파악하고, 맞춤 학습 설계를 통해 실질적인 영어 실력을 향상시킵니다.</div>
        <div class="ai-steps"><span class="ai-step">01 진단</span><span class="ai-step">02 분석</span><span class="ai-step">03 트레이닝</span></div>
      </div>
      <div class="ai-card">
        <div class="ai-card-head"><div class="ai-card-icon">📝</div><div><div class="ai-card-name">AI 국어</div><div class="ai-card-range">대상: 중1~고3</div></div></div>
        <div class="ai-card-desc">100만여 개 콘텐츠로 독서·문학·문법 전 영역을 커버하고, 학교별 기출 기반 실전 훈련으로 내신·수능 실력을 완성합니다.</div>
        <div class="ai-steps"><span class="ai-step">01 진단</span><span class="ai-step">02 분석</span><span class="ai-step">03 예측</span><span class="ai-step">04 트레이닝</span></div>
      </div>
    </div>
  </div>
</section>

<!-- 후기 -->
<section class="review-section">
  <div class="review-inner">
    <div class="review-header">
      <div class="tag">수강생 후기</div>
      <h2 class="sec-title" style="text-align:center">학생들이 직접 전하는<br><em>올케어스터디 이야기</em></h2>
    </div>
  </div>

  <!-- 슬라이더 -->
  <div class="slider-wrap">
    <button class="slider-btn slider-prev" onclick="slideMove(-1)">&#8592;</button>
    <div class="slider-viewport" id="sliderViewport">
      <div class="slider-track" id="sliderTrack">

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-h">고1</span><span class="rb rb-s">국어</span></div>
          <div class="review-title">[글로리드 은평점] 서O윤</div>
          <div class="review-text">처음 국어 공부를 시작할 때는 현대시가 너무 어려웠지만 선생님의 체계적인 지도와 밀착 코칭으로 극복할 수 있었습니다. 학습 동기와 진로 방향까지 함께 잡아 준 수업이 지금의 성적 향상에 큰 힘이 되었습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-m">중3</span><span class="rb rb-s">국어</span></div>
          <div class="review-title">[반월당점] 변O정</div>
          <div class="review-text">올케어스터디를 다니며 스스로 계획을 세우고 실천하는 습관이 생겼고, 부족한 과목에 대한 자신감도 생겼어요. 선생님과의 1:1 소통을 통해 공부에 대한 태도가 달라지고, 자존감과 목표의식이 높아졌습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-h">고3</span><span class="rb rb-s">수학</span></div>
          <div class="review-title">[동탄호수점] 김O서</div>
          <div class="review-text">평일 정규 수업뿐 아니라 주말 개별 수업, 코칭 시간, 시험 기간 자습 시간 등 부족한 부분을 보충할 수 있는 환경을 제공해 주는 게 정말 좋습니다. 학생 개개인을 진심으로 살펴주는 곳입니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-m">중2</span><span class="rb rb-s">수학</span></div>
          <div class="review-title">[수지점] 이O준</div>
          <div class="review-text">수학을 포기하려 했는데 선생님이 기초부터 차근차근 잡아주셨어요. 단원별로 약점을 짚어주고 오답 노트 작성하는 방법까지 알려주셔서 이번 중간고사에서 20점이나 올랐습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-e">초6</span><span class="rb rb-s">영어</span></div>
          <div class="review-title">[고양일산점] 박O연 학부모</div>
          <div class="review-text">아이가 영어에 흥미가 없었는데 수준에 맞는 교재로 시작하니 거부감 없이 잘 따라가더라고요. 선생님과 매주 소통해 주셔서 부모로서 안심이 많이 됐습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-h">고2</span><span class="rb rb-s">국어·영어</span></div>
          <div class="review-title">[성북점] 최O현</div>
          <div class="review-text">혼자 공부하면 계획만 세우다 끝났는데, 코치 선생님이 옆에서 같이 체크해 주니까 실제로 실행이 됩니다. 수행평가 준비도 학원에서 같이 도와주셔서 내신 관리가 훨씬 수월해졌어요.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-m">중1</span><span class="rb rb-s">수학</span></div>
          <div class="review-title">[남양주점] 정O아 학부모</div>
          <div class="review-text">중학교 올라가면서 수학이 갑자기 어려워졌는데, 선생님이 개념부터 다시 잡아주셨어요. 학원 다녀온 날은 아이가 표정이 달라요. 스스로 문제집 펴는 횟수가 눈에 띄게 늘었습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-h">고1</span><span class="rb rb-s">수학·과학</span></div>
          <div class="review-title">[부천점] 윤O빈</div>
          <div class="review-text">고등학교 올라와서 처음엔 정말 막막했는데, 선생님이 공부 방법 자체를 바꿔 주셨어요. 어떻게 개념을 정리하고 문제에 적용하는지 체계가 생겼고, 첫 시험에서 기대 이상의 결과가 나왔습니다.</div>
        </div>

        <div class="review-card">
          <div class="review-quotes">"</div>
          <div class="review-badges"><span class="rb rb-m">중3</span><span class="rb rb-s">영어</span></div>
          <div class="review-title">[대구달서점] 김O린</div>
          <div class="review-text">내신 영어는 학교 시험에 딱 맞춰서 준비해 주시고, AI 영어로 부족한 어휘랑 독해도 같이 잡을 수 있어서 좋았어요. 한 곳에서 두 가지를 다 해결하는 느낌이라 효율적이었습니다.</div>
        </div>

      </div>
    </div>
    <button class="slider-btn slider-next" onclick="slideMove(1)">&#8594;</button>
  </div>

  <!-- 도트 -->
  <div class="slider-dots" id="sliderDots"></div>
</section>

<!-- CTA -->
<section class="cta-section">
  <h2 class="cta-title">지금 바로 가까운 센터에서<br>무료 상담을 받아보세요</h2>
  <p class="cta-sub">전국 200여 개 직영센터에서 전문 코치와 1:1 학습 상담을 진행합니다.</p>
  <div class="cta-btns">
    <a href="/academy/all" class="btn-white">📍 센터 찾기</a>
    <a href="/contact" class="btn-outline">✉️ 온라인 문의</a>
  </div>
</section>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>학원소개 | 올케어스터디</title>
<style>${introStyle}</style>
</head>
<body>
${introBody}
<script>${introScript}<\/script>
</body>
</html>`;
}



function makeAcademyPage() {
  const SIDO_ORDER = ['서울','경기','인천','대전','세종','대구','광주','울산','부산','충북','충남','경북','경남','전북','강원','제주'];

  const body = `
  <div style="max-width:1100px;margin:0 auto;padding:160px 48px 80px">
    <div style="margin-bottom:8px;font-size:13px;color:#9CA3AF"><a href="/" style="color:#9CA3AF;text-decoration:none">홈</a> › <span>학원 찾기</span></div>
    <h1 style="font-size:32px;font-weight:900;color:#0F2044;margin-bottom:6px">코칭센터 찾기</h1>
    <p style="font-size:15px;color:#6B7280;margin-bottom:24px">총 <strong style="color:#1D4ED8" id="total-count">${CENTERS.length}개</strong> 센터</p>

    <!-- 시도 탭 -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #E5E7EB" id="sido-tabs"></div>

    <!-- 구/시 서브탭 -->
    <div id="district-bar" style="display:none;flex-wrap:wrap;gap:6px;margin-bottom:24px;padding:14px 16px;background:white;border-radius:12px;border:1px solid #E5E7EB"></div>

    <!-- 카드 그리드 -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch" id="card-grid"></div>
  </div>

  <!-- 문의 모달 -->
  <div id="contact-modal-bg" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center" onclick="if(event.target===this)closeContactModal()">
    <div style="background:white;border-radius:20px;padding:32px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;margin:16px">
      <div style="font-size:20px;font-weight:900;color:#0F2044;margin-bottom:4px">✉️ 문의하기</div>
      <div id="modal-center-info" style="font-size:13px;color:#3B82F6;font-weight:700;margin-bottom:20px"></div>
      <div id="modal-success" style="display:none;text-align:center;padding:32px 0">
        <div style="font-size:48px;margin-bottom:12px">✅</div>
        <div style="font-size:18px;font-weight:900;color:#0F2044;margin-bottom:6px">문의가 접수되었습니다!</div>
        <div style="font-size:14px;color:#6B7280">빠른 시일 내에 연락드리겠습니다.</div>
      </div>
      <div id="modal-form">
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">이름 <span style="color:#EF4444">*</span></label>
        <input id="m-name" type="text" placeholder="홍길동" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;margin-bottom:16px;font-family:inherit" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">학년 / 나이 <span style="color:#EF4444">*</span></label>
        <select id="m-grade" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;background:white;font-family:inherit;color:#374151;margin-bottom:16px" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
          <option value="">선택해주세요</option>
          <optgroup label="초등학생"><option>초등 1학년</option><option>초등 2학년</option><option>초등 3학년</option><option>초등 4학년</option><option>초등 5학년</option><option>초등 6학년</option></optgroup>
          <optgroup label="중학생"><option>중학 1학년</option><option>중학 2학년</option><option>중학 3학년</option></optgroup>
          <optgroup label="고등학생"><option>고등 1학년</option><option>고등 2학년</option><option>고등 3학년</option></optgroup>
        </select>
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">관심 센터</label>
        <input id="m-center" type="text" readonly placeholder="" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;margin-bottom:16px;font-family:inherit;background:#F8FAFC;color:#1D4ED8;font-weight:700">
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">연락처 <span style="color:#EF4444">*</span></label>
        <input id="m-phone" type="tel" placeholder="010-0000-0000" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;margin-bottom:16px;font-family:inherit" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">거주 주소 <span style="color:#EF4444">*</span></label>
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <input id="m-addr-road" type="text" placeholder="도로명 주소 (검색 또는 직접 입력)" style="flex:1;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;font-family:inherit" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
          <button type="button" onclick="searchAddress()" style="padding:11px 14px;background:#1D4ED8;color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0">🔍 검색</button>
        </div>
        <input id="m-addr-detail" type="text" placeholder="상세 주소 (예: 101동 502호)" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;margin-bottom:16px;font-family:inherit" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
        <label style="display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">문의 내용</label>
        <textarea id="m-message" rows="4" style="width:100%;box-sizing:border-box;padding:11px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;outline:none;resize:vertical;margin-bottom:16px;font-family:inherit;line-height:1.6" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'"></textarea>
        <div style="background:#F8FAFC;border:1.5px solid #E5E7EB;border-radius:12px;padding:14px 16px;margin-bottom:16px">
          <div style="font-size:12px;color:#6B7280;line-height:1.7;margin-bottom:10px"><strong>수집 항목:</strong> 이름, 학년/나이, 연락처, 거주주소, 문의내용<br><strong>수집 목적:</strong> 학습 상담 및 센터 안내<br><strong>보유 기간:</strong> 상담 완료 후 1년</div>
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" id="m-agree" style="width:16px;height:16px;accent-color:#1D4ED8;flex-shrink:0">
            <span style="font-size:13px;font-weight:700;color:#0F2044">개인정보 수집 및 이용에 동의합니다 <span style="color:#EF4444">*</span></span>
          </label>
        </div>
        <div id="m-error" style="display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:13px;color:#DC2626;margin-bottom:12px"></div>
        <div style="display:flex;gap:10px">
          <button onclick="closeContactModal()" style="flex:1;padding:13px;border-radius:10px;border:1.5px solid #E5E7EB;background:white;font-size:14px;font-weight:700;cursor:pointer;color:#6B7280;font-family:inherit">취소</button>
          <button onclick="submitModalContact()" style="flex:2;padding:13px;border-radius:10px;border:none;background:#1D4ED8;color:white;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit">✉️ 문의 제출하기</button>
        </div>
      </div>
    </div>
  </div>

  <script>
  const CENTERS = ${JSON.stringify(CENTERS)};
  const SIDO_ORDER = ${JSON.stringify(SIDO_ORDER)};
  let currentSido = null;
  let currentDistrict = '전체';

  const existingSido = new Set(CENTERS.map(c => c.sido));
  const sidoList = SIDO_ORDER.filter(s => existingSido.has(s));
  const sidoCounts = {};
  CENTERS.forEach(c => { sidoCounts[c.sido] = (sidoCounts[c.sido]||0)+1; });

  function getDistricts(sido) {
    const map = {};
    CENTERS.filter(c => c.sido===sido).forEach(c => { map[c.district]=(map[c.district]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  }

  function renderSidoTabs() {
    const el = document.getElementById('sido-tabs');
    const allActive = currentSido === null;
    let html = \`<button onclick="selectSido(null)" style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;border:1.5px solid \${allActive?'#1D4ED8':'#E5E7EB'};\${allActive?'background:#1D4ED8;color:white;':'background:white;color:#374151;'}">전체 <span style="font-size:11px;opacity:0.7">\${CENTERS.length}</span></button>\`;
    sidoList.forEach(s => {
      const active = s === currentSido;
      html += \`<button onclick="selectSido('\${s}')" style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;border:1.5px solid \${active?'#1D4ED8':'#E5E7EB'};\${active?'background:#1D4ED8;color:white;':'background:white;color:#374151;'}">\${s} <span style="font-size:11px;opacity:0.7">\${sidoCounts[s]}</span></button>\`;
    });
    el.innerHTML = html;
  }

  function renderDistrictBar() {
    const bar = document.getElementById('district-bar');
    if (!currentSido) { bar.style.display='none'; return; }
    const districts = getDistricts(currentSido);
    if (districts.length <= 1) { bar.style.display='none'; return; }
    const total = sidoCounts[currentSido];
    let html = \`<button onclick="selectDistrict('전체')" style="padding:5px 14px;border-radius:999px;font-size:12px;font-weight:\${currentDistrict==='전체'?'800':'600'};cursor:pointer;white-space:nowrap;border:1.5px solid \${currentDistrict==='전체'?'#93C5FD':'#E5E7EB'};\${currentDistrict==='전체'?'background:#EFF6FF;color:#1D4ED8;':'background:white;color:#374151;'}">전체 (\${total})</button>\`;
    districts.forEach(([d,cnt]) => {
      const active = d===currentDistrict;
      html += \`<button onclick="selectDistrict('\${d}')" style="padding:5px 14px;border-radius:999px;font-size:12px;font-weight:\${active?'800':'600'};cursor:pointer;white-space:nowrap;border:1.5px solid \${active?'#93C5FD':'#E5E7EB'};\${active?'background:#EFF6FF;color:#1D4ED8;':'background:white;color:#374151;'}">\${d} (\${cnt})</button>\`;
    });
    bar.style.display='flex';
    bar.innerHTML = html;
  }

  function renderCards() {
    const filtered = CENTERS.filter(c =>
      (currentSido===null || c.sido===currentSido) &&
      (currentDistrict==='전체' || c.district===currentDistrict)
    );
    document.getElementById('total-count').textContent = filtered.length+'개';
    document.getElementById('card-grid').innerHTML = filtered.length ? filtered.map((c,i) => {
      const uid = (currentSido||'all')+(currentDistrict||'')+i;
      const cname = (c.officialName||c.name).replace(/'/g,"\\\\'");
      const dirHtml = c.directions
        ? \`<div id="d\${uid}" style="display:none;font-size:11px;color:#374151;line-height:1.6;background:#F8FAFC;border-radius:8px;padding:8px 10px;margin-top:6px;white-space:pre-line">\${c.directions.replace(/</g,'&lt;')}</div><button id="b\${uid}" onclick="var d=document.getElementById('d\${uid}');var b=document.getElementById('b\${uid}');if(d.style.display==='none'){d.style.display='block';b.textContent='📍 위치안내 접기'}else{d.style.display='none';b.textContent='📍 위치안내 보기'}" style="margin-top:4px;background:none;border:none;color:#3B82F6;font-size:11px;font-weight:700;cursor:pointer;padding:0">📍 위치안내 보기</button>\`
        : '';
      return \`<div style="background:white;border:1.5px solid #E5E7EB;border-radius:16px;padding:20px 22px;display:flex;flex-direction:column;transition:box-shadow .2s,border-color .2s" onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.10)';this.style.borderColor='#93C5FD'" onmouseout="this.style.boxShadow='none';this.style.borderColor='#E5E7EB'">
        <div style="margin-bottom:10px">
          <div style="font-size:11px;font-weight:700;color:#3B82F6;margin-bottom:3px">\${c.sido} \${c.district}</div>
          <div style="font-size:16px;font-weight:900;color:#0F2044;line-height:1.3">\${c.officialName||c.name}</div>
          \${c.regNo?'<div style="font-size:10px;color:#9CA3AF;margin-top:2px">'+c.regNo+'</div>':''}
        </div>
        <div style="font-size:11px;color:#6B7280;line-height:1.5;display:flex;gap:5px;align-items:flex-start;margin-bottom:6px"><span style="flex-shrink:0">📍</span><span>\${c.address}</span></div>
        \${dirHtml}
        <div style="margin-top:auto;padding-top:12px;border-top:1px solid #F1F5F9;display:flex;flex-direction:column;gap:6px">
          \${c.target_elem?'<div style="display:flex;gap:6px;align-items:flex-start"><span style="flex-shrink:0;white-space:nowrap;background:#FEF3C7;color:#D97706;padding:2px 7px;border-radius:4px;font-weight:700;font-size:11px">초등</span><span style="font-size:12px;color:#374151;line-height:1.5">'+c.target_elem+'</span></div>':''}
          \${c.target_mid?'<div style="display:flex;gap:6px;align-items:flex-start"><span style="flex-shrink:0;white-space:nowrap;background:#DCFCE7;color:#16A34A;padding:2px 7px;border-radius:4px;font-weight:700;font-size:11px">중등</span><span style="font-size:12px;color:#374151;line-height:1.5">'+c.target_mid+'</span></div>':''}
          \${c.target_high?'<div style="display:flex;gap:6px;align-items:flex-start"><span style="flex-shrink:0;white-space:nowrap;background:#EFF6FF;color:#2563EB;padding:2px 7px;border-radius:4px;font-weight:700;font-size:11px">고등</span><span style="font-size:12px;color:#374151;line-height:1.5">'+c.target_high+'</span></div>':''}
          \${!c.target_elem&&!c.target_mid&&!c.target_high?'<div style="font-size:11px;color:#D1D5DB">대상학교 정보 없음</div>':''}
        </div>
        <button onclick="location.href='/contact?center='+encodeURIComponent('\${cname}')" style="display:block;width:100%;text-align:center;background:#1D4ED8;color:white;padding:11px;border-radius:10px;font-size:13px;font-weight:700;margin-top:14px;border:none;cursor:pointer;font-family:inherit">✉️ 문의하기</button>
      </div>\`;
    }).join('') : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#9CA3AF">해당 지역 센터가 없습니다</div>';
  }

  function selectSido(sido) {
    currentSido = sido;
    currentDistrict = '전체';
    renderSidoTabs();
    renderDistrictBar();
    renderCards();
  }
  function selectDistrict(d) {
    currentDistrict = d;
    renderDistrictBar();
    renderCards();
  }

  function openContactModal(sido, district, name) {
    document.getElementById('modal-center-info').textContent = sido+' '+district+' · '+name;
    document.getElementById('m-center').value = name;
    document.getElementById('m-message').value = '';
    document.getElementById('modal-success').style.display='none';
    document.getElementById('modal-form').style.display='block';
    document.getElementById('m-error').style.display='none';
    document.getElementById('contact-modal-bg').style.display='flex';
    document.getElementById('m-name').focus();
  }
  function closeContactModal() {
    document.getElementById('contact-modal-bg').style.display='none';
  }
  function searchAddress() {
    function open() {
      new daum.Postcode({ oncomplete: function(data) {
        document.getElementById('m-addr-road').value = data.roadAddress||data.jibunAddress;
        document.getElementById('m-addr-detail').focus();
      }}).open();
    }
    if (typeof daum!=='undefined'&&daum.Postcode) { open(); }
    else { var s=document.createElement('script'); s.src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; s.onload=open; document.head.appendChild(s); }
  }
  function submitModalContact() {
    var name=document.getElementById('m-name').value.trim();
    var grade=document.getElementById('m-grade').value;
    var phone=document.getElementById('m-phone').value.trim();
    var road=document.getElementById('m-addr-road').value.trim();
    var detail=document.getElementById('m-addr-detail').value.trim();
    var message=document.getElementById('m-message').value.trim();
    var agree=document.getElementById('m-agree').checked;
    if (!name)    { showMErr('이름을 입력해주세요.'); return; }
    if (!grade)   { showMErr('학년/나이를 선택해주세요.'); return; }
    if (!phone)   { showMErr('연락처를 입력해주세요.'); return; }
    if (!road)    { showMErr('거주 주소를 입력해주세요.'); return; }
    if (!agree)   { showMErr('개인정보 수집 및 이용에 동의해주세요.'); return; }
    fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,grade,phone,address:road+(detail?' '+detail:''),message})})
    .then(r=>r.json()).then(data=>{
      if(data.ok){document.getElementById('modal-form').style.display='none';document.getElementById('modal-success').style.display='block';}
      else showMErr('전송 중 오류가 발생했습니다.');
    }).catch(()=>showMErr('네트워크 오류가 발생했습니다.'));
  }
  function showMErr(msg){var el=document.getElementById('m-error');el.textContent='⚠️ '+msg;el.style.display='block';}

  // 초기 렌더
  renderSidoTabs();
  renderDistrictBar();
  renderCards();
  <\/script>`;

  return wrap('코칭센터 찾기 | 올케어스터디', '전국 올케어스터디 코칭센터를 찾아보세요. 초중고 맞춤 1:1 학습코칭.', '/academy/all', body);
}


function makeContactPage() {
  const body = `
  <style>
  .cf-page{max-width:1100px;margin:0 auto;padding:180px 24px 0;display:grid;grid-template-columns:1fr 420px;gap:48px;align-items:start}
  .info-badge2{display:inline-flex;align-items:center;gap:8px;background:#DBEAFE;color:#1D4ED8;font-size:12px;font-weight:800;padding:5px 14px;border-radius:999px;margin-bottom:16px}
  .cf-info-title{font-size:38px;font-weight:900;color:#0F2044;line-height:1.2;margin-bottom:14px;letter-spacing:-1px}
  .cf-info-title em{color:#1D4ED8;font-style:normal}
  .cf-info-sub{font-size:15px;color:#6B7280;line-height:1.8;margin-bottom:40px}
  .cf-contact-cards{display:flex;flex-direction:column;gap:14px;margin-bottom:40px}
  .cf-contact-card{background:white;border:1px solid #E5E7EB;border-radius:16px;padding:20px 24px;display:flex;align-items:center;gap:16px;transition:.2s}
  .cf-contact-card:hover{border-color:#93C5FD;box-shadow:0 4px 20px rgba(29,78,216,.08)}
  .ccc-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .ccc-blue{background:#EFF6FF}.ccc-green{background:#F0FDF4}.ccc-orange{background:#FFF7ED}
  .ccc-label{font-size:12px;color:#9CA3AF;margin-bottom:3px;font-weight:600}
  .ccc-value{font-size:16px;font-weight:800;color:#0F2044}
  .ccc-desc{font-size:12px;color:#6B7280;margin-top:2px}
  .cf-proc-title{font-size:15px;font-weight:800;color:#0F2044;margin-bottom:16px}
  .cf-steps{display:flex;flex-direction:column;gap:0}
  .cf-step{display:flex;gap:14px;align-items:flex-start;position:relative}
  .cf-step:not(:last-child)::after{content:'';position:absolute;left:15px;top:34px;width:2px;height:calc(100% - 10px);background:#E5E7EB}
  .cf-step-num{width:32px;height:32px;border-radius:50%;background:#0F2044;color:white;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1}
  .cf-step-body{padding-bottom:24px}
  .cf-step-t{font-size:14px;font-weight:800;color:#0F2044;margin-bottom:3px}
  .cf-step-d{font-size:13px;color:#6B7280;line-height:1.6}
  .cf-form-card{background:white;border-radius:24px;padding:40px 36px;box-shadow:0 8px 48px rgba(15,32,68,.10),0 2px 8px rgba(0,0,0,.04)}
  .cf-form-title{font-size:22px;font-weight:900;color:#0F2044;margin-bottom:4px}
  .cf-form-sub{font-size:13px;color:#9CA3AF;margin-bottom:24px}
  .cf-field{margin-bottom:18px}
  .cf-field label{display:block;font-size:13px;font-weight:700;color:#374151;margin-bottom:7px}
  .cf-input{width:100%;padding:13px 16px;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;background:white;color:#1F2937;box-sizing:border-box}
  .cf-input:focus{border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
  .cf-field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .cf-addr-row{display:flex;gap:8px;margin-bottom:8px}
  .cf-addr-row .cf-input{flex:1}
  .cf-search-btn{padding:13px 16px;background:#0F2044;color:white;border:none;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:.2s}
  .cf-search-btn:hover{background:#1D4ED8}
  .cf-chips{display:flex;flex-wrap:wrap;gap:8px}
  .cf-chip{padding:8px 14px;border:1.5px solid #E5E7EB;border-radius:999px;font-size:13px;font-weight:600;color:#6B7280;cursor:pointer;transition:.2s;background:white;user-select:none}
  .cf-chip:hover{border-color:#93C5FD;color:#1D4ED8}
  .cf-chip.active{background:#EFF6FF;border-color:#3B82F6;color:#1D4ED8;font-weight:800}
  .cf-agree-box{background:#F8FAFC;border:1.5px solid #E5E7EB;border-radius:14px;padding:16px 18px;margin-bottom:20px}
  .cf-agree-title{font-size:12px;font-weight:800;color:#374151;margin-bottom:8px}
  .cf-agree-content{font-size:11px;color:#9CA3AF;line-height:1.7;margin-bottom:12px}
  .cf-agree-check{display:flex;align-items:center;gap:10px;cursor:pointer}
  .cf-agree-check input{width:16px;height:16px;accent-color:#1D4ED8;flex-shrink:0}
  .cf-agree-check span{font-size:13px;font-weight:700;color:#0F2044}
  .cf-error-msg{display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:10px 14px;font-size:13px;color:#DC2626;margin-bottom:14px}
  .cf-submit-btn{width:100%;padding:16px;background:linear-gradient(135deg,#0F2044,#1D4ED8);color:white;border:none;border-radius:14px;font-size:16px;font-weight:900;cursor:pointer;transition:.2s;font-family:inherit;letter-spacing:.5px;box-shadow:0 4px 16px rgba(29,78,216,.3)}
  .cf-submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(29,78,216,.4)}
  @media(max-width:900px){.cf-page{grid-template-columns:1fr;padding:160px 16px 60px}.cf-field-row{grid-template-columns:1fr}.cf-form-card{padding:28px 20px}}
  </style>

  <div style="background:#F0F4FF;padding-bottom:80px">
  <div class="cf-page">
    <div>
      <div class="info-badge2">✉️ 문의하기</div>
      <h1 class="cf-info-title">궁금한 점을<br><em>편하게 남겨주세요</em></h1>
      <p class="cf-info-sub">올케어스터디 전문 상담사가<br>빠른 시일 내에 연락드리겠습니다.</p>
      <div class="cf-contact-cards">
        <div class="cf-contact-card"><div class="ccc-icon ccc-blue">📞</div><div><div class="ccc-label">전화 상담</div><div class="ccc-value">010-6834-8080</div></div></div>
        <div class="cf-contact-card" id="cf-card-center2"><div class="ccc-icon ccc-green">📍</div><div><div class="ccc-label">센터 방문 상담</div><div class="ccc-value">전국 200여 개 직영센터</div><div class="ccc-desc">가까운 센터를 찾아보세요</div></div></div>
        <div class="cf-contact-card"><div class="ccc-icon ccc-orange">⏱️</div><div><div class="ccc-label">평균 응답 시간</div><div class="ccc-value">30분 이내</div></div></div>
      </div>
      <div class="cf-proc-title">📋 상담 진행 순서</div>
      <div class="cf-steps">
        <div class="cf-step"><div class="cf-step-num">1</div><div class="cf-step-body"><div class="cf-step-t">문의 접수</div><div class="cf-step-d">양식 작성 후 제출하시면 즉시 접수됩니다</div></div></div>
        <div class="cf-step"><div class="cf-step-num">2</div><div class="cf-step-body"><div class="cf-step-t">담당자 배정</div><div class="cf-step-d" id="cf-step2-desc2">교육컨설턴트가 배정됩니다</div></div></div>
        <div class="cf-step"><div class="cf-step-num">3</div><div class="cf-step-body"><div class="cf-step-t">1:1 맞춤 상담</div><div class="cf-step-d">학생 상황에 맞는 학습 방향을 안내드립니다</div></div></div>
        <div class="cf-step"><div class="cf-step-num">4</div><div class="cf-step-body"><div class="cf-step-t" id="cf-step4-text2">센터 등록</div><div class="cf-step-d" id="cf-step4-desc2">원하시면 가까운 센터 등록으로 연결됩니다</div></div></div>
      </div>
    </div>

    <div class="cf-form-card">
      <div id="contact-success" style="display:none;text-align:center;padding:40px 0">
        <div style="font-size:64px;margin-bottom:16px">✅</div>
        <div style="font-size:22px;font-weight:900;color:#0F2044;margin-bottom:8px">문의가 접수되었습니다!</div>
        <div style="font-size:14px;color:#6B7280;margin-bottom:24px;line-height:1.7">담당자가 확인 후<br>빠른 시일 내에 연락드리겠습니다.</div>
        <a href="/" style="display:inline-block;background:#0F2044;color:white;padding:13px 28px;border-radius:12px;font-weight:700;text-decoration:none;font-size:14px">홈으로 돌아가기</a>
      </div>
      <div id="contact-form">
        <div class="cf-form-title">📝 상담 신청서</div>
        <div class="cf-form-sub">* 표시 항목은 필수입니다</div>
        <div style="display:flex;border:1.5px solid #E5E7EB;border-radius:12px;overflow:hidden;margin-bottom:24px">
          <button id="tab-academy" onclick="cfSwitchType('academy')" style="flex:1;padding:13px;font-size:14px;font-weight:800;cursor:pointer;border:none;background:#0F2044;color:white;font-family:inherit">🏫 학원 상담</button>
          <button id="tab-tutoring" onclick="cfSwitchType('tutoring')" style="flex:1;padding:13px;font-size:14px;font-weight:700;cursor:pointer;border:none;background:white;color:#6B7280;font-family:inherit">👨‍🏫 과외 상담</button>
        </div>
        <div class="cf-field-row">
          <div class="cf-field"><label>이름 <span style="color:#EF4444">*</span></label><input id="cf-name" type="text" placeholder="홍길동" class="cf-input" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'"></div>
          <div class="cf-field"><label>연락처 <span style="color:#EF4444">*</span></label><input id="cf-phone" type="tel" placeholder="010-0000-0000" class="cf-input" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'"></div>
        </div>
        <div class="cf-field">
          <label>학년 / 나이 <span style="color:#EF4444">*</span></label>
          <div class="cf-chips">
            <div class="cf-chip" onclick="cfSelectGrade(this,'초등 1학년')">초1</div><div class="cf-chip" onclick="cfSelectGrade(this,'초등 2학년')">초2</div><div class="cf-chip" onclick="cfSelectGrade(this,'초등 3학년')">초3</div><div class="cf-chip" onclick="cfSelectGrade(this,'초등 4학년')">초4</div><div class="cf-chip" onclick="cfSelectGrade(this,'초등 5학년')">초5</div><div class="cf-chip" onclick="cfSelectGrade(this,'초등 6학년')">초6</div>
            <div class="cf-chip" onclick="cfSelectGrade(this,'중학 1학년')">중1</div><div class="cf-chip" onclick="cfSelectGrade(this,'중학 2학년')">중2</div><div class="cf-chip" onclick="cfSelectGrade(this,'중학 3학년')">중3</div>
            <div class="cf-chip" onclick="cfSelectGrade(this,'고등 1학년')">고1</div><div class="cf-chip" onclick="cfSelectGrade(this,'고등 2학년')">고2</div><div class="cf-chip" onclick="cfSelectGrade(this,'고등 3학년')">고3</div>
            <div class="cf-chip" id="cf-chip-adult2" onclick="cfSelectGrade(this,'성인')" style="display:none">성인</div>
          </div>
          <input type="hidden" id="cf-grade">
        </div>
        <div class="cf-field">
          <label>거주 주소 <span style="color:#EF4444">*</span></label>
          <div class="cf-addr-row"><input id="cf-sido" type="text" placeholder="도로명 주소 (검색 또는 직접 입력)" class="cf-input" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'"><button class="cf-search-btn" onclick="searchContactAddress()">🔍 검색</button></div>
          <input id="cf-address" type="text" placeholder="상세 주소 (예: 101동 502호)" class="cf-input" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
        </div>
        <div id="cf-fields-academy">
          <div class="cf-field">
            <label>관심 센터 이름</label><input id="cf-center" type="text" placeholder="예: 수지점" class="cf-input" onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
          </div>
          <div class="cf-field">
            <label>원하는 수업 과목</label>
            <div class="cf-chips"><div class="cf-chip" onclick="this.classList.toggle('active')">수학</div><div class="cf-chip" onclick="this.classList.toggle('active')">영어</div><div class="cf-chip" onclick="this.classList.toggle('active')">국어</div><div class="cf-chip" onclick="this.classList.toggle('active')">과학</div><div class="cf-chip" onclick="this.classList.toggle('active')">사회</div><div class="cf-chip" onclick="this.classList.toggle('active')">전과목</div></div>
          </div>
        </div>
        <div id="cf-fields-tutoring" style="display:none">
          <div class="cf-field-row">
            <div class="cf-field"><label>희망 과목</label><select id="cf-subject" class="cf-input"><option value="">선택해주세요</option><option>수학</option><option>영어</option><option>국어</option><option>과학</option><option>사회</option><option>전과목</option></select></div>
            <div class="cf-field"><label>수업 방식</label><select id="cf-method" class="cf-input"><option value="">선택해주세요</option><option>대면 (오프라인)</option><option>온라인</option><option>상관없음</option></select></div>
          </div>
          <div class="cf-field-row">
            <div class="cf-field"><label>선생님 성별 선호</label><select id="cf-gender" class="cf-input"><option value="">상관없음</option><option>남자 선생님</option><option>여자 선생님</option></select></div>
            <div class="cf-field"><label>주당 희망 수업 횟수</label><select id="cf-times" class="cf-input"><option value="">선택해주세요</option><option>주 1회</option><option>주 2회</option><option>주 3회</option><option>주 4회 이상</option></select></div>
          </div>
        </div>
        <div class="cf-field">
          <label>문의 내용</label>
          <textarea id="cf-message" rows="4" class="cf-input" placeholder="센터 위치, 수업 방식, 등록 절차 등 궁금한 점을 적어주세요." onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'"></textarea>
        </div>
        <div class="cf-agree-box">
          <div class="cf-agree-title">🔒 개인정보 수집 및 이용 동의</div>
          <div class="cf-agree-content"><strong>수집 항목:</strong> 이름, 학년/나이, 연락처, 거주 주소, 문의내용<br><strong>수집 목적:</strong> 학습 상담 및 센터 안내 서비스 제공<br><strong>보유 기간:</strong> 상담 완료 후 1년</div>
          <label class="cf-agree-check"><input type="checkbox" id="cf-agree"><span>개인정보 수집 및 이용에 동의합니다 <span style="color:#EF4444">*</span></span></label>
        </div>
        <div class="cf-error-msg" id="cf-error"></div>
        <button class="cf-submit-btn" id="cf-submit" onclick="submitContact()">✉️ 문의 제출하기</button>
      </div>
    </div>
  </div>
  </div>

  <script>
  function cfSwitchType(type) {
    document.getElementById('cf-fields-academy').style.display = type==='academy'?'block':'none';
    document.getElementById('cf-fields-tutoring').style.display = type==='tutoring'?'block':'none';
    var ta=document.getElementById('tab-academy'), tt=document.getElementById('tab-tutoring');
    ta.style.background=type==='academy'?'#0F2044':'white'; ta.style.color=type==='academy'?'white':'#6B7280'; ta.style.fontWeight=type==='academy'?'800':'700';
    tt.style.background=type==='tutoring'?'#0F2044':'white'; tt.style.color=type==='tutoring'?'white':'#6B7280'; tt.style.fontWeight=type==='tutoring'?'800':'700';
    document.getElementById('cf-message').placeholder = type==='academy'
      ? '센터 위치, 수업 방식, 등록 절차 등 궁금한 점을 적어주세요.'
      : '원하시는 과외 방향, 학습 목표 등을 자유롭게 적어주세요.';
    var adultChip = document.getElementById('cf-chip-adult2');
    if(adultChip) adultChip.style.display = type==='tutoring' ? 'inline-block' : 'none';
    var step4 = document.getElementById('cf-step4-text2');
    if(step4) step4.textContent = type==='academy' ? '센터 등록' : '교사 배정';
    var step4d = document.getElementById('cf-step4-desc2');
    if(step4d) step4d.textContent = type==='academy' ? '원하시면 가까운 센터 등록으로 연결됩니다' : '적합한 선생님을 매칭하여 수업을 연결해드립니다';
    var centerCard = document.getElementById('cf-card-center2');
    if(centerCard) centerCard.style.display = type==='tutoring' ? 'none' : 'flex';
  }
  function cfSelectGrade(el, val) {
    document.querySelectorAll('.cf-chip[data-grade]').forEach(c => c.classList.remove('active'));
    el.setAttribute('data-grade','1'); el.classList.add('active');
    document.getElementById('cf-grade').value = val;
  }
  (function(){
    var p = new URLSearchParams(window.location.search);
    var cn = p.get('center');
    if(cn) {
      var el = document.getElementById('cf-center');
      if(el) { el.value = cn; el.style.borderColor='#3B82F6'; }
    }
  })();
  function searchContactAddress() {
    function openDaum() { new daum.Postcode({ oncomplete: function(data) { document.getElementById('cf-sido').value = data.roadAddress||data.jibunAddress; document.getElementById('cf-address').focus(); }}).open(); }
    if (typeof daum!=='undefined'&&daum.Postcode) openDaum();
    else { var s=document.createElement('script'); s.src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; s.onload=openDaum; document.head.appendChild(s); }
  }
  function submitContact() {
    var name=document.getElementById('cf-name').value.trim();
    var grade=document.getElementById('cf-grade').value;
    var phone=document.getElementById('cf-phone').value.trim();
    var sido=document.getElementById('cf-sido').value.trim();
    var address=document.getElementById('cf-address').value.trim();
    var message=document.getElementById('cf-message').value.trim();
    var agree=document.getElementById('cf-agree').checked;
    if (!name)    { showErr('이름을 입력해주세요.'); return; }
    if (!grade)   { showErr('학년/나이를 선택해주세요.'); return; }
    if (!phone)   { showErr('연락처를 입력해주세요.'); return; }
    if (!sido)    { showErr('거주 주소를 입력해주세요.'); return; }
    if (!agree)   { showErr('개인정보 수집 및 이용에 동의해주세요.'); return; }
    var btn=document.getElementById('cf-submit');
    btn.disabled=true; btn.textContent='제출 중...'; btn.style.opacity='.7';
    fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,grade,phone,address:sido+(address?' '+address:''),message})})
    .then(r=>r.json()).then(data=>{
      if(data.ok){document.getElementById('contact-form').style.display='none';document.getElementById('contact-success').style.display='block';}
      else{btn.disabled=false;btn.textContent='✉️ 문의 제출하기';btn.style.opacity='1';showErr('전송 중 오류가 발생했습니다.');}
    }).catch(()=>{btn.disabled=false;btn.textContent='✉️ 문의 제출하기';btn.style.opacity='1';showErr('네트워크 오류가 발생했습니다.');});
  }
  function showErr(msg){var el=document.getElementById('cf-error');el.textContent='⚠️ '+msg;el.style.display='block';el.scrollIntoView({behavior:'smooth',block:'center'});document.getElementById('cf-submit').disabled=false;document.getElementById('cf-submit').textContent='✉️ 문의 제출하기';document.getElementById('cf-submit').style.opacity='1';}
  </script>`;
  return wrap('문의하기 | 올케어스터디', '올케어스터디에 학습 상담 및 센터 관련 문의를 남겨주세요.', '/contact', body);
}

function makeHomePage(){
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>올케어스터디 - 지역별 과외·학원 정보 No.1</title>
<meta name="description" content="전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼. 서울, 경기, 인천 등 내 지역 검증된 선생님 12,400명+. 수학, 영어, 과학 과외 무료 상담.">
<meta name="keywords" content="과외, 학원, 지역별과외, 수학과외, 영어과외, 1:1과외, 초등과외, 중등과외, 고등과외, 올케어스터디, 서울과외, 경기과외">
<meta name="robots" content="index, follow">
<meta name="author" content="올케어스터디">
<meta name="google-site-verification" content="st8_MGU2mfnaomGNCLUGBmiQsZD50WNTWEUxzfmJ47E" />
<meta name="naver-site-verification" content="a1c57425042478220780bb530f8511e3eec2a1fd" />
<link rel="canonical" href="https://allcarestudy.com/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://allcarestudy.com/">
<meta property="og:title" content="올케어스터디 - 지역별 과외·학원 정보 No.1">
<meta property="og:description" content="전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼. 검증된 선생님 12,400명+. 무료 상담 신청.">
<meta property="og:site_name" content="올케어스터디">
<meta property="og:locale" content="ko_KR">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="올케어스터디 - 지역별 과외·학원 정보 No.1">
<meta name="twitter:description" content="전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼. 검증된 선생님 12,400명+.">

<!-- Schema.org 구조화 데이터 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "올케어스터디",
  "url": "https://allcarestudy.com",
  "description": "전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼",
  "telephone": "010-6834-8080",
  "areaServed": "KR",
  "serviceType": ["과외", "학원", "학습코칭"]
}
</script>

<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
<style>
:root {
  --navy: #0F2044;
  --navy-mid: #1E3A6E;
  --navy-light: #2563EB;
  --blue: #3B82F6;
  --blue-pale: #EFF6FF;
  --blue-border: #BFDBFE;
  --sky: #60A5FA;
  --text-dark: #0F2044;
  --text-mid: #374151;
  --text-muted: #9CA3AF;
  --bg: #F8FAFF;
  --white: #FFFFFF;
  --border: #E5E7EB;
  --shadow-sm: 0 1px 6px rgba(0,0,0,0.06);
  --shadow: 0 4px 24px rgba(0,0,0,0.09);
  --shadow-lg: 0 12px 48px rgba(15,32,68,0.15);
  --radius: 14px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Pretendard',-apple-system,sans-serif;background:var(--bg);color:var(--text-dark)}
a{text-decoration:none;color:inherit}
button{cursor:pointer;font-family:inherit}

/* HEADER */
header{position:fixed;top:0;left:0;right:0;z-index:300;background:#ffffff;border-bottom:1px solid rgba(15,32,68,0.1);box-shadow:0 2px 16px rgba(15,32,68,0.06)}
.hw{max-width:1280px;margin:0 auto;padding:0 48px;height:136px;display:flex;align-items:center;gap:32px}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-mark{width:44px;height:44px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(29,78,216,0.35);flex-shrink:0}
.logo-name{display:flex;flex-direction:column;line-height:1.15}
.logo-main{font-size:20px;font-weight:900;letter-spacing:2px;color:#0A1628}
.logo-main em{font-style:normal;color:var(--sky)}
.logo-sub{font-size:10px;color:rgba(15,32,68,0.6);font-weight:700;letter-spacing:3px}
.vpill{border:1.5px solid rgba(15,32,68,0.2);border-radius:999px;padding:6px 18px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(15,32,68,0.04)}
.vpill .vl{font-size:10px;color:rgba(15,32,68,0.5);font-weight:600}
.vpill .vc{font-size:15px;font-weight:900;color:#1D4ED8;letter-spacing:-0.5px}
.gnb{margin-left:auto;display:flex;align-items:center;gap:2px}
.gi{position:relative}
.gb{display:flex;align-items:center;gap:5px;padding:8px 16px;border:none;background:none;font-size:14px;font-weight:700;color:#0F2044;border-radius:8px;transition:all .18s;white-space:nowrap}
.gb:hover{background:rgba(15,32,68,0.08);color:#1D4ED8}
.arr{width:14px;height:14px;transition:transform .2s;color:rgba(255,255,255,0.4)}
.gi:hover .arr{transform:rotate(180deg);color:var(--sky)}
.drop{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);min-width:160px;background:var(--navy);border-radius:12px;box-shadow:var(--shadow-lg);border:1px solid rgba(255,255,255,0.12);padding:6px;opacity:0;visibility:hidden;transition:all .18s;z-index:400}
.gi:hover .drop{opacity:1;visibility:visible}
.drop a{display:block;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);transition:all .15s}
.drop a:hover{background:rgba(255,255,255,0.1);color:white}
.hsearch{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);transition:all .2s;flex-shrink:0}
.hsearch:hover{border-color:var(--sky);color:var(--sky)}

/* HERO */
.hero{margin-top:136px;position:relative;overflow:hidden}
.hslider{display:flex;transition:transform .65s cubic-bezier(.4,0,.2,1)}
.slide{min-width:100%;height:460px;display:flex;align-items:center}
.s1{background:linear-gradient(130deg,#0F2044 0%,#1E3A6E 50%,#1D4ED8 100%)}
.s2{background:linear-gradient(130deg,#0C4A6E 0%,#0369A1 50%,#0EA5E9 100%)}
.s3{background:linear-gradient(130deg,#1E1B4B 0%,#3730A3 50%,#4F46E5 100%)}
.sin{max-width:1280px;margin:0 auto;padding:0 80px;width:100%;display:grid;grid-template-columns:1fr 400px;gap:48px;align-items:center}
.seb{display:inline-flex;align-items:center;gap:6px;background:rgba(96,165,250,.15);border:1px solid rgba(96,165,250,.25);border-radius:999px;padding:4px 14px;font-size:12px;font-weight:700;color:var(--sky);margin-bottom:18px}
.sdot{width:6px;height:6px;background:var(--sky);border-radius:50%;animation:blink 1.6s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.scap{font-size:14px;color:rgba(255,255,255,.65);margin-bottom:8px}
.stitle{font-size:clamp(28px,3.5vw,46px);font-weight:900;line-height:1.15;letter-spacing:-1.5px;color:white;margin-bottom:14px}
.stitle .hl{color:var(--sky)}
.sdesc{font-size:14px;color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:28px}
.sbtns{display:flex;gap:12px}
.bph{background:var(--blue);color:white;border:none;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;transition:all .2s;box-shadow:0 6px 20px rgba(59,130,246,.4)}
.bph:hover{background:#2563EB;transform:translateY(-2px)}
.bps{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.25);padding:13px 24px;border-radius:10px;font-size:14px;font-weight:600;transition:all .2s}
.bps:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.5)}
.svis{display:flex;align-items:center;justify-content:center}
.vc-card{background:rgba(255,255,255,.07);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:28px;width:100%}
.vch{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.vci{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--blue),var(--sky));display:flex;align-items:center;justify-content:center;font-size:22px}
.vct{font-size:15px;font-weight:800;color:white}
.vcs{font-size:12px;color:rgba(255,255,255,.5)}
.vcst{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}
.vcsi{background:rgba(255,255,255,.08);border-radius:10px;padding:12px 14px}
.vcn{font-size:20px;font-weight:900;color:var(--sky);letter-spacing:-.5px}
.vcl{font-size:11px;color:rgba(255,255,255,.45);margin-top:2px}
.vcb{background:rgba(255,255,255,.06);border-radius:8px;padding:12px 14px}
.vcbl{display:flex;justify-content:space-between;font-size:12px;color:rgba(255,255,255,.5);margin-bottom:6px}
.vcbt{height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;margin-bottom:8px}
.vcbf{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--sky))}
.hdots{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10}
.hdot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);border:none;cursor:pointer;padding:0;transition:all .3s}
.hdot.on{background:var(--sky);width:24px;border-radius:4px}

/* STRENGTH */
.strength{background:white;padding:80px 0;border-bottom:1px solid var(--border)}
.sw{max-width:1280px;margin:0 auto;padding:0 48px}
.sh{text-align:center;margin-bottom:52px}
.se{display:inline-block;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--blue);margin-bottom:10px}
.st{font-size:clamp(22px,3vw,34px);font-weight:900;letter-spacing:-1px;color:var(--navy);line-height:1.25}
.st .hl{color:var(--blue)}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.sc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:28px 24px;text-align:center;transition:all .3s;position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--navy),var(--blue));opacity:0;transition:opacity .3s}
.sc:hover{transform:translateY(-5px);box-shadow:var(--shadow);border-color:var(--blue-border);background:white}
.sc:hover::before{opacity:1}
.se2{font-size:36px;margin-bottom:12px;display:block}
.sn{font-size:36px;font-weight:900;color:var(--navy-light);letter-spacing:-1px;line-height:1;margin-bottom:4px}
.sl{font-size:12px;color:var(--text-muted);font-weight:500}
.sd{font-size:12px;color:var(--text-mid);margin-top:8px;line-height:1.5}

/* REVIEWS */
.reviews{padding:80px 0;background:var(--blue-pale)}
.rw{overflow:hidden;margin-top:48px}
.rt{display:flex;gap:20px;animation:scrollL 30s linear infinite;width:max-content}
.rt:hover{animation-play-state:paused}
@keyframes scrollL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.rc{width:280px;flex-shrink:0;background:white;border-radius:var(--radius);padding:22px;box-shadow:var(--shadow-sm);border:1px solid var(--blue-border)}
.rb{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;color:white;margin-bottom:12px}
.rtitle{font-size:15px;font-weight:800;color:var(--navy);margin-bottom:8px;line-height:1.35}
.rtext{font-size:13px;color:var(--text-mid);line-height:1.6;margin-bottom:14px}
.rname{font-size:12px;color:var(--text-muted)}
.rstar{color:#FBBF24;font-size:13px;margin-bottom:6px}

/* SPECIAL */
.special{padding:80px 0;background:white}
.spg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:52px}
.spc{background:var(--bg);border-radius:var(--radius);padding:32px 28px;border:1px solid var(--border);display:flex;gap:20px;align-items:flex-start;transition:all .3s}
.spc:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--blue-border);background:white}
.spi{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.ic1{background:linear-gradient(135deg,#EFF6FF,#BFDBFE)}
.ic2{background:linear-gradient(135deg,#F0FDF4,#BBF7D0)}
.ic3{background:linear-gradient(135deg,#F0F9FF,#BAE6FD)}
.ic4{background:linear-gradient(135deg,#EEF2FF,#C7D2FE)}
.spt h4{font-size:16px;font-weight:800;margin-bottom:6px;color:var(--navy)}
.spt p{font-size:13px;color:var(--text-muted);line-height:1.65}

/* DIAGNOSIS */
.diagnosis{padding:80px 0;background:var(--bg)}
.diag-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px}
.diag-card{background:white;border-radius:var(--radius);padding:28px 24px;border:1px solid var(--border);transition:all .3s;cursor:default;position:relative;overflow:hidden}
.diag-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;opacity:0;transition:opacity .3s}
.diag-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--blue-border)}
.diag-card:hover::after{opacity:1}
.dc1::after{background:linear-gradient(90deg,#16A34A,#4ADE80)}
.dc2::after{background:linear-gradient(90deg,#DB2777,#F472B6)}
.dc3::after{background:linear-gradient(90deg,#2563EB,#60A5FA)}
.dc4::after{background:linear-gradient(90deg,#D97706,#FCD34D)}
.dc5::after{background:linear-gradient(90deg,#7C3AED,#A78BFA)}
.dc6::after{background:linear-gradient(90deg,#0D9488,#34D399)}
.diag-badge{display:inline-block;font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;margin-bottom:14px}
.db1{background:#DCFCE7;color:#16A34A}
.db2{background:#FCE7F3;color:#DB2777}
.db3{background:#DBEAFE;color:#1D4ED8}
.db4{background:#FEF3C7;color:#D97706}
.db5{background:#EDE9FE;color:#7C3AED}
.db6{background:#CCFBF1;color:#0F766E}
.diag-icon{font-size:32px;margin-bottom:12px;display:block}
.diag-title{font-size:15px;font-weight:800;color:var(--navy);margin-bottom:6px}
.diag-desc{font-size:12px;color:var(--text-muted);line-height:1.6}
.diag-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.diag-tag{font-size:10px;color:var(--text-muted);background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:2px 8px}

/* FOOTER */
footer{background:var(--navy);padding:48px 0 32px;color:rgba(255,255,255,.45)}
.fi{max-width:1280px;margin:0 auto;padding:0 48px}
.ft{display:flex;justify-content:space-between;padding-bottom:32px;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,.08);gap:48px}
.flm{font-size:20px;font-weight:900;color:white}
.flm em{font-style:normal;color:var(--sky)}
.fdesc{font-size:13px;line-height:1.7;margin-top:8px;max-width:260px}
.flinks{display:flex;gap:48px}
.fc h5{color:rgba(255,255,255,.8);font-size:13px;font-weight:700;margin-bottom:14px}
.fc a{display:block;font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px;transition:color .2s}
.fc a:hover{color:rgba(255,255,255,.8)}
.fph{text-align:right}
.fph span{font-size:11px;color:rgba(255,255,255,.4);display:block;margin-bottom:4px}
.fph strong{font-size:22px;font-weight:900;color:white;letter-spacing:-.5px}
.fb2{display:flex;justify-content:space-between;align-items:center;font-size:11px}
.fnotice{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:10px 16px;font-size:11px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:20px}

/* FLOATS */
.floats{position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:9999}
.fbtn{display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;border:none;font-size:14px;font-weight:700;box-shadow:var(--shadow-lg);transition:all .25s;white-space:nowrap}
.fbtn:hover{transform:translateX(-4px) scale(1.03)}
.fb1{background:var(--blue);color:white}


/* MEGA MENU */
.mega-drop{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);width:660px;background:var(--navy);border-radius:16px;box-shadow:var(--shadow-lg);border:1px solid rgba(255,255,255,0.12);padding:24px;opacity:0;visibility:hidden;transition:all .2s;z-index:400}
.gi:hover .mega-drop{opacity:1;visibility:visible}
.mega-tabs{display:flex;gap:6px;margin-bottom:18px;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:14px}
.mega-tab{padding:7px 18px;border-radius:8px;font-size:13px;font-weight:700;color:rgba(255,255,255,.5);cursor:pointer;border:none;background:none;transition:all .2s;font-family:inherit}
.mega-tab.on{background:var(--blue);color:white}
.mega-tab:hover:not(.on){background:rgba(255,255,255,.08);color:white}
.mega-panel{display:none}
.mega-panel.on{display:block}
.mega-rt{font-size:10px;font-weight:700;color:var(--sky);letter-spacing:2.5px;text-transform:uppercase;margin-bottom:8px;margin-top:14px}
.mega-rt:first-child{margin-top:0}
.mega-btns{display:flex;flex-wrap:wrap;gap:6px}
.mega-btn{padding:5px 13px;border-radius:6px;font-size:12px;font-weight:600;color:rgba(255,255,255,.65);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .18s;text-decoration:none}
.mega-btn:hover{background:var(--blue);color:white;border-color:var(--blue)}

/* HAMBURGER */
.hburg{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;flex-shrink:0}
.hburg span{display:block;width:22px;height:2px;background:rgba(255,255,255,.8);border-radius:2px;transition:all .3s}
.hburg.on span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.hburg.on span:nth-child(2){opacity:0}
.hburg.on span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
/* MOBILE MENU */
.mob-menu{position:fixed;top:56px;left:0;right:0;bottom:0;background:var(--navy);z-index:299;overflow-y:auto;transform:translateX(100%);transition:transform .3s ease}
.mob-menu.on{transform:translateX(0)}
.mob-inner{padding:24px 20px}
.mob-section{margin-bottom:28px}
.mob-title{font-size:11px;font-weight:700;letter-spacing:3px;color:var(--sky);text-transform:uppercase;margin-bottom:12px}
.mob-links{display:flex;flex-wrap:wrap;gap:8px}
.mob-links a{padding:8px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:8px;font-size:14px;font-weight:600;color:rgba(255,255,255,.8);transition:all .2s}
.mob-links a:hover{background:var(--blue);border-color:var(--blue);color:white}
.mob-cta{display:flex;flex-direction:column;gap:10px;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,.1)}
.mob-cta button{padding:14px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:all .2s}
.mob-cta button:first-child{background:var(--blue);color:white}
.mob-cta button:last-child{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.2)}

/* FADE UP */
.fu{opacity:1;transform:translateY(0);transition:opacity .6s ease,transform .6s ease}
.fu.vis{opacity:1;transform:translateY(0)}

/* ══ MOBILE ══ */
@media(max-width:768px){
  /* HEADER */
  .hw{padding:0 16px;height:72px;gap:10px}
  .logo-sub{display:none}
  .logo-main{font-size:15px}
  .logo-mark{width:32px;height:32px}
  .vpill{padding:4px 10px}
  .vpill .vc{font-size:13px}
  .vpill .vl{font-size:9px}
  .gnb{display:none}
  .hsearch{display:none}
  .hburg{display:flex}

  /* HERO */
  .hero{margin-top:72px}
  .slide{height:auto;min-height:420px;padding:32px 0 24px}
  .sin{grid-template-columns:1fr;padding:0 20px;gap:24px}
  .svis{display:none}
  .stitle{font-size:32px;letter-spacing:-1px}
  .seb{font-size:11px}
  .scap{font-size:13px}
  .sdesc{font-size:13px;margin-bottom:20px}
  .sbtns{flex-direction:column;gap:8px}
  .bph,.bps{width:100%;text-align:center;padding:12px 20px}
  .hdots{bottom:12px}

  /* STRENGTH */
  .strength{padding:48px 0}
  .sw{padding:0 16px}
  .sh{margin-bottom:32px}
  .st{font-size:22px}
  .sg{grid-template-columns:1fr 1fr;gap:12px}
  .sc{padding:20px 14px}
  .se2{font-size:28px;margin-bottom:8px}
  .sn{font-size:26px}

  /* REVIEWS */
  .reviews{padding:48px 0}
  .rc{width:240px;padding:18px}

  /* SPECIAL */
  .special{padding:48px 0}
  .spg{grid-template-columns:1fr;gap:12px}
  .spc{padding:20px}

  /* DIAGNOSIS */
  .diagnosis{padding:48px 0}
  .diag-grid{grid-template-columns:1fr 1fr;gap:12px}
  .diag-card{padding:18px 14px}
  .diag-icon{font-size:24px;margin-bottom:8px}
  .diag-title{font-size:13px}
  .diag-desc{font-size:11px}
  .diag-tags{display:none}

  /* FOOTER */
  footer{padding:32px 0 24px}
  .fi{padding:0 16px}
  .ft{flex-direction:column;gap:24px;padding-bottom:24px}
  .flinks{flex-wrap:wrap;gap:24px}
  .fph{text-align:left}
  .fph strong{font-size:18px}
  .fb2{flex-direction:column;gap:6px;align-items:flex-start}

  /* FLOATS */
  .floats{right:12px;bottom:24px;gap:8px}
  .fbtn{padding:12px 16px;font-size:13px}
  .diag-grid{grid-template-columns:repeat(2,1fr);gap:12px}
  #region-section{padding:40px 20px}
  #region-section h2{font-size:22px}
  #region-section > div > div:last-child{grid-template-columns:repeat(2,1fr);gap:8px}
  #region-section a{padding:10px 12px;font-size:13px}
}

@media(max-width:400px){
  .diag-grid{grid-template-columns:1fr}
  .sg{grid-template-columns:1fr 1fr}
  .stitle{font-size:28px}
}
</style>
</head>
<body>

<header>
  <div class="hw">
    <a href="#" class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="logo-name">
        <span class="logo-main"><em>올케어</em>스터디</span>
        <span class="logo-sub">ALLCARE STUDY</span>
      </div>
    </a>

    <div class="vpill">
      <span class="vl">누적 방문자</span>
      <span class="vc" id="vc">353,112명</span>
    </div>

    <nav class="gnb">
      <!-- 지역별수업 메가메뉴 -->
      <div class="gi" id="gi-region">
        <button class="gb" onclick="toggleMega('region')">지역별수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="mega-drop" id="mega-region">
          <div class="mega-tabs">
            <button class="mega-tab on" onclick="switchTab('region','local')">📍 지역별 과외</button>
            <button class="mega-tab" onclick="switchTab('region','grade')">🎓 학년별 과외</button>
            <button class="mega-tab" onclick="switchTab('region','school')">🏫 학교별 과외</button>
          </div>
          <!-- 지역별 -->
          <div class="mega-panel on" id="region-local">
            <div class="mega-btns">
              <a class="mega-btn" href="/seoul">📍 서울특별시</a>
              <a class="mega-btn" href="/gyeonggi">🌿 경기도</a>
              <a class="mega-btn" href="/chungcheong">🌾 충청도</a>
              <a class="mega-btn" href="/gyeongsang">🌊 경상도</a>
              <a class="mega-btn" href="/jeolla">🍀 전라도</a>
              <a class="mega-btn" href="/jeju">🌺 제주도</a>
            </div>
          </div>
          <!-- 학년별 -->
          <div class="mega-panel" id="region-grade">
            <div class="mega-rt">초등학교</div>
            <div class="mega-btns">
              <a class="mega-btn" href="#">초등 1학년</a><a class="mega-btn" href="#">초등 2학년</a><a class="mega-btn" href="#">초등 3학년</a><a class="mega-btn" href="#">초등 4학년</a><a class="mega-btn" href="#">초등 5학년</a><a class="mega-btn" href="#">초등 6학년</a>
            </div>
            <div class="mega-rt">중학교</div>
            <div class="mega-btns">
              <a class="mega-btn" href="#">중학교 1학년</a><a class="mega-btn" href="#">중학교 2학년</a><a class="mega-btn" href="#">중학교 3학년</a>
            </div>
            <div class="mega-rt">고등학교</div>
            <div class="mega-btns">
              <a class="mega-btn" href="#">고등 1학년</a><a class="mega-btn" href="#">고등 2학년</a><a class="mega-btn" href="#">고등 3학년</a><a class="mega-btn" href="#">수능 준비</a>
            </div>
          </div>
          <!-- 학교별 -->
          <div class="mega-panel" id="region-school">
            <div class="mega-btns">
              <a class="mega-btn" href="/seoul">학교별 과외 전체 보기 →</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 과목수업 -->
      <div class="gi">
        <button class="gb">과목수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="drop"><a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a><a href="#">코딩</a><a href="#">검정고시</a><a href="#">코칭 수업</a></div>
      </div>
      <!-- 학원수업 - 바로 이동 -->
      <div class="gi">
        <button class="gb" onclick="this.parentElement.classList.toggle('open')">학원수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button><div class="drop"><a href="/academy/intro">학원소개</a><a href="/academy/all">센터찾기</a></div>
      </div>
      <!-- 회화수업 -->
      <div class="gi">
        <button class="gb">회화수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="drop"><a href="#">영어회화</a><a href="#">중국어회화</a><a href="#">일본어회화</a></div>
      </div>
      <!-- 문의하기 -->
      <div class="gi">
        <a href="/contact" class="gb" style="text-decoration:none;display:flex;align-items:center;color:#1D4ED8;font-weight:800">문의하기</a>
      </div>
    </nav>

    <button class="hsearch">
      <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    </button>
    <!-- 모바일 햄버거 -->
    <button class="hburg" id="hburg" onclick="toggleMobileMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<!-- 모바일 메뉴 -->
<div class="mob-menu" id="mobMenu">
  <div class="mob-inner">
    <div class="mob-section">
      <div class="mob-title">📍 지역별수업</div>
      <div class="mob-links">
        <a href="/seoul">서울특별시</a>
        <a href="/gyeonggi">경기도</a>
        <a href="/chungcheong">충청도</a>
        <a href="/gyeongsang">경상도</a>
        <a href="/jeolla">전라도</a>
        <a href="/jeju">제주도</a>
      </div>
    </div>
    <div class="mob-section">
      <div class="mob-title">📚 과목수업</div>
      <div class="mob-links">
        <a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a><a href="#">코딩</a><a href="#">검정고시</a><a href="#">코칭 수업</a>
      </div>
    </div>
    <div class="mob-section">
      <div class="mob-title">🏫 학원수업</div>
      <div class="mob-links">
        <a href="/academy/intro">🏫 학원소개</a><a href="/academy/all">📍 센터찾기</a>
      </div>
    </div>
    <div class="mob-section">
      <div class="mob-title">🗣 회화수업</div>
      <div class="mob-links">
        <a href="#">영어회화</a><a href="#">중국어회화</a><a href="#">일본어회화</a>
      </div>
    </div>
    <div class="mob-section">
      <div class="mob-title">✉️ 문의하기</div>
      <div class="mob-links">
        <a href="/contact">문의 양식</a>
      </div>
    </div>
    <div class="mob-cta">
      <button onclick="window.location.href='tel:01068348080'">📞 전화상담</button>
      <button onclick="window.location.href='/contact'">✉️ 문의하기</button>
    </div>
  </div>
</div>

<!-- HERO -->
<section class="hero">
  <div class="hslider" id="hs">
    <div class="slide s1">
      <div class="sin">
        <div>
          <div class="seb"><div class="sdot"></div> No.1 지역별 과외 플랫폼</div>
          <p class="scap">우리 아이에게 딱 맞는 선생님을 찾아드립니다</p>
          <h1 class="stitle">내 지역 최고의<br><span class="hl">1:1 맞춤 과외</span><br>지금 찾아보세요</h1>
          <p class="sdesc">전국 검증된 선생님 12,400명+<br>지역별·과목별·학년별로 딱 맞는 수업 연결</p>
          <div class="sbtns">
            <button class="bph" onclick="document.getElementById('region-section').scrollIntoView({behavior:'smooth'})">지역별 과외 찾기 →</button>
            <button class="bps" onclick="window.location.href='/contact'">✉️ 문의하기</button>
          </div>
        </div>
        <div class="svis">
          <div class="vc-card">
            <div class="vch"><div class="vci">📍</div><div><div class="vct">강남구 수학 과외</div><div class="vcs">매칭 완료 · 오늘 기준</div></div></div>
            <div class="vcst">
              <div class="vcsi"><div class="vcn">247</div><div class="vcl">등록 선생님</div></div>
              <div class="vcsi"><div class="vcn">98%</div><div class="vcl">만족도</div></div>
            </div>
            <div class="vcb">
              <div class="vcbl"><span>이번 달 매칭률</span><span style="color:var(--sky);font-weight:700">94%</span></div>
              <div class="vcbt"><div class="vcbf" style="width:94%"></div></div>
              <div class="vcbl"><span>학부모 재등록률</span><span style="color:var(--sky);font-weight:700">87%</span></div>
              <div class="vcbt"><div class="vcbf" style="width:87%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide s2">
      <div class="sin">
        <div>
          <div class="seb"><div class="sdot"></div> 35년 교육 노하우</div>
          <p class="scap">검증된 학원 정보를 한눈에 확인하세요</p>
          <h1 class="stitle">우리 동네<br><span class="hl">믿을 수 있는</span><br>학원 정보</h1>
          <p class="sdesc">학원 비교부터 후기까지<br>올케어스터디에서 모두 확인하세요</p>
          <div class="sbtns">
            <a href="/academy/all" style="display:inline-block;text-decoration:none"><button class="bph">학원 찾기 →</button></a>
            <button class="bps">후기 보기</button>
          </div>
        </div>
        <div class="svis">
          <div class="vc-card">
            <div class="vch"><div class="vci">🏫</div><div><div class="vct">서초구 영어 학원</div><div class="vcs">실시간 업데이트</div></div></div>
            <div class="vcst">
              <div class="vcsi"><div class="vcn">1,240</div><div class="vcl">등록 학원</div></div>
              <div class="vcsi"><div class="vcn">4.8★</div><div class="vcl">평균 평점</div></div>
            </div>
            <div class="vcb">
              <div class="vcbl"><span>정보 업데이트율</span><span style="color:var(--sky);font-weight:700">96%</span></div>
              <div class="vcbt"><div class="vcbf" style="width:96%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide s3">
      <div class="sin">
        <div>
          <div class="seb"><div class="sdot"></div> AI 맞춤 진단</div>
          <p class="scap">6가지 맞춤 진단으로 약점을 파악하세요</p>
          <h1 class="stitle">AI 데이터 기반<br><span class="hl">성적 향상</span><br>맞춤 전략</h1>
          <p class="sdesc">100만 누적 데이터로<br>우리 아이의 약점을 정확히 찾아냅니다</p>
          <div class="sbtns">
            <button class="bph">무료 진단 받기 →</button>
            <button class="bps">자세히 보기</button>
          </div>
        </div>
        <div class="svis">
          <div class="vc-card">
            <div class="vch"><div class="vci">🎯</div><div><div class="vct">AI 학습 진단 결과</div><div class="vcs">김○○ · 중학교 2학년</div></div></div>
            <div class="vcst">
              <div class="vcsi"><div class="vcn">상위 8%</div><div class="vcl">수학 성취도</div></div>
              <div class="vcsi"><div class="vcn">+23점</div><div class="vcl">3개월 향상</div></div>
            </div>
            <div class="vcb">
              <div class="vcbl"><span>수학</span><span style="color:var(--sky);font-weight:700">92%</span></div>
              <div class="vcbt"><div class="vcbf" style="width:92%"></div></div>
              <div class="vcbl"><span>영어</span><span style="color:var(--sky);font-weight:700">78%</span></div>
              <div class="vcbt"><div class="vcbf" style="width:78%"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="hdots">
    <button class="hdot on" onclick="gs(0)"></button>
    <button class="hdot" onclick="gs(1)"></button>
    <button class="hdot" onclick="gs(2)"></button>
  </div>
</section>

<!-- STRENGTH -->
<section class="strength">
  <div class="sw">
    <div class="sh fu">
      <div class="se">OUR STRENGTH</div>
      <h2 class="st">35년의 교육 노하우,<br><span class="hl">올케어스터디가 다릅니다</span></h2>
    </div>
    <div class="sg">
      <div class="sc fu"><span class="se2">🏆</span><div class="sn">35년</div><div class="sl">No.1 청소년 학습코칭</div><div class="sd">남다른 교육·코칭 노하우</div></div>
      <div class="sc fu" style="transition-delay:.1s"><span class="se2">👨‍🏫</span><div class="sn">4,000명</div><div class="sl">최정예 전문 학습코치</div><div class="sd">검증된 1:1 밀착 관리</div></div>
      <div class="sc fu" style="transition-delay:.2s"><span class="se2">📈</span><div class="sn">100만명</div><div class="sl">누적 체험 회원수</div><div class="sd">월평균 3만명 진행</div></div>
      <div class="sc fu" style="transition-delay:.3s"><span class="se2">⭐</span><div class="sn">96.7%</div><div class="sl">학습 만족도</div><div class="sd">학생·학부모 모두 만족</div></div>
    </div>
  </div>
</section>

<!-- REGION SELECT -->
<section id="region-section" style="padding:56px 48px;background:white;border-bottom:1px solid #E5E7EB">
  <div style="max-width:1100px;margin:0 auto">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-size:12px;font-weight:700;color:#3B82F6;letter-spacing:2px;margin-bottom:10px">FIND YOUR CLASS</div>
      <h2 style="font-size:26px;font-weight:900;color:#0F2044">수업 찾기</h2>
      <p style="font-size:14px;color:#9CA3AF;margin-top:6px">원하는 카테고리를 선택하세요</p>
    </div>
    <!-- 탭 -->
    <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;justify-content:center" id="find-tabs">
      <button onclick="switchFind('region')" id="ftab-region" style="padding:10px 22px;border-radius:999px;border:1.5px solid #3B82F6;background:#3B82F6;color:white;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit">🏙 지역별 과외</button>
      <button onclick="switchFind('subject')" id="ftab-subject" style="padding:10px 22px;border-radius:999px;border:1.5px solid #E5E7EB;background:white;color:#374151;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit">📚 과목별 과외</button>
      <button onclick="switchFind('academy')" id="ftab-academy" style="padding:10px 22px;border-radius:999px;border:1.5px solid #E5E7EB;background:white;color:#374151;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit">🏫 학원 찾기</button>
      <button onclick="switchFind('conv')" id="ftab-conv" style="padding:10px 22px;border-radius:999px;border:1.5px solid #E5E7EB;background:white;color:#374151;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;font-family:inherit">🗣 회화수업</button>
      <button onclick="window.location.href='/contact'" id="ftab-contact" style="padding:10px 22px;border-radius:999px;border:1.5px solid #1D4ED8;background:white;color:#1D4ED8;font-size:14px;font-weight:800;cursor:pointer;transition:all .2s;font-family:inherit">✉️ 문의하기</button>
    </div>
    <!-- 패널 -->
    <div id="fpanel-region">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <a href="/seoul" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🏙 서울특별시</a>
      <a href="/gyeonggi" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌿 경기도</a>
      <a href="/incheon" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌊 인천광역시</a>
      <a href="/busan" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🐟 부산광역시</a>
      <a href="/daegu" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🍎 대구광역시</a>
      <a href="/daejeon" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌾 대전광역시</a>
      <a href="/gwangju" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌸 광주광역시</a>
      <a href="/ulsan" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">⚙️ 울산광역시</a>
      <a href="/sejong" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🏛 세종특별시</a>
      <a href="/gangwon" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🏔 강원도</a>
      <a href="/chungbuk" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌻 충청북도</a>
      <a href="/chungnam" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌊 충청남도</a>
      <a href="/jeonbuk" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌾 전라북도</a>
      <a href="/jeonnam" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🍵 전라남도</a>
      <a href="/gyeongbuk" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🍎 경상북도</a>
      <a href="/gyeongnam" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌊 경상남도</a>
      <a href="/jeju" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🌺 제주특별자치도</a>
    </div>
    </div>
    <div id="fpanel-subject" style="display:none">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">📐 수학</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">📖 영어</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🔬 과학</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">📝 국어</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🗺 사회/역사</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">💻 코딩</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">📋 검정고시</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🎯 코칭 수업</a>
    </div>
    </div>
    <div id="fpanel-academy" style="display:none">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
      <a href="/academy/seoul" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🏙 서울 <span style="font-size:12px;color:#3B82F6;font-weight:700">24곳</span></a>
      <a href="/academy/gyeonggi" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌿 경기 <span style="font-size:12px;color:#3B82F6;font-weight:700">100곳</span></a>
      <a href="/academy/incheon" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌊 인천 <span style="font-size:12px;color:#3B82F6;font-weight:700">10곳</span></a>
      <a href="/academy/busan" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🐟 부산 <span style="font-size:12px;color:#3B82F6;font-weight:700">5곳</span></a>
      <a href="/academy/daegu" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🍎 대구 <span style="font-size:12px;color:#3B82F6;font-weight:700">16곳</span></a>
      <a href="/academy/daejeon" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌾 대전 <span style="font-size:12px;color:#3B82F6;font-weight:700">9곳</span></a>
      <a href="/academy/gwangju" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌸 광주 <span style="font-size:12px;color:#3B82F6;font-weight:700">6곳</span></a>
      <a href="/academy/ulsan" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">⚙️ 울산 <span style="font-size:12px;color:#3B82F6;font-weight:700">4곳</span></a>
      <a href="/academy/gangwon" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🏔 강원 <span style="font-size:12px;color:#3B82F6;font-weight:700">6곳</span></a>
      <a href="/academy/chungbuk" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌻 충북 <span style="font-size:12px;color:#3B82F6;font-weight:700">6곳</span></a>
      <a href="/academy/chungnam" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌊 충남 <span style="font-size:12px;color:#3B82F6;font-weight:700">6곳</span></a>
      <a href="/academy/jeonbuk" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌾 전북 <span style="font-size:12px;color:#3B82F6;font-weight:700">3곳</span></a>
      <a href="/academy/gyeongbuk" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🍎 경북 <span style="font-size:12px;color:#3B82F6;font-weight:700">5곳</span></a>
      <a href="/academy/gyeongnam" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌊 경남 <span style="font-size:12px;color:#3B82F6;font-weight:700">3곳</span></a>
      <a href="/academy/jeju" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.background='#F8FAFF'">🌺 제주 <span style="font-size:12px;color:#3B82F6;font-weight:700">1곳</span></a>
    </div>
    </div>
    <div id="fpanel-conv" style="display:none">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🇺🇸 영어회화</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🇨🇳 중국어회화</a>
      <a href="#" style="display:flex;align-items:center;gap:10px;padding:14px 16px;background:#F8FAFF;border:1.5px solid #E5E7EB;border-radius:12px;font-size:14px;font-weight:700;color:#0F2044;text-decoration:none;white-space:nowrap;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6';this.style.background='#EFF6FF'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='#0F2044';this.style.background='#F8FAFF'">🇯🇵 일본어회화</a>
    </div>
    </div>
  </div>
</section>
<script>
function switchFind(tab){
  ['region','subject','academy','conv'].forEach(function(t){
    var panel = document.getElementById('fpanel-'+t);
    var btn = document.getElementById('ftab-'+t);
    if(t===tab){
      panel.style.display='block';
      btn.style.background='#3B82F6';btn.style.color='white';btn.style.borderColor='#3B82F6';
    }else{
      panel.style.display='none';
      btn.style.background='white';btn.style.color='#374151';btn.style.borderColor='#E5E7EB';
    }
  });
  // 문의하기 버튼 스타일 유지
  var cbtn = document.getElementById('ftab-contact');
  if(cbtn){ cbtn.style.background='white';cbtn.style.color='#1D4ED8';cbtn.style.borderColor='#1D4ED8'; }
}
</script>

<!-- REVIEWS -->

<section class="reviews">
  <div class="sw">
    <div class="sh fu">
      <div class="se">REAL REVIEWS</div>
      <h2 class="st">직접 경험한 학부모·학생의<br><span class="hl">생생한 성적 향상 스토리</span></h2>
    </div>
  </div>
  <div class="rw">
    <div class="rt">
      <div class="rc"><span class="rb" style="background:#1D4ED8">연세대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">6개월 만에 내신 4등급 → 1등급</div><div class="rtext">코치 선생님이 제 약점을 정확히 짚어주셔서 단기간에 성적이 확 올랐어요.</div><div class="rname">이*윤 회원 (고2)</div></div>
      <div class="rc"><span class="rb" style="background:#15803D">이화여대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수시 학생부로 이화여대 합격!</div><div class="rtext">학생기록부 관리부터 면접 준비까지 체계적으로 도와주셔서 합격할 수 있었어요.</div><div class="rname">김*연 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#7C3AED">서울대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수능 수학 2등급 → 만점!</div><div class="rtext">올케어스터디 덕분에 제 실력이 어느 정도인지 정확히 알고 집중 공략할 수 있었습니다.</div><div class="rname">정*원 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#B45309">경희대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">중학생 때부터 시작해서 목표 달성</div><div class="rtext">중2 때부터 꾸준히 관리받았더니 고3이 되니 여유가 생기더라고요. 정말 추천합니다.</div><div class="rname">전*빈 회원 학부모</div></div>
      <div class="rc"><span class="rb" style="background:#0F766E">고려대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">공부 습관이 완전히 바뀌었어요</div><div class="rtext">스스로 계획 세우고 실천하는 법을 배웠어요. 성적보다 공부 자신감이 생긴 게 더 큰 수확이에요.</div><div class="rname">박*준 회원 (중3)</div></div>
      <div class="rc"><span class="rb" style="background:#BE185D">한양대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">아이가 먼저 공부하겠다고 해요</div><div class="rtext">예전엔 억지로 책상에 앉혔는데, 지금은 스스로 계획 짜고 공부합니다. 정말 감사해요.</div><div class="rname">최*아 회원 학부모</div></div>
      <!-- 루프 복제 -->
      <div class="rc"><span class="rb" style="background:#1D4ED8">연세대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">6개월 만에 내신 4등급 → 1등급</div><div class="rtext">코치 선생님이 제 약점을 정확히 짚어주셔서 단기간에 성적이 확 올랐어요.</div><div class="rname">이*윤 회원 (고2)</div></div>
      <div class="rc"><span class="rb" style="background:#15803D">이화여대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수시 학생부로 이화여대 합격!</div><div class="rtext">학생기록부 관리부터 면접 준비까지 체계적으로 도와주셔서 합격할 수 있었어요.</div><div class="rname">김*연 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#7C3AED">서울대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수능 수학 2등급 → 만점!</div><div class="rtext">올케어스터디 덕분에 제 실력이 어느 정도인지 정확히 알고 집중 공략할 수 있었습니다.</div><div class="rname">정*원 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#B45309">경희대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">중학생 때부터 시작해서 목표 달성</div><div class="rtext">중2 때부터 꾸준히 관리받았더니 고3이 되니 여유가 생기더라고요. 정말 추천합니다.</div><div class="rname">전*빈 회원 학부모</div></div>
      <div class="rc"><span class="rb" style="background:#0F766E">고려대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">공부 습관이 완전히 바뀌었어요</div><div class="rtext">스스로 계획 세우고 실천하는 법을 배웠어요. 성적보다 공부 자신감이 생긴 게 더 큰 수확이에요.</div><div class="rname">박*준 회원 (중3)</div></div>
      <div class="rc"><span class="rb" style="background:#BE185D">한양대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">아이가 먼저 공부하겠다고 해요</div><div class="rtext">예전엔 억지로 책상에 앉혔는데, 지금은 스스로 계획 짜고 공부합니다. 정말 감사해요.</div><div class="rname">최*아 회원 학부모</div></div>
    </div>
  </div>
</section>

<!-- SPECIAL -->
<section class="special">
  <div class="sw">
    <div class="sh fu">
      <div class="se">SPECIAL POINT</div>
      <h2 class="st">우리 아이 성적,<br><span class="hl">왜 올케어스터디여야 할까요?</span></h2>
      <p style="font-size:14px;color:var(--text-muted);margin-top:12px;line-height:1.7">단순한 과외 중개가 아닙니다. 학습 진단부터 목표 설계, 실행 관리까지<br>아이의 성장을 함께 책임집니다.</p>
    </div>
    <div class="spg fu">
      <div class="spc"><div class="spi ic1">🎯</div><div class="spt"><h4>학교·교재 맞춤 1:1 대비</h4><p>전국 모든 학교의 교과서·부교재를 분석해 내 학교 시험에 딱 맞는 맞춤 수업을 제공합니다.</p></div></div>
      <div class="spc"><div class="spi ic2">🔍</div><div class="spt"><h4>변형문제 완벽 대응 전략</h4><p>기본 개념부터 심화 응용까지 단계별로 훈련해 어떤 문제 유형에도 당황하지 않는 실력을 만듭니다.</p></div></div>
      <div class="spc"><div class="spi ic3">🧠</div><div class="spt"><h4>AI 기반 학습 취약점 분석</h4><p>100만 건의 누적 학습 데이터로 아이의 취약점을 정밀하게 찾아내고 집중 보완합니다.</p></div></div>
      <div class="spc"><div class="spi ic4">📆</div><div class="spt"><h4>시험 일정 연동 플래닝</h4><p>학사일정·시험 일정에 맞춰 역산 계획표를 설계하고 매주 실천 여부를 함께 점검합니다.</p></div></div>
    </div>
  </div>
</section>

<!-- DIAGNOSIS -->
<section class="diagnosis">
  <div class="sw">
    <div class="sh fu">
      <div class="se">DIAGNOSIS PROGRAM</div>
      <h2 class="st">6가지 정밀 진단검사<br><span class="hl">무엇이 있는지 확인해보세요</span></h2>
      <p style="font-size:14px;color:var(--text-muted);margin-top:12px;line-height:1.7">학습부터 진로, 부모 코칭까지 — 자세한 내용은 상담을 통해 안내드립니다.</p>
    </div>
    <div class="diag-grid fu">
      <div class="diag-card dc1">
        <span class="diag-badge db1">무료 체험</span>
        <span class="diag-icon">📊</span>
        <div class="diag-title">학습진단검사</div>
        <div class="diag-desc">학습 성격 유형, 동기, 요인을 분석해 공부 방향을 잡아드립니다.</div>
        <div class="diag-tags"><span class="diag-tag">학습 성격 유형</span><span class="diag-tag">학습 동기 분석</span><span class="diag-tag">학습 요인</span></div>
      </div>
      <div class="diag-card dc2">
        <span class="diag-badge db2">무료 체험</span>
        <span class="diag-icon">✅</span>
        <div class="diag-title">자기주도검사</div>
        <div class="diag-desc">계획 수립·실천 능력과 자기평가 역량을 객관적으로 측정합니다.</div>
        <div class="diag-tags"><span class="diag-tag">자기주도성</span><span class="diag-tag">계획 수립</span><span class="diag-tag">자기평가</span></div>
      </div>
      <div class="diag-card dc3">
        <span class="diag-badge db3">회원용</span>
        <span class="diag-icon">💼</span>
        <div class="diag-title">진로적성검사</div>
        <div class="diag-desc">직업 성격 유형과 진로 탐색·준비 수준을 진단합니다.</div>
        <div class="diag-tags"><span class="diag-tag">직업 성격 유형</span><span class="diag-tag">진로 탐색</span><span class="diag-tag">전공 계열</span></div>
      </div>
      <div class="diag-card dc4">
        <span class="diag-badge db4">회원용</span>
        <span class="diag-icon">📐</span>
        <div class="diag-title">학습유형검사</div>
        <div class="diag-desc">학습 성향, 의지, 스타일, 행동을 파악해 최적 공부법을 안내합니다.</div>
        <div class="diag-tags"><span class="diag-tag">학습성향</span><span class="diag-tag">학습의지</span><span class="diag-tag">학습스타일</span></div>
      </div>
      <div class="diag-card dc5">
        <span class="diag-badge db5">회원용</span>
        <span class="diag-icon">🎓</span>
        <div class="diag-title">입시예측검사</div>
        <div class="diag-desc">목표 고교·대학 합격 가능성과 수시·정시 전략을 예측합니다.</div>
        <div class="diag-tags"><span class="diag-tag">고교 합격 진단</span><span class="diag-tag">대학 합격 예측</span><span class="diag-tag">수시·정시</span></div>
      </div>
      <div class="diag-card dc6">
        <span class="diag-badge db6">회원용</span>
        <span class="diag-icon">👨‍👩‍👧</span>
        <div class="diag-title">부모코칭검사</div>
        <div class="diag-desc">자녀와의 의사소통 유형과 양육 스타일을 진단해 관계를 개선합니다.</div>
        <div class="diag-tags"><span class="diag-tag">양육 스타일</span><span class="diag-tag">의사소통 분석</span><span class="diag-tag">관계 점검</span></div>
      </div>
    </div>

  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="fi">
    <div class="fnotice">⚠️ 안내사항 · 본 사이트의 모든 콘텐츠는 정보 제공 목적이며, 학습 효과를 보장하지 않습니다.</div>
    <div class="ft">
      <div>
        <div class="flm" style="display:flex;align-items:center;gap:10px">
          <div style="width:34px;height:34px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span style="letter-spacing:2px"><em>올케어</em>스터디</span>
        </div>
        <p class="fdesc">초등학생부터 고등학생까지<br>학습에 필요한 모든 정보를 한곳에서</p>
      </div>
      <div class="fph"><span>📞 무료 상담 전화</span><strong>010-6834-8080</strong></div>
    </div>
    <div class="fb2">
      <span>© 2026 올케어스터디. All rights reserved.</span>
    </div>
  </div>
</footer>

<div class="floats" id="floats">
  <a class="fbtn fb1" href="tel:01068348080">📞 전화상담</a>
  <a class="fbtn fb2" href="/contact">✉️ 문의하기</a>
</div>
<script>
(function(){
  var floats = document.getElementById('floats');
  var footer = document.querySelector('footer');
  function adjustFloats(){
    var footerTop = footer.getBoundingClientRect().top;
    var windowH = window.innerHeight;
    var floatsH = floats.offsetHeight;
    if(footerTop < windowH){
      floats.style.bottom = (windowH - footerTop + 60) + 'px';
    } else {
      floats.style.bottom = '60px';
    }
  }
  window.addEventListener('scroll', adjustFloats);
  window.addEventListener('resize', adjustFloats);
  adjustFloats();
})();
</script>

<script>
function toggleMobileMenu(){
  const m=document.getElementById('mobMenu');
  const b=document.getElementById('hburg');
  m.classList.toggle('on');
  b.classList.toggle('on');
}

  document.querySelectorAll('#mega-'+menu+' .mega-tab').forEach((t,i)=>t.classList.remove('on'));
  document.querySelectorAll('#mega-'+menu+' .mega-panel').forEach(p=>p.classList.remove('on'));
  event.target.classList.add('on');
  document.getElementById(menu+'-'+tab).classList.add('on');
}

setInterval(()=>{cnt+=Math.floor(Math.random()*3);document.getElementById('vc').textContent=cnt.toLocaleString('ko-KR')+'명';},3000);
let cur=0;
function gs(n){cur=n;document.getElementById('hs').style.transform=\`translateX(-\${n*100}%)\`;document.querySelectorAll('.hdot').forEach((d,i)=>d.classList.toggle('on',i===n));}
setInterval(()=>gs((cur+1)%3),4500);
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:0.15});
document.querySelectorAll('.fu').forEach(el=>obs.observe(el));
</script>
</body>
</html>
`;
}

// ── 사이트맵 ──────────────────────────────────────────────

function serveSitemap() {
  const urls = [`<url><loc>https://allcarestudy.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`];

  // 강남구 동별 × 학년 × 과목 전체
  for (const dong of GANGNAM_DONGS) {
    for (const grade of Object.keys(GRADES)) {
      for (const subj of Object.keys(SUBJECTS)) {
        urls.push(`<url><loc>https://allcarestudy.com/seoul/gangnam/${DONG_EN[dong]||dong}/${GRADE_EN[grade]||grade}/${SUBJECT_EN[subj]||subj}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
      }
    }
  }

  // 기타 지역
  for (const [sido, r] of Object.entries(REGIONS)) {
    urls.push(`<url><loc>https://allcarestudy.com/${SIDO_EN[sido]||sido}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
    for (const ak of Object.keys(r.areas)) {
      urls.push(`<url><loc>https://allcarestudy.com/${SIDO_EN[sido]||sido}/${DISTRICT_EN[ak]||ak}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
    }
  }

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

// ── 라우터 ────────────────────────────────────────────────

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);
    const parts = path.split('/').filter(Boolean);
    const h = { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'public,max-age=3600' };

    // ── 문의 API ──────────────────────────────────────
    if (path === '/api/contact' && request.method === 'POST') {
      const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      };
      try {
        const body = await request.json();
        const { name, grade, phone, address, message } = body;
        if (!name || !grade || !phone || !address || !message) {
          return new Response(JSON.stringify({ ok: false, error: '필수 항목 누락' }), { headers: corsHeaders });
        }

        // Google Apps Script로 전송 (시트 기록 + 네이버 메일 발송)
        const GAS_URL = 'https://script.google.com/macros/s/AKfycbxWr1XcAQVsxPKgH9FbUaUcKAYCNzDoA-ngykhJ2ae4sCk562rT7bBe2sO7ym5-KdI2/exec';
        const gasRes = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, grade, phone, address, message })
        });
        const gasData = await gasRes.json();
        if (gasData.ok) {
          return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
        } else {
          console.error('GAS error:', gasData.error);
          return new Response(JSON.stringify({ ok: false, error: gasData.error }), { headers: corsHeaders });
        }
      } catch (e) {
        console.error('contact api error:', e);
        return new Response(JSON.stringify({ ok: false, error: e.message }), { headers: corsHeaders });
      }
    }

    if (path === '/sitemap.xml') return serveSitemap();

    // 문의하기
    if (path === '/contact') return new Response(makeContactPage(), { headers: h });

    // 학원소개
    if (path === '/academy/intro') return new Response(makeAcademyIntroPage(), { headers: h });

    // 학원 찾기
    if (path === '/academy' || path.startsWith('/academy/')) {
      return new Response(makeAcademyPage(), { headers: h });
    }
    if (path === '/robots.txt') return new Response('User-agent: *\nAllow: /\nSitemap: https://allcarestudy.com/sitemap.xml', { headers: { 'Content-Type': 'text/plain' } });

    // 홈
    if (parts.length === 0) return new Response(makeHomePage(), { headers: h });

    // 영문 URL 파싱
    // /seoul/gangnam/daichi/high/math (5단계 - 동 포함)
    if (parts.length === 5) {
      const kr = toKr(parts[0], parts[1], parts[2], parts[3], parts[4]);
      if (kr.sido === '서울' && kr.district === '강남구') {
        const page = makeDongArticle(kr.dong, kr.grade, kr.subject);
        if (page) return new Response(page, { headers: h });
      }
    }

    // /seoul/gangnam/high/math (4단계)
    if (parts.length === 4) {
      const kr = toKr(parts[0], parts[1], null, parts[2], parts[3]);
      const page = makeArticlePage(kr.sido, kr.district, kr.grade, kr.subject);
      if (page) return new Response(page, { headers: h });
    }

    // /seoul/gangnam/high (3단계 - 학년 선택)
    if (parts.length === 3) {
      const kr = toKr(parts[0], parts[1], null, parts[2], null);
      const rk = kr.sido; const ak = kr.district; const gk = kr.grade;
      const region = REGIONS[rk]; const area = region?.areas[ak]; const grade = GRADES[gk];
      if (region && area && grade) {
        const subjLinks = Object.entries(SUBJECTS).map(([s, v]) => {
          const url = enUrl(rk, ak, null, gk, s);
          return `<a class="subj-link" href="${url}"><span>${v.emoji} ${ak} ${gk} ${s}과외</span><span>→</span></a>`;
        }).join('');
        const body = `<div class="wrap">
<div class="bc"><a href="/">홈</a> › <a href="/${SIDO_EN[rk]||rk}">${region.label}</a> › <a href="/${SIDO_EN[rk]||rk}/${DISTRICT_EN[ak]||ak}">${ak}</a> › <span>${gk}</span></div>
<h1 class="art-title">${ak} ${gk} 과외 | 과목 선택</h1>
<div class="art-body"><h2>과목을 선택하세요</h2><div class="subj-grid">${subjLinks}</div></div>
<div class="cta-box"><h3>${ak} ${gk} 맞춤 과외</h3><p>무료 상담 신청</p>
<div class="cta-btns"><a class="btn-p" href="tel:01068348080">📞 010-6834-8080</a><a class="btn-o" href="/contact">✉️ 문의하기</a></div></div>
</div>`;
        const canon = `/${SIDO_EN[rk]||rk}/${DISTRICT_EN[ak]||ak}/${GRADE_EN[gk]||gk}`;
        return new Response(wrap(`${ak} ${gk} 과외`, `${ak} ${gk} 과목별 과외`, canon, body), { headers: h });
      }
    }

    // /seoul/gangnam (2단계)
    if (parts.length === 2) {
      const kr = toKr(parts[0], parts[1], null, null, null);
      const page = makeAreaPage(kr.sido, kr.district);
      if (page) return new Response(page, { headers: h });
    }

    // /seoul (1단계)
    if (parts.length === 1) {
      const kr = toKr(parts[0], null, null, null, null);
      const page = makeSidoPage(kr.sido);
      if (page) return new Response(page, { headers: h });
    }

    // 404
    return new Response(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>404 - 올케어스터디</title><style>${CSS}</style></head><body>
${HEADER}<div class="wrap" style="text-align:center;padding-top:80px">
<div style="font-size:64px;margin-bottom:20px">🔍</div>
<h1 class="art-title">페이지를 찾을 수 없습니다</h1>
<p style="color:var(--text-muted);margin-bottom:32px">요청하신 페이지가 없거나 이동되었습니다.</p>
<a href="/" class="btn-p" style="display:inline-block">홈으로 돌아가기</a>
</div>${FOOTER}</body></html>`, { status: 404, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
};
