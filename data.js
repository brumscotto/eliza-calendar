// Themes, letter styles, colors and stickers.
// Add a theme by copying one of the entries below and changing the values.

const APP_NAME = "Eliza's Calendar";

const THEMES = {
  seasons: {
    name: 'Seasons', icon: '🌷☀️🍂❄️', auto: true,
  },
  spring: {
    name: 'Spring', icon: '🌷',
    bg: 'linear-gradient(160deg,#e9fcd9 0%,#fde3f2 100%)',
    ink: '#3f7d2c', weekday: '#d24f93',
    cell: 'rgba(255,255,255,.88)', border: '#f7b6d2', today: '#ff5fae',
    accent: '#ff8cc6', accentInk: '#fff',
    deco: ['🌷', '🐣'], particles: ['🌸', '🌸', '💮', '🦋'], motion: 'fall',
    colors: ['#ffb3d1', '#b8e986', '#fff3a0', '#c9b6ff', '#ff8cc6'], frame: 'emoji', garland: 'flags',
  },
  summer: {
    name: 'Summer', icon: '☀️',
    bg: 'linear-gradient(180deg,#b8efff 0%,#fff4b0 100%)',
    ink: '#0b6c8f', weekday: '#ff8a00',
    cell: 'rgba(255,255,255,.88)', border: '#ffd166', today: '#ff8a00',
    accent: '#ff9f1c', accentInk: '#fff',
    deco: ['☀️', '🏖️'], particles: ['🫧', '🫧', '☀️', '🐚'], motion: 'rise',
    colors: ['#ffd166', '#4cc9f0', '#ff8fab', '#80ed99', '#ff9f1c'], frame: 'stripes', garland: 'flags',
  },
  fall: {
    name: 'Fall', icon: '🍂',
    bg: 'linear-gradient(170deg,#fff1d6 0%,#ffcf9f 100%)',
    ink: '#8a3b12', weekday: '#c4561e',
    cell: 'rgba(255,255,255,.88)', border: '#f4a259', today: '#e76f51',
    accent: '#e76f51', accentInk: '#fff',
    deco: ['🍂', '🍎'], particles: ['🍁', '🍂', '🍃', '🍂'], motion: 'fall',
    colors: ['#f4a259', '#e76f51', '#f6d365', '#8ab17d', '#bc6c25'], frame: 'emoji', garland: 'flags',
  },
  winter: {
    name: 'Winter', icon: '❄️',
    bg: 'linear-gradient(180deg,#dcefff 0%,#f4efff 100%)',
    ink: '#2b4c8c', weekday: '#5b8def',
    cell: 'rgba(255,255,255,.9)', border: '#a9cdf5', today: '#3d74e6',
    accent: '#5b8def', accentInk: '#fff',
    deco: ['⛄', '❄️'], particles: ['❄️', '❄️', '❄️', '✨'], motion: 'fall',
    colors: ['#a9cdf5', '#ffffff', '#c8b6ff', '#5b8def', '#e0f2ff'], frame: 'emoji', garland: 'lights',
  },
  rainbow: {
    name: 'Rainbow', icon: '🌈',
    bg: 'linear-gradient(135deg,#ffd1dc,#ffe5b4,#fff7b0,#d4f8c4,#c9e7ff,#e3d1ff)',
    ink: '#7b2cbf', weekday: '#e63985',
    cell: 'rgba(255,255,255,.88)', border: '#c9a7ff', today: '#ff4fa3',
    accent: '#9b5de5', accentInk: '#fff',
    deco: ['🌈', '☁️'], particles: ['🌈', '☁️', '✨'], motion: 'drift',
    colors: ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'], frame: 'rainbow', garland: 'flags',
  },
  unicorn: {
    name: 'Unicorn', icon: '🦄',
    bg: 'linear-gradient(160deg,#fbe0ff 0%,#dbe4ff 55%,#dffff5 100%)',
    ink: '#a1338f', weekday: '#7c5ce0',
    cell: 'rgba(255,255,255,.88)', border: '#f0b3ff', today: '#d63fbf',
    accent: '#c86ce0', accentInk: '#fff',
    deco: ['🦄', '✨'], particles: ['✨', '💖', '⭐', '🦄'], motion: 'drift',
    colors: ['#f9a8d4', '#c4b5fd', '#a5f3fc', '#fde68a', '#f0abfc'], frame: 'dots', garland: 'flags',
  },
  ocean: {
    name: 'Ocean', icon: '🐠',
    bg: 'linear-gradient(180deg,#9fe3ff 0%,#2f8fcf 100%)',
    ink: '#ffffff', weekday: '#08577f',
    cell: 'rgba(255,255,255,.9)', border: '#7fd0f5', today: '#ff7a59',
    accent: '#ff7a59', accentInk: '#fff',
    deco: ['🐳', '🐠'], particles: ['🫧', '🫧', '🐟', '🫧'], motion: 'rise',
    colors: ['#ffffff', '#ff7a59', '#ffd166', '#4cc9f0', '#90e0ef'], frame: 'emoji', garland: 'flags',
  },
  space: {
    name: 'Space', icon: '🚀',
    bg: 'radial-gradient(circle at 30% 15%,#46338f 0%,#1a0f45 55%,#0b0626 100%)',
    ink: '#ffe66d', weekday: '#c9b8ff',
    cell: 'rgba(255,255,255,.93)', border: '#8a74ff', today: '#ffb703',
    accent: '#8a74ff', accentInk: '#fff',
    deco: ['🚀', '🪐'], particles: ['⭐', '✨', '🌟', '✨'], motion: 'twinkle',
    colors: ['#ffe66d', '#8a74ff', '#ff8fab', '#4cc9f0', '#ffffff'], frame: 'emoji', garland: 'lights',
  },
  dino: {
    name: 'Dinosaurs', icon: '🦕',
    bg: 'linear-gradient(170deg,#eaf8cf 0%,#b5df87 100%)',
    ink: '#2f6b1f', weekday: '#5c8d1a',
    cell: 'rgba(255,255,255,.88)', border: '#9ccc65', today: '#f28c28',
    accent: '#6aa84f', accentInk: '#fff',
    deco: ['🦖', '🦕'], particles: ['🌿', '🦴', '🌋', '🌿'], motion: 'drift',
    colors: ['#9ccc65', '#f28c28', '#ffd54f', '#6aa84f', '#8d6e63'], frame: 'dots', garland: 'flags',
  },
  candy: {
    name: 'Candy', icon: '🍭',
    bg: 'linear-gradient(160deg,#ffe0f0 0%,#ddf6ff 100%)',
    ink: '#e0457b', weekday: '#2ba7c9',
    cell: 'rgba(255,255,255,.9)', border: '#ffb3d1', today: '#e0457b',
    accent: '#ff6fa5', accentInk: '#fff',
    deco: ['🍭', '🧁'], particles: ['🍬', '🍭', '🧁', '🍩'], motion: 'fall',
    colors: ['#ff6fa5', '#7ee0f2', '#fff07a', '#c3a6ff', '#ffffff'], frame: 'stripes', garland: 'flags',
  },
  pets: {
    name: 'Pets', icon: '🐱',
    bg: 'linear-gradient(170deg,#fff4e6 0%,#ffe0d0 100%)',
    ink: '#8b5a3c', weekday: '#d77a4f',
    cell: 'rgba(255,255,255,.9)', border: '#f2c09f', today: '#ef6f4c',
    accent: '#ef8a5f', accentInk: '#fff',
    deco: ['🐶', '🐱'], particles: ['🐾', '🐾', '🦴', '🐟'], motion: 'drift',
    colors: ['#ef8a5f', '#f2c09f', '#ffd6a5', '#a3d9ff', '#8b5a3c'], frame: 'checks', garland: 'flags',
  },
  hearts: {
    name: 'Hearts', icon: '💖',
    bg: 'linear-gradient(170deg,#ffe3ec 0%,#ffc2d6 100%)',
    ink: '#c2185b', weekday: '#e04a7f',
    cell: 'rgba(255,255,255,.9)', border: '#ff9dbd', today: '#e5004f',
    accent: '#ff4f8b', accentInk: '#fff',
    deco: ['💖', '💌'], particles: ['💖', '💕', '❤️', '💗'], motion: 'rise',
    colors: ['#ff4f8b', '#ffc2d6', '#ffffff', '#e5004f', '#ff9dbd'], frame: 'dots', garland: 'lights',
  },
  spooky: {
    name: 'Spooky', icon: '🎃',
    bg: 'linear-gradient(180deg,#3a1f5d 0%,#6b2f6e 55%,#f08a3c 100%)',
    ink: '#ffb347', weekday: '#e6d2ff',
    cell: 'rgba(255,255,255,.92)', border: '#b07ad9', today: '#ff7b00',
    accent: '#ff7b00', accentInk: '#fff',
    deco: ['🎃', '👻'], particles: ['👻', '🦇', '🍬', '🦇'], motion: 'drift',
    colors: ['#ff7b00', '#b07ad9', '#7bd389', '#ffb347', '#3a1f5d'], frame: 'emoji', garland: 'lights',
  },
};

// The "Seasons" theme picks one of these by month (0 = January).
const SEASON_BY_MONTH = [
  'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
  'summer', 'summer', 'fall', 'fall', 'fall', 'winter',
];

// Borders around the calendar and decorations across the top.
const FRAMES = {
  emoji:   { name: 'Stickers' },
  dots:    { name: 'Polka dots' },
  stripes: { name: 'Stripes' },
  checks:  { name: 'Checks' },
  rainbow: { name: 'Rainbow' },
  none:    { name: 'Plain' },
};

const GARLANDS = {
  flags:  { name: 'Flags', icon: '🚩' },
  lights: { name: 'Lights', icon: '💡' },
  none:   { name: 'None', icon: '➖' },
};

// Fonts that ship with iPadOS, so the app needs no internet.
const FONTS = {
  rounded:  { name: 'Bubbly',      stack: 'ui-rounded, "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif' },
  chalk:    { name: 'Chalk',       stack: '"Chalkboard SE", "Chalkboard", "Comic Sans MS", cursive' },
  marker:   { name: 'Marker',      stack: '"Marker Felt", "Comic Sans MS", cursive' },
  notebook: { name: 'Notebook',    stack: '"Noteworthy", "Bradley Hand", cursive' },
  hand:     { name: 'Handwriting', stack: '"Bradley Hand", "Segoe Print", cursive' },
  fancy:    { name: 'Fancy',       stack: '"Snell Roundhand", "Brush Script MT", cursive' },
  type:     { name: 'Typewriter',  stack: '"American Typewriter", "Courier New", monospace' },
};

const TEXT_COLORS = ['#333333', '#e63946', '#f77f00', '#e9b400', '#2a9d4f', '#1d6fe0', '#7b2cbf', '#ff4fa3', '#8d5524'];
const DAY_COLORS = [null, '#ffd6e7', '#ffe5b4', '#fff6a5', '#d4f8c4', '#c9e7ff', '#e3d1ff', '#f1f1f1'];

const STICKERS = [
  { tab: '😀', name: 'Faces', items: '😀 😃 😄 😁 😆 😂 😊 😍 🥰 😘 😋 😜 🤪 😎 🤩 🥳 😇 🙃 😴 🤗 🤭 😮 😲 🥺 😢 😭 😡 🤒 🤧 🤠 😺 😻 👻 🤖 👽 💩' },
  { tab: '🐶', name: 'Animals', items: '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🦆 🦉 🦄 🐴 🐝 🦋 🐞 🐌 🐢 🐍 🦖 🦕 🐙 🦀 🐠 🐬 🐳 🦈 🦩 🦔 🐿️ 🐾' },
  { tab: '🌸', name: 'Nature', items: '🌸 🌷 🌹 🌺 🌻 🌼 💐 🌈 ☀️ 🌤️ ⛅ ☁️ 🌧️ ⛈️ ❄️ ☃️ ⛄ 🌙 ⭐ 🌟 ✨ ⚡ 🔥 💧 🌊 🍀 🍁 🍂 🍃 🌲 🌳 🌴 🌵 🍄 🪺 🌍 🪐' },
  { tab: '🍕', name: 'Food', items: '🍎 🍓 🍒 🍉 🍌 🍇 🍑 🍍 🥝 🥕 🌽 🥦 🥨 🧀 🍕 🍔 🌭 🍟 🌮 🍝 🍣 🥞 🧇 🥚 🍩 🍪 🎂 🧁 🍰 🍦 🍨 🍭 🍬 🍫 🍿 🧃 🥛 ☕' },
  { tab: '🎉', name: 'Party', items: '🎉 🎊 🎈 🎁 🎂 🎀 🪅 🥳 🎆 🎇 🎃 🎄 🕎 🐣 🐰 💝 👑 💎 🏆 🥇 🎟️ 🪩 🎵 🎶' },
  { tab: '⚽', name: 'Play', items: '⚽ 🏀 🏈 ⚾ 🎾 🏐 🏓 ⛸️ 🛼 🛹 🚲 🛴 🏊‍♀️ 🤸‍♀️ 🩰 💃 🎨 🖍️ ✏️ 📚 📖 🎹 🎸 🥁 🎤 🎬 🧩 🪁 🎮 🧸 🪀 🏕️ ⛺ 🏖️ 🛝' },
  { tab: '🚗', name: 'Places', items: '🏠 🏡 🏫 🏥 🏰 🎡 🎢 🎠 🎪 🏟️ 🗽 ⛰️ 🏔️ 🏝️ 🚗 🚌 🚕 🚓 🚑 🚒 🚜 🚂 ✈️ 🚀 🚁 ⛵ 🛳️ 🗺️ 🧳' },
  { tab: '💖', name: 'Love', items: '❤️ 🧡 💛 💚 💙 💜 🩷 🤍 🤎 🖤 💖 💗 💓 💕 💞 💘 💝 💌 💯 ⭐ 🌟 💫 ✨ 🌈 🫶 👍 👏 🙌 ✌️ 🤞 ✅ ❗ ❓' },
  { tab: '👧', name: 'People', items: '👧 👦 👩 👨 👵 👴 👶 🧒 👸 🤴 🧚‍♀️ 🧜‍♀️ 🦸‍♀️ 🧙‍♀️ 🧝‍♀️ 👩‍🚀 👩‍🍳 👩‍🏫 👩‍⚕️ 👩‍🎨 👨‍👩‍👧 👨‍👩‍👧‍👦 👭 👫 🤝 🤗' },
].map(cat => ({ ...cat, items: cat.items.split(' ') }));

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
