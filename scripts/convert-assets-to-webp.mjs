import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|PNG|jpg|jpeg|JPG)$/i.test(entry.name) && !entry.name.endsWith('.webp')) {
      const ext = path.extname(entry.name);
      const baseName = entry.name.slice(0, -ext.length);
      const webpPath = path.join(dirPath, `${baseName}.webp`);

      try {
        const inputStats = fs.statSync(fullPath);
        // Convert to WebP with smart quality settings
        await sharp(fullPath)
          .webp({ quality: 82, effort: 5 })
          .toFile(webpPath);

        const outputStats = fs.statSync(webpPath);
        const savedPercent = Math.round((1 - outputStats.size / inputStats.size) * 100);
        console.log(`[WebP] ${fullPath} (${Math.round(inputStats.size / 1024)}KB) -> ${webpPath} (${Math.round(outputStats.size / 1024)}KB) [${savedPercent}% saved]`);
      } catch (err) {
        console.error(`[Error] Failed to convert ${fullPath}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('--- Starting WebP Asset Optimization ---');
  await processDirectory('assets');
  await processDirectory('image');
  console.log('--- Finished WebP Asset Optimization ---');
}

main();

