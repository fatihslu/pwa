// KolGücü PWA - Interactive Workout, Visuals & Nutrition App
const STORAGE_KEY = 'kolgucu_pwa_state_v1';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Pzt -> Paz

function getTodayDateStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekId() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.profile) parsed.profile = { age: 37, height: 180, weight: 86 };
      if (!parsed.calorieLog) parsed.calorieLog = {}; // { dateStr: kcal }
      return parsed;
    }
  } catch (e) {}
  return {
    weekId: getWeekId(),
    profile: { age: 37, height: 180, weight: 86 },
    completedDays: [],
    warmupDone: {},
    workoutLogs: {},
    lastWeights: {},
    nutrition: {},
    calorieLog: {},      // { "2024-01-01": 350 }  estimated burned kcal
    measurements: [
      { date: getTodayDateStr(), weight: 86.0, rightArm: 35.0, leftArm: 34.8 }
    ]
  };
}

let state = loadState();

// Reset weekly completion if new week started
if (state.weekId !== getWeekId()) {
  state.weekId = getWeekId();
  state.completedDays = [];
  saveState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// App UI state
const todayDayIndex = new Date().getDay();
let selectedDayIndex = todayDayIndex;
let activeTab = 'today';
let warmupOpen = false; // DEFAULT KAPALI
let timerInterval = null;
let timerSeconds = 0;
let deferredInstallPrompt = null;
let musicOn = false;

// ── Innovative Energy Flow Canvas (Harmonic Waves + Glowing Circuit Nodes) ──
const energyCanvas = document.getElementById('energy-canvas');
const ctx2d = energyCanvas ? energyCanvas.getContext('2d') : null;

const energyNodes = Array.from({ length: 16 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.75,
  vy: (Math.random() - 0.5) * 0.75,
  r: 1.5 + Math.random() * 2,
  phase: Math.random() * Math.PI * 2
}));

const energyWaves = [
  { amp: 28, freq: 0.008, speed: 0.022, yRatio: 0.22, phase: 0,   width: 1.6, color: '14, 126, 142' },
  { amp: 36, freq: 0.006, speed: -0.018, yRatio: 0.45, phase: 1.8, width: 1.3, color: '21, 168, 187' },
  { amp: 22, freq: 0.011, speed: 0.026, yRatio: 0.68, phase: 3.4, width: 1.2, color: '168, 221, 229' },
  { amp: 32, freq: 0.007, speed: -0.015, yRatio: 0.85, phase: 5.1, width: 1.4, color: '14, 126, 142' }
];

let energyTick = 0;

function resizeCanvas() {
  if (!energyCanvas) return;
  energyCanvas.width = window.innerWidth;
  energyCanvas.height = window.innerHeight;
}

function animateLines() {
  if (!ctx2d || !energyCanvas) return;
  const W = energyCanvas.width;
  const H = energyCanvas.height;
  ctx2d.clearRect(0, 0, W, H);
  const isDark = document.documentElement.dataset.theme !== 'light';
  energyTick += 1;

  // 1. Flowing harmonic energy ribbons
  energyWaves.forEach(w => {
    w.phase += w.speed;
    const baseY = H * w.yRatio;
    const alpha = isDark ? 0.28 : 0.20;
    const grad = ctx2d.createLinearGradient(0, baseY, W, baseY);
    grad.addColorStop(0, `rgba(${w.color}, 0)`);
    grad.addColorStop(0.25, `rgba(${w.color}, ${alpha})`);
    grad.addColorStop(0.5, `rgba(${w.color}, ${alpha * 1.4})`);
    grad.addColorStop(0.75, `rgba(${w.color}, ${alpha})`);
    grad.addColorStop(1, `rgba(${w.color}, 0)`);

    ctx2d.beginPath();
    for (let x = 0; x <= W; x += 14) {
      const y = baseY
        + Math.sin(x * w.freq + w.phase) * w.amp
        + Math.cos(x * w.freq * 0.5 - w.phase * 0.7) * (w.amp * 0.45);
      if (x === 0) ctx2d.moveTo(x, y);
      else ctx2d.lineTo(x, y);
    }
    ctx2d.strokeStyle = grad;
    ctx2d.lineWidth = w.width;
    ctx2d.stroke();

    // Traveling energy spark along the wave
    const sparkX = ((energyTick * (w.speed > 0 ? 2.2 : -2.2)) % W + W) % W;
    const sparkY = baseY
      + Math.sin(sparkX * w.freq + w.phase) * w.amp
      + Math.cos(sparkX * w.freq * 0.5 - w.phase * 0.7) * (w.amp * 0.45);
    const sparkGrad = ctx2d.createRadialGradient(sparkX, sparkY, 0, sparkX, sparkY, 10);
    sparkGrad.addColorStop(0, `rgba(${w.color}, ${isDark ? 0.75 : 0.55})`);
    sparkGrad.addColorStop(1, `rgba(${w.color}, 0)`);
    ctx2d.fillStyle = sparkGrad;
    ctx2d.beginPath();
    ctx2d.arc(sparkX, sparkY, 10, 0, Math.PI * 2);
    ctx2d.fill();
  });

  // 2. Interconnected kinetic nodes
  const maxDist = 115;
  for (let i = 0; i < energyNodes.length; i++) {
    const a = energyNodes[i];
    a.x += a.vx;
    a.y += a.vy;
    a.phase += 0.04;
    if (a.x < 0 || a.x > W) a.vx *= -1;
    if (a.y < 0 || a.y > H) a.vy *= -1;

    for (let j = i + 1; j < energyNodes.length; j++) {
      const b = energyNodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < maxDist) {
        const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.25 : 0.18);
        ctx2d.beginPath();
        ctx2d.moveTo(a.x, a.y);
        ctx2d.lineTo(b.x, b.y);
        ctx2d.strokeStyle = `rgba(14, 126, 142, ${lineAlpha})`;
        ctx2d.lineWidth = 0.9;
        ctx2d.stroke();
      }
    }

    const pulse = 0.5 + 0.5 * Math.sin(a.phase);
    ctx2d.beginPath();
    ctx2d.arc(a.x, a.y, a.r + pulse * 0.8, 0, Math.PI * 2);
    ctx2d.fillStyle = isDark
      ? `rgba(168, 221, 229, ${0.25 + pulse * 0.35})`
      : `rgba(14, 126, 142, ${0.22 + pulse * 0.28})`;
    ctx2d.fill();
  }

  requestAnimationFrame(animateLines);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateLines();

// DOM Elements
const mainContent = document.getElementById('main-content');
const headerDateLabel = document.getElementById('header-date-label');
const streakCountEl = document.getElementById('streak-count');
const restTimerBar = document.getElementById('rest-timer-bar');
const timerDisplay = document.getElementById('timer-display');
const installBtn = document.getElementById('install-pwa-btn');
const themBtn = document.getElementById('theme-toggle-btn');
const musicBtn = document.getElementById('music-toggle-btn');

// ── Theme toggle ──
const savedTheme = localStorage.getItem('kolgucu_theme') || 'dark';
if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
(function applyThemeIcons() {
  const moonEl = document.getElementById('theme-icon-moon');
  const sunEl = document.getElementById('theme-icon-sun');
  if (savedTheme === 'light') {
    if (moonEl) moonEl.classList.add('hidden');
    if (sunEl) sunEl.classList.remove('hidden');
  }
})();

if (themBtn) {
  themBtn.addEventListener('click', () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    const moonEl = document.getElementById('theme-icon-moon');
    const sunEl = document.getElementById('theme-icon-sun');
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('kolgucu_theme', 'dark');
      if (moonEl) moonEl.classList.remove('hidden');
      if (sunEl) sunEl.classList.add('hidden');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('kolgucu_theme', 'light');
      if (moonEl) moonEl.classList.add('hidden');
      if (sunEl) sunEl.classList.remove('hidden');
    }
  });
}

// ── Music toggle ──
const TRACKS = [
  { title: 'Sport Beat Vol.1',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Sport Beat Vol.2',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Sport Beat Vol.3',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'Sport Beat Vol.4',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'Sport Beat Vol.5',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { title: 'Sport Beat Vol.6',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { title: 'Sport Beat Vol.7',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { title: 'Sport Beat Vol.8',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { title: 'Sport Beat Vol.9',  artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { title: 'Sport Beat Vol.10', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
];

let currentTrack = 0;
let audioEl = null;
let musicPlayerEl = null;

// SVG icons for music player (inline, no CDN dependency)
const svgPrev = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`;
const svgNext = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`;
const svgPlay = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const svgPause = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const svgClose = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const svgMusic = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;

function buildAudioPlayer() {
  if (musicPlayerEl) return;

  audioEl = new Audio();
  audioEl.preload = 'none';
  audioEl.volume = 0.75;

  musicPlayerEl = document.createElement('div');
  musicPlayerEl.id = 'music-player';
  updatePlayerUI();
  document.body.appendChild(musicPlayerEl);

  audioEl.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % TRACKS.length;
    loadTrack(true);
  });
}

function updatePlayerUI() {
  if (!musicPlayerEl) return;
  const t = TRACKS[currentTrack];
  const isPlaying = audioEl && !audioEl.paused;
  musicPlayerEl.innerHTML = `
    <span style="color:var(--accent);flex-shrink:0;">${svgMusic}</span>
    <div style="flex:1;min-width:0;">
      <div style="font-size:13px;font-weight:800;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.title}</div>
      <div style="font-size:11px;color:var(--text-muted);">${t.artist}</div>
    </div>
    <button id="mp-prev" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;display:grid;place-items:center;">${svgPrev}</button>
    <button id="mp-play" style="background:linear-gradient(135deg,#0E7E8E,#15A8BB);border:none;color:#fff;border-radius:50%;width:36px;height:36px;cursor:pointer;display:grid;place-items:center;flex-shrink:0;">${isPlaying ? svgPause : svgPlay}</button>
    <button id="mp-next" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;display:grid;place-items:center;">${svgNext}</button>
    <button id="mp-close" style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;display:grid;place-items:center;">${svgClose}</button>
  `;
  musicPlayerEl.querySelector('#mp-play').addEventListener('click', togglePlay);
  musicPlayerEl.querySelector('#mp-prev').addEventListener('click', () => { currentTrack = (currentTrack - 1 + TRACKS.length) % TRACKS.length; loadTrack(true); });
  musicPlayerEl.querySelector('#mp-next').addEventListener('click', () => { currentTrack = (currentTrack + 1) % TRACKS.length; loadTrack(true); });
  musicPlayerEl.querySelector('#mp-close').addEventListener('click', () => {
    musicOn = false;
    document.body.classList.remove('music-playing');
    musicBtn.classList.remove('music-active');
    if (audioEl) audioEl.pause();
    if (musicPlayerEl) { musicPlayerEl.remove(); musicPlayerEl = null; audioEl = null; }
  });
}

function loadTrack(autoplay = false) {
  if (!audioEl) return;
  audioEl.src = TRACKS[currentTrack].src;
  updatePlayerUI();
  if (autoplay) {
    audioEl.play().catch(() => {});
  }
}

function togglePlay() {
  if (!audioEl) return;
  if (audioEl.paused) {
    if (!audioEl.src) audioEl.src = TRACKS[currentTrack].src;
    audioEl.play().then(() => {
      updatePlayerUI();
    }).catch(() => {});
  } else {
    audioEl.pause();
    updatePlayerUI();
  }
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
      document.body.classList.add('music-playing');
      musicBtn.classList.add('music-active');
      buildAudioPlayer();
      togglePlay();
    } else {
      document.body.classList.remove('music-playing');
      musicBtn.classList.remove('music-active');
      if (audioEl) audioEl.pause();
      if (musicPlayerEl) { musicPlayerEl.remove(); musicPlayerEl = null; audioEl = null; }
    }
  });
}

// Format Header Date
function updateHeader() {
  const now = new Date();
  const formatted = now.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  headerDateLabel.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  streakCountEl.textContent = state.completedDays.filter(d => !WEEKLY_PLAN[d].isRest).length;
}

// Audio Beep for Rest Timer
function playTimerBeep() {
  try {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {}
}

function startRestTimer(seconds) {
  clearInterval(timerInterval);
  timerSeconds = seconds;
  restTimerBar.classList.remove('hidden');
  renderTimerDisplay();
  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      restTimerBar.classList.add('hidden');
      playTimerBeep();
      return;
    }
    renderTimerDisplay();
  }, 1000);
}

function renderTimerDisplay() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

document.getElementById('timer-stop-btn').addEventListener('click', () => {
  clearInterval(timerInterval);
  restTimerBar.classList.add('hidden');
});

document.querySelectorAll('.timer-btn[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const delta = parseInt(btn.dataset.add, 10);
    timerSeconds = Math.max(5, timerSeconds + delta);
    renderTimerDisplay();
  });
});

// Modal Logic
const modal = document.getElementById('exercise-modal');
function openExerciseModal(exId) {
  const ex = EXERCISES[exId];
  if (!ex) return;
  document.getElementById('modal-muscle-tag').textContent = ex.muscle;
  document.getElementById('modal-title').textContent = ex.name;
  document.getElementById('modal-visual').innerHTML = getExerciseSVG(ex.visualKey);
  document.getElementById('modal-sets-reps').textContent = `${ex.sets} × ${ex.reps}`;
  document.getElementById('modal-rest').textContent = `${ex.rest} sn`;
  document.getElementById('modal-start-weight').textContent = ex.startWeight;
  document.getElementById('modal-tips').innerHTML = ex.tips.map(t => `<li>${t}</li>`).join('');
  document.getElementById('modal-caution').textContent = ex.caution;
  modal.classList.remove('hidden');
}

function closeExerciseModal() {
  modal.classList.add('hidden');
}

document.getElementById('modal-close-btn').addEventListener('click', closeExerciseModal);
document.getElementById('modal-backdrop').addEventListener('click', closeExerciseModal);

// Workout Log Helpers
function getLogKey(dayIdx) {
  return `${getTodayDateStr()}_${dayIdx}`;
}

function getExerciseSets(dayIdx, exId) {
  const key = getLogKey(dayIdx);
  if (!state.workoutLogs[key]) state.workoutLogs[key] = {};
  if (!state.workoutLogs[key][exId]) {
    const ex = EXERCISES[exId];
    const defaultW = state.lastWeights[exId] || '';
    state.workoutLogs[key][exId] = Array.from({ length: ex.sets }, () => ({
      weight: defaultW,
      reps: ex.reps.split('-')[0].replace(/\D/g, '') || '12',
      done: false
    }));
  }
  return state.workoutLogs[key][exId];
}

// ── Estimated calorie burn for workout days (simple formula) ──
function estimateCaloriesBurned(dayIdx) {
  const day = WEEKLY_PLAN[dayIdx];
  if (!day || day.isRest) return 0;
  const w = (state.profile && state.profile.weight) || 86;
  // ~5–6 kcal/min for moderate resistance training
  const mins = parseInt(day.duration) || 45;
  return Math.round(w * 0.065 * mins);
}

// ═══════════════════════════════════════════
// RENDER: TODAY TAB
// ═══════════════════════════════════════════
function renderTodayTab() {
  const day = WEEKLY_PLAN[selectedDayIndex];
  const dateStr = getTodayDateStr();
  const isToday = selectedDayIndex === todayDayIndex;
  const isDayDone = state.completedDays.includes(selectedDayIndex);

  // Day Selector Strip
  let html = `<div class="day-strip">`;
  DAY_ORDER.forEach(idx => {
    const d = WEEKLY_PLAN[idx];
    const cls = [
      'day-pill',
      idx === selectedDayIndex ? 'active' : '',
      idx === todayDayIndex ? 'is-today' : '',
      state.completedDays.includes(idx) ? 'done-day' : ''
    ].filter(Boolean).join(' ');
    html += `<button class="${cls}" data-select-day="${idx}">${d.short}</button>`;
  });
  html += `</div>`;

  // Hero Card
  html += `
    <section class="hero-card">
      <span class="badge ${day.isRest ? 'badge-rest' : ''}">
        ${isToday ? 'BUGÜN • ' : ''}${day.name.toUpperCase()} — ${day.focusBadge}
      </span>
      <h2>${day.title}</h2>
      <p class="hero-sub">${day.subtitle}</p>
      <div class="hero-stats">
        <span class="stat-chip">⏱️ ${day.duration}</span>
        ${!day.isRest ? `<span class="stat-chip">🏋️ ${day.exercises.length} Hareket</span>` : ''}
        <span class="stat-chip">🏠 Dambıl + Mat</span>
      </div>
  `;

  if (!day.isRest) {
    let totalSets = 0;
    let doneSets = 0;
    day.exercises.forEach(exId => {
      const sets = getExerciseSets(selectedDayIndex, exId);
      totalSets += sets.length;
      doneSets += sets.filter(s => s.done).length;
    });
    const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
    html += `
      <div class="progress-wrap">
        <div class="progress-head">
          <span>Antrenman İlerlemesi</span>
          <strong>${doneSets}/${totalSets} Set (%${pct})</strong>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }
  html += `</section>`;

  // Rest Day View
  if (day.isRest) {
    html += `
      <section class="card">
        <h3 class="card-title">
          <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M5 8h13v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z"/><path d="M12 2v6"/></svg>
          Dinlenme &amp; Toparlanma Rehberi
        </h3>
        <div class="check-list">
          ${day.restTasks.map((t, i) => `
            <label class="check-item">
              <input type="checkbox" data-rest-task="${i}" />
              <span>${t}</span>
            </label>
          `).join('')}
        </div>
      </section>
      <button class="btn-primary ${isDayDone ? 'completed' : ''}" id="complete-day-btn">
        ${isDayDone ? '✅ Dinlenme Günü Tamamlandı' : 'Dinlenme Hedeflerini Tamamla'}
      </button>
    `;
    mainContent.innerHTML = html;
    bindTodayEvents();
    return;
  }

  // Warmup Card — DEFAULT KAPALI
  const warmupState = state.warmupDone[dateStr] || {};
  const checkedCount = Object.values(warmupState).filter(Boolean).length;
  html += `
    <section class="card">
      <div class="card-header-row" id="toggle-warmup">
        <h3 class="card-title">
          <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          5 Dk Isınma &amp; Postür
          ${checkedCount > 0 ? `<span style="font-size:12px;color:var(--success);font-weight:600;">${checkedCount}/${WARMUP_ROUTINE.length}</span>` : ''}
        </h3>
        <svg class="lucide-icon chevron-icon ${warmupOpen ? 'open' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      ${warmupOpen ? `
        <div class="check-list">
          ${WARMUP_ROUTINE.map(w => `
            <label class="check-item ${warmupState[w.id] ? 'checked' : ''}">
              <input type="checkbox" data-warmup="${w.id}" ${warmupState[w.id] ? 'checked' : ''} />
              <span>${w.text}</span>
            </label>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;

  // Exercise Cards
  day.exercises.forEach((exId, exIdx) => {
    const ex = EXERCISES[exId];
    const sets = getExerciseSets(selectedDayIndex, exId);
    const allDone = sets.every(s => s.done);
    html += `
      <article class="exercise-card ${allDone ? 'ex-done' : ''}">
        <div class="ex-top">
          <div class="ex-thumb" data-open-ex="${exId}">
            ${getExerciseSVG(ex.visualKey)}
            <span class="ex-thumb-zoom">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </span>
          </div>
          <div class="ex-info">
            <span class="ex-muscle">${exIdx + 1}. ${ex.muscle}</span>
            <h3 class="ex-name">${ex.name}</h3>
            <div class="ex-meta">
              <span>${ex.sets} Set × ${ex.reps}</span>
              <span>⏳ ${ex.rest}s</span>
              <span>💡 ${ex.startWeight}</span>
            </div>
          </div>
        </div>
        <div class="sets-grid">
          ${sets.map((s, sIdx) => `
            <div class="set-row ${s.done ? 'set-done' : ''}">
              <span class="set-num">${sIdx + 1}. Set</span>
              <input type="number" step="0.5" min="0" class="set-input" placeholder="kg"
                value="${s.weight}" data-set-input="${exId}|${sIdx}|weight" aria-label="Ağırlık kg" />
              <input type="number" min="1" class="set-input" placeholder="tekrar"
                value="${s.reps}" data-set-input="${exId}|${sIdx}|reps" aria-label="Tekrar" />
              <button class="set-check-btn ${s.done ? 'checked' : ''}"
                data-toggle-set="${exId}|${sIdx}" aria-label="Seti Tamamla">
                ${s.done
                  ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                  : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                }
              </button>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  });

  html += `
    <button class="btn-primary ${isDayDone ? 'completed' : ''}" id="complete-day-btn">
      ${isDayDone
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Bugünkü Antrenman Tamamlandı!`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Antrenmanı Tamamla &amp; Kaydet`
      }
    </button>
  `;

  mainContent.innerHTML = html;
  bindTodayEvents();
}

function bindTodayEvents() {
  document.querySelectorAll('[data-select-day]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDayIndex = parseInt(btn.dataset.selectDay, 10);
      renderTodayTab();
    });
  });

  const toggleWarmupBtn = document.getElementById('toggle-warmup');
  if (toggleWarmupBtn) {
    toggleWarmupBtn.addEventListener('click', () => {
      warmupOpen = !warmupOpen;
      renderTodayTab();
    });
  }

  document.querySelectorAll('[data-warmup]').forEach(cb => {
    cb.addEventListener('change', () => {
      const dateStr = getTodayDateStr();
      if (!state.warmupDone[dateStr]) state.warmupDone[dateStr] = {};
      state.warmupDone[dateStr][cb.dataset.warmup] = cb.checked;
      saveState();
      renderTodayTab();
    });
  });

  document.querySelectorAll('[data-open-ex]').forEach(el => {
    el.addEventListener('click', () => openExerciseModal(el.dataset.openEx));
  });

  document.querySelectorAll('[data-set-input]').forEach(inp => {
    inp.addEventListener('change', () => {
      const [exId, sIdx, field] = inp.dataset.setInput.split('|');
      const sets = getExerciseSets(selectedDayIndex, exId);
      sets[parseInt(sIdx, 10)][field] = inp.value;
      if (field === 'weight' && inp.value) {
        state.lastWeights[exId] = inp.value;
      }
      saveState();
    });
  });

  document.querySelectorAll('[data-toggle-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const [exId, sIdx] = btn.dataset.toggleSet.split('|');
      const sets = getExerciseSets(selectedDayIndex, exId);
      const idx = parseInt(sIdx, 10);
      sets[idx].done = !sets[idx].done;
      saveState();
      if (sets[idx].done) {
        startRestTimer(EXERCISES[exId].rest);
      }
      renderTodayTab();
    });
  });

  const completeBtn = document.getElementById('complete-day-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      if (!state.completedDays.includes(selectedDayIndex)) {
        state.completedDays.push(selectedDayIndex);
        // Log estimated calorie burn for today
        const today = getTodayDateStr();
        if (!state.calorieLog) state.calorieLog = {};
        state.calorieLog[today] = estimateCaloriesBurned(selectedDayIndex);
      } else {
        state.completedDays = state.completedDays.filter(d => d !== selectedDayIndex);
      }
      saveState();
      updateHeader();
      renderTodayTab();
    });
  }
}

// ═══════════════════════════════════════════
// RENDER: NUTRITION TAB
// ═══════════════════════════════════════════
function renderNutritionTab() {
  const dateStr = getTodayDateStr();
  const isTodayRest = WEEKLY_PLAN[todayDayIndex].isRest;
  if (!state.nutrition[dateStr]) {
    state.nutrition[dateStr] = {
      meals: {},
      waterMl: 0,
      mode: isTodayRest ? 'rest' : 'training'
    };
  }
  const nState = state.nutrition[dateStr];
  const plan = NUTRITION_PLAN[nState.mode];
  const waterTargetMl = plan.waterLiters * 1000;
  const p = state.profile || { age: 37, height: 180, weight: 86 };

  let html = `
    <section class="hero-card">
      <span class="badge">${p.weight} KG • ${p.height} CM • ${p.age} YAŞ</span>
      <h2>Beslenme &amp; Su Planı</h2>
      <p class="hero-sub">Günlük öğün ve su takibi.</p>
    </section>

    <div class="seg-toggle">
      <button class="seg-btn ${nState.mode === 'training' ? 'active' : ''}" data-nmode="training">🏋️ Antrenman Günü</button>
      <button class="seg-btn ${nState.mode === 'rest' ? 'active' : ''}" data-nmode="rest">🧘 Dinlenme Günü</button>
    </div>

    <div class="macro-grid">
      <div class="macro-box"><strong>${plan.calories}</strong><span>kcal</span></div>
      <div class="macro-box"><strong style="color:var(--accent)">${plan.protein}g</strong><span>Protein</span></div>
      <div class="macro-box"><strong>${plan.carbs}g</strong><span>Karb</span></div>
      <div class="macro-box"><strong>${plan.fat}g</strong><span>Yağ</span></div>
    </div>

    <section class="card water-card">
      <div>
        <h3 class="card-title">
          <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          Günlük Su Takibi
        </h3>
        <p style="margin:2px 0 0;font-size:13px;color:var(--text-muted);">
          <strong>${(nState.waterMl / 1000).toFixed(2)} L</strong> / ${plan.waterLiters} L
        </p>
      </div>
      <div class="water-btns">
        <button class="btn-secondary" data-water="-250">-250ml</button>
        <button class="btn-secondary" style="background:var(--accent);border-color:var(--accent);color:#fff;" data-water="250">+250ml</button>
      </div>
    </section>

    ${plan.meals.map(m => {
      const checked = !!nState.meals[m.id];
      return `
        <label class="card meal-card ${checked ? 'ex-done' : ''}">
          <input type="checkbox" data-meal="${m.id}" ${checked ? 'checked' : ''} />
          <div>
            <div class="meal-time">${m.time}</div>
            <div class="meal-title">${m.title}</div>
            <p class="meal-items">${m.items}</p>
            <div class="meal-macros">${m.macros}</div>
          </div>
        </label>
      `;
    }).join('')}
  `;

  mainContent.innerHTML = html;

  document.querySelectorAll('[data-nmode]').forEach(btn => {
    btn.addEventListener('click', () => {
      nState.mode = btn.dataset.nmode;
      saveState();
      renderNutritionTab();
    });
  });

  document.querySelectorAll('[data-water]').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseInt(btn.dataset.water, 10);
      nState.waterMl = Math.max(0, Math.min(waterTargetMl + 1500, nState.waterMl + delta));
      saveState();
      renderNutritionTab();
    });
  });

  document.querySelectorAll('[data-meal]').forEach(cb => {
    cb.addEventListener('change', () => {
      nState.meals[cb.dataset.meal] = cb.checked;
      saveState();
      renderNutritionTab();
    });
  });
}

// ═══════════════════════════════════════════
// CHART HELPERS — Lightweight SVG/Canvas charts
// ═══════════════════════════════════════════
function drawLineChart(canvasId, labels, values, color = '#0E7E8E', unit = '') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 300;
  const H = 110;
  canvas.width = W;
  canvas.height = H;

  const isDark = document.documentElement.dataset.theme !== 'light';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(1,15,30,0.08)';
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(1,15,30,0.55)';

  if (!values.length || values.every(v => v === null)) {
    ctx.fillStyle = labelColor;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Henüz veri yok', W / 2, H / 2);
    return;
  }

  const pad = { top: 14, bottom: 24, left: 12, right: 12 };
  const validVals = values.filter(v => v !== null);
  const minV = Math.min(...validVals);
  const maxV = Math.max(...validVals);
  const range = maxV - minV || 1;

  const getX = i => pad.left + (i / Math.max(values.length - 1, 1)) * (W - pad.left - pad.right);
  const getY = v => pad.top + (1 - (v - minV) / range) * (H - pad.top - pad.bottom);

  // Grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  [0.25, 0.5, 0.75].forEach(r => {
    const y = pad.top + r * (H - pad.top - pad.bottom);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
  });

  // Fill gradient under curve
  const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
  grad.addColorStop(0, color.replace(')', ', 0.35)').replace('rgb', 'rgba'));
  grad.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
  if (!color.startsWith('rgb')) {
    // hex color — use direct approach
  }

  // Draw line
  ctx.beginPath();
  let first = true;
  values.forEach((v, i) => {
    if (v === null) return;
    const x = getX(i);
    const y = getY(v);
    if (first) { ctx.moveTo(x, y); first = false; }
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  values.forEach((v, i) => {
    if (v === null) return;
    const x = getX(i);
    const y = getY(v);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'var(--surface)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Last value label
  if (validVals.length) {
    const lastIdx = values.map((v, i) => v !== null ? i : -1).filter(i => i >= 0).pop();
    const lx = getX(lastIdx);
    const ly = getY(values[lastIdx]);
    ctx.fillStyle = color;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = lx > W - 50 ? 'right' : 'left';
    ctx.fillText(`${values[lastIdx]}${unit}`, lx + (lx > W - 50 ? -6 : 6), ly - 6);
  }

  // X-axis labels
  ctx.fillStyle = labelColor;
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  const step = Math.ceil(labels.length / 6);
  labels.forEach((lbl, i) => {
    if (i % step === 0 || i === labels.length - 1) {
      ctx.fillText(lbl, getX(i), H - 4);
    }
  });
}

function drawBarChart(canvasId, labels, values, color = '#22D3B0', unit = '') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 300;
  const H = 110;
  canvas.width = W;
  canvas.height = H;

  const isDark = document.documentElement.dataset.theme !== 'light';
  const labelColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(1,15,30,0.55)';

  if (!values.length || values.every(v => !v)) {
    ctx.fillStyle = labelColor;
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Henüz veri yok', W / 2, H / 2);
    return;
  }

  const pad = { top: 10, bottom: 24, left: 8, right: 8 };
  const maxV = Math.max(...values) || 1;
  const barW = Math.max(4, (W - pad.left - pad.right) / values.length - 3);

  values.forEach((v, i) => {
    const x = pad.left + i * ((W - pad.left - pad.right) / values.length);
    const barH = ((v || 0) / maxV) * (H - pad.top - pad.bottom);
    const y = H - pad.bottom - barH;

    ctx.fillStyle = color + '55';
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, 3) : ctx.rect(x, y, barW, barH);
    ctx.fill();

    if (v) {
      ctx.fillStyle = color;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${v}`, x + barW / 2, y - 3);
    }

    ctx.fillStyle = labelColor;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 5);
  });
}

// Build last N-day data arrays from state
function buildMeasurementData(field, n = 10) {
  const all = [...(state.measurements || [])].slice(-n);
  return {
    labels: all.map(m => m.date.slice(5)),   // MM-DD
    values: all.map(m => m[field] ?? null)
  };
}

function buildCalorieData(n = 10) {
  const log = state.calorieLog || {};
  const keys = Object.keys(log).sort().slice(-n);
  return {
    labels: keys.map(k => k.slice(5)),
    values: keys.map(k => log[k] || 0)
  };
}

// ═══════════════════════════════════════════
// RENDER: PROGRESS TAB
// ═══════════════════════════════════════════
function renderProgressTab() {
  const p = state.profile || { age: 37, height: 180, weight: 86 };
  const bmi = (p.weight / Math.pow(p.height / 100, 2)).toFixed(1);
  const msrs = state.measurements;
  const latest = msrs[msrs.length - 1] || { weight: p.weight, rightArm: 35, leftArm: 34.8 };
  const first = msrs[0] || latest;
  const armDelta = (latest.rightArm - first.rightArm).toFixed(1);
  const weightDelta = (latest.weight - first.weight).toFixed(1);
  const totalWorkouts = state.completedDays ? state.completedDays.filter(d => !WEEKLY_PLAN[d].isRest).length : 0;

  const wDeltaSign = parseFloat(weightDelta) > 0 ? '+' : '';
  const aDeltaSign = parseFloat(armDelta) > 0 ? '+' : '';

  let html = `
    <section class="hero-card">
      <span class="badge">İLERLEME GRAFİKLERİ</span>
      <h2>Vücut &amp; Antrenman Takibi</h2>
      <p class="hero-sub">Ölçümlerini gir, gelişimini gözlemle.</p>
    </section>

    <div class="stats-row">
      <div class="stat-box">
        <span class="stat-value">${latest.weight}<small style="font-size:14px"> kg</small></span>
        <span class="stat-name">Güncel Kilo</span>
        <span class="stat-delta ${parseFloat(weightDelta) > 0 ? 'delta-pos' : 'delta-neg'}">${wDeltaSign}${weightDelta} kg</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${bmi}</span>
        <span class="stat-name">VKİ</span>
        <span class="stat-delta" style="color:var(--text-muted);">${parseFloat(bmi) < 25 ? '✅ Normal' : '⚠️ Fazla'}</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${latest.rightArm}<small style="font-size:14px"> cm</small></span>
        <span class="stat-name">Sağ Kol</span>
        <span class="stat-delta ${parseFloat(armDelta) >= 0 ? 'delta-pos' : 'delta-neg'}">${aDeltaSign}${armDelta} cm</span>
      </div>
      <div class="stat-box">
        <span class="stat-value">${totalWorkouts}</span>
        <span class="stat-name">Bu hafta antrenman</span>
        <span class="stat-delta" style="color:var(--text-muted);">/5 gün</span>
      </div>
    </div>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
        Yakılan Kalori (Tahmini)
      </h3>
      <div class="chart-wrap">
        <canvas class="chart-canvas" id="chart-cal"></canvas>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        Kilo Grafiği (kg)
      </h3>
      <div class="chart-wrap">
        <canvas class="chart-canvas" id="chart-weight"></canvas>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        Kol Çevresi (cm)
      </h3>
      <div class="chart-wrap" style="margin-bottom:8px;">
        <div class="chart-label" style="color:var(--accent);">▸ Sağ Kol</div>
        <canvas class="chart-canvas" id="chart-rarm"></canvas>
      </div>
      <div class="chart-wrap">
        <div class="chart-label" style="color:var(--success);">▸ Sol Kol</div>
        <canvas class="chart-canvas" id="chart-larm"></canvas>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Haftalık Ölçüm Ekle
      </h3>
      <p style="font-size:12px;color:var(--text-muted);margin:4px 0 10px;">
        💾 Veriler tarayıcı hafızasına kaydedilir.
      </p>
      <div class="input-grid">
        <div>
          <label class="field-label">Kilo (kg)</label>
          <input id="inp-weight" type="number" step="0.1" class="set-input" value="${latest.weight}" />
        </div>
        <div>
          <label class="field-label">Sağ Kol (cm)</label>
          <input id="inp-rarm" type="number" step="0.1" class="set-input" value="${latest.rightArm}" />
        </div>
        <div>
          <label class="field-label">Sol Kol (cm)</label>
          <input id="inp-larm" type="number" step="0.1" class="set-input" value="${latest.leftArm}" />
        </div>
      </div>
      <button class="btn-primary" id="save-measure-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Ölçümü Kaydet
      </button>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        Ölçüm Geçmişi
      </h3>
      <div class="history-list">
        ${msrs.length === 0
          ? '<p style="font-size:13px;color:var(--text-muted);">Henüz ölçüm eklenmedi.</p>'
          : msrs.slice().reverse().map(m => `
            <div class="history-row">
              <span>${m.date}</span>
              <strong>${m.weight} kg • Sağ: ${m.rightArm} cm • Sol: ${m.leftArm} cm</strong>
            </div>
          `).join('')
        }
      </div>
    </section>
  `;

  mainContent.innerHTML = html;

  // Draw charts after DOM is ready
  requestAnimationFrame(() => {
    const cal = buildCalorieData(14);
    drawBarChart('chart-cal', cal.labels, cal.values, '#22D3B0', ' kcal');

    const wt = buildMeasurementData('weight', 12);
    drawLineChart('chart-weight', wt.labels, wt.values, '#0E7E8E', ' kg');

    const ra = buildMeasurementData('rightArm', 12);
    drawLineChart('chart-rarm', ra.labels, ra.values, '#15A8BB', ' cm');

    const la = buildMeasurementData('leftArm', 12);
    drawLineChart('chart-larm', la.labels, la.values, '#22D3B0', ' cm');
  });

  document.getElementById('save-measure-btn').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('inp-weight').value);
    const r = parseFloat(document.getElementById('inp-rarm').value);
    const l = parseFloat(document.getElementById('inp-larm').value);
    if (!isNaN(w) && !isNaN(r) && !isNaN(l)) {
      state.measurements.push({ date: getTodayDateStr(), weight: w, rightArm: r, leftArm: l });
      if (!state.profile) state.profile = { age: 37, height: 180, weight: w };
      else state.profile.weight = w;
      saveState();
      renderProgressTab();
    }
  });
}

// ═══════════════════════════════════════════
// RENDER: PROFILE TAB
// ═══════════════════════════════════════════
function renderProfileTab() {
  const p = state.profile || { age: 37, height: 180, weight: 86 };
  const bmi = (p.weight / Math.pow(p.height / 100, 2)).toFixed(1);
  const totalWorkouts = state.completedDays ? state.completedDays.filter(d => !WEEKLY_PLAN[d].isRest).length : 0;

  let html = `
    <section class="hero-card">
      <span class="badge">PROFİL</span>
      <h2>👤 Profil Bilgileri</h2>
      <div class="hero-stats">
        <span class="stat-chip">🎂 ${p.age} Yaş</span>
        <span class="stat-chip">📏 ${p.height} cm</span>
        <span class="stat-chip">⚖️ ${p.weight} kg</span>
        <span class="stat-chip">🧮 VKİ ${bmi}</span>
        <span class="stat-chip">🏋️ ${totalWorkouts} Antrenman</span>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Profil Düzenle
      </h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0;">
        <div>
          <label class="field-label">Yaş</label>
          <input id="prof-age" type="number" min="14" max="99" class="set-input" value="${p.age}" />
        </div>
        <div>
          <label class="field-label">Boy (cm)</label>
          <input id="prof-height" type="number" min="120" max="230" class="set-input" value="${p.height}" />
        </div>
      </div>
      <button class="btn-primary" id="save-profile-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Profili Kaydet
      </button>
    </section>

    <section class="card">
      <h3 class="card-title">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Antrenman Kayıtları Hakkında
      </h3>
      <p style="font-size:13px;color:var(--text-muted);margin:6px 0 0;line-height:1.6;">
        <strong>"Antrenmanı Tamamla"</strong> bastığında, o günün tamamlandığı
        <span style="color:var(--success);">🔥 seri sayacına</span> işlenir ve set/tekrar/ağırlık kayıtların
        <strong>tarayıcı hafızasına</strong> otomatik kaydedilir.
        <br><br>
        📌 Set tik attığın an, ağırlık/tekrar girdiğin an anında kaydedilir. <strong>İnternet kesilse bile</strong> kaybolmaz.
        <br><br>
        🏋️ Bu haftaki tamamlanan antrenman: <strong>${totalWorkouts} gün</strong>
      </p>
    </section>
  `;

  mainContent.innerHTML = html;

  document.getElementById('save-profile-btn').addEventListener('click', () => {
    const age = parseInt(document.getElementById('prof-age').value, 10);
    const height = parseInt(document.getElementById('prof-height').value, 10);
    if (!isNaN(age) && !isNaN(height)) {
      state.profile = { ...state.profile, age, height };
      saveState();
      renderProfileTab();
    }
  });
}

// ═══════════════════════════════════════════
// RENDER: SETTINGS TAB
// ═══════════════════════════════════════════
function renderSettingsTab() {
  const isLight = document.documentElement.dataset.theme === 'light';

  let html = `
    <section class="hero-card">
      <span class="badge">AYARLAR</span>
      <h2>⚙️ Uygulama Ayarları</h2>
      <p class="hero-sub">Tema, ses, güncelleme ve veri yönetimi.</p>
    </section>

    <section class="card">
      <div class="settings-row">
        <span class="settings-row-label">
          <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          Açık Tema
        </span>
        <label class="toggle-switch">
          <input type="checkbox" id="settings-theme-toggle" ${isLight ? 'checked' : ''} />
          <span class="toggle-track"></span>
        </label>
      </div>
      <div class="settings-row">
        <span class="settings-row-label">
          <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          Müzik Çal
        </span>
        <label class="toggle-switch">
          <input type="checkbox" id="settings-music-toggle" ${musicOn ? 'checked' : ''} />
          <span class="toggle-track"></span>
        </label>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title" style="margin-bottom:12px;">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        WebAPK Kurulum &amp; Güncelleme
      </h3>
      <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px;">
        Telefonda Chrome/Safari menüsünden <strong>"Ana Ekrana Ekle"</strong> veya <strong>"Uygulamayı Yükle"</strong> seçerek tam ekran uygulama gibi kullan.
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-secondary" id="force-update-btn" style="border-color:rgba(34,211,176,0.4);color:var(--success);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Güncelle (Veri Korunur)
        </button>
        <button class="btn-secondary" id="reset-data-btn" style="color:#FCA5A5;border-color:rgba(239,68,68,0.3);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Tüm Verileri Sıfırla
        </button>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title" style="margin-bottom:8px;">
        <svg class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        Hakkında
      </h3>
      <p style="font-size:13px;color:var(--text-muted);margin:0;line-height:1.6;">
        <strong>KolGücü PWA</strong> — Evde Dambıl Antrenman &amp; Beslenme Uygulaması<br>
        37 yaş • 180 cm • 86 kg • Masa başı çalışanı<br>
        5 gün/hafta • Dambıl 2–20 kg • Mat • Ev egzersizleri
      </p>
    </section>
  `;

  mainContent.innerHTML = html;

  document.getElementById('settings-theme-toggle').addEventListener('change', (e) => {
    const moonEl = document.getElementById('theme-icon-moon');
    const sunEl = document.getElementById('theme-icon-sun');
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('kolgucu_theme', 'light');
      if (moonEl) moonEl.classList.add('hidden');
      if (sunEl) sunEl.classList.remove('hidden');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('kolgucu_theme', 'dark');
      if (moonEl) moonEl.classList.remove('hidden');
      if (sunEl) sunEl.classList.add('hidden');
    }
  });

  document.getElementById('settings-music-toggle').addEventListener('change', (e) => {
    if (e.target.checked && !musicOn) {
      musicOn = true;
      document.body.classList.add('music-playing');
      musicBtn.classList.add('music-active');
      buildAudioPlayer();
      togglePlay();
    } else if (!e.target.checked && musicOn) {
      musicOn = false;
      document.body.classList.remove('music-playing');
      musicBtn.classList.remove('music-active');
      if (audioEl) audioEl.pause();
      if (musicPlayerEl) { musicPlayerEl.remove(); musicPlayerEl = null; audioEl = null; }
    }
  });

  document.getElementById('force-update-btn').addEventListener('click', async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.update()));
      }
    } catch (e) {}
    window.location.reload();
  });

  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm('Tüm antrenman ve ölçü kayıtların silinsin mi?')) {
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      updateHeader();
      renderSettingsTab();
    }
  });
}

// ═══════════════════════════════════════════
// Tab Switching
// ═══════════════════════════════════════════
function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  if (tabName === 'today') renderTodayTab();
  else if (tabName === 'nutrition') renderNutritionTab();
  else if (tabName === 'progress') renderProgressTab();
  else if (tabName === 'profile') renderProfileTab();
  else if (tabName === 'settings') renderSettingsTab();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installBtn.classList.add('hidden');
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// Init
updateHeader();
switchTab('today');
