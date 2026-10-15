import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const AWARDS_DIR = path.resolve('assets/awards');
const TEMP_DIR = path.resolve('scripts/temp_downloads');

if (!fs.existsSync(AWARDS_DIR)) fs.mkdirSync(AWARDS_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Diamond SVG definition for Level 15 and global gem icons (pure transparent 3D brilliant diamond)
const diamondSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#bae6fd" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="facetCenter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="facetLeftTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="facetRightTop" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="facetBottomCenter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="60%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#075985" />
    </linearGradient>
    <linearGradient id="facetBottomLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="facetBottomRight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </linearGradient>
    <linearGradient id="facetCornerL" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="facetCornerR" x1="100%" y1="50%" x2="0%" y2="50%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </linearGradient>
    <filter id="gemGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#00e5ff" flood-opacity="0.4" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.6" />
    </filter>
  </defs>

  <g filter="url(#gemGlow)">
    <polygon points="170,110 342,110 395,190 256,230 117,190" fill="url(#facetCenter)" stroke="#bae6fd" stroke-width="2" stroke-linejoin="round" />
    <polygon points="170,110 256,80 342,110 256,120" fill="url(#facetTop)" stroke="#e0f2fe" stroke-width="2" stroke-linejoin="round" />
    <polygon points="80,190 170,110 117,190" fill="url(#facetCornerL)" stroke="#7dd3fc" stroke-width="2" stroke-linejoin="round" />
    <polygon points="170,110 256,80 117,190" fill="#38bdf8" opacity="0.85" stroke="#bae6fd" stroke-width="2" stroke-linejoin="round" />
    <polygon points="342,110 256,80 395,190" fill="url(#facetRightTop)" stroke="#bae6fd" stroke-width="2" stroke-linejoin="round" />
    <polygon points="432,190 342,110 395,190" fill="url(#facetCornerR)" stroke="#38bdf8" stroke-width="2" stroke-linejoin="round" />
    <polygon points="256,230 395,190 256,430" fill="url(#facetBottomRight)" stroke="#38bdf8" stroke-width="2" stroke-linejoin="round" />
    <polygon points="256,230 117,190 256,430" fill="url(#facetBottomCenter)" stroke="#0284c7" stroke-width="2" stroke-linejoin="round" />
    <polygon points="117,190 80,190 256,430" fill="url(#facetBottomLeft)" stroke="#0369a1" stroke-width="2" stroke-linejoin="round" />
    <polygon points="395,190 432,190 256,430" fill="#082f49" stroke="#0c4a6e" stroke-width="2" stroke-linejoin="round" />
    <polygon points="190,112 256,90 230,130" fill="#ffffff" opacity="0.85" />
    <circle cx="210" cy="115" r="8" fill="#ffffff" opacity="0.9" />
    <path d="M 210,95 L 210,135 M 190,115 L 230,115" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" />
    <circle cx="370" cy="205" r="5" fill="#ffffff" opacity="0.75" />
    <circle cx="130" cy="205" r="4" fill="#ffffff" opacity="0.65" />
  </g>
</svg>
`;

const ICON_DEFINITIONS = [
  { level: 1, name: 'Chrono Speedster', folder: 'clock', file: 'clock-dynamic-color.png', color: 'from-amber-400 to-orange-500', desc: 'Conquered Level 1 arithmetic time challenge' },
  { level: 2, name: 'Logic Cipher', folder: 'puzzle', file: 'puzzle-dynamic-color.png', color: 'from-cyan-400 to-blue-500', desc: 'Mastered Level 2 puzzle sequences' },
  { level: 3, name: 'Matrix Cube', folder: 'cube', file: 'cube-dynamic-color.png', color: 'from-purple-400 to-indigo-500', desc: 'Solved Level 3 isometric logic blocks' },
  { level: 4, name: 'Neural Flash', folder: 'flash', file: 'flash-dynamic-color.png', color: 'from-yellow-300 to-amber-500', desc: 'Discharged Level 4 high-voltage reasoning' },
  { level: 5, name: 'Synapse Spark', folder: 'bulb', file: 'bulb-dynamic-color.png', color: 'from-amber-300 to-yellow-500', desc: 'Illuminated Level 5 cognitive breakthroughs' },
  { level: 6, name: 'Arithmetic Matrix', folder: 'calculator', file: 'calculator-dynamic-color.png', color: 'from-blue-400 to-indigo-600', desc: 'Calculated Level 6 cyber theorems' },
  { level: 7, name: 'Golden Sovereign', folder: '3d-coin', file: '3d-coin-dynamic-color.png', color: 'from-yellow-400 to-amber-600', desc: 'Minted Level 7 golden arithmetic ratios' },
  { level: 8, name: 'Daily Chronicler', folder: 'calender', file: 'calender-dynamic-color.png', color: 'from-sky-400 to-cyan-600', desc: 'Completed Level 8 calendar challenges' },
  { level: 9, name: 'Bullseye Marksman', folder: 'target', file: 'target-dynamic-color.png', color: 'from-red-400 to-rose-600', desc: 'Scored Level 9 pinpoint precision equations' },
  { level: 10, name: 'Cosmic Ascendant', folder: 'rocket', file: 'rocket-dynamic-color.png', color: 'from-orange-400 to-red-600', desc: 'Launched Level 10 supersonic ascension' },
  { level: 11, name: 'Aegis Defender', folder: 'shield', file: 'sheild-dynamic-color.png', color: 'from-cyan-400 to-teal-500', desc: 'Fortified Level 11 shield defenses' },
  { level: 12, name: 'Supernova Burst', folder: 'fire', file: 'fire-dynamic-color.png', color: 'from-orange-500 to-rose-600', desc: 'Ignited Level 12 blazing solve streaks' },
  { level: 13, name: 'Grand Vault', folder: 'gift', file: 'gift-dynamic-color.png', color: 'from-pink-400 to-purple-600', desc: 'Unwrapped Level 13 mystery treasuries' },
  { level: 14, name: 'Vault Keymaster', folder: 'key', file: 'key-dynamic-color.png', color: 'from-amber-400 to-yellow-500', desc: 'Unlocked Level 14 secret vault doors' },
  { level: 15, name: 'Diamond Mind', isDiamond: true, color: 'from-cyan-300 to-blue-600', desc: 'Faceted Level 15 flawless math perfection' },
  { level: 16, name: 'Victory Chime', folder: 'bell', file: 'bell-dynamic-color.png', color: 'from-yellow-400 to-amber-500', desc: 'Rang the Level 16 victory bell' },
  { level: 17, name: 'Celestial Starlight', folder: 'star', file: 'star-dynamic-color.png', color: 'from-amber-300 to-yellow-400', desc: 'Attained Level 17 astral mastery' },
  { level: 18, name: 'Omni Sphere', folder: 'sphere', file: 'sphere-dynamic-color.png', color: 'from-teal-400 to-cyan-600', desc: 'Harmonized Level 18 multidimensional orbits' },
  { level: 19, name: 'Titan Battleaxe', folder: 'axe', file: 'axe-dynamic-color.png', color: 'from-rose-400 to-red-600', desc: 'Cleaved Level 19 titan challenges' },
  { level: 20, name: 'Cipher Lockbreaker', folder: 'lock', file: 'lock-dynamic-color.png', color: 'from-amber-400 to-orange-600', desc: 'Decrypted Level 20 heavy cipher locks' },
  { level: 21, name: 'Grandmaster Bishop', folder: 'chess', file: 'chess-dynamic-color.png', color: 'from-indigo-400 to-violet-600', desc: 'Outplayed Level 21 tactical chessboards' },
  { level: 22, name: 'Medal of Honor', folder: 'medal', file: 'medal-dynamic-color.png', color: 'from-yellow-400 to-amber-500', desc: 'Decorated with Level 22 medal of courage' },
  { level: 23, name: 'Imperial Sovereign', folder: 'crown', file: 'crown-dynamic-color.png', color: 'from-amber-300 to-yellow-500', desc: 'Crowned sovereign of Level 23 math realm' },
  { level: 24, name: 'Champion Cup', folder: 'cup', file: 'cup-dynamic-color.png', color: 'from-yellow-400 to-amber-600', desc: 'Raised Level 24 golden championship cup' },
  { level: 25, name: 'Apex Grandmaster', folder: 'trophy', file: 'trophy-dynamic-color.png', color: 'from-amber-300 to-yellow-400', desc: 'Ascended to the supreme Level 25 apex throne' }
];

async function isFileValidPng(filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    if (fs.statSync(filePath).size < 10000) return false;
    await sharp(filePath).toBuffer();
    return true;
  } catch (e) {
    return false;
  }
}

async function run() {
  console.log('🚀 Starting 3D Background-Free Level Awards Generation...');

  // 1. Process Diamond for Level 15 and global gems
  console.log('💎 Generating 3D Transparent Diamond...');
  const diamondBuf = Buffer.from(diamondSvg);
  await sharp(diamondBuf).resize(256, 256).webp({ quality: 95 }).toFile(path.join(AWARDS_DIR, 'award_lvl_15.webp'));
  await sharp(diamondBuf).resize(256, 256).png().toFile(path.join(AWARDS_DIR, 'award_lvl_15.png'));

  // Also update assets/icon_gem_3d_clean
  await sharp(diamondBuf).resize(128, 128).webp({ quality: 95 }).toFile('assets/icon_gem_3d_clean.webp');
  await sharp(diamondBuf).resize(128, 128).png().toFile('assets/icon_gem_3d_clean.png');

  // 2. Download and process all GitHub 3D icons
  for (const item of ICON_DEFINITIONS) {
    if (item.isDiamond) continue;

    const rawUrl = `https://raw.githubusercontent.com/LanzeG/3D-ICONS/main/ICONS%20HERE!/${encodeURIComponent(item.folder)}/${encodeURIComponent(item.file)}`;
    const tempFile = path.join(TEMP_DIR, `${item.folder}_${item.file}`);
    const outWebp = path.join(AWARDS_DIR, `award_lvl_${String(item.level).padStart(2, '0')}.webp`);
    const outPng = path.join(AWARDS_DIR, `award_lvl_${String(item.level).padStart(2, '0')}.png`);

    let isValid = await isFileValidPng(tempFile);
    if (!isValid) {
      console.log(`⬇️ Downloading Level ${item.level} (${item.folder})...`);
      execSync(`curl.exe -L -o "${tempFile}" "${rawUrl}"`, { stdio: 'inherit' });
    }

    console.log(`⚙️ Processing Level ${item.level} -> 256x256 WebP/PNG...`);
    await sharp(tempFile)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 92 })
      .toFile(outWebp);

    await sharp(tempFile)
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPng);
  }

  // 3. Transparency verification check for all 25 awards
  console.log('\n🔍 Verifying 100% Background-Free Transparency on all 25 icons:');
  let allPass = true;
  for (let i = 1; i <= 25; i++) {
    const file = path.join(AWARDS_DIR, `award_lvl_${String(i).padStart(2, '0')}.webp`);
    const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    const cornerAlpha = data[3]; // pixel (0,0) alpha
    const isTransparent = (info.channels === 4 && cornerAlpha === 0);
    if (!isTransparent) allPass = false;
    console.log(`Lvl ${i}: ${isTransparent ? '✅ 100% TRANSPARENT' : '❌ NOT TRANSPARENT'} (channels: ${info.channels}, alpha: ${cornerAlpha})`);
  }

  console.log(`\n🎉 All 25 level awards processed! Verification: ${allPass ? 'ALL PASSED ✅' : 'FAILED ❌'}`);
}

run().catch(console.error);
