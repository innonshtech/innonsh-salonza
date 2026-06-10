const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dir = path.join(__dirname, 'app', 'dashboard');

walkDir(dir, function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace heavy borders with standard borders
    content = content.replace(/border-2 border-slate-100/g, 'border border-slate-200');
    // Also catch cases where they might be separated or in different order
    content = content.replace(/border border-slate-100/g, 'border border-slate-200');
    
    // Replace bubbly corners with standard corners
    content = content.replace(/rounded-3xl/g, 'rounded-xl');
    content = content.replace(/rounded-2xl/g, 'rounded-xl');
    content = content.replace(/rounded-\[40px\]/g, 'rounded-xl');
    content = content.replace(/rounded-\[2\.5rem\]/g, 'rounded-xl');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
