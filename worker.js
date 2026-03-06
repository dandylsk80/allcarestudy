// =============================================
// 올케어스터디 Cloudflare Workers
// URL: /서울/강남구/고등/수학/ → 동적 HTML 생성
// =============================================

const REGIONS = {
  '서울': {
    label: '서울특별시', emoji: '🏙',
    areas: {
      '강남구': { dongs:['대치동','압구정동','청담동','역삼동','개포동','도곡동','삼성동','일원동','수서동','세곡동'], feature:'대한민국 최고 교육특구. 대치동 학원가 중심, 내신 난이도 전국 최상위권. 경시대회 수준 문제 출제.' },
      '강동구': { dongs:['천호동','성내동','길동','둔촌동','명일동','고덕동','상일동','강일동','암사동'], feature:'강남과 인접한 교육 중심지. 고덕·명일 학군이 우수하며 재건축 이후 교육 수요 급증.' },
      '강북구': { dongs:['미아동','번동','수유동','우이동'], feature:'강북 생활권 중심. 합리적 비용으로 내신 1:1 관리 수요 높음.' },
      '강서구': { dongs:['화곡동','가양동','마곡동','염창동','등촌동','방화동'], feature:'마곡 신도시 개발로 교육 인프라 급성장. 초중등 과외 수요 지속 증가.' },
      '관악구': { dongs:['신림동','봉천동','청룡동','남현동'], feature:'서울대 인근 학군. 대학생 과외 교사 풀 풍부, 비용 대비 우수한 교육 환경.' },
      '광진구': { dongs:['자양동','구의동','광장동','중곡동','능동','화양동','군자동'], feature:'건대·세종대 인근. 중고등 내신 관리 수요 높고 어학 과외 인기.' },
      '노원구': { dongs:['월계동','공릉동','하계동','중계동','상계동'], feature:'중계동 학원가 형성. 강남 다음으로 교육열 높은 지역, 수능 준비 특화.' },
      '동작구': { dongs:['사당동','상도동','노량진동','흑석동','대방동'], feature:'노량진 공무원 시험 메카. 고등 수능 준비와 초중등 내신 관리 모두 활발.' },
      '마포구': { dongs:['합정동','홍대앞','상수동','망원동','연남동','서교동','공덕동'], feature:'홍대·공덕 문화·교육 복합지역. 영어·예술 계열 과외 수요 높음.' },
      '서대문구': { dongs:['신촌동','연희동','홍제동','홍은동','북가좌동','남가좌동'], feature:'연세대·이화여대 인근. 대학생 과외 공급 풍부, 어학·논술 특화.' },
      '서초구': { dongs:['방배동','반포동','잠원동','서초동','양재동','우면동','내곡동'], feature:'강남구와 함께 서울 최고 교육 지역. 반포·방배 학군 우수, 내신 경쟁 치열.' },
      '성동구': { dongs:['왕십리동','행당동','사근동','금호동','옥수동','성수동','마장동'], feature:'뚝섬·성수 개발로 교육 수요 급증. 한양대 인근 학군 우수.' },
      '송파구': { dongs:['잠실동','석촌동','문정동','장지동','거여동','마천동','풍납동','방이동'], feature:'잠실·문정 학군 우수. 롯데월드·올림픽공원 인근 신흥 교육 중심지.' },
      '양천구': { dongs:['목동','신정동','신월동'], feature:'목동 학원가 전국 2위. 수학·영어 특화 교육, 내신 경쟁 매우 치열.' },
      '영등포구': { dongs:['영등포동','여의도동','당산동','신길동','대림동','도림동'], feature:'여의도 금융중심 인근. 영어 조기교육·수능 준비 수요 균형.' },
      '용산구': { dongs:['이태원동','한남동','서빙고동','이촌동','후암동','청파동'], feature:'한남·이촌 고급 주거지. 외국어·국제학교 대비 과외 수요 높음.' },
      '은평구': { dongs:['응암동','역촌동','불광동','갈현동','구산동','대조동','신사동','녹번동','진관동'], feature:'뉴타운 개발로 교육 인프라 성장. 초중등 수학·영어 과외 수요 증가.' },
      '종로구': { dongs:['청운동','효자동','사직동','삼청동','가회동','혜화동','명륜동'], feature:'성균관대·서울대병원 인근. 의대 준비·논술·어학 특화 과외 인기.' },
      '중구': { dongs:['명동','회현동','충무로동','필동','장충동','신당동','다산동','약수동'], feature:'서울 중심부. 다양한 교육 수요, 외국어·예체능 과외 활발.' },
      '중랑구': { dongs:['면목동','상봉동','중화동','묵동','망우동','신내동'], feature:'중랑천 주변 주거지. 내신 관리 중심 실속형 과외 수요 높음.' },
      '성북구': { dongs:['길음동','정릉동','종암동','하월곡동','장위동','석관동'], feature:'고려대·한국예술종합학교 인근. 내신·수능 균형 지원 수요.' },
      '도봉구': { dongs:['쌍문동','방학동','창동','도봉동'], feature:'창동 신경제 중심지 개발 중. 중고등 내신 1:1 관리 수요 증가.' },
      '동대문구': { dongs:['전농동','답십리동','장안동','청량리동','회기동','이문동','휘경동'], feature:'경희대·한국외대 인근. 어학 특화 과외와 내신 관리 수요 균형.' },
      '구로구': { dongs:['구로동','신도림동','개봉동','오류동','고척동','항동'], feature:'G밸리 직주근접 지역. 초등 영어·수학 조기교육 수요 높음.' },
      '금천구': { dongs:['가산동','독산동','시흥동'], feature:'중소기업 밀집 지역. 실용적 학습 수요 높으며 내신 관리 중심.' },
    }
  },
  '경기': {
    label: '경기도', emoji: '🌿',
    areas: {
      '수원시': { dongs:['팔달구','영통구','권선구','장안구'], feature:'경기도청 소재지. 삼성전자 수원캠퍼스 인근, 이공계 특화 교육 수요 높음.' },
      '성남시': { dongs:['분당구','수정구','중원구'], feature:'분당 1기 신도시. 판교 IT벨트 인근, 수학·코딩 과외 수요 최상위권.' },
      '용인시': { dongs:['기흥구','수지구','처인구'], feature:'수지·기흥 신흥 학군. 강남 못지않은 교육열, 내신 경쟁 치열.' },
      '고양시': { dongs:['일산동구','일산서구','덕양구'], feature:'일산 2기 신도시. 출판·방송 산업 밀집, 어학·예술 과외 수요 높음.' },
      '부천시': { dongs:['원미구','소사구','오정구'], feature:'서울 인접 위성도시. 내신 관리·수능 준비 균형 수요.' },
      '안양시': { dongs:['만안구','동안구'], feature:'평촌 학원가 유명. 수학·영어 집중 교육, 경쟁률 높은 학군.' },
      '안산시': { dongs:['단원구','상록구'], feature:'반월·시화 공단 인근. 다문화 교육·기초학력 보완 수요.' },
      '남양주시': { dongs:['다산동','퇴계원','별내동','화도읍'], feature:'다산 신도시 급성장. 초중등 수학·영어 수요 빠르게 증가.' },
      '화성시': { dongs:['동탄1신도시','동탄2신도시','봉담읍'], feature:'동탄 신도시 폭발적 성장. 젊은 학부모 많아 조기교육 수요 전국 최상위.' },
      '평택시': { dongs:['평택동','포승읍','안중읍','고덕국제신도시'], feature:'삼성·LG 반도체 클러스터. 이공계·영어 수요 급증.' },
      '파주시': { dongs:['운정신도시','금촌동','문산읍'], feature:'운정 신도시 성장. 초중등 교육 수요 꾸준히 증가.' },
      '의정부시': { dongs:['의정부동','가능동','장암동','녹양동'], feature:'경기 북부 중심. 내신 관리·수능 준비 수요 높음.' },
      '하남시': { dongs:['미사강변도시','위례신도시','덕풍동'], feature:'서울 동남부 인접. 미사·위례 신도시 교육 수요 급증.' },
      '김포시': { dongs:['한강신도시','장기동','구래동'], feature:'한강 신도시 성장. 서울 직주근접, 초중등 영어·수학 수요.' },
      '광주시': { dongs:['경안동','오포읍','곤지암읍'], feature:'성남·하남 인접 주거지역. 중고등 내신 관리 수요.' },
      '시흥시': { dongs:['정왕동','은행동','배곧신도시'], feature:'배곧 신도시 성장. 젊은 가족 증가로 초등 과외 수요 급증.' },
      '군포시': { dongs:['산본동','당정동','속달동'], feature:'산본 신도시. 수도권 교육 수요 안정적.' },
      '의왕시': { dongs:['내손동','포일동','오전동'], feature:'안양·수원 인접. 중소도시 맞춤형 내신 관리 수요.' },
      '과천시': { dongs:['과천동','갈현동','문원동'], feature:'정부과천청사 인근. 공무원 자녀 교육 수요, 안정적 학습 환경.' },
      '광명시': { dongs:['광명동','철산동','하안동'], feature:'서울 서남부 인접. 내신 관리 중심 과외 수요.' },
    }
  },
  '충청': {
    label: '충청도', emoji: '🌾',
    areas: {
      '대전': { dongs:['유성구','서구','중구','동구','대덕구'], feature:'대덕연구단지 인근. 과학고·영재학교 입시 특화, 이공계 수요 전국 최상위.' },
      '세종': { dongs:['어진동','나성동','보람동','새롬동'], feature:'행정중심복합도시. 공무원 자녀 교육 수요, 균형잡힌 학습 환경.' },
      '청주시': { dongs:['흥덕구','서원구','청원구','상당구'], feature:'충북 최대 도시. 내신 관리·수능 준비 균형, SK하이닉스 종사자 자녀 이공계 수요.' },
      '천안시': { dongs:['서북구','동남구'], feature:'충남 최대 도시. 삼성·현대 인근, 이공계·영어 수요 높음.' },
      '아산시': { dongs:['배방읍','온양동','탕정면'], feature:'삼성디스플레이 인근. 기업도시 특성상 이공계 과외 수요.' },
      '공주시': { dongs:['공주읍','유구읍','이인면'], feature:'충남 역사문화도시. 국립공주대 인근, 인문계 과외 수요.' },
      '충주시': { dongs:['충주시내','목행동','용산동'], feature:'충북 제2도시. 내신 관리 중심 수요.' },
    }
  },
  '경상': {
    label: '경상도', emoji: '🌊',
    areas: {
      '부산': { dongs:['해운대구','수영구','연제구','동래구','부산진구','남구'], feature:'동남권 최대 도시. 해운대·수영 학군 우수, 부산 내신 최상위권.' },
      '대구': { dongs:['수성구','달서구','북구','동구','중구'], feature:'수성구 학원가 전국 3위권. 수학·영어 집중, 내신 경쟁 치열.' },
      '울산': { dongs:['남구','동구','북구','중구'], feature:'현대자동차·현대중공업 인근. 이공계 특화, 안정적 교육 수요.' },
      '창원시': { dongs:['성산구','의창구','마산합포구','진해구'], feature:'경남 최대 도시. 방위산업·자동차 인근 이공계 수요.' },
      '김해시': { dongs:['장유동','내외동','삼방동'], feature:'부산 위성도시 급성장. 초중등 영어·수학 수요 빠르게 증가.' },
      '구미시': { dongs:['선산읍','형곡동','신평동'], feature:'국가산업단지. 이공계 특화, 반도체·전자 분야 진로 수요.' },
      '포항시': { dongs:['남구','북구'], feature:'POSTECH 인근. 과학·수학 심화 수요, 이공계 진로 특화.' },
      '경주시': { dongs:['황성동','동천동','성건동'], feature:'역사문화도시. 인문·국어 교육 수요, 관광·문화 연계 학습.' },
      '양산시': { dongs:['물금읍','양산시내','웅상'], feature:'부산 근교 신도시. 초중등 수요 증가.' },
    }
  },
  '전라': {
    label: '전라도', emoji: '🍀',
    areas: {
      '광주': { dongs:['서구','남구','북구','동구','광산구'], feature:'호남 최대 교육 도시. 예술·문화 교육 특화, 내신 관리 수요 높음.' },
      '전주시': { dongs:['완산구','덕진구'], feature:'전북 최대 도시. 역사·문화 교육 환경 우수, 균형잡힌 학습 수요.' },
      '여수시': { dongs:['돌산읍','여서동','문수동'], feature:'여수엑스포 이후 성장. 관광·해양 산업 인근, 실용 영어 수요.' },
      '순천시': { dongs:['조례동','왕조동','풍덕동'], feature:'전남 동부 중심. 내신 관리·수능 준비 균형 수요.' },
      '익산시': { dongs:['영등동','어양동','목천동'], feature:'전북 서부 중심. 내신 관리 위주 과외 수요.' },
      '군산시': { dongs:['조촌동','미룡동','수송동'], feature:'새만금 개발 인근. 이공계 교육 수요 증가 추세.' },
    }
  },
  '제주': {
    label: '제주도', emoji: '🌺',
    areas: {
      '제주시': { dongs:['연동','노형동','이도동','삼도동','건입동'], feature:'국제학교 밀집. 영어 몰입교육·IB 과정 준비 수요 전국 최상위.' },
      '서귀포시': { dongs:['서귀동','대정읍','남원읍','성산읍'], feature:'자연환경 속 교육. 귀촌 가족 증가로 초중등 기초 과외 수요 증가.' },
    }
  },
};

const GRADES = {
  '초등': { label: '초등학교', years: ['1학년','2학년','3학년','4학년','5학년','6학년'] },
  '중등': { label: '중학교', years: ['1학년','2학년','3학년'] },
  '고등': { label: '고등학교', years: ['1학년','2학년','3학년','수능준비'] },
};

const SUBJECTS = {
  '수학': { emoji: '📐', desc: '개념부터 심화까지 단계별 맞춤 수학 과외' },
  '영어': { emoji: '🔤', desc: '내신·수능·회화 목적별 맞춤 영어 과외' },
  '국어': { emoji: '📖', desc: '문학·비문학·화법·작문 내신·수능 국어 과외' },
  '과학': { emoji: '🔬', desc: '물리·화학·생명과학·지구과학 과목별 과외' },
  '사회': { emoji: '🌍', desc: '한국사·사회·경제·정치 내신·수능 대비 과외' },
  '코딩': { emoji: '💻', desc: '스크래치·파이썬·알고리즘 단계별 코딩 과외' },
  '논술': { emoji: '✍️', desc: '대입 논술·구술·서류 전형 맞춤 준비 과외' },
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
.art-header{margin-bottom:32px}
.art-tag{display:inline-block;background:var(--blue-pale);color:var(--blue);font-size:12px;font-weight:700;padding:4px 12px;border-radius:6px;margin-bottom:14px}
.art-title{font-size:clamp(22px,3.5vw,34px);font-weight:900;letter-spacing:-1px;color:var(--navy);line-height:1.25;margin-bottom:16px}
.art-meta{display:flex;align-items:center;gap:16px;font-size:13px;color:var(--text-muted);flex-wrap:wrap}
.art-thumb{width:100%;height:240px;border-radius:var(--radius);margin-bottom:36px;background:linear-gradient(135deg,#EFF6FF,#DBEAFE);display:flex;align-items:center;justify-content:center;font-size:72px}
.art-body h2{font-size:20px;font-weight:900;color:var(--navy);margin:36px 0 14px;padding-bottom:10px;border-bottom:2px solid var(--blue-pale)}
.art-body h3{font-size:16px;font-weight:800;color:var(--navy);margin:24px 0 10px}
.art-body p{font-size:15px;color:var(--text-mid);line-height:1.85;margin-bottom:14px}
.art-body strong{color:var(--navy);font-weight:800}
.tag-wrap{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin:20px 0}
.tag-label{font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:12px;letter-spacing:1px}
.tags{display:flex;flex-wrap:wrap;gap:8px}
.tag{padding:7px 16px;background:var(--blue-pale);border:1px solid var(--blue-border);border-radius:8px;font-size:13px;font-weight:600;color:var(--blue);transition:all .2s}
.tag:hover{background:var(--blue);color:white}
.subj-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}
.subj-link{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:white;border:1.5px solid var(--border);border-radius:10px;font-size:14px;font-weight:700;color:var(--text-dark);transition:all .2s}
.subj-link:hover{border-color:var(--blue);color:var(--blue);background:var(--blue-pale)}
.cta-box{background:linear-gradient(135deg,var(--navy),var(--navy-mid));border-radius:20px;padding:36px 40px;text-align:center;margin:48px 0}
.cta-box h3{font-size:22px;font-weight:900;color:white;margin-bottom:8px}
.cta-box p{font-size:14px;color:rgba(255,255,255,.65);margin-bottom:24px}
.cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.btn-p{background:var(--blue);color:white;border:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer}
.btn-o{background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.3);padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer}
.related-title{font-size:18px;font-weight:900;color:var(--navy);margin-bottom:20px;margin-top:48px}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.rel-card{background:white;border:1px solid var(--border);border-radius:var(--radius);padding:18px;transition:all .2s;display:block}
.rel-card:hover{border-color:var(--blue-border);transform:translateY(-2px);box-shadow:var(--shadow)}
.rc-tag{font-size:11px;font-weight:700;color:var(--blue);margin-bottom:8px}
.rc-title{font-size:14px;font-weight:800;color:var(--navy);line-height:1.4}
footer{background:var(--navy);padding:28px 48px;margin-top:80px}
.fi{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center}
.fl{font-size:14px;font-weight:900;color:white}.fl em{font-style:normal;color:var(--sky)}
.fr{font-size:12px;color:rgba(255,255,255,.35)}
.floats{position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:500}
.fbtn{display:flex;align-items:center;gap:10px;padding:13px 20px;border-radius:999px;border:none;font-size:13px;font-weight:700;box-shadow:0 8px 32px rgba(15,32,68,.2);transition:all .25s;cursor:pointer;white-space:nowrap}
.fbtn:hover{transform:translateX(-4px)}.fb1{background:var(--blue);color:white}.fb2{background:var(--navy);color:white}
@media(max-width:768px){header{padding:0 16px}.gnav{display:none}.wrap{padding:32px 16px 60px}.subj-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr 1fr}.cta-box{padding:24px 20px}footer{padding:20px 16px}.fi{flex-direction:column;gap:6px;text-align:center}.floats{right:12px;bottom:20px}.art-thumb{height:160px;font-size:56px}}
`;

function today(){const d=new Date();return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;}

function wrap(title,desc,canonical,body){
  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title} - 올케어스터디</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://allcarestudy.com${canonical}">
<meta property="og:title" content="${title} - 올케어스터디">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://allcarestudy.com${canonical}">
<meta property="og:locale" content="ko_KR">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${title}","description":"${desc}","url":"https://allcarestudy.com${canonical}","publisher":{"@type":"Organization","name":"올케어스터디","url":"https://allcarestudy.com"}}</script>
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
<style>${CSS}</style></head><body>
<header>
  <a href="/" class="logo"><em>올케어</em>스터디</a>
  <nav class="gnav"><a href="/">홈</a><a href="/지역별과외/">지역별수업</a><a href="/과목별과외/">과목수업</a></nav>
</header>
${body}
<footer><div class="fi"><div class="fl"><em>올케어</em>스터디</div><div class="fr">© 2026 올케어스터디. All rights reserved.</div></div></footer>
<div class="floats">
  <button class="fbtn fb1" onclick="location.href='tel:01068348080'">📞 전화상담</button>
  <button class="fbtn fb2" onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">✨ 무료상담</button>
</div>
</body></html>`;
}

function makeAreaPage(rk,ak){
  const region=REGIONS[rk]; const area=region?.areas[ak]; if(!region||!area)return null;
  const title=`${ak} 과외 | ${region.label} ${ak} 맞춤 1:1 과외`;
  const desc=`${ak} 과외 정보. ${region.label} ${ak} 지역 검증된 선생님을 올케어스터디에서 찾아보세요. 수학, 영어, 국어, 과학 등 과목별·학년별 맞춤 과외.`;
  const canonical=`/${rk}/${ak}/`;
  const dongTags=area.dongs.map(d=>`<span class="tag">${d}</span>`).join('');
  const subjLinks=Object.entries(SUBJECTS).slice(0,4).flatMap(([s])=>[
    `<a class="subj-link" href="/${rk}/${ak}/고등/${s}/"><span>📚 ${ak} 고등 ${s}과외</span><span>→</span></a>`,
    `<a class="subj-link" href="/${rk}/${ak}/중등/${s}/"><span>📚 ${ak} 중등 ${s}과외</span><span>→</span></a>`
  ]).slice(0,8).join('');
  const relAreas=Object.keys(region.areas).filter(a=>a!==ak).slice(0,3)
    .map(a=>`<a class="rel-card" href="/${rk}/${a}/"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} 과외 | ${region.label} ${a} 맞춤 과외</div></a>`).join('');
  const body=`<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/지역별과외/">${region.label}</a> › <span>${ak}</span></div>
  <div class="art-header">
    <div class="art-tag">${region.label} · ${ak}</div>
    <h1 class="art-title">${ak} 과외 | ${region.label} ${ak} 맞춤 1:1 과외</h1>
    <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span><span>⏱ 3분</span></div>
  </div>
  <div class="art-thumb">${region.emoji}</div>
  <div class="art-body">
    <h2>${ak} 과외 안내</h2>
    <p>${area.feature}</p>
    <h3>${ak} 주요 지역</h3>
    <div class="tag-wrap"><div class="tag-label">동별 과외 정보</div><div class="tags">${dongTags}</div></div>
    <h2>과목별·학년별 과외 찾기</h2>
    <p>${ak} 지역 수학, 영어, 국어, 과학 등 과목별로 검증된 선생님을 연결해드립니다.</p>
    <div class="subj-grid">${subjLinks}</div>
  </div>
  <div class="cta-box">
    <h3>${ak} 맞춤 과외 선생님 찾기</h3>
    <p>지금 무료 상담을 신청하시면 전문 코디네이터가 연결해드립니다</p>
    <div class="cta-btns">
      <button class="btn-p" onclick="location.href='tel:01068348080'">📞 전화 상담 010-6834-8080</button>
      <button class="btn-o" onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">✨ 무료상담 신청</button>
    </div>
  </div>
  <div class="related-title">🔗 주변 지역 과외 정보</div>
  <div class="related-grid">${relAreas}</div>
</div>`;
  return wrap(title,desc,canonical,body);
}

function makeArticlePage(rk,ak,gk,sk){
  const region=REGIONS[rk]; const area=region?.areas[ak]; const grade=GRADES[gk]; const subject=SUBJECTS[sk];
  if(!region||!area||!grade||!subject)return null;
  const title=`${ak} ${gk} ${sk}과외 | ${region.label} ${ak} ${grade.label} ${sk} 맞춤 과외`;
  const desc=`${ak} ${gk} ${sk}과외. ${region.label} ${ak} 지역 ${grade.label} ${sk} 검증된 선생님과 1:1 맞춤 수업. 올케어스터디에서 무료 상담.`;
  const canonical=`/${rk}/${ak}/${gk}/${sk}/`;
  const yearTags=grade.years.map(y=>`<span class="tag">${y}</span>`).join('');
  const otherSubj=Object.entries(SUBJECTS).filter(([s])=>s!==sk).slice(0,6)
    .map(([s,v])=>`<a class="subj-link" href="/${rk}/${ak}/${gk}/${s}/"><span>${v.emoji} ${ak} ${gk} ${s}과외</span><span>→</span></a>`).join('');
  const relLinks=Object.keys(region.areas).filter(a=>a!==ak).slice(0,3)
    .map(a=>`<a class="rel-card" href="/${rk}/${a}/${gk}/${sk}/"><div class="rc-tag">${region.label}</div><div class="rc-title">${a} ${gk} ${sk}과외 | ${a} 맞춤 과외</div></a>`).join('');
  const body=`<div class="wrap">
  <div class="bc"><a href="/">홈</a> › <a href="/지역별과외/">${region.label}</a> › <a href="/${rk}/${ak}/">${ak}</a> › <span>${gk} ${sk}과외</span></div>
  <div class="art-header">
    <div class="art-tag">${region.label} · ${ak} · ${gk}</div>
    <h1 class="art-title">${ak} ${gk} ${sk}과외 | ${region.label} ${ak} ${grade.label} ${sk} 맞춤 과외</h1>
    <div class="art-meta"><span>✏️ 올케어스터디 편집팀</span><span>📅 ${today()}</span><span>⏱ 4분</span></div>
  </div>
  <div class="art-thumb">${subject.emoji}</div>
  <div class="art-body">
    <h2>${ak} ${gk} ${sk}과외 안내</h2>
    <p>${region.label} <strong>${ak}</strong> 지역 <strong>${grade.label} ${sk}</strong> 과외 전문 선생님을 올케어스터디에서 연결해드립니다. ${subject.desc}.</p>
    <p>${area.feature}</p>
    <h2>학년별 수업 안내</h2>
    <p>${gk} 학년별로 맞춤 커리큘럼을 제공합니다. 내신 대비부터 심화 과정까지 학생의 수준에 맞게 설계됩니다.</p>
    <div class="tag-wrap"><div class="tag-label">학년 선택</div><div class="tags">${yearTags}</div></div>
    <h2>올케어스터디 ${sk}과외 특징</h2>
    <p><strong>1:1 맞춤 수업</strong>: 학생의 현재 수준과 목표를 분석해 최적의 커리큘럼을 설계합니다.</p>
    <p><strong>검증된 선생님</strong>: 경력·학력·수업 방식을 사전 검증한 선생님만 연결합니다.</p>
    <p><strong>지속 관리</strong>: 매주 학습 현황을 점검하고 부족한 부분을 즉시 보완합니다.</p>
    <p><strong>학교 맞춤</strong>: ${ak} 주요 학교의 시험 경향과 교재를 분석해 내신에 특화된 수업을 제공합니다.</p>
    <h3>다른 과목도 함께 찾아보세요</h3>
    <div class="subj-grid">${otherSubj}</div>
  </div>
  <div class="cta-box">
    <h3>${ak} ${gk} ${sk}과외 무료 상담</h3>
    <p>지금 상담 신청 시 전문 코디네이터가 24시간 내 연락드립니다</p>
    <div class="cta-btns">
      <button class="btn-p" onclick="location.href='tel:01068348080'">📞 전화 상담 010-6834-8080</button>
      <button class="btn-o" onclick="window.open('https://naver.me/IMZ9N0ST','_blank')">✨ 무료상담 신청</button>
    </div>
  </div>
  <div class="related-title">🔗 주변 지역 ${sk}과외</div>
  <div class="related-grid">${relLinks}</div>
</div>`;
  return wrap(title,desc,canonical,body);
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
header{position:fixed;top:0;left:0;right:0;z-index:300;background:rgba(15,32,68,0.97);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,0.08)}
.hw{max-width:1280px;margin:0 auto;padding:0 48px;height:68px;display:flex;align-items:center;gap:32px}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-mark{width:38px;height:38px;background:linear-gradient(135deg,var(--blue),var(--sky));border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(59,130,246,0.4)}
.logo-name{display:flex;flex-direction:column;line-height:1.15}
.logo-main{font-size:18px;font-weight:900;letter-spacing:-0.5px;color:white}
.logo-main em{font-style:normal;color:var(--sky)}
.logo-sub{font-size:10px;color:rgba(255,255,255,0.4);font-weight:500;letter-spacing:0.5px}
.vpill{border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:6px 18px;display:flex;flex-direction:column;align-items:center;line-height:1.3;background:rgba(255,255,255,0.06)}
.vpill .vl{font-size:10px;color:rgba(255,255,255,0.45);font-weight:500}
.vpill .vc{font-size:15px;font-weight:900;color:var(--sky);letter-spacing:-0.5px}
.gnb{margin-left:auto;display:flex;align-items:center;gap:2px}
.gi{position:relative}
.gb{display:flex;align-items:center;gap:5px;padding:8px 16px;border:none;background:none;font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);border-radius:8px;transition:all .18s;white-space:nowrap}
.gb:hover{background:rgba(255,255,255,0.1);color:white}
.arr{width:14px;height:14px;transition:transform .2s;color:rgba(255,255,255,0.4)}
.gi:hover .arr{transform:rotate(180deg);color:var(--sky)}
.drop{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);min-width:160px;background:var(--navy);border-radius:12px;box-shadow:var(--shadow-lg);border:1px solid rgba(255,255,255,0.12);padding:6px;opacity:0;visibility:hidden;transition:all .18s;z-index:400}
.gi:hover .drop{opacity:1;visibility:visible}
.drop a{display:block;padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);transition:all .15s}
.drop a:hover{background:rgba(255,255,255,0.1);color:white}
.hsearch{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);transition:all .2s;flex-shrink:0}
.hsearch:hover{border-color:var(--sky);color:var(--sky)}

/* HERO */
.hero{margin-top:68px;position:relative;overflow:hidden}
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
.fu{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
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
  .hero{margin-top:56px}
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
              <a class="mega-btn" href="/region.html?r=서울">📍 서울특별시</a>
              <a class="mega-btn" href="/region.html?r=경기">🌿 경기도</a>
              <a class="mega-btn" href="/region.html?r=충청">🌾 충청도</a>
              <a class="mega-btn" href="/region.html?r=경상">🌊 경상도</a>
              <a class="mega-btn" href="/region.html?r=전라">🍀 전라도</a>
              <a class="mega-btn" href="/region.html?r=제주">🌺 제주도</a>
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
              <a class="mega-btn" href="/region.html?t=school">학교별 과외 전체 보기 →</a>
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
        <a href="/region.html?r=서울">서울특별시</a>
        <a href="/region.html?r=경기">경기도</a>
        <a href="/region.html?r=충청">충청도</a>
        <a href="/region.html?r=경상">경상도</a>
        <a href="/region.html?r=전라">전라도</a>
        <a href="/region.html?r=제주">제주도</a>
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
            <button class="bph" onclick="window.location.href='/region.html'">지역별 과외 찾기 →</button>
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

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);
    const parts = path.split('/').filter(Boolean);
    const headers = {'Content-Type':'text/html;charset=UTF-8','Cache-Control':'public,max-age=3600'};

    // 홈 (/)
    if(parts.length===0){
      return new Response(makeHomePage(),{headers});
    }
    // /지역/구/학년/과목/
    if(parts.length===4){
      const page=makeArticlePage(parts[0],parts[1],parts[2],parts[3]);
      if(page) return new Response(page,{headers});
    }
    // /지역/구/
    if(parts.length===2){
      const page=makeAreaPage(parts[0],parts[1]);
      if(page) return new Response(page,{headers});
    }
    // 404
    return new Response(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>404</title><style>${CSS}</style></head><body>
<header><a href="/" class="logo"><em>올케어</em>스터디</a></header>
<div class="wrap" style="text-align:center;padding-top:80px">
  <div style="font-size:64px;margin-bottom:24px">🔍</div>
  <h1 style="font-size:28px;font-weight:900;color:var(--navy);margin-bottom:12px">페이지를 찾을 수 없습니다</h1>
  <p style="color:var(--text-muted);margin-bottom:32px">요청하신 페이지가 존재하지 않습니다.</p>
  <a href="/" style="background:var(--blue);color:white;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px">홈으로 돌아가기</a>
</div></body></html>`,{status:404,headers:{'Content-Type':'text/html;charset=UTF-8'}});
  }
};
