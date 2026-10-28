// slides.json → html/NN.html（＋ガイド版）を書き出し、Chromium で 1080×1920 PNG に変換する
// 見た目：インスタのアプリで手で文字を置いたような「行ごとの半透明の帯」＋文ごとに少しずれた位置と傾き。
// 書体は全枚・全文字 Noto Sans JP で統一。主役の一言（[[[ ]]]）は強調色＋少し大きく。マーカー（{{ }}）は使わず、ふつうの文字として扱う。
// 使い方: PW_CORE=<playwright-core のパス> node html/build.js   （BACKDROP=<dir> で文字を消した検品用の背景版）
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_CORE || 'playwright-core');

const ROOT = path.resolve(__dirname, '..');
const slides = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));

// 配色：テラコッタ（強調色は暗い帯の上で使う）
const C = { em: '#FFC08A', band: 'rgba(24,16,12,.76)' };

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\{\{(.+?)\}\}/g, '$1')
  .replace(/\[\[\[(.+?)\]\]\]/g, '<span class="hero">$1</span>')
  .replace(/\[\[(.+?)\]\]/g, '<span class="em">$1</span>');

// 文（空白行で区切られたかたまり）ごとに、左右の位置だけ少しずらす（傾けない。手で置いた感じ）
const JITTER = [[0, 0], [26, 0], [-8, 0], [18, 0], [6, 0], [-14, 0]];

function blocks(lines) {
  const out = []; let cur = [];
  for (const l of lines) { if (l === '') { if (cur.length) out.push(cur); cur = []; } else cur.push(l); }
  if (cur.length) out.push(cur);
  return out;
}

// 枚ごとの文字の置き場所（全枚「画像＋文字だけ・暗い画面に白文字」。読みやすさは文字の後ろの帯で出す）
const LAYOUT = {
  1: { top: 300, left: 300, size: 42 },
  2: { bottom: 1520, left: 96, size: 42 },
  3: { top: 290, left: 96, size: 42 },
  4: { bottom: 1520, left: 96, size: 42 },
  5: { top: 255, left: 92, size: 40, gap: 0.55 },
};
// 5枚目のリアクション：画面右下のいいね（ハート）
const STICKER = { x: 985, y: 1840, label: 'いいね（ハート）' };

const css = (L, backdrop) => `
@font-face{font-family:"NSJ";src:url(fonts/NotoSansJP.ttf);font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#1a110c}
body{position:relative;font-family:"NSJ",sans-serif;font-weight:400;font-size:${L.size}px;color:#fff;letter-spacing:.04em}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.txt{position:absolute;left:${L.left}px;right:60px;${L.top != null ? `top:${L.top}px;` : ''}${L.bottom != null ? `bottom:${1920 - L.bottom}px;` : ''}
  display:flex;flex-direction:column;align-items:flex-start;gap:${L.gap || 0.75}em}
.blk{line-height:1.78}
.ln{display:block;white-space:nowrap}
.ln span.t,.ln .hero{background:${C.band};padding:.1em .34em .14em;border-radius:.28em;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.em{color:${C.em};font-weight:500}
.hero{color:${C.em};font-weight:500;font-size:1.3em;letter-spacing:.04em;line-height:1.5}
.next{position:absolute;right:64px;bottom:352px;font-size:26px;line-height:1;letter-spacing:.06em;
  background:${C.band};padding:.32em .6em;border-radius:.4em;opacity:.92}
.spot{position:absolute;left:${STICKER.x - 55}px;top:${STICKER.y - 55}px;width:110px;height:110px;border-radius:50%;
  border:4.5px dashed #fff;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.spotlabel{position:absolute;right:${1080 - (STICKER.x - 55) + 18}px;top:${STICKER.y - 18}px;font-size:30px;line-height:1.2;letter-spacing:.06em;
  text-shadow:0 0 2px #000,0 1px 3px rgba(0,0,0,.8)}
${backdrop ? '.txt,.next,.spotlabel{visibility:hidden}' : ''}
`;

function lineHtml(l) {
  const h = inline(l);
  // 主役の一言だけの行は手書き風の帯、それ以外は行全体を1つの帯に入れる
  if (/^<span class="hero">.*<\/span>[。、]?$/.test(h)) return `<span class="ln">${h}</span>`;
  return `<span class="ln"><span class="t">${h}</span></span>`;
}

function page(s, { guide = false, backdrop = false } = {}) {
  const L = LAYOUT[s.no];
  const n = String(s.no).padStart(2, '0');
  const body = blocks(s.lines).map((b, i) => {
    const [dx, rot] = JITTER[(i + s.no) % JITTER.length];
    return `<div class="blk" style="transform:translateX(${dx}px) rotate(${rot}deg);transform-origin:left center">${b.map(lineHtml).join('')}</div>`;
  }).join('\n');
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${css(L, backdrop)}</style></head><body>
<div class="bg" style="background-image:url(../bg/${n}.jpg)"></div>
<div class="txt">${body}</div>
${s.no < 5 ? '<div class="next">次へ →</div>' : ''}
${guide ? `<div class="spot"></div><div class="spotlabel">${STICKER.label}</div>` : ''}
</body></html>`;
}

(async () => {
  const BD = process.env.BACKDROP;
  const jobs = [];
  for (const s of slides) {
    const n = String(s.no).padStart(2, '0');
    if (BD) { fs.writeFileSync(path.join(__dirname, `_bd${n}.html`), page(s, { backdrop: true })); jobs.push([`_bd${n}.html`, path.join(BD, `${n}.png`)]); continue; }
    fs.writeFileSync(path.join(__dirname, `${n}.html`), page(s));
    jobs.push([`${n}.html`, path.join(ROOT, 'slides', `${n}.png`)]);
    if (s.no === 5) {
      fs.writeFileSync(path.join(__dirname, '05_guide.html'), page(s, { guide: true }));
      jobs.push(['05_guide.html', path.join(ROOT, 'guide', '05_guide.png')]);
    }
  }
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const [h, out] of jobs) {
    await p.goto('file://' + path.join(__dirname, h));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    // 検品用：帯を含めた文字の範囲
    const r = await p.evaluate(() => {
      let L = 1e9, T = 1e9, R = 0, B = 0;
      document.querySelectorAll('.ln > *').forEach(e => { for (const b of e.getClientRects()) { L = Math.min(L, b.left); T = Math.min(T, b.top); R = Math.max(R, b.right); B = Math.max(B, b.bottom); } });
      return [Math.round(L), Math.round(T), Math.round(R), Math.round(B), document.fonts.check('40px NSJ')];
    });
    if (!BD) console.log(h, 'left,top,right,bottom,fontOK =', JSON.stringify(r));
    await p.screenshot({ path: out });
  }
  await b.close();
  if (BD) slides.forEach(s => fs.unlinkSync(path.join(__dirname, `_bd${String(s.no).padStart(2, '0')}.html`)));
})();
