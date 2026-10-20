// slides.json → html/NN.html（＋ガイド版）を書き出し、Chromium で 1080×1920 PNG に変換する
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const slides = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));

// 配色：ネイビー×イエロー（暗い画面用）
// スタンプの置き場所（最後の1枚）：中心座標と種類
const SPOT = { x: 540, y: 1370, label: '絵文字スライダー' };
const C = { em: '#FFD65A', marker: 'rgba(255,214,90,.60)', ink: '#1F2A3D' };

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\[\[\[(.+?)\]\]\]/g, '<span class="hero">$1</span>')
  .replace(/\[\[(.+?)\]\]/g, '<span class="em">$1</span>')
  .replace(/\{\{(.+?)\}\}/g, '<span class="mk">$1</span>');
const lines = arr => arr.map(l => l === '' ? '<div class="ln blank">&nbsp;</div>' : `<div class="ln">${inline(l)}</div>`).join('\n');

// 枚ごとの差：見出しの揃え・文字サイズ・グラデーションを70%のまま保つ高さ（そこから380pxで0%へ）
const V = {
  1: { align: 'left', size: 44, head: 96, hold: 1130 },
  2: { align: 'center', size: 44, head: 100, hold: 1220 },
  3: { align: 'left', size: 44, head: 96, hold: 1180 },
};

function page(s, guide) {
  const v = V[s.no];
  const head = s.lines.slice(0, s.head_lines).map(l => l.replace(/\[\[|\]\]/g, ''));
  const body = s.lines.slice(s.head_lines + 1);
  const n = String(s.no).padStart(2, '0');
  const last = s.no === slides.length;
  const css = `
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-Regular.ttf);font-weight:400}
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0d1020}
body{position:relative;font-family:"ZOM",serif;font-weight:400;color:#fff;letter-spacing:.05em}
.bg{position:absolute;inset:0;background:url(../bg/${n}.jpg) center/cover}
.shade{position:absolute;left:0;right:0;top:0;height:${v.hold + 380}px;
  background:linear-gradient(rgba(0,0,0,.70),rgba(0,0,0,.70) ${v.hold}px,rgba(0,0,0,.35) ${v.hold + 170}px,rgba(0,0,0,0))}
.blk{position:absolute;top:290px;left:96px;right:72px;display:flex;flex-direction:column;align-items:${v.align === 'center' ? 'center' : 'flex-start'}}
.head{font-size:${v.head}px;line-height:1.32;font-weight:600;color:${C.em};letter-spacing:.06em;text-align:${v.align};
  text-shadow:0 2px 6px rgba(0,0,0,.55)}
.rule{width:150px;height:2px;background:${C.em};opacity:.9;margin:38px 0 44px}
.txt{font-size:${v.size}px;line-height:1.7;text-align:left}
.ln{white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,.6),0 0 16px rgba(0,0,0,.45)}
.mk{background:linear-gradient(transparent 60%, ${C.marker} 60%)}
.em,.hero{color:${C.em};font-weight:600}
.next{position:absolute;right:72px;bottom:352px;font-size:26px;line-height:1;letter-spacing:.08em;opacity:.88;
  padding:10px 18px;border-radius:999px;background:rgba(10,14,30,.45);
  text-shadow:0 0 2px rgba(0,0,0,.9),0 1px 8px rgba(0,0,0,.7)}
.spot{position:absolute;left:${SPOT.x - 55}px;top:${SPOT.y - 55}px;width:110px;height:110px;border-radius:50%;
  border:4.5px dashed #fff;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.spotlabel{position:absolute;left:${SPOT.x + 55 + 20}px;top:${SPOT.y - 17}px;font-size:30px;line-height:1.15;letter-spacing:.06em;
  text-shadow:0 0 2px #000,0 1px 3px rgba(0,0,0,.8)}
`;
  const html = `<div class="bg"></div><div class="shade"></div>
<div class="blk"><div class="head">${head.map(h => `<div class="ln">${esc(h)}</div>`).join('')}</div>
<div class="rule"></div><div class="txt">${lines(body)}</div></div>
${last ? '' : '<div class="next">次へ →</div>'}
${guide ? `<div class="spot"></div><div class="spotlabel">${SPOT.label}</div>` : ''}`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`;
}

(async () => {
  const jobs = [];
  for (const s of slides) {
    const n = String(s.no).padStart(2, '0');
    fs.writeFileSync(path.join(__dirname, `${n}.html`), page(s, false));
    jobs.push([`${n}.html`, path.join(ROOT, 'slides', `${n}.png`)]);
    if (s.no === slides.length) {
      fs.writeFileSync(path.join(__dirname, `${n}_guide.html`), page(s, true));
      jobs.push([`${n}_guide.html`, path.join(ROOT, 'guide', `${n}_guide.png`)]);
    }
  }
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const [h, out] of jobs) {
    await p.goto('file://' + path.join(__dirname, h));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    // 検品用：文字のかたまりの外接矩形とフォント読込
    const box = await p.$$eval('.head,.txt,.next', els => els.map(e => { const r = e.getBoundingClientRect(); return [e.className, Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }));
    const fontOk = await p.evaluate(() => document.fonts.check('44px ZOM'));
    console.log(h, JSON.stringify(box), 'font', fontOk);
    await p.screenshot({ path: out });
  }
  await b.close();
})();
