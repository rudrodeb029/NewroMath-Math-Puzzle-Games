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

