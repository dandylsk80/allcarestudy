// ============================================================
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
header{background:var(--navy);padding:0 48px;height:64px;display:flex;align-items:center;gap:20px;position:sticky;top:0;z-index:200}
.logo{font-size:18px;font-weight:900;color:white}.logo em{font-style:normal;color:var(--sky)}
.gnav{margin-left:auto;display:flex;gap:20px}.gnav a{font-size:13px;color:rgba(255,255,255,.6);font-weight:500}.gnav a:hover{color:white}
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
`;

const HEADER = `<header>
  <a href="/" class="logo"><em>올케어</em>스터디</a>
  <nav class="gnav">
    <a href="/">홈</a>
    <a href="/서울/강남구">서울 강남구</a>
    <a href="/서울">서울</a>
  </nav>
</header>`;

const FOOTER = `<footer><div class="fi">
  <div class="fl"><em>올케어</em>스터디</div>
  <div class="fr">© 2026 올케어스터디. All rights reserved. | 010-6834-8080</div>
</div></footer>
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

// ── 강남구 동별 × 학년 × 과목 SEO 아티클 (2000자) ──────────────

function makeDongArticle(dong, grade, subject) {
  const sInfo = SUBJECT_INFO[subject];
  const gInfo = GRADES[grade];
  if (!sInfo || !gInfo) return null;

  const dongDesc = GANGNAM_DONG_INFO[dong] || `${dong}은 서울 강남구에 위치한 지역으로, 우수한 교육 환경을 갖추고 있습니다.`;
  const gradeDesc = sInfo[grade] || sInfo['고등'];

  const title = `${dong} ${grade} ${subject}과외 | 강남구 ${dong} ${gInfo.label} ${subject} 맞춤 1:1 과외 - 올케어스터디`;
  const desc = `${dong} ${grade} ${subject}과외 전문. 강남구 ${dong} 지역 ${gInfo.label} ${subject} 검증된 선생님과 1:1 맞춤 수업. 내신·수능 완벽 대비. 무료 상담 010-6834-8080`;
  const canonical = `/서울/강남구/${dong}/${grade}/${subject}`;

  // 관련 과목 링크
  const otherSubjects = Object.keys(SUBJECTS).filter(s => s !== subject).slice(0, 6)
    .map(s => `<a class="subj-link" href="/서울/강남구/${dong}/${grade}/${s}"><span>${SUBJECTS[s].emoji} ${dong} ${grade} ${s}과외</span><span>→</span></a>`)
    .join('');

  // 관련 동 링크
  const otherDongs = GANGNAM_DONGS.filter(d => d !== dong).slice(0, 3)
    .map(d => `<a class="rel-card" href="/서울/강남구/${d}/${grade}/${subject}"><div class="rc-tag">강남구 · ${d}</div><div class="rc-title">${d} ${grade} ${subject}과외 | 강남구 맞춤 1:1 과외</div></a>`)
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
  <div class="bc"><a href="/">홈</a> › <a href="/서울">서울특별시</a> › <a href="/서울/강남구">강남구</a> › <a href="/서울/강남구/${dong}/${grade}">${dong} ${grade}</a> › <span>${subject}과외</span></div>

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

  <div class="art-thumb">${SUBJECTS[subject].emoji}</div>

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

  return wrap(title, desc, canonical, body);
}

// ── 강남구 페이지 ──────────────────────────────────────────

function makeGangnamPage() {
  const gradeLinks = Object.keys(GRADES).map(g =>
    `<a href="/서울/강남구/${g}" class="tag" style="font-size:14px;padding:10px 20px">${g}</a>`
  ).join('');

  const dongCards = GANGNAM_DONGS.map(dong =>
    `<a href="/서울/강남구/${dong}/고등/수학" class="rel-card"><div class="rc-tag">강남구 · ${dong}</div><div class="rc-title">${dong} 과외 | 강남구 ${dong} 맞춤 1:1 과외</div></a>`
  ).join('');

  const subjLinks = Object.entries(SUBJECTS).map(([s, v]) =>
    `<a class="subj-link" href="/서울/강남구/대치동/고등/${s}"><span>${v.emoji} 강남구 고등 ${s}과외</span><span>→</span></a>`
  ).join('');

  const title = '강남구 과외 | 서울 강남구 대치동·압구정·역삼 맞춤 1:1 과외 - 올케어스터디';
  const desc = '강남구 과외 전문. 대치동, 압구정동, 역삼동, 청담동 등 강남구 전 지역 검증된 선생님. 수학, 영어, 국어, 과학 내신·수능 완벽 대비. 무료 상담 010-6834-8080';

  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/서울">서울특별시</a> › <span>강남구</span></div>

  <div class="art-tag">🏙 서울특별시 · 강남구</div>
  <h1 class="art-title">강남구 과외 | 대치동·압구정·역삼 맞춤 1:1 과외</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span><span>⏱ 3분</span></div>

  <div class="info-box">
    <div class="info-item"><div class="info-num">247명</div><div class="info-label">등록 선생님</div></div>
    <div class="info-item"><div class="info-num">98%</div><div class="info-label">만족도</div></div>
    <div class="info-item"><div class="info-num">무료</div><div class="info-label">상담 신청</div></div>
  </div>

  <div class="art-thumb">🏙</div>

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
  const distCards = Object.keys(r.areas).map(dist =>
    `<a href="/${rk}/${dist}" class="tag" style="font-size:14px;padding:10px 20px">${dist}</a>`
  ).join('');
  const title = `${r.label} 과외 | ${r.label} 지역별 맞춤 1:1 과외 - 올케어스터디`;
  const desc = `${r.label} 과외 전문. ${r.label} 전 지역 검증된 선생님. 수학, 영어, 국어, 과학 내신·수능 완벽 대비. 무료 상담 010-6834-8080`;
  const body = `<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <span>${r.label}</span></div>
  <div class="art-tag">${r.emoji} ${r.label}</div>
  <h1 class="art-title">${r.label} 과외 | 지역별 맞춤 1:1 과외 안내</h1>
  <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span></div>
  <div class="art-thumb">${r.emoji}</div>
  <div class="art-body">
    <h2>지역 선택</h2>
    <div class="tag-wrap"><div class="tag-label">📍 구/군 선택</div><div class="tags">${distCards}</div></div>
  </div>
  <div class="cta-box">
    <h3>${r.label} 맞춤 과외 신청</h3>
    <p>무료 상담을 신청하시면 전문 코디네이터가 연결해드립니다</p>
    <div class="cta-btns">
      <a class="btn-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
    </div>
  </div>
</div>`;
  return wrap(title, desc, `/${rk}`, body);
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
    `<a class="subj-link" href="/${rk}/${ak}/고등/${s}"><span>${v.emoji} ${ak} 고등 ${s}과외</span><span>→</span></a>`
  ).join('');
  const relAreas = Object.keys(region.areas).filter(a => a !== ak).slice(0, 3)
    .map(a => `<a class="rel-card" href="/${rk}/${a}"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} 과외 | ${a} 맞춤 과외</div></a>`).join('');

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
  return wrap(title, desc, `/${rk}/${ak}`, body);
}

// ── 기존 구/학년/과목 페이지 (강남구 외) ─────────────────────

function makeArticlePage(rk, ak, gk, sk) {
  const region = REGIONS[rk];
  const area = region?.areas[ak];
  const grade = GRADES[gk];
  const subj = SUBJECTS[sk];
  if (!region || !area || !grade || !subj) return null;

  const otherSubj = Object.entries(SUBJECTS).filter(([s]) => s !== sk).slice(0, 6)
    .map(([s, v]) => `<a class="subj-link" href="/${rk}/${ak}/${gk}/${s}"><span>${v.emoji} ${ak} ${gk} ${s}과외</span><span>→</span></a>`).join('');
  const relLinks = Object.keys(region.areas).filter(a => a !== ak).slice(0, 3)
    .map(a => `<a class="rel-card" href="/${rk}/${a}/${gk}/${sk}"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} ${gk} ${sk}과외</div></a>`).join('');
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

function makeHomePage() {
  const regionCards = Object.entries(REGIONS).map(([sido, r]) =>
    `<a href="/${sido}" style="display:flex;align-items:center;gap:12px;padding:16px 20px;background:white;border:1.5px solid var(--border);border-radius:12px;font-size:15px;font-weight:700;color:var(--text-dark);text-decoration:none;transition:all .2s"><span style="font-size:24px">${r.emoji}</span><span>${r.label}</span></a>`
  ).join('');

  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>올케어스터디 - 지역별 과외·학원 정보 No.1</title>
<meta name="description" content="전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼. 서울, 경기, 인천 등 내 지역 검증된 선생님 12,400명+. 수학, 영어, 과학 과외 무료 상담.">
<meta name="robots" content="index,follow">
<meta name="google-site-verification" content="st8_MGU2mfnaomGNCLUGBmiQsZD50WNTWEUxzfmJ47E">
<meta name="naver-site-verification" content="a1c57425042478220780bb530f8511e3eec2a1fd">
<link rel="canonical" href="https://allcarestudy.com/">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
<style>
:root{--navy:#0F2044;--navy-mid:#1E3A6E;--blue:#3B82F6;--blue-pale:#EFF6FF;--blue-border:#BFDBFE;--sky:#60A5FA;--text-dark:#0F2044;--text-mid:#374151;--text-muted:#9CA3AF;--bg:#F8FAFF;--border:#E5E7EB;--shadow:0 4px 24px rgba(0,0,0,0.09);--shadow-lg:0 12px 48px rgba(15,32,68,0.15);--radius:14px}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:'Pretendard',-apple-system,sans-serif;background:var(--bg);color:var(--text-dark)}
a{text-decoration:none;color:inherit}button{cursor:pointer;font-family:inherit}

/* HEADER */
header{position:fixed;top:0;left:0;right:0;z-index:300;background:rgba(15,32,68,0.97);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.08)}
.hw{max-width:1280px;margin:0 auto;padding:0 48px;height:80px;display:flex;align-items:center;gap:32px}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-mark{width:38px;height:38px;background:linear-gradient(135deg,var(--blue),var(--sky));border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(59,130,246,0.4)}
.logo-name{display:flex;flex-direction:column;line-height:1.15}
.logo-main{font-size:18px;font-weight:900;letter-spacing:-0.5px;color:white}
.logo-main em{font-style:normal;color:var(--sky)}
.logo-sub{font-size:10px;color:rgba(255,255,255,0.4);font-weight:500;letter-spacing:0.5px}
.vpill{border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:8px 20px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(255,255,255,0.06)}
.vpill .vl{font-size:10px;color:rgba(255,255,255,0.45);font-weight:500}
.vpill .vc{font-size:16px;font-weight:900;color:var(--sky);letter-spacing:-0.5px}
.gnb{margin-left:auto;display:flex;align-items:center;gap:2px}
.gb{display:flex;align-items:center;gap:5px;padding:8px 16px;border:none;background:none;font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);border-radius:8px;transition:all .18s;white-space:nowrap}
.gb:hover{background:rgba(255,255,255,0.1);color:white}

/* HERO */
.hero{margin-top:80px;background:linear-gradient(130deg,#0F2044 0%,#1E3A6E 50%,#1D4ED8 100%);padding:80px 48px;min-height:500px;display:flex;align-items:center}
.hero-inner{max-width:1280px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(96,165,250,.15);border:1px solid rgba(96,165,250,.25);border-radius:999px;padding:5px 16px;font-size:12px;font-weight:700;color:var(--sky);margin-bottom:20px}
.hero-dot{width:6px;height:6px;background:var(--sky);border-radius:50%;animation:blink 1.6s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.hero-title{font-size:clamp(30px,3.5vw,52px);font-weight:900;line-height:1.15;letter-spacing:-1.5px;color:white;margin-bottom:16px}
.hero-title .hl{color:var(--sky)}
.hero-desc{font-size:15px;color:rgba(255,255,255,.65);line-height:1.7;margin-bottom:32px}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn-hero-p{background:var(--blue);color:white;border:none;padding:15px 32px;border-radius:12px;font-size:15px;font-weight:700;transition:all .2s;box-shadow:0 6px 20px rgba(59,130,246,.4);text-decoration:none;display:inline-block}
.btn-hero-p:hover{background:#2563EB;transform:translateY(-2px)}
.btn-hero-s{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.25);padding:15px 26px;border-radius:12px;font-size:15px;font-weight:600;transition:all .2s;text-decoration:none;display:inline-block}
.btn-hero-s:hover{background:rgba(255,255,255,.18)}

/* HERO 오른쪽 - 사람 이미지 + 카드 */
.hero-visual{position:relative;display:flex;align-items:center;justify-content:center}
.hero-img-wrap{position:relative;width:100%;max-width:420px}
.hero-person{width:100%;border-radius:20px;object-fit:cover;height:360px;background:linear-gradient(135deg,rgba(59,130,246,0.3),rgba(96,165,250,0.2));display:flex;align-items:center;justify-content:center;font-size:120px;border:1px solid rgba(255,255,255,0.1)}
.stat-card{position:absolute;background:rgba(255,255,255,.12);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:16px 20px}
.stat-card.tl{top:-20px;left:-20px}
.stat-card.br{bottom:-20px;right:-20px}
.stat-num{font-size:24px;font-weight:900;color:white;letter-spacing:-0.5px}
.stat-label{font-size:11px;color:rgba(255,255,255,.55);margin-top:2px}

/* STATS */
.stats{background:white;padding:48px 0;border-bottom:1px solid var(--border)}
.stats-inner{max-width:1280px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.stat-item{text-align:center;padding:24px}
.stat-icon{font-size:32px;margin-bottom:10px}
.stat-n{font-size:36px;font-weight:900;color:var(--navy-mid);letter-spacing:-1px}
.stat-l{font-size:13px;color:var(--text-muted);margin-top:4px}

/* PEOPLE SECTION */
.people{padding:80px 0;background:var(--bg)}
.people-inner{max-width:1280px;margin:0 auto;padding:0 48px}
.section-header{text-align:center;margin-bottom:52px}
.section-label{display:inline-block;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--blue);margin-bottom:10px}
.section-title{font-size:clamp(22px,3vw,34px);font-weight:900;letter-spacing:-1px;color:var(--navy);line-height:1.25}
.section-title .hl{color:var(--blue)}
.people-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.people-card{background:white;border-radius:20px;overflow:hidden;border:1px solid var(--border);transition:all .3s}
.people-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg)}
.people-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:80px;position:relative;overflow:hidden}
.pi1{background:linear-gradient(135deg,#667eea,#764ba2)}
.pi2{background:linear-gradient(135deg,#f093fb,#f5576c)}
.pi3{background:linear-gradient(135deg,#4facfe,#00f2fe)}
.people-img img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.people-info{padding:20px}
.people-name{font-size:16px;font-weight:800;color:var(--navy);margin-bottom:4px}
.people-desc{font-size:13px;color:var(--text-muted);line-height:1.6}
.people-tag{display:inline-block;background:var(--blue-pale);color:var(--blue);font-size:11px;font-weight:700;padding:3px 10px;border-radius:6px;margin-top:8px}

/* REGION */
.region-section{padding:80px 0;background:white}
.region-inner{max-width:1280px;margin:0 auto;padding:0 48px}
.region-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:32px}
.region-card{display:flex;align-items:center;gap:12px;padding:16px 20px;background:var(--bg);border:1.5px solid var(--border);border-radius:12px;font-size:15px;font-weight:700;color:var(--text-dark);transition:all .2s}
.region-card:hover{background:var(--blue-pale);border-color:var(--blue);color:var(--blue);transform:translateY(-2px)}

/* REVIEWS */
.reviews{padding:80px 0;background:var(--blue-pale);overflow:hidden}
.rw{margin-top:48px;overflow:hidden}
.rt{display:flex;gap:20px;animation:scrollL 30s linear infinite;width:max-content}
.rt:hover{animation-play-state:paused}
@keyframes scrollL{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.rc{width:280px;flex-shrink:0;background:white;border-radius:var(--radius);padding:22px;box-shadow:0 1px 6px rgba(0,0,0,.06);border:1px solid var(--blue-border)}
.rb{display:inline-block;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;color:white;margin-bottom:12px}
.rtitle{font-size:15px;font-weight:800;color:var(--navy);margin-bottom:8px;line-height:1.35}
.rtext{font-size:13px;color:var(--text-mid);line-height:1.6;margin-bottom:14px}
.rname{font-size:12px;color:var(--text-muted)}
.rstar{color:#FBBF24;font-size:13px;margin-bottom:6px}

/* CTA SECTION */
.cta-section{padding:80px 0;background:linear-gradient(135deg,var(--navy),var(--navy-mid))}
.cta-inner{max-width:800px;margin:0 auto;padding:0 48px;text-align:center}
.cta-inner h2{font-size:clamp(24px,3vw,38px);font-weight:900;color:white;letter-spacing:-1px;margin-bottom:12px}
.cta-inner p{font-size:15px;color:rgba(255,255,255,.65);margin-bottom:36px}
.cta-inner-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

/* FOOTER */
footer{background:var(--navy);padding:48px 0 32px}
.fi{max-width:1280px;margin:0 auto;padding:0 48px}
.ft{display:flex;justify-content:space-between;padding-bottom:32px;margin-bottom:24px;border-bottom:1px solid rgba(255,255,255,.08);gap:48px;flex-wrap:wrap}
.flm{font-size:20px;font-weight:900;color:white}.flm em{font-style:normal;color:var(--sky)}
.fdesc{font-size:13px;line-height:1.7;color:rgba(255,255,255,.45);margin-top:8px;max-width:260px}
.flinks{display:flex;gap:48px;flex-wrap:wrap}
.fc h5{color:rgba(255,255,255,.8);font-size:13px;font-weight:700;margin-bottom:14px}
.fc a{display:block;font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px;transition:color .2s}
.fc a:hover{color:rgba(255,255,255,.8)}
.fph{text-align:right}
.fph span{font-size:11px;color:rgba(255,255,255,.4);display:block;margin-bottom:4px}
.fph strong{font-size:22px;font-weight:900;color:white;letter-spacing:-.5px}
.fb2{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:rgba(255,255,255,.35);flex-wrap:wrap;gap:8px}

/* FLOATS */
.floats{position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:500}
.fbtn{display:flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;border:none;font-size:14px;font-weight:700;box-shadow:var(--shadow-lg);transition:all .25s;white-space:nowrap;text-decoration:none;cursor:pointer}
.fbtn:hover{transform:translateX(-4px) scale(1.03)}
.fb1{background:var(--blue);color:white}.fb2c{background:var(--navy);color:white}

@media(max-width:768px){
  .hw{padding:0 16px;height:64px}
  .gnb{display:none}
  .logo-sub{display:none}
  .vpill{padding:5px 12px}
  .hero{margin-top:64px;padding:48px 20px}
  .hero-inner{grid-template-columns:1fr;gap:32px}
  .hero-visual{display:none}
  .stats-inner{grid-template-columns:1fr 1fr;padding:0 16px}
  .people-inner{padding:0 16px}
  .people-grid{grid-template-columns:1fr}
  .region-inner{padding:0 16px}
  .cta-inner{padding:0 20px}
  .fi{padding:0 16px}
  .ft{flex-direction:column;gap:24px}
  .fph{text-align:left}
  .fb2{flex-direction:column;align-items:flex-start}
  .floats{right:12px;bottom:24px}
}
</style>
</head>
<body>

<header>
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
      <button class="gb" onclick="location.href='/서울'">지역별수업</button>
      <button class="gb" onclick="location.href='/서울/강남구/대치동/고등/수학'">과목수업</button>
      <button class="gb">학원수업</button>
    </nav>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="hero-badge"><div class="hero-dot"></div> No.1 지역별 과외 플랫폼</div>
      <h1 class="hero-title">내 지역 최고의<br><span class="hl">1:1 맞춤 과외</span><br>지금 찾아보세요</h1>
      <p class="hero-desc">전국 검증된 선생님 12,400명+<br>지역별·과목별·학년별로 딱 맞는 수업 연결</p>
      <div class="hero-btns">
        <a class="btn-hero-p" href="/서울/강남구">지역별 과외 찾기 →</a>
        <a class="btn-hero-s" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-img-wrap">
        <div class="hero-person">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="과외 수업 모습" style="border-radius:20px" onerror="this.parentElement.innerHTML='👩‍🏫'">
        </div>
        <div class="stat-card tl">
          <div class="stat-num">98%</div>
          <div class="stat-label">학습 만족도</div>
        </div>
        <div class="stat-card br">
          <div class="stat-num">+23점</div>
          <div class="stat-label">평균 성적 향상</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="stats">
  <div class="stats-inner">
    <div class="stat-item"><div class="stat-icon">🏆</div><div class="stat-n">35년</div><div class="stat-l">No.1 학습코칭</div></div>
    <div class="stat-item"><div class="stat-icon">👨‍🏫</div><div class="stat-n">12,400명</div><div class="stat-l">검증된 선생님</div></div>
    <div class="stat-item"><div class="stat-icon">📈</div><div class="stat-n">100만명</div><div class="stat-l">누적 수강생</div></div>
    <div class="stat-item"><div class="stat-icon">⭐</div><div class="stat-n">96.7%</div><div class="stat-l">학습 만족도</div></div>
  </div>
</section>

<!-- 선생님 소개 -->
<section class="people">
  <div class="people-inner">
    <div class="section-header">
      <div class="section-label">OUR TEACHERS</div>
      <h2 class="section-title">검증된 선생님과<br><span class="hl">직접 만나보세요</span></h2>
    </div>
    <div class="people-grid">
      <div class="people-card">
        <div class="people-img pi1">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="수학 선생님" onerror="this.parentElement.innerHTML='👩‍🏫'">
        </div>
        <div class="people-info">
          <div class="people-name">김지은 선생님</div>
          <div class="people-desc">서울대 수학교육과 졸업 · 강남구 내신 전문 · 7년 경력</div>
          <span class="people-tag">수학 전문</span>
        </div>
      </div>
      <div class="people-card">
        <div class="people-img pi2">
          <img src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80" alt="영어 선생님" onerror="this.parentElement.innerHTML='👨‍🏫'">
        </div>
        <div class="people-info">
          <div class="people-name">박민준 선생님</div>
          <div class="people-desc">연세대 영어영문학과 졸업 · 수능 영어 1등급 전문 · 5년 경력</div>
          <span class="people-tag">영어 전문</span>
        </div>
      </div>
      <div class="people-card">
        <div class="people-img pi3">
          <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&q=80" alt="과학 선생님" onerror="this.parentElement.innerHTML='👩‍🔬'">
        </div>
        <div class="people-info">
          <div class="people-name">이수현 선생님</div>
          <div class="people-desc">KAIST 물리학과 졸업 · 과학올림피아드 코치 · 8년 경력</div>
          <span class="people-tag">과학 전문</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 지역별 -->
<section class="region-section">
  <div class="region-inner">
    <div class="section-header">
      <div class="section-label">REGION</div>
      <h2 class="section-title">📍 내 지역 과외 찾기</h2>
    </div>
    <div class="region-grid">${regionCards}</div>
  </div>
</section>

<!-- 후기 -->
<section class="reviews">
  <div style="max-width:1280px;margin:0 auto;padding:0 48px">
    <div class="section-header">
      <div class="section-label">REAL REVIEWS</div>
      <h2 class="section-title">학부모·학생의<br><span class="hl">생생한 성적 향상 후기</span></h2>
    </div>
  </div>
  <div class="rw">
    <div class="rt">
      <div class="rc"><span class="rb" style="background:#1D4ED8">연세대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">6개월 만에 내신 4등급 → 1등급</div><div class="rtext">코치 선생님이 제 약점을 정확히 짚어주셔서 단기간에 성적이 확 올랐어요.</div><div class="rname">이*윤 회원 (고2)</div></div>
      <div class="rc"><span class="rb" style="background:#15803D">이화여대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수시 학생부로 이화여대 합격!</div><div class="rtext">학생기록부 관리부터 면접 준비까지 체계적으로 도와주셔서 합격할 수 있었어요.</div><div class="rname">김*연 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#7C3AED">서울대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수능 수학 2등급 → 만점!</div><div class="rtext">올케어스터디 덕분에 제 실력이 어느 정도인지 정확히 알고 집중 공략할 수 있었습니다.</div><div class="rname">정*원 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#B45309">경희대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">중학생 때부터 시작해서 목표 달성</div><div class="rtext">중2 때부터 꾸준히 관리받았더니 고3이 되니 여유가 생기더라고요.</div><div class="rname">전*빈 회원 학부모</div></div>
      <div class="rc"><span class="rb" style="background:#0F766E">고려대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">공부 습관이 완전히 바뀌었어요</div><div class="rtext">스스로 계획 세우고 실천하는 법을 배웠어요. 성적보다 공부 자신감이 생겼어요.</div><div class="rname">박*준 회원 (중3)</div></div>
      <div class="rc"><span class="rb" style="background:#BE185D">한양대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">아이가 먼저 공부하겠다고 해요</div><div class="rtext">예전엔 억지로 책상에 앉혔는데, 지금은 스스로 계획 짜고 공부합니다.</div><div class="rname">최*아 회원 학부모</div></div>
      <div class="rc"><span class="rb" style="background:#1D4ED8">연세대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">6개월 만에 내신 4등급 → 1등급</div><div class="rtext">코치 선생님이 제 약점을 정확히 짚어주셔서 단기간에 성적이 확 올랐어요.</div><div class="rname">이*윤 회원 (고2)</div></div>
      <div class="rc"><span class="rb" style="background:#15803D">이화여대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수시 학생부로 이화여대 합격!</div><div class="rtext">학생기록부 관리부터 면접 준비까지 체계적으로 도와주셔서 합격할 수 있었어요.</div><div class="rname">김*연 회원 (고3)</div></div>
      <div class="rc"><span class="rb" style="background:#7C3AED">서울대 합격</span><div class="rstar">★★★★★</div><div class="rtitle">수능 수학 2등급 → 만점!</div><div class="rtext">올케어스터디 덕분에 집중 공략할 수 있었습니다.</div><div class="rname">정*원 회원 (고3)</div></div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="cta-inner">
    <h2>지금 바로 무료 상담 신청</h2>
    <p>전문 코디네이터가 24시간 내 최적의 선생님을 연결해드립니다</p>
    <div class="cta-inner-btns">
      <a class="btn-hero-p" href="tel:01068348080">📞 전화 상담 010-6834-8080</a>
      <a class="btn-hero-s" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담 신청</a>
    </div>
  </div>
</section>

<footer>
  <div class="fi">
    <div class="ft">
      <div>
        <div class="flm"><em>올케어</em>스터디</div>
        <p class="fdesc">초등학생부터 고등학생까지<br>학습에 필요한 모든 정보를 한곳에서</p>
      </div>
      <div class="flinks">
        <div class="fc"><h5>지역별수업</h5><a href="/서울">서울 과외</a><a href="/경기">경기 과외</a><a href="/인천">인천 과외</a></div>
        <div class="fc"><h5>과목수업</h5><a href="/서울/강남구/대치동/고등/수학">수학</a><a href="/서울/강남구/대치동/고등/영어">영어</a><a href="/서울/강남구/대치동/고등/과학">과학</a></div>
        <div class="fc"><h5>고객지원</h5><a href="https://naver.me/IMZ9N0ST" target="_blank">무료 상담</a><a href="#">이용약관</a><a href="#">개인정보처리방침</a></div>
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
  <a class="fbtn fb1" href="tel:01068348080">📞 전화상담</a>
  <a class="fbtn fb2c" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담</a>
</div>

<script>
let cnt = 353112;
setInterval(()=>{cnt+=Math.floor(Math.random()*3);document.getElementById('vc').textContent=cnt.toLocaleString('ko-KR')+'명';},3000);
</script>
</body></html>`;
}

// ── 사이트맵 ──────────────────────────────────────────────

function serveSitemap() {
  const urls = [`<url><loc>https://allcarestudy.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`];

  // 강남구 동별 × 학년 × 과목 전체
  for (const dong of GANGNAM_DONGS) {
    for (const grade of Object.keys(GRADES)) {
      for (const subj of Object.keys(SUBJECTS)) {
        urls.push(`<url><loc>https://allcarestudy.com/서울/강남구/${dong}/${grade}/${subj}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`);
      }
    }
  }

  // 기타 지역
  for (const [sido, r] of Object.entries(REGIONS)) {
    urls.push(`<url><loc>https://allcarestudy.com/${sido}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
    for (const ak of Object.keys(r.areas)) {
      urls.push(`<url><loc>https://allcarestudy.com/${sido}/${ak}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
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

    // /서울/강남구/대치동/고등/수학 (동 포함 5단계)
    if (parts.length === 5 && parts[0] === '서울' && parts[1] === '강남구') {
      const [, , dong, grade, subject] = parts;
      const page = makeDongArticle(dong, grade, subject);
      if (page) return new Response(page, { headers: h });
    }

    // /서울/강남구/고등 (3단계 - 학년 선택)
    if (parts.length === 3) {
      const [rk, ak, gk] = parts;
      if (REGIONS[rk]?.areas[ak] && GRADES[gk]) {
        const region = REGIONS[rk];
        const area = region.areas[ak];
        const grade = GRADES[gk];
        const subjLinks = Object.entries(SUBJECTS).map(([s, v]) =>
          `<a class="subj-link" href="/${rk}/${ak}/${gk}/${s}"><span>${v.emoji} ${ak} ${gk} ${s}과외</span><span>→</span></a>`
        ).join('');
        const body = `<div class="wrap">
<div class="bc"><a href="/">홈</a> › <a href="/${rk}">${region.label}</a> › <a href="/${rk}/${ak}">${ak}</a> › <span>${gk}</span></div>
<h1 class="art-title">${ak} ${gk} 과외 | 과목 선택</h1>
<div class="art-body"><h2>과목을 선택하세요</h2><div class="subj-grid">${subjLinks}</div></div>
<div class="cta-box"><h3>${ak} ${gk} 맞춤 과외</h3><p>무료 상담 신청</p>
<div class="cta-btns"><a class="btn-p" href="tel:01068348080">📞 010-6834-8080</a><a class="btn-o" href="https://naver.me/IMZ9N0ST" target="_blank">✨ 무료상담</a></div></div>
</div>`;
        return new Response(wrap(`${ak} ${gk} 과외`, `${ak} ${gk} 과목별 과외`, `/${rk}/${ak}/${gk}`, body), { headers: h });
      }
    }

    // /서울/강남구/고등/수학 (4단계)
    if (parts.length === 4) {
      const [rk, ak, gk, sk] = parts;
      const page = makeArticlePage(rk, ak, gk, sk);
      if (page) return new Response(page, { headers: h });
    }

    // /서울/강남구 (2단계)
    if (parts.length === 2) {
      const page = makeAreaPage(parts[0], parts[1]);
      if (page) return new Response(page, { headers: h });
    }

    // /서울 (1단계)
    if (parts.length === 1) {
      const page = makeSidoPage(parts[0]);
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
