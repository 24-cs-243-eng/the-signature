const fs = require('fs');
const path = require('path');
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir('signature-fastfood-main/public/media', 'images/media');
if(fs.existsSync('signature-fastfood-main/public/favicon.ico')) fs.copyFileSync('signature-fastfood-main/public/favicon.ico', 'images/favicon.ico');
if(fs.existsSync('signature-fastfood-main/public/robots.txt'))  fs.copyFileSync('signature-fastfood-main/public/robots.txt', 'images/robots.txt');
console.log('All images copied successfully!');
