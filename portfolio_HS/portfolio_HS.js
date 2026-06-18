const PALETTES = [
  { bg: ['#1a1040','#2d1b69'], glow: '#4a30b8' },
  { bg: ['#0d1f3c','#1a3a6b'], glow: '#2a5aad' },
  { bg: ['#2e1f0d','#6b4a1a'], glow: '#b87a28' },
  { bg: ['#0d2e2e','#1a6b6b'], glow: '#28b8b8' },
  { bg: ['#1a0d2e','#3a1a6b'], glow: '#5a2ab8' },
  { bg: ['#2e0d1f','#6b1a3a'], glow: '#b82870' },
];

const CARD_DATA = [
  { title:'KT멤버십 리디자인',    sub:'2026 · UI/UX · Figma',           tags:['UI/UX','Figma'],              palette:PALETTES[0], img:'images/KT멤버십_card01.jpg',   thumb:'images/KT멤버십_banner02.png',
    desc:'실제 사용자 인터뷰와 IA 분석을 기반으로 KT멤버십 앱의 정보구조를 전면 재설계했습니다. 복잡한 혜택 탐색 플로우를 단순화하고, 사용자 체류 시간을 40% 향상시킨 UI 개선안을 도출했으며, [멤버십 어플리케이션]의 비효율성을 [지도]와 결합함으로 UX 개선을 했습니다.' },
  { title:'Toss-Ads 홈페이지 개선안',   sub:'2026 · web-Design · Figma · VSCode',          tags:['UI/UX','Figma','Web'],              palette:PALETTES[1], img:'images/toss-ads_card01.jpg',       thumb:'images/toss-ads_banner02.jpg',
    desc:'토스 광고 플랫폼의 랜딩 페이지와와 가입 유도 페이지의 일부를 재설계했습니다. 사용자가 불편함을 느낄 수 있는 일부 레이아웃을 개선하고 UI의 변화를 최소화하여 기존 웹페이지의 분위기를 해치지 않도록 기획하였으며 직관적인 스텝 형태, 전환율을 높이는 방향으로 재구성하였습니다. 기획 기반의 리디자인 프로젝트입니다.' },
  { title:'레몬소르베 Branding',      sub:'2025 · Brand · Visual',           tags:['Branding','Illustrator'],      palette:PALETTES[2], img:'images/레몬소르베_card01.jpg',     thumb:'images/레몬소르베_banner02.jpg',
    desc:'레몬소르베 브랜드의 아이덴티티 시스템을 구축했습니다. 컬러 팔레트, 로고 가이드라인, 패키지 디자인까지 일관된 브랜드 경험을 설계하고 시각 자산 전반을 제작했습니다.' },
  { title:'B-mix Studio Replit',   sub:'2025 · Web Design · Figma', tags:['UI/UX','Figma','Web'],    palette:PALETTES[3], img:'images/B-mixStudio_card01.jpg', thumb:'images/B-mixStudio_banner02.jpg',
    desc:'B-mix Studio의 Replit 리디자인 프로젝트입니다. 브랜드 감성을 유지하면서 사용성을 개선하고 레이아웃 구조를 재정립했습니다.' },
  { title:'캣팡 서비스 기획',       sub:'2025 · UI/UX · Figma', tags:['UI/UX','Figma','Service'],    palette:PALETTES[4], img:'images/캣팡_card01.jpg', thumb:'images/캣팡_banner02.jpg',
    desc:'반려묘 케어 서비스 캣팡의 UI/UX를 기획하고 디자인했습니다. 사용자 여정 분석을 바탕으로 핵심 기능을 정의하고 직관적인 인터페이스를 설계했습니다.' },
  { title:'Interactive Web App',      sub:'Interaction · Tailwind',  tags:['Interaction','Tailwind CSS'], palette:PALETTES[5], img:null,
    desc:'Tailwind CSS와 인터랙션 디자인을 결합하여 몰입감 있는 웹 경험을 구현한 실험적 프로젝트입니다.' },
];

// BUILD PROJECT ROWS
const projectList = document.getElementById('project-list');
CARD_DATA.forEach(d => {
  const row = document.createElement('div');
  row.className = 'project-row';

  const imgDiv = document.createElement('div');
  imgDiv.className = 'project-img';
  imgDiv.style.background = `linear-gradient(145deg, ${d.palette.bg[0]} 0%, ${d.palette.bg[1]} 100%)`;
  if (d.thumb) {
    const img = document.createElement('img');
    img.src = d.thumb;
    img.alt = d.title;
    imgDiv.appendChild(img);
  }

  const tagHtml = d.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
  const descDiv = document.createElement('div');
  descDiv.className = 'project-desc';
  descDiv.innerHTML = `
    <div class="project-tags">${tagHtml}</div>
    <div class="project-title">${d.title}</div>
    <div class="project-sub">${d.sub}</div>
    <p class="project-text">${d.desc}</p>`;

  row.appendChild(imgDiv);
  row.appendChild(descDiv);
  projectList.appendChild(row);
});

// ORBIT CAROUSEL (decorative)
function hexToRgb(h) {
  return `${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)}`;
}

const CARD_W = 240, CARD_H = 336;
const N = CARD_DATA.length * 2;
const RADIUS = 630;
const getCX = () => window.innerWidth * 1.04;
const getCY = () => window.innerHeight * 0.59;
const DEG_PER_CARD = 360 / N;
const DEG_PER_MS = (1.02 * 360) / 60000;
const opacity = 1;

let angle = 0, autoOn = true, lastTs = null, rafId = null;

const stage = document.getElementById('orbit-stage');
const cardEls = [...CARD_DATA, ...CARD_DATA].map((d) => {
  const el = document.createElement('div');
  el.className = 'orbit-card';
  el.style.background = d.img ? 'transparent' : `linear-gradient(145deg, ${d.palette.bg[0]} 0%, ${d.palette.bg[1]} 100%)`;
  el.style.width  = CARD_W + 'px';
  el.style.height = CARD_H + 'px';
  el.style.marginLeft = (-CARD_W / 2) + 'px';
  el.style.marginTop  = (-CARD_H / 2) + 'px';
  const tagHtml = d.tags.map(t => `<span class="c-tag">${t}</span>`).join('');
  el.innerHTML = `
    <div class="c-top">
      ${d.img ? `<img src="${d.img}" alt="${d.title}">` : ''}
      <div class="c-tags">${tagHtml}</div>
    </div>
    <div class="c-body">
      <div class="c-title">${d.title}</div>
      <div class="c-sub">${d.sub}</div>
    </div>`;
  stage.appendChild(el);
  return el;
});

function positionCards(a) {
  const cx = getCX(), cy = getCY(), r = Math.PI / 180;
  cardEls.forEach((el, i) => {
    const theta = (a + i * DEG_PER_CARD) * r;
    const x = cx + RADIUS * Math.cos(theta);
    const y = cy + RADIUS * Math.sin(theta);
    const cosT = Math.cos(theta);
    el.style.transform = `translate(${x}px,${y}px) rotate(${a + i * DEG_PER_CARD + 90}deg)`;
    el.style.opacity = cosT < 0 ? 1 : Math.max(0, 1 + cosT * 3);
  });
}

function autoLoop(ts) {
  if (!autoOn) return;
  if (!lastTs) lastTs = ts;
  angle -= DEG_PER_MS * (ts - lastTs);
  lastTs = ts;
  positionCards(angle);
  rafId = requestAnimationFrame(autoLoop);
}

window.addEventListener('resize', () => positionCards(angle));
positionCards(angle);
rafId = requestAnimationFrame(autoLoop);

// HOSEONG 0.2+1.4=1.6s, PARK 0.5+1.4=1.9s → slide-in after PARK done
setTimeout(() => { document.getElementById('heroRole').classList.add('visible'); }, 1150);
setTimeout(() => { document.getElementById('heroBio').classList.add('visible'); }, 1500);
// orbit cards enter after all text done (~2.65s)
setTimeout(() => { document.getElementById('orbit-stage').classList.add('visible'); }, 2200);

// ── FULLPAGE SCROLL ──
(function () {
  const heroEl     = document.getElementById('hero');
  const infoEl     = document.querySelector('.info-section');
  const projectsEl = document.querySelector('.projects-section');
  const contactEl  = document.querySelector('.contact-section');

  let isAnimating = false;
  let accumulated = 0;
  let prevDelta   = 0;
  let inContact   = false;
  const THRESHOLD = 3200;

  function snapTo(el, curtain) {
    isAnimating = true;
    if (curtain) {
      inContact = true;
      contactEl.classList.add('curtain-up');
      setTimeout(() => { isAnimating = false; }, 1100);
      return;
    }
    if (el === projectsEl && inContact) {
      inContact = false;
      contactEl.classList.remove('curtain-up');
      setTimeout(() => { isAnimating = false; }, 1100);
      return;
    }
    const target = el.offsetTop;
    window.scrollTo({ top: target, behavior: 'smooth' });

    function onScroll() {
      if (Math.abs(window.scrollY - target) < 8) {
        isAnimating = false;
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll);
    setTimeout(() => {
      isAnimating = false;
      window.removeEventListener('scroll', onScroll);
    }, 3000);
  }

  window.addEventListener('wheel', (e) => {
    const scrollY    = window.scrollY;
    const vh         = window.innerHeight;
    const infoTop    = infoEl.offsetTop;
    const infoBot    = infoTop + infoEl.offsetHeight;
    const projTop    = projectsEl.offsetTop;
    const projBot    = projTop + projectsEl.offsetHeight;

    // 방향 바뀌면 누적 리셋
    if ((e.deltaY > 0 && prevDelta < 0) || (e.deltaY < 0 && prevDelta > 0)) accumulated = 0;
    prevDelta = e.deltaY;

    // ── CONTACT (fixed overlay) ──
    if (inContact) {
      e.preventDefault();
      if (isAnimating) return;
      accumulated += e.deltaY;
      if (accumulated < -THRESHOLD) { accumulated = 0; snapTo(projectsEl); }
      return;
    }

    // ── HERO ──
    if (scrollY < infoTop - 10) {
      e.preventDefault();
      if (isAnimating) return;
      accumulated += e.deltaY;
      if (accumulated > THRESHOLD) { accumulated = 0; snapTo(infoEl); }
      return;
    }

    // ── INFO ──
    if (scrollY >= infoTop - 10 && scrollY < projTop - 10) {
      const infoH = infoEl.offsetHeight;
      if (infoH > vh) {
        if (e.deltaY > 0 && scrollY + vh < infoBot - 10) return;
        if (e.deltaY < 0 && scrollY > infoTop + 10) return;
      }
      e.preventDefault();
      if (isAnimating) return;
      accumulated += e.deltaY;
      if (Math.abs(accumulated) > THRESHOLD) {
        const dir = accumulated > 0 ? 1 : -1;
        accumulated = 0;
        if (dir > 0) snapTo(projectsEl);
        else snapTo(heroEl);
      }
      return;
    }

    // ── PROJECTS ──
    if (scrollY >= projTop - 10) {
      const projH = projectsEl.offsetHeight;
      if (projH > vh) {
        if (e.deltaY > 0 && scrollY + vh < projBot - 10) return;
        if (e.deltaY < 0 && scrollY > projTop + 10) return;
      }
      e.preventDefault();
      if (isAnimating) return;
      accumulated += e.deltaY;
      if (Math.abs(accumulated) > THRESHOLD) {
        const dir = accumulated > 0 ? 1 : -1;
        accumulated = 0;
        if (dir > 0) snapTo(contactEl, true);
        else snapTo(infoEl);
      }
      return;
    }

    accumulated = 0;
  }, { passive: false });
})();
