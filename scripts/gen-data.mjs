/* TANGLANGUAGE — bo sinh du lieu
   Chay: node scripts/gen-data.mjs
   Tao ra: js/vocab-advanced.js  (>= 1200 tu)
           js/listening-data.js  (>= 600 cau)
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { RAW_VOCAB } from './raw-vocab.mjs';
import { RAW_VOCAB2 } from './raw-vocab2.mjs';
import { RAW_VOCAB3 } from './raw-vocab3.mjs';
import { RAW_VOCAB4 } from './raw-vocab4.mjs';
import { RAW_VOCAB5, RAW_VOCAB5B, RAW_VOCAB5C } from './raw-vocab5.mjs';
import {
  FIXED_SENTENCES, TEMPLATES, STRUCTURES, EXTRA_FIXED,
} from './raw-listening.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const jsDir = path.join(here, '..', 'js');

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/* ============================================================
   1) TU VUNG NANG CAO
   ============================================================ */
const TOPIC_META = [
  { id: 'business',     name: 'Kinh doanh',           emoji: '📈' },
  { id: 'tech',         name: 'Công nghệ',            emoji: '💻' },
  { id: 'politics',     name: 'Chính trị & Xã hội',   emoji: '🏛️' },
  { id: 'science',      name: 'Khoa học',             emoji: '🔬' },
  { id: 'economy',      name: 'Kinh tế',              emoji: '💰' },
  { id: 'law',          name: 'Pháp luật',            emoji: '⚖️' },
  { id: 'medicine',     name: 'Y tế',                 emoji: '🩺' },
  { id: 'environment',  name: 'Môi trường',           emoji: '🌍' },
  { id: 'art',          name: 'Nghệ thuật & Văn hóa', emoji: '🎨' },
  { id: 'sport',        name: 'Thể thao',             emoji: '⚽' },
  { id: 'psychology',   name: 'Tâm lý học',           emoji: '🧠' },
  { id: 'education',    name: 'Giáo dục',             emoji: '🎓' },
  { id: 'transport',    name: 'Giao thông',           emoji: '🚆' },
  { id: 'culinary',     name: 'Ẩm thực',              emoji: '🍳' },
  { id: 'finance',      name: 'Tài chính cá nhân',    emoji: '🏦' },
  { id: 'communication',name: 'Giao tiếp',            emoji: '🗣️' },
  { id: 'media',        name: 'Truyền thông',         emoji: '📰' },
  { id: 'geography',    name: 'Địa lý',               emoji: '🗺️' },
  { id: 'philosophy',   name: 'Triết học & Tôn giáo', emoji: '🕊️' },
  { id: 'agriculture',  name: 'Nông nghiệp',          emoji: '🌾' },
  { id: 'architecture', name: 'Kiến trúc',            emoji: '🏗️' },
  { id: 'military',     name: 'Quân sự & Quốc phòng', emoji: '🎖️' },
  { id: 'society',      name: 'Xã hội',               emoji: '👥' },
];

const seenWord = new Set();
const vocabLines = [];
for (const [word, ipa, mean, topic, ex] of [...RAW_VOCAB, ...RAW_VOCAB2, ...RAW_VOCAB3, ...RAW_VOCAB4, ...RAW_VOCAB5, ...RAW_VOCAB5B, ...RAW_VOCAB5C]) {
  const key = String(word).toLowerCase().trim();
  if (!key || seenWord.has(key)) continue;
  seenWord.add(key);
  vocabLines.push(
    `  { topic:'${topic}', word:'${esc(word)}', ipa:'${esc(ipa)}', mean:'${esc(mean)}', ex:'${esc(ex)}' },`
  );
}

const vocabOut = `/* TANGLANGUAGE — vocab-advanced.js
   Tu vung nang cao. File nay duoc SINH TU DONG (scripts/gen-data.mjs) — dung sua tay.
   Tong so: ${vocabLines.length} tu, ${TOPIC_META.length} chu de.
*/

const ADVANCED_TOPICS = [
${TOPIC_META.map(t => `  { id:'${t.id}', name:'${t.name}', emoji:'${t.emoji}' },`).join('\n')}
];

const ADVANCED_VOCABULARY = [
${vocabLines.join('\n')}
];
`;

fs.writeFileSync(path.join(jsDir, 'vocab-advanced.js'), vocabOut, 'utf8');
console.log('vocab-advanced.js:', vocabLines.length, 'tu');

/* ============================================================
   2) 600 CAU LUYEN NGHE
   ============================================================ */
const items = [];
const pushItem = (text, correct, wrongArr) => {
  const bad = (wrongArr || []).filter(w => w && w !== correct);
  if (bad.length < 2) return;
  items.push({ text, correct, d1: bad[0], d2: bad[1] });
};

// (a) cau co dinh chat luong cao
for (const [text, correct, wrongs] of [...FIXED_SENTENCES, ...EXTRA_FIXED]) {
  pushItem(text, correct, wrongs);
}

// (b) cau sinh tu template theo chu de
for (const tpl of TEMPLATES) {
  for (const it of tpl.items) {
    pushItem(tpl.en(it), tpl.vi(it), tpl.wrong(it));
  }
}

// (c) cau sinh tu cau truc ngu phap
for (const s of STRUCTURES) {
  if (s.subjects && s.places) {
    for (const sub of s.subjects) {
      for (const pl of s.places) {
        pushItem(
          `${sub.en} ${pl.en} ${s.endEn}`,
          `${sub.vi} ${pl.vi} ${s.endVi}`,
          s.wrongEnd.map(w => `${sub.vi} ${pl.vi} ${w}`)
        );
      }
    }
  }
  if (s.a && s.b) {
    for (const x of s.a) {
      for (const y of s.b) {
        pushItem(s.en(x, y), s.vi(x, y), s.wrong(x, y));
      }
    }
  }
  if (s.things) {
    for (const it of s.things) pushItem(s.en(it), s.vi(it), s.wrong(it));
  }
  if (s.actions) {
    for (const it of s.actions) pushItem(s.en(it), s.vi(it), s.wrong(it));
  }
}

// Loai trung lap theo cau tieng Anh
const seenText = new Set();
const unique = [];
for (const it of items) {
  const k = it.text.toLowerCase().trim();
  if (seenText.has(k)) continue;
  seenText.add(k);
  unique.push(it);
}

/* Mo rong bang bien the mo dau neu chua du 600 cau */
const OPENERS = [
  { en: 'Honestly, ',       vi: 'Thật lòng mà nói, ' },
  { en: 'I think ',         vi: 'Tôi nghĩ ' },
  { en: 'Usually, ',        vi: 'Thông thường, ' },
  { en: 'In my opinion, ',  vi: 'Theo ý tôi, ' },
  { en: 'These days, ',     vi: 'Dạo này, ' },
  { en: 'Sadly, ',          vi: 'Đáng buồn là, ' },
];

// Ha chu cai dau xuong chu thuong, nhung giu nguyen dai tu "I"
function decryptFirst(s) {
  if (/^I(\s|'|\b)/.test(s)) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

const basePool = [...unique];
let n = 0;
while (unique.length < 600 && basePool.length) {
  const src = basePool[n % basePool.length];
  const op = OPENERS[n % OPENERS.length];
  const text = op.en + decryptFirst(src.text);
  const key = text.toLowerCase().trim();
  n++;
  if (seenText.has(key)) continue;
  seenText.add(key);
  unique.push({
    text,
    correct: op.vi + src.correct,
    d1: op.vi + src.d1,
    d2: op.vi + src.d2,
  });
}

const finalItems = unique.slice(0, 600);

/* Xao tron dap an (deterministic) + ghi file */
const listenLines = finalItems.map((it, idx) => {
  const opts = [it.correct, it.d1, it.d2];
  const shift = (idx * 7 + 1) % 3;
  const rotated = opts.slice(shift).concat(opts.slice(0, shift));
  const answer = rotated.indexOf(it.correct);
  return `  { text:'${esc(it.text)}', options:[${rotated
    .map(o => `'${esc(o)}'`)
    .join(', ')}], answer:${answer} },`;
});

const listenOut = `/* TANGLANGUAGE — listening-data.js
   Cau hoi luyen nghe. File nay duoc SINH TU DONG (scripts/gen-data.mjs) — dung sua tay.
   Tong so: ${listenLines.length} cau.
*/

const LISTENING_BANK = [
${listenLines.join('\n')}
];
`;

fs.writeFileSync(path.join(jsDir, 'listening-data.js'), listenOut, 'utf8');
console.log('listening-data.js:', listenLines.length, 'cau');
