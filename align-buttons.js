const fs = require('fs');
const path = require('path');

// Fix clients/page.tsx
let clientsPath = path.join(__dirname, 'app', 'dashboard', 'clients', 'page.tsx');
let content = fs.readFileSync(clientsPath, 'utf8');

// Replace the new client button using regex
content = content.replace(/className="[^"]*bg-linear-to-br[^"]*from-indigo-600[^"]*"/g, 'className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all active:scale-95"');
content = content.replace(/>\s*NEW CLIENT\s*<\/button>/g, '>\n                    New Client\n                </button>');

fs.writeFileSync(clientsPath, content, 'utf8');

// Fix memberships/page.tsx
let membersPath = path.join(__dirname, 'app', 'dashboard', 'memberships', 'page.tsx');
let membersContent = fs.readFileSync(membersPath, 'utf8');

// The create new plan button in memberships
membersContent = membersContent.replace(/className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-md hover:shadow-lg active:scale-95"/g, 'className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all active:scale-95"');

fs.writeFileSync(membersPath, membersContent, 'utf8');

console.log('Fixed buttons');
