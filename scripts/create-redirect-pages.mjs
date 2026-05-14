import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';

const root = process.cwd();
const notesDir = path.join(root, 'src/content/notes');
const redirectsDir = path.join(root, 'src/pages');
const generatedMarker = '<!-- generated:legacy-redirect -->';

function redirectPage(destination) {
  return `---
const destination = '${destination}';
---
<!doctype html>
<html lang="en">
  ${generatedMarker}
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

async function cleanGeneratedRedirects() {
  let entries = [];
  try {
    entries = await fs.readdir(redirectsDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) return;

      const directory = path.join(redirectsDir, entry.name);
      const indexPath = path.join(directory, 'index.astro');
      let content;
      try {
        content = await fs.readFile(indexPath, 'utf8');
      } catch (error) {
        if (error.code === 'ENOENT') return;
        throw error;
      }

      if (content.includes(generatedMarker)) {
        await fs.rm(directory, { recursive: true, force: true });
      }
    })
  );
}

const files = (await fs.readdir(notesDir)).filter((file) => file.endsWith('.md'));
let generated = 0;

await cleanGeneratedRedirects();

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
