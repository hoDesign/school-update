const PALETTES = [
  { bg: ['#1a1040','#2d1b69'], glow: '#4a30b8' },
  { bg: ['#0d1f3c','#1a3a6b'], glow: '#2a5aad' },
  { bg: ['#2e1f0d','#6b4a1a'], glow: '#b87a28' },
  { bg: ['#0d2e2e','#1a6b6b'], glow: '#28b8b8' },
  { bg: ['#1a0d2e','#3a1a6b'], glow: '#5a2ab8' },
  { bg: ['#2e0d1f','#6b1a3a'], glow: '#b82870' },
];

const CARD_DATA = [
  { title:'KT멤버십 UXUI리디자인',    sub:'2025 · UI/UX',           tags:['UI/UX','Figma'],              palette:PALETTES[0], img:'images/01_kt-membership.jpg',
    desc:'실제 사용자 인터뷰와 IA 분석을 통해 KT멤버십 앱의 정보구조를 재설계하고 전반적인 UI를 개선한 프로젝트입니다.' },
  { title:'Brand Redesign Project',   sub:'UI/UX · Figma',          tags:['UI/UX','Figma'],              palette:PALETTES[1], img:null,
    desc:'브랜드 아이덴티티 재정립을 목표로 컬러 시스템, 타이포그래피, 컴포넌트 가이드라인을 새롭게 구축했습니다.' },
  { title:'E-Commerce Platform',      sub:'HTML/CSS · JS',           tags:['HTML/CSS','JavaScript'],      palette:PALETTES[2], img:null,
    desc:'반응형 이커머스 플랫폼의 프론트엔드를 바닐라 JS로 구현하며 퍼포먼스와 접근성을 최적화했습니다.' },
  { title:'Promotion Landing Page',   sub:'Photoshop · Illustrator', tags:['Photoshop','Illustrator'],    palette:PALETTES[3], img:null,
    desc:'프로모션 캠페인을 위한 랜딩 페이지를 설계하고 비주얼 방향부터 최종 에셋 제작까지 전담했습니다.' },
  { title:'Admin Dashboard UI',       sub:'UI Design · Prototyping', tags:['UI Design','Prototyping'],    palette:PALETTES[4], img:null,
    desc:'복잡한 데이터를 직관적으로 시각화하는 어드민 대시보드 UI를 설계하고 인터랙티브 프로토타입을 제작했습니다.' },
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
  if (d.img) {
    const img = document.createElement('img');
    img.src = d.img;
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

const CARD_W = 200, CARD_H = 280;
const N = CARD_DATA.length * 2;
const RADIUS = 600;
const getCX = () => window.innerWidth * 0.96;
const getCY = () => window.innerHeight * 0.59;
const DEG_PER_CARD = 360 / N;
const DEG_PER_MS = (1.7 * 360) / 60000;

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
