import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[copy-assets] Successfully copied ${src} -> ${dest}`);
}

copyDir('assets', 'dist/assets');
copyDir('image', 'dist/image');
copyDir('assets', 'public/assets');
copyDir('assets', 'android/app/src/main/assets/public/assets');


// Prune source PNG/JPG files that already have an optimized WebP sibling (smaller APK + CDN payload)
function pruneRaster(dir) {
  if (!fs.existsSync(dir)) return;
  let removed = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!/^\.(png|jpe?g)$/i.test(ext)) continue;
    const full = path.join(entry.parentPath ?? entry.path, entry.name);
    if (fs.existsSync(full.slice(0, -ext.length) + '.webp')) { fs.rmSync(full); removed++; }
  }
  console.log('[copy-assets] Pruned ' + removed + ' redundant raster files in ' + dir);
}
pruneRaster('dist/assets');
pruneRaster('dist/image');
pruneRaster('android/app/src/main/assets/public/assets');
pruneRaster('android/app/src/main/assets/public/image');
