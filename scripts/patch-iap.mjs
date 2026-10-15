import fs from 'fs';
import path from 'path';

const targetGradle = path.resolve('node_modules/@capgo/native-purchases/android/build.gradle');

if (fs.existsSync(targetGradle)) {
  let content = fs.readFileSync(targetGradle, 'utf8');
  if (content.includes("classpath 'com.android.tools.build:gradle:8.7.3'")) {
    content = content.replace(
      "classpath 'com.android.tools.build:gradle:8.7.3'",
      "classpath 'com.android.tools.build:gradle:8.2.1'"
    );
    fs.writeFileSync(targetGradle, content, 'utf8');
    console.log('[patch-iap] Aligned @capgo/native-purchases AGP version to 8.2.1');
  }
}

