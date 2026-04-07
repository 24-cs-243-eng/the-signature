const fs = require('fs');
const path = require('path');
function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/signature/media/')) {
        content = content.replace(/\/signature\/media\//g, '/media/');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed ' + file);
      }
    }
  }
}
replaceInFiles('./src');
