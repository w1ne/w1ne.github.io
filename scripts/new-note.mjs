#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Post Title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[''""`]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const today = new Date().toISOString().slice(0, 10);
const filePath = path.join('src', 'content', 'notes', `${slug}.md`);

if (fs.existsSync(filePath)) {
  console.error(`Already exists: ${filePath}`);
  process.exit(1);
}

const body = `---
title: ${title}
description: ''
date: '${today}'
tags: []
draft: true
---

`;

fs.writeFileSync(filePath, body, 'utf8');
console.log(`Created ${filePath}`);

const editor = process.env.VISUAL || process.env.EDITOR;
if (editor) {
  spawn(editor, [filePath], { stdio: 'inherit' });
}
