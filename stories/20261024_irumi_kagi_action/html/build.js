// slides.json → html/NN.html（＋ガイド版）を書き出し、Chromium で 1080×1920 PNG に変換する
// 使い方: PW_CORE=<playwright-core のパス> node html/build.js   （BACKDROP=<dir> で文字を消した検品用の背景版を書き出す）
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_CORE || 'playwright-core');

const ROOT = path.resolve(__dirname, '..');
const slides = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));

// 配色：ネイビー×イエロー
const C = { emDark: '#FFD65A', marker: 'rgba(255,214,90,.60)' };
const BODY = 44, LH = 1.7, HERO = 1.5; // 本文44px・行間1.7・主役は本文の1.5倍

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\[\[\[(.+?)\]\]\]/g, '<span class="hero">$1</span>')
  .replace(/\[\[(.+?)\]\]/g, '<span class="em">$1</span>')
  .replace(/\{\{(.+?)\}\}/g, '<span class="mk">$1</span>');
const lines = arr => arr.map(l => {
  if (l === '') return '<div class="ln blank">&nbsp;</div>';
  return `<div class="ln${l.includes('[[[') ? ' big' : ''}">${inline(l)}</div>`;
}).join('\n');

// 枚ごとの文字の置き方（すべて「画像＋文字だけ・暗い画面に白文字」）
// pos: 文字のかたまりの縦位置（top=上端 / bottom=下端 / center）、align: 揃え、glow: 文字の後ろだけの暗い楕円の中心と大きさ
const LAYOUT = {
  1: { pos: { center: 1120 }, align: 'center', glow: [480, 1120, 1100, 700], size: 40, right: 152 },
  2: { pos: { bottom: 1515 }, align: 'center', glow: [540, 1170, 1250, 1000], dark: [.80, .62] },
  3: { pos: { bottom: 1515 }, align: 'left', glow: [500, 1160, 1150, 980] },
  4: { pos: { top: 300 }, align: 'center', glow: [540, 690, 1150, 980] },
  5: { pos: { bottom: 1535 }, align: 'center', glow: [540, 1240, 1150, 820] },
};

const css = (L, backdrop) => `
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-Regular.ttf);font-weight:400}
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0b1020}
body{position:relative;font-family:"ZOM",serif;font-weight:400;font-size:${L.size || BODY}px;line-height:${LH};letter-spacing:.05em;color:#fff}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.glow{position:absolute;left:${L.glow[0]}px;top:${L.glow[1]}px;width:${L.glow[2]}px;height:${L.glow[3]}px;transform:translate(-50%,-50%);
  background:radial-gradient(closest-side, rgba(6,10,24,${(L.dark||[.62,.42])[0]}), rgba(6,10,24,${(L.dark||[.62,.42])[1]}) 60%, rgba(6,10,24,0))}
.txt{position:absolute;left:${L.align === 'left' ? 110 : 72}px;right:${L.right || 72}px;text-align:${L.align};
  ${L.pos.top != null ? `top:${L.pos.top}px;` : ''}${L.pos.bottom != null ? `bottom:${1920 - L.pos.bottom}px;` : ''}${L.pos.center != null ? `top:${L.pos.center}px;transform:translateY(-50%);` : ''}}
.ln{white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,.6),0 0 16px rgba(0,0,0,.45)}
.ln.big{line-height:1.45}
.em{color:${C.emDark};font-weight:600}
.hero{color:${C.emDark};font-weight:600;font-size:${HERO}em;letter-spacing:.04em}
.mk{background:linear-gradient(transparent 76%, ${C.marker} 76%, ${C.marker} 96%, transparent 96%)}
.next{position:absolute;right:72px;bottom:352px;font-size:26px;line-height:1;letter-spacing:.08em;opacity:.82;
  text-shadow:0 0 2px rgba(0,0,0,.9),0 1px 8px rgba(0,0,0,.7)}
.spot{position:absolute;left:${985 - 55}px;top:${1840 - 55}px;width:110px;height:110px;border-radius:50%;
  border:4.5px dashed #fff;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.spotlabel{position:absolute;right:${1080 - (985 - 55) + 18}px;top:${1840 - 18}px;font-size:30px;line-height:1.2;letter-spacing:.06em;
  text-shadow:0 0 2px #000,0 1px 3px rgba(0,0,0,.8)}
${backdrop ? '.ln,.next,.spotlabel{color:transparent!important;text-shadow:none!important}.hero,.em{color:transparent!important}' : ''}
`;

function page(s, { guide = false, backdrop = false } = {}) {
  const L = LAYOUT[s.no];
  const n = String(s.no).padStart(2, '0');
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${css(L, backdrop)}</style></head><body>
<div class="bg" style="background-image:url(../bg/${n}.jpg)"></div><div class="glow"></div>
<div class="txt">${lines(s.lines)}</div>
${s.no < 5 ? '<div class="next">次へ →</div>' : ''}
${guide ? '<div class="spot"></div><div class="spotlabel">いいね（ハート）</div>' : ''}
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
    // 検品用：文字の実際の範囲（各行の文字の左右端と、かたまりの上下端）
    const r = await p.evaluate(() => {
      const rg = document.createRange(); let L = 1e9, R = 0;
      document.querySelectorAll('.ln:not(.blank)').forEach(e => { rg.selectNodeContents(e); const b = rg.getBoundingClientRect(); L = Math.min(L, b.left); R = Math.max(R, b.right); });
      const t = document.querySelector('.txt').getBoundingClientRect();
      return [Math.round(L), Math.round(t.top), Math.round(R), Math.round(t.bottom), document.fonts.check('44px ZOM')];
    });
    console.log(h, 'left,top,right,bottom,font =', JSON.stringify(r));
    await p.screenshot({ path: out });
  }
  await b.close();
  if (BD) slides.forEach(s => fs.unlinkSync(path.join(__dirname, `_bd${String(s.no).padStart(2, '0')}.html`)));
})();
