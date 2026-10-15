// slides.json → html/NN.html（＋ガイド版）を書き出し、Chromium で 1080×1920 PNG に変換する
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW_CORE || 'playwright-core');

const ROOT = path.resolve(__dirname, '..');
const slides = JSON.parse(fs.readFileSync(path.join(ROOT, 'slides.json'), 'utf8'));

const C = {
  light: '#E9EFE5', ink: '#253026', goldOnLight: '#7A5A12',
  emDark: '#C2E3A8', marker: 'rgba(170,210,140,.45)',
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\[\[\[(.+?)\]\]\]/g, '<span class="hero">$1</span>')
  .replace(/\[\[(.+?)\]\]/g, '<span class="em">$1</span>')
  .replace(/\{\{(.+?)\}\}/g, '<span class="mk">$1</span>');
const lines = arr => arr.map(l => l === '' ? '<div class="ln blank">&nbsp;</div>' : `<div class="ln">${inline(l)}</div>`).join('\n');

const base = (size, lh) => `
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-Regular.ttf);font-weight:400}
@font-face{font-family:"ZOM";src:url(fonts/ZenOldMincho-SemiBold.ttf);font-weight:600}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#111}
body{position:relative;font-family:"ZOM",serif;font-weight:400;font-size:${size}px;line-height:${lh};letter-spacing:.05em;font-feature-settings:"palt" 0}
.bg{position:absolute;inset:0;background-size:cover;background-position:center}
.ln{white-space:nowrap}
.mk{background:linear-gradient(transparent 58%, ${C.marker} 58%)}
.em{font-weight:600}
.hero{font-weight:600}
.next{position:absolute;right:72px;bottom:350px;font-size:26px;letter-spacing:.08em;opacity:.8;line-height:1}
.dark{color:#fff}
.dark .ln{text-shadow:0 1px 3px rgba(0,0,0,.55),0 0 18px rgba(0,0,0,.45)}
.dark .em,.dark .hero{color:${C.emDark}}
`;

function page(css, body) {
  if (process.env.BACKDROP) css += '.ln,.head,.next,.spotlabel{color:transparent!important;text-shadow:none!important}';
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;
}

const nextMark = (dark) => `<div class="next" style="color:${dark ? '#fff' : C.ink}${dark ? ';text-shadow:0 0 2px rgba(0,0,0,.9),0 1px 8px rgba(0,0,0,.7)' : ''}">次へ →</div>`;

const build = {
  // 1：画像＋文字だけ（暗い画面に白文字・中央）
  1: s => page(base(50, 1.7) + `
.glow{position:absolute;left:50%;top:50%;width:1150px;height:820px;transform:translate(-50%,-50%);
  background:radial-gradient(closest-side, rgba(10,12,28,.62), rgba(10,12,28,.40) 55%, rgba(10,12,28,0))}
.txt{position:absolute;left:72px;right:72px;top:50%;transform:translateY(-50%);text-align:center}
`, `<div class="bg" style="background-image:url(../bg/01.jpg)"></div><div class="glow"></div>
<div class="txt dark">${lines(s.lines)}</div>${nextMark(true)}`),

  // 2：上下分割（上に画像、下は明るい面に黒文字・左揃え）
  2: s => page(base(48, 1.7) + `
.img{position:absolute;left:0;top:0;width:1080px;height:860px;background:url(../bg/02.jpg) center 62%/cover}
.panel{position:absolute;left:-60px;right:-60px;top:800px;bottom:0;background:${C.light};border-radius:50% 50% 0 0/70px 70px 0 0}
.txt{position:absolute;left:120px;right:72px;top:905px;color:${C.ink};text-align:left}
.em,.hero{color:${C.goldOnLight}}
`, `<div class="img"></div><div class="panel"></div>
<div class="txt">${lines(s.lines)}</div>${nextMark(false)}`),

  // 3：見出し強調（上だけ暗いグラデ、上に大見出し、線、本文は左揃え）
  3: s => {
    const head = s.lines.slice(0, 2).map(l => l.replace(/\[\[\[|\]\]\]/g, ''));
    const bodyLines = s.lines.slice(3);
    return page(base(46, 1.7) + `
.shade{position:absolute;left:0;right:0;top:0;height:1150px;background:linear-gradient(rgba(0,0,0,.70),rgba(0,0,0,.45) 60%,rgba(0,0,0,0))}
.head{position:absolute;left:96px;top:300px;font-size:104px;line-height:1.35;font-weight:600;color:${C.emDark};letter-spacing:.06em;text-shadow:0 2px 6px rgba(0,0,0,.5)}
.rule{position:absolute;left:100px;top:600px;width:160px;height:2px;background:${C.emDark};opacity:.85}
.txt{position:absolute;left:100px;right:72px;top:650px;text-align:left}
`, `<div class="bg" style="background-image:url(../bg/03.jpg)"></div><div class="shade"></div>
<div class="head">${head.map(h => `<div class="ln">${esc(h)}</div>`).join('')}</div><div class="rule"></div>
<div class="txt dark">${lines(bodyLines)}</div>${nextMark(true)}`);
  },

  // 4：写真＋小さな一言（写真が主役・下に小さめの文字）
  4: s => page(base(46, 1.65) + `
.shade{position:absolute;left:0;right:0;bottom:0;height:980px;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.45) 22%,rgba(0,0,0,.60) 55%,rgba(0,0,0,.60))}
.txt{position:absolute;left:72px;right:72px;bottom:430px;text-align:center}
`, `<div class="bg" style="background-image:url(../bg/04.jpg)"></div><div class="shade"></div>
<div class="txt dark">${lines(s.lines)}</div>${nextMark(true)}`),

  // 5：画像＋文字だけ（暗い画面に白文字・中央）＋質問ボックスの余白
  5: (s, guide) => page(base(50, 1.7) + `
.glow{position:absolute;left:50%;top:640px;width:1150px;height:860px;transform:translate(-50%,-50%);
  background:radial-gradient(closest-side, rgba(0,0,0,.55), rgba(0,0,0,.35) 55%, rgba(0,0,0,0))}
.txt{position:absolute;left:72px;right:72px;top:340px;text-align:center}
.spot{position:absolute;left:${540 - 55}px;top:${1350 - 55}px;width:110px;height:110px;border-radius:50%;
  border:4.5px dashed #fff;filter:drop-shadow(0 0 1.5px rgba(0,0,0,.9)) drop-shadow(0 1px 2px rgba(0,0,0,.6))}
.spotlabel{position:absolute;left:${540 + 55 + 22}px;top:${1350 - 18}px;font-size:30px;line-height:1.2;color:#fff;letter-spacing:.06em;
  text-shadow:0 0 2px #000,0 1px 3px rgba(0,0,0,.8)}
`, `<div class="bg" style="background-image:url(../bg/05.jpg)"></div><div class="glow"></div>
<div class="txt dark">${lines(s.lines)}</div>
${guide ? '<div class="spot"></div><div class="spotlabel">質問ボックス</div>' : ''}`),
};

(async () => {
  const jobs = [];
  for (const s of slides) {
    const n = String(s.no).padStart(2, '0');
    fs.writeFileSync(path.join(__dirname, `${n}.html`), build[s.no](s, false));
    jobs.push([`${n}.html`, process.env.BACKDROP ? path.join(process.env.BACKDROP, `${n}.png`) : path.join(ROOT, 'slides', `${n}.png`)]);
    if (s.no === 5 && !process.env.BACKDROP) {
      fs.writeFileSync(path.join(__dirname, `05_guide.html`), build[5](s, true));
      jobs.push(['05_guide.html', path.join(ROOT, 'guide', '05_guide.png')]);
    }
  }
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (const [h, out] of jobs) {
    await p.goto('file://' + path.join(__dirname, h));
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    // 文字のかたまりの位置を記録（検品用）
    const box = await p.$$eval('.txt,.head', els => els.map(e => { const r = e.getBoundingClientRect(); return [e.className, Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom), e.scrollWidth > e.clientWidth + 1]; }));
    const lineW = await p.$$eval('.ln', els => Math.max(...els.map(e => e.getBoundingClientRect().right)));
    const fontOk = await p.evaluate(() => document.fonts.check('50px ZOM'));
    console.log(h, JSON.stringify(box), 'maxRight', Math.round(lineW), 'font', fontOk);
    await p.screenshot({ path: out });
  }
  await b.close();
})();
