import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const staticDirs = ['images', 'files', 'edge-ai-2026', 'flowstun'];

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

for (const directory of staticDirs) {
  const source = path.join(root, directory);
  const destination = path.join(distDir, directory);

  if (!(await pathExists(source))) continue;

  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.cp(source, destination, { recursive: true });

  console.log(`Copied ${directory}/ to ${path.relative(root, destination)}`);
}

// FlowStun proposal docs stay in the repo for archival but must NOT be published.
const flowstunDocs = path.join(distDir, 'flowstun', 'docs');
if (await pathExists(flowstunDocs)) {
  await fs.rm(flowstunDocs, { recursive: true, force: true });
  console.log('Removed flowstun/docs/ from build output (kept in repo, not served)');
}
