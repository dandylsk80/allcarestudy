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


.wrap{max-width:900px;margin:0 auto;padding:48px 24px 80px}
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
.floats{position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:500}
.fbtn{display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;border:none;font-size:13px;font-weight:700;box-shadow:0 8px 32px rgba(15,32,68,.2);transition:all .25s;cursor:pointer;white-space:nowrap;text-decoration:none}
.fbtn:hover{transform:translateX(-4px)}.fb1{background:var(--blue);color:white}.fb2{background:var(--navy);color:white}
@media(max-width:768px){header{padding:0 16px}.gnav{display:none}.wrap{padding:32px 16px 60px}.subj-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr 1fr}.info-box{grid-template-columns:1fr 1fr}.cta-box{padding:24px 20px}footer{padding:20px 16px}.floats{right:12px;bottom:20px}.art-thumb{height:160px;font-size:56px}}
header{position:fixed;top:0;left:0;right:0;z-index:300;background:#ffffff;border-bottom:1px solid rgba(15,32,68,0.1);box-shadow:0 2px 16px rgba(15,32,68,0.06)}
.hw{max-width:1280px;margin:0 auto;padding:0 48px;height:136px;display:flex;align-items:center;gap:32px}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-mark{width:44px;height:44px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(29,78,216,0.35);flex-shrink:0}
.logo-name{display:flex;flex-direction:column;line-height:1.15}
.logo-main{font-size:20px;font-weight:900;letter-spacing:2px;color:#0A1628}
.logo-main em{font-style:normal;color:var(--sky)}
.logo-sub{font-size:10px;color:rgba(15,32,68,0.6);font-weight:700;letter-spacing:3px}
.vpill{border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:6px 18px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(255,255,255,0.06)}
.vpill .vl{font-size:10px;color:#374151;font-weight:600}
.vpill .vc{font-size:15px;font-weight:900;color:var(--sky);letter-spacing:-0.5px}
.gnb{margin-left:auto;display:flex;align-items:center;gap:2px}
.gi{position:relative}
.gb{display:flex;align-items:center;gap:5px;padding:8px 16px;border:none;background:none;font-size:14px;font-weight:700;color:#0F2044;border-radius:8px;transition:all .18s;white-space:nowrap}
.gb:hover{background:rgba(15,32,68,0.08);color:#1D4ED8}
.arr{width:14px;height:14px;transition:transform .2s;color:rgba(255,255,255,0.4)}
.gi:hover .arr{transform:rotate(180deg);color:var(--sky)}
.gi:hover .drop{opacity:1;visibility:visible}
.gi:hover .mega-drop{opacity:1;visibility:visible}
.hw{padding:0 16px;height:56px;gap:10px}
.logo-sub{display:none}
.logo-main{font-size:15px}
.logo-mark{width:32px;height:32px}
.vpill{padding:4px 10px}
.vpill .vc{font-size:13px}
.vpill .vl{font-size:9px}
.gnb{display:none}
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
        <div class="drop"><a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a></div>
      </div>
      <!-- 학원수업 -->
      <div class="gi">
        <button class="gb">학원수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="drop"><a href="#">학원 찾기</a><a href="#">학원 비교</a><a href="#">학원 후기</a></div>
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
</header>`;


const HEADER_DARK = `<header>
  <div class="hw">
    <a href="/" class="logo">
      <div class="logo-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="logo-name">
        <span class="logo-main" style="color:white"><em style="color:#60A5FA">올케어</em>스터디</span>
        <span class="logo-sub" style="color:rgba(255,255,255,0.45)">ALLCARE STUDY</span>
      </div>
    </a>

    <div class="vpill" style="border-color:rgba(255,255,255,0.2);background:rgba(255,255,255,0.06)">
      <span class="vl" style="color:rgba(255,255,255,0.5)">누적 방문자</span>
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
        <div class="drop"><a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a></div>
      </div>
      <!-- 학원수업 -->
      <div class="gi">
        <button class="gb">학원수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="drop"><a href="#">학원 찾기</a><a href="#">학원 비교</a><a href="#">학원 후기</a></div>
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
</header>`;

const FOOTER = `<footer style="background:#0F2044;padding:48px 0 28px">
  <div style="max-width:1100px;margin:0 auto;padding:0 48px">
    <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:10px 16px;margin-bottom:32px;font-size:12px;color:rgba(255,255,255,0.4);display:flex;align-items:center;gap:8px">
      <span>⚠️</span><span>안내사항 · 본 사이트의 모든 콘텐츠는 정보 제공 목적이며, 학습 효과를 보장하지 않습니다.</span>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 1.5fr;gap:40px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08)">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:34px;height:34px;background:linear-gradient(135deg,#1D4ED8,#3B82F6);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span style="font-size:20px;font-weight:900;letter-spacing:2px;color:white"><em style="font-style:normal;color:#60A5FA">올케어</em>스터디</span>
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.7">초등학생부터 고등학생까지<br>학습에 필요한 모든 정보를 한곳에서</p>
      </div>
      <div>
        <h5 style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:14px">지역별수업</h5>
        <a href="/seoul" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">서울 과외</a>
        <a href="/gyeonggi" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">경기 과외</a>
        <a href="/incheon" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">인천 과외</a>
      </div>
      <div>
        <h5 style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:14px">과목수업</h5>
        <a href="/seoul/gangnam/daichi/high/math" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">수학</a>
        <a href="/seoul/gangnam/daichi/high/english" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">영어</a>
        <a href="/seoul/gangnam/daichi/high/science" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">과학</a>
      </div>
      <div>
        <h5 style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:14px">고객지원</h5>
        <a href="https://naver.me/IMZ9N0ST" target="_blank" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">무료 상담</a>
        <a href="#" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">이용약관</a>
        <a href="#" style="display:block;font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:8px;text-decoration:none">개인정보처리방침</a>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:6px">📞 무료 상담 전화</div>
        <div style="font-size:20px;font-weight:900;color:white;letter-spacing:0;white-space:nowrap">010-6834-8080</div>
        <a href="tel:01068348080" style="display:inline-block;margin-top:10px;background:#3B82F6;color:white;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none">전화 상담</a>
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:20px;font-size:11px;color:rgba(255,255,255,0.3);flex-wrap:wrap;gap:8px">
      <span>© 2026 올케어스터디. All rights reserved.</span>
      <span>사업자등록번호: 000-00-00000</span>
    </div>
  </div>
</footer>
<div class="floats">
  <a class="fbtn fb1" href="tel:01068348080">📞 전화상담</a>
  <a class="fbtn fb2" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담</a>
</div>`;

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
  return page
    .replace('background:#ffffff;border-bottom:1px solid rgba(15,32,68,0.1);box-shadow:0 2px 16px rgba(15,32,68,0.06)', 
             'background:rgba(15,32,68,0.97);border-bottom:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(16px)');
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
    <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80" alt="${dong} ${grade} ${subject}과외" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.style.background='linear-gradient(135deg,#EFF6FF,#DBEAFE)';this.remove()">
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
      <a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
    </div>
  </div>

  <div class="related-title">🔗 강남구 인근 동 ${subject}과외</div>
  <div class="related-grid">${otherDongs}</div>
</div>`;

  return wrapDark(title, desc, canonical, body);
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
      <a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
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
        <a href="https://naver.me/IMZ9N0ST" target="_blank" style="background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.25);padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;text-align:center">✨ 무료상담 신청</a>
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
      <a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
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
      <a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
    </div>
  </div>
  <div class="related-title">🔗 주변 지역 ${sk}과외</div>
  <div class="related-grid">${relLinks}</div>
</div>`;
  return wrap(title, desc, `/${rk}/${ak}/${gk}/${sk}`, body);
}

// ── 홈페이지 ──────────────────────────────────────────────

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
.vpill{border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:6px 18px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(255,255,255,0.06)}
.vpill .vl{font-size:10px;color:#374151;font-weight:600}
.vpill .vc{font-size:15px;font-weight:900;color:var(--sky);letter-spacing:-0.5px}
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
.hero{margin-top:160px;position:relative;overflow:hidden}
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
.floats{position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:500}
.fbtn{display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;border:none;font-size:14px;font-weight:700;box-shadow:var(--shadow-lg);transition:all .25s;white-space:nowrap}
.fbtn:hover{transform:translateX(-4px) scale(1.03)}
.fb1{background:var(--blue);color:white}
.fb2c{background:var(--navy);color:white}

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
  .hw{padding:0 16px;height:56px;gap:10px}
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
  .hero{margin-top:160px}
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
        <div class="drop"><a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a></div>
      </div>
      <!-- 학원수업 -->
      <div class="gi">
        <button class="gb">학원수업<svg class="arr" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>
        <div class="drop"><a href="#">학원 찾기</a><a href="#">학원 비교</a><a href="#">학원 후기</a></div>
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
        <a href="#">수학</a><a href="#">영어</a><a href="#">과학</a><a href="#">국어</a><a href="#">사회/역사</a>
      </div>
    </div>
    <div class="mob-section">
      <div class="mob-title">🏫 학원수업</div>
      <div class="mob-links">
        <a href="#">학원 찾기</a><a href="#">학원 비교</a><a href="#">학원 후기</a>
      </div>
    </div>
    <div class="mob-cta">
      <button onclick="window.location.href='tel:01068348080'">📞 전화상담</button>
      <button onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">✨ 무료상담 신청</button>
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
            <button class="bph" onclick="window.location.href='/seoul'">지역별 과외 찾기 →</button>
            <button class="bps" onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">무료 상담 신청</button>
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
            <button class="bph">학원 찾기 →</button>
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
        <div class="flm"><em>올케어</em>스터디</div>
        <p class="fdesc">초등학생부터 고등학생까지<br>학습에 필요한 모든 정보를 한곳에서</p>
      </div>
      <div class="flinks">
        <div class="fc"><h5>지역별수업</h5><a href="#">서울 과외</a><a href="#">경기 과외</a><a href="#">인천 과외</a></div>
        <div class="fc"><h5>과목수업</h5><a href="#">수학</a><a href="#">영어</a><a href="#">과학</a></div>
        <div class="fc"><h5>고객지원</h5><a href="#">무료 상담</a><a href="#">이용약관</a><a href="#">개인정보처리방침</a></div>
      </div>
      <div class="fph"><span>📞 무료 상담 전화</span><strong>010-6834-8080</strong></div>
    </div>
    <div class="fb2">
      <span>© 2026 올케어스터디. All rights reserved.</span>
      <span>사업자등록번호: 000-00-00000</span>
    </div>
  </div>
</footer>

<div class="floats">
  <button class="fbtn fb1" onclick="window.location.href='tel:01068348080'">📞 전화상담</button>
  <button class="fbtn fb2c" onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">✨ 무료상담 신청</button>
</div>

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

    if (path === '/sitemap.xml') return serveSitemap();
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
<div class="cta-btns"><a class="btn-p" href="tel:01068348080">📞 010-6834-8080</a><a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담</a></div></div>
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
