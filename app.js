(() => {
  'use strict';

  // ---------- Storage ----------
  const STORE_KEY = 'eliza-calendar-v1';
  const MAX_STICKERS = 30;

  function emptyState() {
    return { version: 1, months: {}, days: {}, settings: { particles: true, sounds: true } };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyState();
      return normalize(JSON.parse(raw));
    } catch (e) {
      return emptyState();
    }
  }

  function normalize(data) {
    const base = emptyState();
    if (!data || typeof data !== 'object') return base;
    return {
      version: 1,
      months: data.months && typeof data.months === 'object' ? data.months : {},
      days: data.days && typeof data.days === 'object' ? data.days : {},
      settings: { ...base.settings, ...(data.settings || {}) },
    };
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save', e);
    }
  }

  let state = load();
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const pad = (n) => String(n).padStart(2, '0');
  const monthKey = (y, m) => `${y}-${pad(m + 1)}`;
  const dayKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function parseDayKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return { y, m: m - 1, d };
  }

  function todayKey() {
    const t = new Date();
    return dayKey(t.getFullYear(), t.getMonth(), t.getDate());
  }

  function monthSettings(y, m) {
    return state.months[monthKey(y, m)] || {};
  }

  function themeFor(y, m) {
    const id = monthSettings(y, m).theme || 'seasons';
    const theme = THEMES[id] || THEMES.seasons;
    return theme.auto ? THEMES[SEASON_BY_MONTH[m]] : theme;
  }

  function fontFor(y, m) {
    return FONTS[monthSettings(y, m).font] || FONTS.rounded;
  }

  function frameFor(y, m) {
    const id = monthSettings(y, m).frame;
    return FRAMES[id] ? id : themeFor(y, m).frame;
  }

  function garlandFor(y, m) {
    const id = monthSettings(y, m).garland;
    return GARLANDS[id] ? id : themeFor(y, m).garland;
  }

  function emojiTile(a, b) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='52' height='26'>` +
      `<text x='4' y='20' font-size='18'>${a}</text><text x='30' y='20' font-size='18'>${b}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  // The patterned border around the calendar.
  function frameCSS(kind, theme) {
    const c = theme.colors;
    const soft = (col, pct) => `color-mix(in srgb, ${col} ${pct}%, white)`;
    switch (kind) {
      case 'emoji':
        return `${emojiTile(theme.particles[0], theme.deco[0])} 0 0 / 52px 26px round, ${soft(c[0], 45)}`;
      case 'dots':
        return `radial-gradient(circle, ${c[1]} 30%, transparent 32%) 0 0 / 22px 22px, ` +
          `radial-gradient(circle, ${c[2]} 30%, transparent 32%) 11px 11px / 22px 22px, ${c[0]}`;
      case 'stripes':
        return `repeating-linear-gradient(45deg, ${c[0]} 0 11px, #fff 11px 18px, ${c[1]} 18px 29px, #fff 29px 36px)`;
      case 'checks':
        return `repeating-conic-gradient(${c[0]} 0 25%, ${soft(c[1], 50)} 0 50%) 0 0 / 26px 26px`;
      case 'rainbow':
        return 'linear-gradient(135deg, #ff6b6b, #ffa94d, #ffd43b, #69db7c, #4dabf7, #9775fa, #f783ac)';
      default:
        return 'transparent';
    }
  }

  // Flags or twinkle lights hanging across the top.
  function garlandSVG(kind, theme, width) {
    if (kind === 'none' || !width) return '';
    const W = Math.round(width);
    const swags = W > 900 ? 4 : 3;
    const seg = W / swags;
    const sag = 16;
    const top = 4;
    const wire = kind === 'lights' ? '#3d5a3d' : 'rgba(90,70,60,.75)';
    let paths = '';
    let items = '';
    let n = 0;
    for (let i = 0; i < swags; i++) {
      const ax = i * seg, bx = (i + 1) * seg, cx = ax + seg / 2, cy = top + sag * 2;
      paths += `M${ax},${top} Q${cx},${cy} ${bx},${top} `;
      const count = Math.max(3, Math.floor(seg / (kind === 'lights' ? 40 : 34)));
      for (let k = 0; k < count; k++) {
        const t = (k + 0.5) / count;
        const x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx;
        const y = (1 - t) * (1 - t) * top + 2 * (1 - t) * t * cy + t * t * top;
        const dx = 2 * (1 - t) * (cx - ax) + 2 * t * (bx - cx);
        const dy = 2 * (1 - t) * (cy - top) + 2 * t * (top - cy);
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
        const col = theme.colors[n % theme.colors.length];
        if (kind === 'lights') {
          items += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(deg * 0.5).toFixed(1)})">` +
            `<rect x="-3.5" y="-1" width="7" height="7" rx="1.5" fill="#556b55"/>` +
            `<ellipse class="bulb" cx="0" cy="13" rx="6.5" ry="9" fill="${col}" style="color:${col}"/></g>`;
        } else {
          items += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)})">` +
            `<polygon points="-13,0 13,0 0,26" fill="${col}" stroke="rgba(0,0,0,.08)" stroke-width="1"/></g>`;
        }
        n++;
      }
    }
    return `<svg width="${W}" height="64" viewBox="0 0 ${W} 64">` +
      `<path d="${paths}" fill="none" stroke="${wire}" stroke-width="2.5"/>${items}</svg>`;
  }

  function renderGarland() {
    const theme = themeFor(view.y, view.m);
    const kind = garlandFor(view.y, view.m);
    const box = $('garland');
    box.className = `garland ${kind}`;
    box.innerHTML = garlandSVG(kind, theme, box.clientWidth);
    $('app').classList.toggle('has-garland', kind !== 'none');
  }

  function hasContent(day) {
    return day && ((day.text && day.text.trim()) || (day.stickers && day.stickers.length) || day.color);
  }

  // ---------- Sounds ----------
  let audioCtx = null;
  function playPop(freq = 520) {
    if (!state.settings.sounds) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.2, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch (e) { /* sound is optional */ }
  }

  // ---------- Theme ----------
  const now = new Date();
  const view = { y: now.getFullYear(), m: now.getMonth() };

  function applyTheme() {
    const theme = themeFor(view.y, view.m);
    const font = fontFor(view.y, view.m);
    const root = document.documentElement.style;
    root.setProperty('--bg', theme.bg);
    root.setProperty('--ink', theme.ink);
    root.setProperty('--weekday', theme.weekday);
    root.setProperty('--cell', theme.cell);
    root.setProperty('--border', theme.border);
    root.setProperty('--today', theme.today);
    root.setProperty('--accent', theme.accent);
    root.setProperty('--accent-ink', theme.accentInk);
    root.setProperty('--cal-font', font.stack);
    const frame = frameFor(view.y, view.m);
    root.setProperty('--frame', frameCSS(frame, theme));
    root.setProperty('--frame-pad', { none: '0px', emoji: '26px' }[frame] || '14px');
    $('decoLeft').textContent = theme.deco[0];
    $('decoRight').textContent = theme.deco[1];
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.accent);
    renderParticles(theme);
    renderGarland();
  }

  let particleSig = '';
  function renderParticles(theme) {
    const box = $('particles');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const on = state.settings.particles && !reduced;
    const sig = on ? theme.particles.join('') + theme.motion : 'off';
    if (sig === particleSig) return;
    particleSig = sig;
    box.innerHTML = '';
    if (!on) return;
    const count = theme.motion === 'twinkle' ? 30 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = `particle ${theme.motion}`;
      p.textContent = theme.particles[i % theme.particles.length];
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.fontSize = `${20 + Math.random() * 28}px`;
      p.style.animationDuration = `${10 + Math.random() * 14}s`;
      p.style.animationDelay = `${-Math.random() * 20}s`;
      box.appendChild(p);
    }
  }

  // ---------- Day rendering (shared by grid + editor) ----------
  function textSizeClass(text) {
    const n = text.length;
    if (n <= 10) return 'size-xl';
    if (n <= 22) return 'size-l';
    if (n <= 40) return 'size-m';
    return 'size-s';
  }

  function renderDay(el, key, opts = {}) {
    const { d } = parseDayKey(key);
    const day = state.days[key] || {};
    el.innerHTML = '';
    el.style.setProperty('--day-color', day.color || 'var(--cell)');

    const num = document.createElement('div');
    num.className = 'day-num';
    num.textContent = d;
    el.appendChild(num);

    const layer = document.createElement('div');
    layer.className = 'sticker-layer';
    (day.stickers || []).forEach((s, i) => {
      const sp = document.createElement('span');
      sp.className = 'sticker';
      sp.dataset.idx = i;
      sp.textContent = s.e;
      positionSticker(sp, s);
      if (opts.selected === i) sp.classList.add('selected');
      layer.appendChild(sp);
    });
    el.appendChild(layer);

    // A faint theme charm so empty days still look decorated.
    if (opts.charm && !hasContent(day)) {
      const c = document.createElement('span');
      c.className = 'charm';
      c.textContent = opts.charm;
      el.appendChild(c);
    }

    const text = (day.text || '').trim();
    if (text) {
      const t = document.createElement('div');
      t.className = `day-text ${textSizeClass(text)}`;
      t.textContent = text;
      if (day.textColor) t.style.color = day.textColor;
      el.appendChild(t);
    }
  }

  function positionSticker(el, s) {
    el.style.left = `${s.x * 100}%`;
    el.style.top = `${s.y * 100}%`;
    el.style.setProperty('--s', s.s);
    el.style.transform = `translate(-50%, -50%) rotate(${s.r}deg)`;
  }

  // ---------- Month grid ----------
  function renderWeekdays() {
    const box = $('weekdays');
    box.innerHTML = '';
    WEEKDAY_NAMES.forEach((name) => {
      const el = document.createElement('div');
      el.innerHTML = `<span class="long">${name}</span><span class="short">${name.slice(0, 3)}</span>`;
      box.appendChild(el);
    });
  }

  function renderMonth() {
    applyTheme();
    $('monthName').textContent = MONTH_NAMES[view.m];
    $('yearName').textContent = view.y;

    const grid = $('grid');
    grid.innerHTML = '';
    const first = new Date(view.y, view.m, 1).getDay();
    const daysIn = new Date(view.y, view.m + 1, 0).getDate();
    const rows = Math.ceil((first + daysIn) / 7);
    grid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    const today = todayKey();
    const theme = themeFor(view.y, view.m);
    const charms = [...new Set([...theme.particles, ...theme.deco])];

    for (let i = 0; i < rows * 7; i++) {
      const d = i - first + 1;
      const cell = document.createElement('div');
      if (d < 1 || d > daysIn) {
        cell.className = 'day-cell blank';
        const deco = document.createElement('span');
        deco.className = 'blank-deco';
        deco.textContent = theme.deco[i % 2];
        cell.appendChild(deco);
      } else {
        const key = dayKey(view.y, view.m, d);
        cell.className = 'day-cell';
        cell.dataset.key = key;
        if (key === today) cell.classList.add('today');
        renderDay(cell, key, { charm: charms[d % charms.length] });
      }
      grid.appendChild(cell);
    }
  }

  function changeMonth(delta) {
    view.m += delta;
    if (view.m < 0) { view.m = 11; view.y--; }
    if (view.m > 11) { view.m = 0; view.y++; }
    const grid = $('grid');
    grid.classList.remove('slide-left', 'slide-right');
    void grid.offsetWidth;
    grid.classList.add(delta > 0 ? 'slide-left' : 'slide-right');
    renderMonth();
  }

  $('prevBtn').addEventListener('click', () => changeMonth(-1));
  $('nextBtn').addEventListener('click', () => changeMonth(1));
  $('todayBtn').addEventListener('click', () => {
    const t = new Date();
    const delta = (t.getFullYear() - view.y) * 12 + (t.getMonth() - view.m);
    if (delta !== 0) changeMonth(delta);
    const cell = document.querySelector('.day-cell.today');
    if (cell) {
      cell.classList.remove('wiggle');
      void cell.offsetWidth;
      cell.classList.add('wiggle');
    }
  });

  // Tap a day to open it; swipe the grid to change months.
  (() => {
    const grid = $('grid');
    let start = null;
    grid.addEventListener('pointerdown', (e) => {
      start = { x: e.clientX, y: e.clientY, t: Date.now() };
    });
    grid.addEventListener('pointerup', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const s = start;
      start = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        changeMonth(dx < 0 ? 1 : -1);
        return;
      }
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && Date.now() - s.t < 800) {
        const cell = e.target.closest('.day-cell[data-key]');
        if (cell) openDay(cell.dataset.key);
      }
    });
    grid.addEventListener('pointercancel', () => { start = null; });
  })();

  // ---------- Sheets ----------
  function openSheet(id) {
    const el = $(id);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('open'));
  }

  function closeSheet(id) {
    const el = $(id);
    el.classList.remove('open');
    setTimeout(() => { el.hidden = true; }, 220);
  }

  function confirmBox(message) {
    return new Promise((resolve) => {
      $('confirmText').textContent = message;
      $('confirmBackdrop').hidden = false;
      const done = (answer) => {
        $('confirmBackdrop').hidden = true;
        $('confirmYes').onclick = $('confirmNo').onclick = null;
        resolve(answer);
      };
      $('confirmYes').onclick = () => done(true);
      $('confirmNo').onclick = () => done(false);
    });
  }

  // ---------- Day editor ----------
  let editKey = null;
  let selected = -1;
  let activeTab = 0;
  let hadContentAtOpen = false;

  function currentDay() {
    if (!state.days[editKey]) state.days[editKey] = { text: '', stickers: [], color: null, textColor: null };
    const day = state.days[editKey];
    day.stickers = day.stickers || [];
    return day;
  }

  function openDay(key) {
    editKey = key;
    selected = -1;
    hadContentAtOpen = !!hasContent(state.days[key]);
    const { y, m, d } = parseDayKey(key);
    const date = new Date(y, m, d);
    const isToday = key === todayKey();
    $('dayTitle').textContent = `${isToday ? '⭐ Today! ' : ''}${WEEKDAY_NAMES[date.getDay()]}, ${MONTH_NAMES[m]} ${d}`;

    // Match the big preview to the shape of a calendar square so it looks the same.
    const cell = document.querySelector(`.day-cell[data-key="${key}"]`);
    const preview = $('preview');
    if (cell) {
      const r = cell.getBoundingClientRect();
      preview.style.aspectRatio = `${r.width} / ${r.height}`;
      preview.style.setProperty('--ar', (r.width / r.height).toFixed(3));
    }
    preview.classList.toggle('today', isToday);

    const day = state.days[key] || {};
    $('dayText').value = day.text || '';
    renderSwatches();
    renderTabs();
    renderTray();
    refreshPreview();
    openSheet('dayBackdrop');
  }

  function closeDay() {
    $('dayText').blur();
    const key = editKey;
    const day = state.days[key];
    if (day && !hasContent(day)) delete state.days[key];
    save();
    closeSheet('dayBackdrop');
    renderMonth();
    if (!hadContentAtOpen && hasContent(state.days[key])) celebrate(key);
    editKey = null;
  }

  function refreshPreview() {
    renderDay($('preview'), editKey, { selected });
    $('stickerTools').hidden = selected < 0;
    $('previewHint').hidden = selected >= 0;
  }

  function renderSwatches() {
    const day = state.days[editKey] || {};
    const textBox = $('textColors');
    textBox.innerHTML = '';
    TEXT_COLORS.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'swatch';
      b.style.background = c;
      b.setAttribute('aria-label', `Word color ${c}`);
      if ((day.textColor || TEXT_COLORS[0]) === c) b.classList.add('on');
      b.addEventListener('click', () => {
        currentDay().textColor = c;
        save();
        renderSwatches();
        refreshPreview();
      });
      textBox.appendChild(b);
    });

    const dayBox = $('dayColors');
    dayBox.innerHTML = '';
    DAY_COLORS.forEach((c) => {
      const b = document.createElement('button');
      b.className = 'swatch';
      if (c) b.style.background = c;
      else { b.classList.add('none'); b.textContent = '✕'; }
      b.setAttribute('aria-label', c ? `Day color ${c}` : 'No day color');
      if ((day.color || null) === c) b.classList.add('on');
      b.addEventListener('click', () => {
        currentDay().color = c;
        save();
        renderSwatches();
        refreshPreview();
      });
      dayBox.appendChild(b);
    });
  }

  function renderTabs() {
    const box = $('stickerTabs');
    box.innerHTML = '';
    STICKERS.forEach((cat, i) => {
      const b = document.createElement('button');
      b.className = 'tab' + (i === activeTab ? ' on' : '');
      b.textContent = cat.tab;
      b.setAttribute('aria-label', cat.name);
      b.addEventListener('click', () => {
        activeTab = i;
        renderTabs();
        renderTray();
      });
      box.appendChild(b);
    });
  }

  function renderTray() {
    const box = $('stickerTray');
    box.innerHTML = '';
    box.scrollTop = 0;
    STICKERS[activeTab].items.forEach((e) => {
      const b = document.createElement('button');
      b.className = 'tray-sticker';
      b.textContent = e;
      b.addEventListener('click', () => addSticker(e, b));
      box.appendChild(b);
    });
  }

  function addSticker(emoji, btn) {
    const day = currentDay();
    if (day.stickers.length >= MAX_STICKERS) {
      $('previewHint').hidden = false;
      $('previewHint').textContent = 'Wow, that day is full of stickers! 🎉';
      return;
    }
    day.stickers.push({
      e: emoji,
      x: 0.4 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.3,
      s: 1,
      r: Math.round((Math.random() - 0.5) * 20),
    });
    selected = day.stickers.length - 1;
    save();
    refreshPreview();
    const el = $('preview').querySelector(`.sticker[data-idx="${selected}"]`);
    if (el) el.classList.add('pop');
    if (btn) {
      btn.classList.remove('bounce');
      void btn.offsetWidth;
      btn.classList.add('bounce');
    }
    playPop(440 + Math.random() * 300);
  }

  $('dayText').addEventListener('input', (e) => {
    currentDay().text = e.target.value;
    save();
    refreshPreview();
  });
  $('dayText').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });

  $('dayDone').addEventListener('click', closeDay);
  $('dayBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDay();
  });

  $('clearDay').addEventListener('click', async () => {
    if (!hasContent(state.days[editKey])) return;
    if (await confirmBox('Clear everything on this day?')) {
      delete state.days[editKey];
      selected = -1;
      $('dayText').value = '';
      save();
      renderSwatches();
      refreshPreview();
    }
  });

  $('stickerTools').addEventListener('click', (e) => {
    const act = e.target.closest('button')?.dataset.act;
    if (!act || selected < 0) return;
    const day = currentDay();
    const s = day.stickers[selected];
    if (!s) return;
    if (act === 'bigger') s.s = clamp(s.s * 1.25, 0.4, 3);
    if (act === 'smaller') s.s = clamp(s.s / 1.25, 0.4, 3);
    if (act === 'rotate') s.r = (s.r + 30) % 360;
    if (act === 'front') {
      day.stickers.splice(selected, 1);
      day.stickers.push(s);
      selected = day.stickers.length - 1;
    }
    if (act === 'delete') {
      day.stickers.splice(selected, 1);
      selected = -1;
      playPop(300);
    }
    save();
    refreshPreview();
  });

  // Drag stickers with one finger; pinch or twist with two.
  (() => {
    const preview = $('preview');
    const pointers = new Map();
    let drag = null;
    let pinch = null;

    const stickerEl = () => preview.querySelector(`.sticker[data-idx="${selected}"]`);

    function startPinch() {
      const [a, b] = [...pointers.values()];
      const s = currentDay().stickers[selected];
      if (!s) return;
      pinch = {
        dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
        angle: Math.atan2(b.y - a.y, b.x - a.x),
        s0: s.s,
        r0: s.r,
      };
      drag = null;
    }

    preview.addEventListener('pointerdown', (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      preview.setPointerCapture(e.pointerId);
      if (pointers.size === 2 && selected >= 0) {
        startPinch();
        return;
      }
      if (pointers.size > 1) return;
      const target = e.target.closest('.sticker');
      if (target) {
        const idx = Number(target.dataset.idx);
        if (idx !== selected) {
          selected = idx;
          refreshPreview();
        }
        const s = currentDay().stickers[selected];
        const rect = preview.getBoundingClientRect();
        drag = {
          offX: e.clientX - (rect.left + s.x * rect.width),
          offY: e.clientY - (rect.top + s.y * rect.height),
          moved: false,
        };
      } else if (selected >= 0) {
        selected = -1;
        refreshPreview();
      }
    });

    preview.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const s = editKey && state.days[editKey]?.stickers?.[selected];
      if (!s) return;
      if (pinch && pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        s.s = clamp(pinch.s0 * (dist / pinch.dist), 0.4, 3);
        s.r = Math.round(pinch.r0 + ((angle - pinch.angle) * 180) / Math.PI);
      } else if (drag) {
        const rect = preview.getBoundingClientRect();
        s.x = clamp((e.clientX - drag.offX - rect.left) / rect.width, 0, 1);
        s.y = clamp((e.clientY - drag.offY - rect.top) / rect.height, 0, 1);
        drag.moved = true;
      } else {
        return;
      }
      const el = stickerEl();
      if (el) positionSticker(el, s);
    });

    function end(e) {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) {
        drag = null;
        save();
      }
    }
    preview.addEventListener('pointerup', end);
    preview.addEventListener('pointercancel', end);
  })();

  function celebrate(key) {
    const cell = document.querySelector(`.day-cell[data-key="${key}"]`);
    if (!cell || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = cell.getBoundingClientRect();
    const bits = ['✨', '⭐', '💖', '🎉', '🌟'];
    for (let i = 0; i < 12; i++) {
      const b = document.createElement('span');
      b.className = 'burst';
      b.textContent = bits[i % bits.length];
      const a = (i / 12) * Math.PI * 2;
      b.style.left = `${r.left + r.width / 2}px`;
      b.style.top = `${r.top + r.height / 2}px`;
      b.style.setProperty('--dx', `${Math.cos(a) * 90}px`);
      b.style.setProperty('--dy', `${Math.sin(a) * 90}px`);
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 900);
    }
    playPop(660);
  }

  // ---------- Theme picker ----------
  function renderThemeSheet() {
    const ms = monthSettings(view.y, view.m);
    const currentTheme = ms.theme || 'seasons';
    const currentFont = ms.font || 'rounded';
    $('themeMonth').textContent = MONTH_NAMES[view.m];

    const grid = $('themeGrid');
    grid.innerHTML = '';
    Object.entries(THEMES).forEach(([id, theme]) => {
      const shown = theme.auto ? THEMES[SEASON_BY_MONTH[view.m]] : theme;
      const b = document.createElement('button');
      b.className = 'theme-card' + (id === currentTheme ? ' on' : '');
      b.style.background = shown.bg;
      b.style.color = shown.ink;
      b.innerHTML = `<span class="theme-icon"></span><span class="theme-name"></span>`;
      b.querySelector('.theme-icon').textContent = theme.icon;
      b.querySelector('.theme-name').textContent = theme.auto ? `Seasons (${shown.name})` : theme.name;
      if (theme.auto) b.classList.add('wide');
      b.addEventListener('click', () => {
        const k = monthKey(view.y, view.m);
        const { frame, garland, ...rest } = state.months[k] || {};
        state.months[k] = rest;
        setMonthSetting('theme', id);
        playPop(500);
      });
      grid.appendChild(b);
    });

    const shownTheme = themeFor(view.y, view.m);
    const currentFrame = frameFor(view.y, view.m);
    const frames = $('frameGrid');
    frames.innerHTML = '';
    Object.entries(FRAMES).forEach(([id, frame]) => {
      const b = document.createElement('button');
      b.className = 'font-card deco-card' + (id === currentFrame ? ' on' : '');
      b.innerHTML = `<span class="frame-sample"><span></span></span><span class="font-name"></span>`;
      const sample = b.querySelector('.frame-sample');
      sample.style.background = frameCSS(id, shownTheme);
      if (id === 'none') sample.classList.add('plain');
      b.querySelector('.font-name').textContent = frame.name;
      b.addEventListener('click', () => setMonthSetting('frame', id));
      frames.appendChild(b);
    });

    const currentGarland = garlandFor(view.y, view.m);
    const garlands = $('garlandGrid');
    garlands.innerHTML = '';
    Object.entries(GARLANDS).forEach(([id, g]) => {
      const b = document.createElement('button');
      b.className = 'font-card' + (id === currentGarland ? ' on' : '');
      b.innerHTML = `<span class="font-sample"></span><span class="font-name"></span>`;
      b.querySelector('.font-sample').textContent = g.icon;
      b.querySelector('.font-name').textContent = g.name;
      b.addEventListener('click', () => setMonthSetting('garland', id));
      garlands.appendChild(b);
    });

    const fonts = $('fontGrid');
    fonts.innerHTML = '';
    Object.entries(FONTS).forEach(([id, font]) => {
      const b = document.createElement('button');
      b.className = 'font-card' + (id === currentFont ? ' on' : '');
      b.style.fontFamily = font.stack;
      b.innerHTML = `<span class="font-sample">Aa 123</span><span class="font-name"></span>`;
      b.querySelector('.font-name').textContent = font.name;
      b.addEventListener('click', () => setMonthSetting('font', id));
      fonts.appendChild(b);
    });

    const t = $('particlesToggle');
    t.innerHTML = state.settings.particles
      ? '<span class="font-sample">✨ On</span><span class="font-name">Tap to turn off</span>'
      : '<span class="font-sample">💤 Off</span><span class="font-name">Tap to turn on</span>';
    t.classList.toggle('on', state.settings.particles);
  }

  function setMonthSetting(field, value) {
    const k = monthKey(view.y, view.m);
    state.months[k] = { ...(state.months[k] || {}), [field]: value };
    save();
    renderMonth();
    renderThemeSheet();
  }

  $('themeBtn').addEventListener('click', () => {
    renderThemeSheet();
    openSheet('themeBackdrop');
  });
  $('themeDone').addEventListener('click', () => closeSheet('themeBackdrop'));
  $('themeBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSheet('themeBackdrop');
  });
  $('particlesToggle').addEventListener('click', () => {
    state.settings.particles = !state.settings.particles;
    save();
    applyTheme();
    renderThemeSheet();
  });

  // ---------- Grown-ups ----------
  function renderGrownup() {
    const b = $('soundsBtn');
    if (b) b.textContent = state.settings.sounds ? '🔊 Sounds on' : '🔇 Sounds off';
  }

  $('grownupBtn').addEventListener('click', () => {
    $('grownupStatus').textContent = '';
    renderGrownup();
    openSheet('grownupBackdrop');
  });
  $('grownupDone').addEventListener('click', () => closeSheet('grownupBackdrop'));
  $('grownupBackdrop').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSheet('grownupBackdrop');
  });

  // Sounds toggle lives with the grown-up settings.
  (() => {
    const b = document.createElement('button');
    b.className = 'pill-btn';
    b.id = 'soundsBtn';
    b.addEventListener('click', () => {
      state.settings.sounds = !state.settings.sounds;
      save();
      renderGrownup();
    });
    document.querySelector('.grownup-actions').appendChild(b);
  })();

  $('exportBtn').addEventListener('click', async () => {
    const stamp = todayKey();
    const name = `calendar-backup-${stamp}.json`;
    const json = JSON.stringify(state, null, 2);
    const file = new File([json], name, { type: 'application/json' });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: name });
        $('grownupStatus').textContent = 'Backup ready ✓';
        return;
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    $('grownupStatus').textContent = 'Backup saved ✓';
  });

  $('importBtn').addEventListener('click', () => $('importFile').click());
  $('importFile').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data || typeof data.days !== 'object') throw new Error('Not a calendar backup');
      if (!(await confirmBox('Replace everything in the calendar with this backup?'))) return;
      state = normalize(data);
      save();
      renderMonth();
      $('grownupStatus').textContent = 'Backup loaded ✓';
    } catch (err) {
      $('grownupStatus').textContent = 'That file did not look like a calendar backup.';
    }
  });

  // ---------- Start ----------
  document.title = APP_NAME;
  renderWeekdays();
  renderMonth();

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderGarland, 150);
  });

  // Keep "today" right if the iPad is left open overnight.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !editKey) renderMonth();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
