const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const root = path.resolve(__dirname, '..');
const includeDirs = ['backend', 'frontend'];
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.sql']);

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.vite'].includes(entry.name)) continue;
      cb(full, true);
      walk(full, cb);
    } else {
      cb(full, false);
    }
  }
}

let changed = 0;
for (const d of includeDirs) {
  const dir = path.join(root, d);
  if (!fs.existsSync(dir)) continue;
  walk(dir, (full, isDir) => {
    if (isDir) return;
    const ext = path.extname(full).toLowerCase();
    if (!exts.has(ext)) return;
    try {
      const src = fs.readFileSync(full, 'utf8');
      const stripped = strip(src);
      if (stripped !== src) {
        fs.writeFileSync(full, stripped, 'utf8');
        console.log('Stripped comments:', full.replace(root + path.sep, ''));
        changed++;
      }
    } catch (err) {
      console.error('Error processing', full, err.message);
    }
  });
}

console.log(`Done. Files changed: ${changed}`);
