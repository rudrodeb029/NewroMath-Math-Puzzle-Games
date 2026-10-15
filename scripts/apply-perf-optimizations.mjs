import fs from 'fs';

const filePath = 'src/legacyApp.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Split around FastGameStorage definition so we don't modify FastGameStorage itself
const storageClassMarker = 'class FastGameStorage {';
const storageClassEndMarker = 'const GameStorage = new FastGameStorage();';

const parts = content.split(storageClassEndMarker);
if (parts.length !== 2) {
  console.error('Marker not found!');
  process.exit(1);
}

const beforeStorage = parts[0] + storageClassEndMarker;
let afterStorage = parts[1];

// 1. Replace localStorage with GameStorage in the application code
afterStorage = afterStorage.replace(/localStorage\.getItem\(/g, 'GameStorage.getItem(');
afterStorage = afterStorage.replace(/localStorage\.setItem\(/g, 'GameStorage.setItem(');
afterStorage = afterStorage.replace(/localStorage\.removeItem\(/g, 'GameStorage.removeItem(');
afterStorage = afterStorage.replace(/localStorage\.clear\(/g, 'GameStorage.clear(');

// 2. Replace PNG asset references with WebP assets
const pngReplacements = [
  ['/assets/hero_scifi_clean.png', '/assets/hero_scifi_clean.webp'],
  ['/assets/card_daily_clean.png', '/assets/card_daily_clean.webp'],
  ['/assets/card_level_clean.png', '/assets/card_level_clean.webp'],
  ['/assets/card_rewards_scifi.png', '/assets/card_rewards_scifi.webp'],
  ['/assets/card_continue_clean.png', '/assets/card_continue_clean.webp'],
  ['/assets/card_newgame_clean.png', '/assets/card_newgame_clean.webp'],
  ['/assets/icon_robot_3d.png', '/assets/icon_robot_3d.webp'],
  ['/assets/icon_trophy_3d.png', '/assets/icon_trophy_3d.webp'],
  ['/assets/icon_chest_3d.png', '/assets/icon_chest_3d.webp'],
  ['/assets/icon_gamepad_3d.png', '/assets/icon_gamepad_3d.webp'],
  ['/assets/icon_target_3d.png', '/assets/icon_target_3d.webp'],
  ['/assets/icon_gold_coin_3d_clean.png', '/assets/icon_gold_coin_3d_clean.webp'],
  ['/assets/icon_gem_3d_clean.png', '/assets/icon_gem_3d_clean.webp'],
  ['/assets/icon_star_3d.png', '/assets/icon_star_3d.webp'],
  ['/assets/icon_stopwatch_3d.png', '/assets/icon_stopwatch_3d.webp'],
  ['/assets/reward_gift_dial_full.png', '/assets/reward_gift_dial_full.webp'],
  ['/assets/levels/level_art_${artIdx}.png', '/assets/levels/level_art_${artIdx}.webp']
];

for (const [from, to] of pngReplacements) {
  afterStorage = afterStorage.split(from).join(to);
}

const newContent = beforeStorage + afterStorage;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully applied GameStorage and WebP optimizations to src/legacyApp.jsx!');

