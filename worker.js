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
  const regionCards = Object.entries(REGIONS).map(([sido,r])=>
    `<a href="/${sido}" style="display:flex;align-items:center;gap:12px;padding:16px 20px;background:white;border:1.5px solid var(--border);border-radius:12px;font-size:15px;font-weight:700;color:var(--text-dark);text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='#3B82F6';this.style.color='#3B82F6'" onmouseout="this.style.borderColor='#E5E7EB';this.style.color='var(--text-dark)'"><span style="font-size:24px">${r.emoji}</span><span>${r.label}</span></a>`
  ).join('');
  const title = '올케어스터디 - 지역별 과외·학원 정보 No.1';
  const desc = '전국 지역별 1:1 맞춤 과외·학원 정보 플랫폼. 서울, 경기, 인천 등 내 지역 검증된 선생님 12,400명+.';
  return `<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://allcarestudy.com/">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
<style>${CSS}</style>
</head><body>
<header style="background:var(--navy);padding:0 48px;height:64px;display:flex;align-items:center;gap:20px">
  <a href="/" style="font-size:18px;font-weight:900;color:white;text-decoration:none"><em style="font-style:normal;color:var(--sky)">올케어</em>스터디</a>
  <nav style="margin-left:auto;display:flex;gap:20px">
    <a href="/" style="font-size:13px;color:rgba(255,255,255,.6);font-weight:500;text-decoration:none">홈</a>
    <a href="/서울" style="font-size:13px;color:rgba(255,255,255,.6);font-weight:500;text-decoration:none">지역별수업</a>
  </nav>
</header>
<div style="background:linear-gradient(130deg,#0F2044,#1E3A6E 60%,#1D4ED8);padding:64px 48px;text-align:center">
  <div style="display:inline-block;background:rgba(96,165,250,.15);border:1px solid rgba(96,165,250,.25);border-radius:999px;padding:4px 16px;font-size:12px;font-weight:700;color:#60A5FA;margin-bottom:20px">No.1 지역별 과외 플랫폼</div>
  <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;color:white;letter-spacing:-1.5px;line-height:1.2;margin-bottom:16px">내 지역 최고의<br><span style="color:#60A5FA">1:1 맞춤 과외</span></h1>
  <p style="font-size:15px;color:rgba(255,255,255,.65);margin-bottom:32px">전국 검증된 선생님 12,400명+ · 지역별·과목별·학년별 맞춤 수업</p>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <a href="/서울/강남구" style="background:#3B82F6;color:white;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none">지역별 과외 찾기 →</a>
    <a href="https://naver.me/IMZ9N0ST" target="_blank" style="background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.3);padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none">✨ 무료상담 신청</a>
  </div>
</div>
<div class="wrap">
  <h2 style="font-size:24px;font-weight:900;color:var(--navy);margin-bottom:24px;text-align:center">📍 지역별 과외 정보</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:48px">${regionCards}</div>
  <div style="background:linear-gradient(135deg,var(--navy),#1E3A6E);border-radius:20px;padding:36px;text-align:center">
    <h3 style="font-size:22px;font-weight:900;color:white;margin-bottom:8px">무료 상담 신청</h3>
    <p style="font-size:14px;color:rgba(255,255,255,.65);margin-bottom:24px">전문 코디네이터가 최적의 선생님을 연결해드립니다</p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <a href="tel:01068348080" style="background:#3B82F6;color:white;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none">📞 010-6834-8080</a>
      <a href="https://naver.me/IMZ9N0ST" target="_blank" style="background:rgba(255,255,255,.1);color:white;border:1.5px solid rgba(255,255,255,.3);padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none">✨ 네이버 상담</a>
    </div>
  </div>
</div>
<footer style="background:var(--navy);padding:28px 48px;margin-top:60px">
  <div style="max-width:900px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <div style="font-size:14px;font-weight:900;color:white"><em style="font-style:normal;color:#60A5FA">올케어</em>스터디</div>
    <div style="font-size:12px;color:rgba(255,255,255,.35)">© 2026 올케어스터디. All rights reserved.</div>
  </div>
</footer>
<div style="position:fixed;right:24px;bottom:40px;display:flex;flex-direction:column;gap:10px;z-index:500">
  <a href="tel:01068348080" style="display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;background:#3B82F6;color:white;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 8px 32px rgba(15,32,68,.2)">📞 전화상담</a>
  <a href="https://naver.me/IMZ9N0ST" target="_blank" style="display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:999px;background:#0F2044;color:white;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 8px 32px rgba(15,32,68,.2)">✨ 무료상담</a>
</div>
</body></html>`;
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
