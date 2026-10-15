const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function floodFillTransparent(inputBuffer, threshold = 45) {
  const { data, info } = await sharp(inputBuffer).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const visited = new Uint8Array(w * h);
  const out = Buffer.from(data);

  const bgR = data[0], bgG = data[1], bgB = data[2];

  function isBg(x, y) {
    const idx = (y * w + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
    const isLight = (r > 195 && g > 200 && b > 210);
    return dist < threshold || isLight;
  }

  const queue = [];
  for (let x = 0; x < w; x++) { queue.push([x, 0], [x, h - 1]); }
  for (let y = 0; y < h; y++) { queue.push([0, y], [w - 1, y]); }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    const pos = y * w + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    if (isBg(x, y)) {
      out[pos * 4 + 3] = 0;
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } });
}

async function main() {
  console.log('--- Processing Icons to Transparent ---');

  // 1. Process Level 1: Centered Stopwatch from bottom_card_2_full.png
  console.log('Processing icon_quick_play (centered stopwatch)...');
  const stopwatchCrop = await sharp('assets/bottom_card_2_full.png')
    .extract({ left: 32, top: 43, width: 40, height: 42 })
    .png()
    .toBuffer();
  
  const stopwatchTrans = await floodFillTransparent(stopwatchCrop, 50);
  const stopwatchTransBuf = await stopwatchTrans.png().toBuffer();

  const centeredStopwatch = await sharp({
    create: {
      width: 58,
      height: 58,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: stopwatchTransBuf, left: 9, top: 8 }])
  .png()
  .toBuffer();

  fs.writeFileSync('assets/icon_quick_play.png', centeredStopwatch);
  await sharp(centeredStopwatch).webp({ quality: 90, lossless: true }).toFile('assets/icon_quick_play.webp');
  console.log('icon_quick_play updated!');

  // 2. Process icon_card_puzzle (Level 2)
  console.log('Processing icon_card_puzzle...');
  const puzzleBuf = fs.readFileSync('assets/icon_card_puzzle.png');
  const puzzleTrans = await floodFillTransparent(puzzleBuf, 48);
  const puzzleTransPng = await puzzleTrans.png().toBuffer();
  fs.writeFileSync('assets/icon_card_puzzle.png', puzzleTransPng);
  await sharp(puzzleTransPng).webp({ quality: 90, lossless: true }).toFile('assets/icon_card_puzzle.webp');
  console.log('icon_card_puzzle updated!');

  // 3. Process icon_brain_3d (Level 4)
  console.log('Processing icon_brain_3d...');
  const brainBuf = fs.readFileSync('assets/icon_brain_3d.png');
  const brainTrans = await floodFillTransparent(brainBuf, 55);
  const brainTransPng = await brainTrans.png().toBuffer();
  fs.writeFileSync('assets/icon_brain_3d.png', brainTransPng);
  await sharp(brainTransPng).webp({ quality: 90, lossless: true }).toFile('assets/icon_brain_3d.webp');
  console.log('icon_brain_3d updated!');

  // 4. Process icon_card_infinity (Level 3)
  console.log('Processing icon_card_infinity...');
  const infinityBuf = fs.readFileSync('assets/icon_card_infinity.png');
  const infinityTrans = await floodFillTransparent(infinityBuf, 40);
  const infinityTransPng = await infinityTrans.png().toBuffer();
  fs.writeFileSync('assets/icon_card_infinity.png', infinityTransPng);
  await sharp(infinityTransPng).webp({ quality: 90, lossless: true }).toFile('assets/icon_card_infinity.webp');
  console.log('icon_card_infinity updated!');

  // 5. Process other white-background icons: stopwatch_3d, brain_boost, gift_3d, daily_rewards, share_3d, trophy_podium
  const otherFiles = [
    { name: 'icon_stopwatch_3d', th: 50 },
    { name: 'icon_brain_boost', th: 50 },
    { name: 'icon_gift_3d', th: 45 },
    { name: 'icon_daily_rewards', th: 45 },
    { name: 'icon_share_3d', th: 45 },
    { name: 'icon_trophy_podium', th: 45 },
  ];

  for (const item of otherFiles) {
    const p = `assets/${item.name}.png`;
    if (fs.existsSync(p)) {
      console.log(`Processing ${item.name}...`);
      const buf = fs.readFileSync(p);
      const trans = await floodFillTransparent(buf, item.th);
      const transPng = await trans.png().toBuffer();
      fs.writeFileSync(p, transPng);
      await sharp(transPng).webp({ quality: 90, lossless: true }).toFile(`assets/${item.name}.webp`);
      console.log(`${item.name} updated!`);
    }
  }

  console.log('--- All target icons successfully processed to transparent! ---');
}

main().catch(console.error);

