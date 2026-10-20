// slides.json → html/NN.html（＋ガイド版）を書き出し、Chromium で 1080×1920 PNG に変換する
// 様式：深い紫の夜空（星を散らす）＋金の三日月＋中央揃えの金色の明朝体＋署名「イルミ」
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const slides = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));

const C = {
  sky: '#110a24', glow: '#1f1544', head: '#E8D6A8', body: '#CDB98F', em: '#F3DC95',
  marker: 'rgba(217,191,133,.26)', icon: '#D9BF85',
};
// スタンプの置き場所（最後の1枚）：中心座標と種類
const SPOT = { x: 540, y: 1385, label: '絵文字スライダー' };
// 文字のかたまりの縦位置（最後の1枚はスライダーの余白を下に空けるため上寄せ）
const TOP = { 1: 560, 2: 560, 3: 290 };
const GAP = { 1: 96, 2: 96, 3: 56 }; // 月と見出しの間

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\[\[\[(.+?)\]\]\]/g, '<span class="em">$1</span>')
  .replace(/\[\[(.+?)\]\]/g, '<span class="em">$1</span>')
  .replace(/\{\{(.+?)\}\}/g, '<span class="mk">$1</span>');
const lines = arr => arr.map(l => l === '' ? '<div class="ln blank">&nbsp;</div>' : `<div class="ln">${inline(l)}</div>`).join('\n');

// 星：枚ごとに配置を変える（同じ背景にならないよう、乱数の種を枚番号にする）
function stars(seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  let out = '';
  for (let i = 0; i < 70; i++) {
    const r = rnd() < 0.85 ? 1.2 + rnd() * 1.2 : 2.4 + rnd() * 1.2;
    out += `<circle cx="${(rnd() * 1080).toFixed(0)}" cy="${(rnd() * 1920).toFixed(0)}" r="${r.toFixed(1)}" fill="#fff" opacity="${(0.12 + rnd() * 0.35).toFixed(2)}"/>`;
  }
  return `<svg class="stars" width="1080" height="1920" viewBox="0 0 1080 1920">${out}</svg>`;
}

const moon = `<svg class="moon" width="140" height="96" viewBox="0 0 140 96">
<path d="M48 4a44 44 0 1 0 30 76A38 38 0 1 1 48 4z" fill="${C.icon}"/>
<path d="M112 26l3 17 17 3-17 3-3 17-3-17-17-3 17-3z" fill="${C.icon}"/></svg>`;

function page(s, guide) {
  const head = s.lines.slice(0, s.head_lines).map(l => l.replace(/\[\[|\]\]/g, ''));
  const body = s.lines.slice(s.head_lines + 1);
  const last = s.no === slides.length;
  const css = `
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-Regular.ttf);font-weight:400}
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
body{position:relative;font-family:"ZOM",serif;font-weight:400;
  background:radial-gradient(ellipse 620px 760px at 50% 48%, ${C.glow}, ${C.sky} 100%) ${C.sky}}
.stars{position:absolute;inset:0}
.blk{position:absolute;left:72px;right:72px;top:${TOP[s.no]}px;display:flex;flex-direction:column;align-items:center;text-align:center}
.moon{margin-bottom:${GAP[s.no]}px}
.head{font-size:60px;line-height:1.6;letter-spacing:.12em;color:${C.head}}
.txt{margin-top:${s.no === slides.length ? 52 : 72}px;font-size:40px;line-height:1.75;letter-spacing:.14em;color:${C.body}}
.ln{white-space:nowrap}
.em{color:${C.em}}
.mk{background:linear-gradient(transparent 62%, ${C.marker} 62%)}
.sign{position:absolute;left:0;right:0;top:1520px;text-align:center;font-size:32px;letter-spacing:.5em;color:${C.body};opacity:.9}
.next{position:absolute;right:72px;bottom:352px;font-size:26px;line-height:1;letter-spacing:.1em;color:${C.body};opacity:.85}
.spot{position:absolute;left:${SPOT.x - 55}px;top:${SPOT.y - 55}px;width:110px;height:110px;border-radius:50%;
  border:4.5px dashed #fff;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.spotlabel{position:absolute;left:${SPOT.x + 55 + 20}px;top:${SPOT.y - 17}px;font-size:30px;line-height:1.15;letter-spacing:.06em;color:#fff;
  text-shadow:0 0 2px #000,0 1px 3px rgba(0,0,0,.8)}
`;
  const html = `${stars(s.no)}
<div class="blk">${moon}<div class="head">${head.map(h => `<div class="ln">${esc(h)}</div>`).join('')}</div>
<div class="txt">${lines(body)}</div></div>
${last ? '' : '<div class="sign">イルミ</div><div class="next">次へ →</div>'}
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
    const box = await p.$$eval('.moon,.head,.txt,.sign,.next', els => els.map(e => { const r = e.getBoundingClientRect(); return [e.getAttribute('class'), Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; }));
    const fontOk = await p.evaluate(() => document.fonts.check('40px ZOM'));
    console.log(h, JSON.stringify(box), 'font', fontOk);
    await p.screenshot({ path: out });
  }
  await b.close();
})();
