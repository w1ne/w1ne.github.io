import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const root = process.cwd();
const notesDir = path.join(root, 'src/content/notes');
const redirectsDir = path.join(root, 'src/pages');

function redirectPage(destination) {
  return `---
const destination = '${destination}';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content={\`0;url=\${destination}\`} />
    <link rel="canonical" href={destination} />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to <a href={destination}>{destination}</a>.</p>
  </body>
</html>
`;
}

const files = (await fs.readdir(notesDir)).filter((file) => file.endsWith('.md'));
let generated = 0;

for (const file of files) {
  const raw = await fs.readFile(path.join(notesDir, file), 'utf8');
  const parsed = matter(raw);
  if (parsed.data.draft) continue;
  if (!parsed.data.legacyUrl) continue;
  const legacyPath = String(parsed.data.legacyUrl).replace(/^\/|\/$/g, '');
  const destination = `/notes/${file.replace(/\.md$/, '')}/`;
  const outputDir = path.join(redirectsDir, legacyPath);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.astro'), redirectPage(destination));
  generated += 1;
}

console.log(`Generated ${generated} redirects from ${files.length} notes`);
