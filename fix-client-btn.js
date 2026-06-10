const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'dashboard', 'clients', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `className="flex items-center justify-center gap-2 bg-linear-to-br from-indigo-600 to-blue-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-blue-200 hover:scale-105 transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    NEW CLIENT`;

const replacementStr = `className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    New Client`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed New Client button');
