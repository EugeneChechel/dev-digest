#!/usr/bin/env node
// Append one insight line to <module>/INSIGHTS.md under a given section.
// Append-only by construction: every original line must survive, in order, or nothing is written.
//
// Usage:
//   node append-insight.mjs --module server --section "What Doesn't Work" --entry "- **2026-11-23 · title** → why → do X."
//   node append-insight.mjs --file /tmp/INSIGHTS.md --section ... --entry ...   (explicit file, for tests)
//
// Exit codes: 0 added · 1 rejected (duplicate / bad input) · 2 integrity check failed (nothing written)

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODULES = ['server', 'client', 'reviewer-core', 'e2e'];
const SECTIONS = [
  'What Works',
  "What Doesn't Work",
  'Codebase Patterns',
  'Tool & Library Notes',
  'Recurring Errors & Fixes',
  'Session Notes',
  'Open Questions',
];
// INSIGHTS.md is @-imported into each module's CLAUDE.md and sent with every request;
// past this size signal drops and a human should consolidate.
const SOFT_LINE_LIMIT = 80;

const fail = (msg, code = 1) => {
  console.error(`append-insight: ${msg}`);
  process.exit(code);
};

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    if (!key?.startsWith('--')) fail(`unexpected argument "${key}"`);
    if (argv[i + 1] === undefined) fail(`missing value for ${key}`);
    out[key.slice(2)] = argv[i + 1];
  }
  return out;
}

const norm = (s) =>
  s.replace(/^\s*[-*]\s*/, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

const args = parseArgs(process.argv.slice(2));

let file;
if (args.file) {
  file = resolve(args.file);
} else {
  if (!MODULES.includes(args.module)) {
    fail(`--module must be one of: ${MODULES.join(', ')} (got "${args.module ?? ''}")`);
  }
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
  file = join(repoRoot, args.module, 'INSIGHTS.md');
}
if (!SECTIONS.includes(args.section)) {
  fail(`--section must be one of: ${SECTIONS.map((s) => `"${s}"`).join(', ')} (got "${args.section ?? ''}")`);
}
if (!args.entry?.trim()) fail('--entry is empty');
if (!existsSync(file)) fail(`${file} not found`);

let entry = args.entry.trim();
if (entry.includes('\n')) fail('--entry must be a single line');
if (!/^[-*] /.test(entry)) entry = `- ${entry}`;

const original = readFileSync(file, 'utf8');
const lines = original.split('\n');

// Exact (normalized) duplicate anywhere in the file → reject. Semantic dedupe is the model's job.
const target = norm(entry);
const dupIdx = lines.findIndex((l) => /^\s*[-*] /.test(l) && norm(l) === target);
if (dupIdx !== -1) fail(`duplicate of line ${dupIdx + 1}: ${lines[dupIdx].trim()}`);

const headingIdx = lines.findIndex((l) => l.trim() === `## ${args.section}`);
if (headingIdx === -1) {
  fail(`section "## ${args.section}" not found in ${file}. Add the heading by hand (never auto-restructure).`);
}

// End of section = next "## " heading or EOF. Insert after the last non-blank line in the section.
let end = lines.length;
for (let i = headingIdx + 1; i < lines.length; i++) {
  if (lines[i].startsWith('## ')) { end = i; break; }
}
let insertAt = headingIdx + 1;
for (let i = headingIdx + 1; i < end; i++) {
  if (lines[i].trim() !== '') insertAt = i + 1;
}

const next = [...lines.slice(0, insertAt), entry, ...lines.slice(insertAt)];

// Integrity: the original must be a subsequence of the new content and exactly one line was added.
let j = 0;
for (const l of next) if (j < lines.length && l === lines[j]) j++;
if (j !== lines.length || next.length !== lines.length + 1) {
  fail('integrity check failed — original content would change; nothing written', 2);
}

const tmp = `${file}.tmp-${process.pid}`;
writeFileSync(tmp, next.join('\n'));
renameSync(tmp, file);

const total = next.join('\n').trimEnd().split('\n').length;
console.log(`added to ${file} § ${args.section} (${total} lines total)`);
if (total > SOFT_LINE_LIMIT) {
  console.log(`warning: ${total} lines > ${SOFT_LINE_LIMIT} — consider a human consolidation pass`);
}
