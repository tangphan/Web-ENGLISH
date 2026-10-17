/* Kiem tra bang cach NAP THAT SU cac file du lieu */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const jsDir = path.join(here, '..', 'js');

function loadExpr(name, expr) {
  const src = fs.readFileSync(path.join(jsDir, name), 'utf8');
  const ctx = vm.createContext({ console });
  return vm.runInContext(src + '\n;' + expr, ctx);
}

// --- LISTENING ---
const bank = loadExpr('listening-data.js', 'LISTENING_BANK');
let badAnswer = 0, badOpts = 0, dupOpts = 0;
const seenText = new Set();
let dupText = 0;
for (const it of bank) {
  if (!Array.isArray(it.options) || it.options.length !== 3) badOpts++;
  if (!(it.answer >= 0 && it.answer < 3) || !it.options[it.answer]) badAnswer++;
  if (new Set(it.options).size !== 3) dupOpts++;
  const k = it.text.toLowerCase();
  if (seenText.has(k)) dupText++;
  seenText.add(k);
}
console.log('=== listening-data.js ===');
console.log('tong cau          :', bank.length);
console.log('answer hop le     :', badAnswer === 0 ? 'TAT CA OK' : badAnswer + ' loi');
console.log('3 lua chon moi cau:', badOpts === 0 ? 'TAT CA OK' : badOpts + ' loi');
console.log('lua chon trung    :', dupOpts);
console.log('cau trung lap     :', dupText);
console.log('vi du 1           :', JSON.stringify(bank[0]));
console.log('vi du 2           :', JSON.stringify(bank[300]));

// --- VOCAB ---
const vocab = loadExpr('vocab-advanced.js', 'ADVANCED_VOCABULARY');
const seenWord = new Set();
let dupWord = 0, missing = 0;
const byTopic = {};
for (const v of vocab) {
  if (!v.word || !v.ipa || !v.mean || !v.ex || !v.topic) { missing++; continue; }
  const k = v.word.toLowerCase();
  if (seenWord.has(k)) dupWord++;
  seenWord.add(k);
  byTopic[v.topic] = (byTopic[v.topic] || 0) + 1;
}
console.log('\n=== vocab-advanced.js ===');
console.log('tong tu        :', vocab.length);
console.log('tu trung lap   :', dupWord);
console.log('thieu truong   :', missing);
console.log('theo chu de    :', JSON.stringify(byTopic));
console.log('vi du          :', JSON.stringify(vocab[0]));
