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
      return parsed;
    }
  } catch (e) {}
  return {
    weekId: getWeekId(),
    profile: { age: 37, height: 180, weight: 86 },
    completedDays: [], // array of dayIndex completed this week
    warmupDone: {}, // { dateStr: { w1: true } }
    workoutLogs: {}, // { "dateStr_dayIndex": { exId: [{ weight, reps, done }] } }
    lastWeights: {}, // { exId: "8" }
    nutrition: {}, // { dateStr: { meals: {}, waterMl: 0, mode: 'training' } }
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
let warmupOpen = true;
let timerInterval = null;
let timerSeconds = 0;
let deferredInstallPrompt = null;
let musicOn = false;

// ── Energy Lines Canvas ──────────────────────────────────────
const energyCanvas = document.getElementById('energy-canvas');
const ctx2d = energyCanvas ? energyCanvas.getContext('2d') : null;

const lines = Array.from({ length: 18 }, (_, i) => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  angle: Math.random() * Math.PI * 2,
  speed: 0.5 + Math.random() * 1.1,
  length: 60 + Math.random() * 100,
  width: 0.6 + Math.random() * 1.4,
  opacity: 0.15 + Math.random() * 0.45,
  hue: Math.random() > 0.5 ? '14, 126, 142' : '168, 221, 229'
}));

function resizeCanvas() {
  if (!energyCanvas) return;
  energyCanvas.width = window.innerWidth;
  energyCanvas.height = window.innerHeight;
}

function animateLines() {
  if (!ctx2d || !energyCanvas) return;
  ctx2d.clearRect(0, 0, energyCanvas.width, energyCanvas.height);
  const isDark = document.documentElement.dataset.theme !== 'light';
  lines.forEach(l => {
    l.x += Math.cos(l.angle) * l.speed;
    l.y += Math.sin(l.angle) * l.speed;
    if (l.x < -l.length) l.x = energyCanvas.width + l.length;
    if (l.x > energyCanvas.width + l.length) l.x = -l.length;
    if (l.y < -l.length) l.y = energyCanvas.height + l.length;
    if (l.y > energyCanvas.height + l.length) l.y = -l.length;
    l.angle += (Math.random() - 0.5) * 0.025;
    const alpha = isDark ? l.opacity : l.opacity * 0.55;
    const grad = ctx2d.createLinearGradient(
      l.x, l.y,
      l.x + Math.cos(l.angle) * l.length,
      l.y + Math.sin(l.angle) * l.length
    );
    grad.addColorStop(0, `rgba(${l.hue},0)`);
    grad.addColorStop(0.5, `rgba(${l.hue},${alpha})`);
    grad.addColorStop(1, `rgba(${l.hue},0)`);
    ctx2d.beginPath();
    ctx2d.moveTo(l.x, l.y);
    ctx2d.lineTo(
      l.x + Math.cos(l.angle) * l.length,
      l.y + Math.sin(l.angle) * l.length
    );
    ctx2d.strokeStyle = grad;
    ctx2d.lineWidth = l.width;
    ctx2d.stroke();
  });
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
const musicFrameWrap = document.getElementById('music-frame-wrap');
const pixabayFrame = document.getElementById('pixabay-frame');

// ── Theme toggle ──
const savedTheme = localStorage.getItem('kolgucu_theme') || 'dark';
if (savedTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');
if (themBtn) {
  themBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  themBtn.addEventListener('click', () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('kolgucu_theme', 'dark');
      themBtn.textContent = '☀️';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('kolgucu_theme', 'light');
      themBtn.textContent = '🌙';
    }
  });
}

// ── Music toggle ──
const PIXABAY_URL = 'https://pixabay.com/music/search/?playlist=32818059&autoplay=1';
if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
      musicBtn.classList.add('music-active');
      musicBtn.textContent = '🔊';
      musicFrameWrap.classList.remove('hidden');
      if (pixabayFrame && !pixabayFrame.src.includes('pixabay')) {
        pixabayFrame.src = PIXABAY_URL;
      }
    } else {
      musicBtn.classList.remove('music-active');
      musicBtn.textContent = '🎵';
      musicFrameWrap.classList.add('hidden');
      if (pixabayFrame) pixabayFrame.src = '';
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

// Render: TODAY TAB
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
        <h3 class="card-title">🧘 Dinlenme & Toparlanma Rehberi</h3>
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

  // Warmup Card (Desk worker posture)
  const warmupState = state.warmupDone[dateStr] || {};
  html += `
    <section class="card">
      <div class="card-header-row" id="toggle-warmup">
        <h3 class="card-title">🔥 5 Dk Isınma & Masa Başı Postür</h3>
        <span>${warmupOpen ? '▲' : '▼'}</span>
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
            <span class="ex-thumb-zoom">🔍</span>
          </div>
          <div class="ex-info">
            <span class="ex-muscle">${exIdx + 1}. ${ex.muscle}</span>
            <h3 class="ex-name">${ex.name}</h3>
            <div class="ex-meta">
              <span>${ex.sets} Set × ${ex.reps}</span>
              <span>⏳ ${ex.rest}s</span>
              <span>💡 ${ex.startWeight}</span>
            </div>
            <button class="btn-guide" data-open-ex="${exId}">👁️ Görsel & Form Rehberi</button>
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
                ${s.done ? '✓' : '○'}
              </button>
            </div>
          `).join('')}
        </div>
      </article>
    `;
  });

  html += `
    <button class="btn-primary ${isDayDone ? 'completed' : ''}" id="complete-day-btn">
      ${isDayDone ? '✅ Bugünkü Antrenman Tamamlandı!' : '🏁 Antrenmanı Tamamla & Kaydet'}
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
      } else {
        state.completedDays = state.completedDays.filter(d => d !== selectedDayIndex);
      }
      saveState();
      updateHeader();
      renderTodayTab();
    });
  }
}

// Render: NUTRITION TAB
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
      <h2>Beslenme & Su Planı</h2>
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
        <h3 class="card-title">💧 Günlük Su Takibi</h3>
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

// Render: PROGRESS TAB
function renderProgressTab() {
  const p = state.profile || { age: 37, height: 180, weight: 86 };
  const bmi = (p.weight / Math.pow(p.height / 100, 2)).toFixed(1);
  const latest = state.measurements[state.measurements.length - 1] || { weight: p.weight, rightArm: 35, leftArm: 34.8 };
  const first = state.measurements[0] || latest;
  const armDelta = (latest.rightArm - first.rightArm).toFixed(1);

  let html = `
    <section class="hero-card">
      <span class="badge">PROFİL & GELİŞİM</span>
      <h2>Ölçü & Profil Bilgileri</h2>
      <p class="hero-sub">Yaş, boy, kilo bilgilerini ve haftalık kol ölçünü buradan güncelle.</p>
      <div class="hero-stats">
        <span class="stat-chip">🎂 ${p.age} Yaş</span>
        <span class="stat-chip">📏 ${p.height} cm</span>
        <span class="stat-chip">⚖️ ${p.weight} kg (VKİ: ${bmi})</span>
        <span class="stat-chip">💪 Sağ Kol: ${latest.rightArm} cm (${armDelta >= 0 ? '+' : ''}${armDelta})</span>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">👤 Profilimi Düzenle (Yaş, Boy, Kilo)</h3>
      <div class="input-grid">
        <div>
          <label class="field-label">Yaş</label>
          <input id="prof-age" type="number" min="14" max="99" class="set-input" value="${p.age}" />
        </div>
        <div>
          <label class="field-label">Boy (cm)</label>
          <input id="prof-height" type="number" min="120" max="230" class="set-input" value="${p.height}" />
        </div>
        <div>
          <label class="field-label">Kilo (kg)</label>
          <input id="prof-weight" type="number" step="0.1" min="35" max="250" class="set-input" value="${p.weight}" />
        </div>
      </div>
      <button class="btn-primary" id="save-profile-btn">Profili Kaydet</button>
    </section>

    <section class="card">
      <h3 class="card-title">📏 Yeni Ölçüm Ekle</h3>
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
      <button class="btn-primary" id="save-measure-btn">Ölçümü Kaydet</button>
    </section>

    <section class="card">
      <h3 class="card-title">🗂️ Ölçüm Geçmişi</h3>
      <div class="history-list">
        ${state.measurements.slice().reverse().map(m => `
          <div class="history-row">
            <span>${m.date}</span>
            <strong>${m.weight} kg • Sağ: ${m.rightArm} cm • Sol: ${m.leftArm} cm</strong>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">📲 WebAPK Kurulum & Güncelleme</h3>
      <p style="font-size:13px;color:var(--text-muted);margin:6px 0 10px;">
        Telefonda Chrome/Safari menüsünden <strong>"Ana Ekrana Ekle"</strong> veya <strong>"Uygulamayı Yükle"</strong> seçeneğine dokunarak tam ekran uygulama gibi kullanabilirsin.
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn-secondary" id="force-update-btn" style="border-color:rgba(16,185,129,0.4);color:var(--success);">
          🔄 Uygulamayı Güncelle (Veriler Korunur)
        </button>
        <button class="btn-secondary" id="reset-data-btn" style="color:#FCA5A5;border-color:rgba(239,68,68,0.3);">
          Tüm Verileri Sıfırla
        </button>
      </div>
    </section>
  `;

  mainContent.innerHTML = html;

  document.getElementById('save-profile-btn').addEventListener('click', () => {
    const age = parseInt(document.getElementById('prof-age').value, 10);
    const height = parseInt(document.getElementById('prof-height').value, 10);
    const weight = parseFloat(document.getElementById('prof-weight').value);
    if (!isNaN(age) && !isNaN(height) && !isNaN(weight)) {
      state.profile = { age, height, weight };
      saveState();
      renderProgressTab();
    }
  });

  document.getElementById('save-measure-btn').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('inp-weight').value);
    const r = parseFloat(document.getElementById('inp-rarm').value);
    const l = parseFloat(document.getElementById('inp-larm').value);
    if (!isNaN(w) && !isNaN(r) && !isNaN(l)) {
      state.measurements.push({ date: getTodayDateStr(), weight: w, rightArm: r, leftArm: l });
      saveState();
      renderProgressTab();
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
      renderProgressTab();
    }
  });
}

// Tab Switching
function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  if (tabName === 'today') renderTodayTab();
  else if (tabName === 'nutrition') renderNutritionTab();
  else if (tabName === 'progress') renderProgressTab();
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
