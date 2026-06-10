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
  if (filePath.endsWith('page.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace h1 class to match Inventory Management format
    content = content.replace(/<h1 className="[^"]*"/g, '<h1 className="text-2xl font-semibold text-slate-900"');
    
    // Replace subtitle right under h1
    content = content.replace(/<\/h1>\s*<p className="[^"]*text-slate-600[^"]*">([\s\S]*?)<\/p>/g, function(match, p1) {
        let text = p1.trim();
        
        // Remove existing "for {salon...}" or similar if it already exists to avoid duplicates
        text = text.replace(/\s+for\s+\{salon\?.name\s*\|\|\s*"[^"]*"\}\s*/g, '');
        text = text.replace(/\s+for\s+your\s+salon\s*/g, '');
        text = text.replace(/\s+for\s+\{salon\?.name\}\s*/g, '');
        
        // Check if `salon` is accessible in this component
        let appendText = ' for your salon';
        if (original.includes('const [salon') || original.includes('const salon ') || original.includes('salon=')) {
            appendText = ' for {salon?.name || "your salon"}';
        }

        return `</h1>\n          <p className="mt-1 text-sm text-slate-600">\n            ${text}${appendText}\n          </p>`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
