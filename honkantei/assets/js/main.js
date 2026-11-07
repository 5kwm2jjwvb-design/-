/* =====================================================================
   イルミ本鑑定LP ― 動作スクリプト
   値の変更は config.js で行ってください（このファイルは基本触らなくてOK）。
   ===================================================================== */
(function () {
  'use strict';

  var C = window.CONFIG || {};
  var body = document.body;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
  }
  function isSet(v) { return v !== null && v !== undefined && v !== ''; }
  function yen(v) { return typeof v === 'number' ? '¥' + v.toLocaleString('ja-JP') : '¥★'; }
  function num(v) { return typeof v === 'number' ? v.toLocaleString('ja-JP') : '★'; }
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  /* ---------------------------------------------------------------
     1. 限定期間（初回訪問日時を localStorage に保存）
     --------------------------------------------------------------- */
  var L = C.limit || {};
  var KEY = L.storageKey || 'irumi_kantei_first_visit_v1';
  var memoryStart = null;

  try {
    if (/[?&]timer=reset\b/.test(location.search)) localStorage.removeItem(KEY);
  } catch (e) {}

  function firstVisit() {
    var now = Date.now();
    try {
      var saved = Number(localStorage.getItem(KEY));
      if (saved > 0 && saved <= now) return saved;
      localStorage.setItem(KEY, String(now));
    } catch (e) {
      // ストレージが使えない環境（プライベートモード等）はこの表示中のみ
      if (memoryStart === null) memoryStart = now;
      return memoryStart;
    }
    return now;
  }

  var days = (typeof L.days === 'number' && L.days > 0) ? L.days : (L.previewDays || 7);
  var start = new Date(firstVisit());
  // 開いた日を1日目として、days日目の24時（= 翌日0時）まで
  var deadline = new Date(start.getFullYear(), start.getMonth(), start.getDate() + days).getTime();

  function isLimited() { return L.enabled !== false && Date.now() < deadline; }

  function setMode() {
    var lim = isLimited();
    body.classList.toggle('is-limited', lim);
    body.classList.toggle('is-expired', !lim);
    return lim;
  }

  /* ---------------------------------------------------------------
     2. CONFIG の値をページに反映
     --------------------------------------------------------------- */
  function bindStatic() {
    $$('[data-cfg]').forEach(function (el) {
      var v = get(el.getAttribute('data-cfg'));
      el.textContent = isSet(v) ? v : '★';
    });
    $$('[data-yen]').forEach(function (el) { el.textContent = yen(get(el.getAttribute('data-yen'))); });
    $$('[data-num]').forEach(function (el) { el.textContent = num(get(el.getAttribute('data-num'))); });

    // 希少性表示
    var sc = C.scarcity || {};
    $$('[data-scarcity]').forEach(function (el) {
      if (sc.show && sc.text) el.textContent = sc.text;
      else el.remove();
    });
  }

  function bindDynamic() {
    var lim = setMode();
    var menus = C.menus || {};

    $$('[data-price-now]').forEach(function (el) {
      var m = menus[el.getAttribute('data-price-now')] || {};
      el.textContent = yen(lim ? m.priceLimited : m.priceRegular);
    });

    $$('[data-link]').forEach(function (el) {
      var key = el.getAttribute('data-link');
      var url;
      if (key.indexOf('pay.') === 0) {
        var m = menus[key.slice(4)] || {};
        url = lim ? m.payUrl : (m.payUrlRegular || m.payUrl);
      } else {
        url = (C.links || {})[key];
      }
      var unset = !isSet(url) || url === '#';
      el.setAttribute('href', unset ? '#' : url);
      el.classList.toggle('is-unset', unset);
      if (!unset && /^https?:/.test(url)) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      }
    });
  }

  // 未設定のリンクを押したとき（ページ先頭へ飛ばないように）
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.is-unset');
    if (!a) return;
    e.preventDefault();
    var isPay = (a.getAttribute('data-link') || '').indexOf('pay.') === 0;
    alert(isPay
      ? 'ただいまお申し込みの準備中です。\n公式LINEからお問い合わせください。'
      : 'このリンクは準備中です。');
  });

  /* ---------------------------------------------------------------
     3. カウントダウン
     --------------------------------------------------------------- */
  var cds = $$('.cd');
  function tick() {
    var left = deadline - Date.now();
    if (left <= 0 || L.enabled === false) {
      bindDynamic();          // 通常料金表示・通常価格の決済リンクへ切り替え
      return;
    }
    var s = Math.floor(left / 1000);
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600),
        m = Math.floor(s % 3600 / 60), sec = s % 60;
    cds.forEach(function (c) {
      c.querySelector('[data-d]').textContent = d;
      c.querySelector('[data-h]').textContent = pad(h);
      c.querySelector('[data-m]').textContent = pad(m);
      c.querySelector('[data-s]').textContent = pad(sec);
    });
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }

  /* ---------------------------------------------------------------
     4. 実績カウンター（スクロールでカウントアップ）
     --------------------------------------------------------------- */
  function buildStats() {
    var list = C.stats || [];
    var box = document.getElementById('stats');
    if (!box || !list.length) return;
    var ul = document.getElementById('stats-list');
    list.forEach(function (s) {
      var li = document.createElement('li');
      li.innerHTML = '<p class="stat-num"><b data-count-to="' + Number(s.value || 0) + '">0</b><span></span></p><p class="stat-label"></p>';
      li.querySelector('span').textContent = s.suffix || '';
      li.querySelector('.stat-label').textContent = s.label || '';
      ul.appendChild(li);
    });
    box.hidden = false;
  }

  function countUp(el) {
    var goal = Number(el.getAttribute('data-count-to')) || 0;
    var dur = 1600, t0 = null;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = goal.toLocaleString('ja-JP'); return; }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(goal * eased).toLocaleString('ja-JP');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------
     5. お客様の声ギャラリー
     --------------------------------------------------------------- */
  function buildVoices() {
    var wrap = document.getElementById('voices-list');
    if (!wrap) return;
    if (!(C.voices || []).length) {           // 空なら「お客様の声」の章ごと非表示
      var sec = document.getElementById('voices');
      if (sec) sec.remove();
      return;
    }
    (C.voices || []).forEach(function (src, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'voice ph ph-voice rv';
      b.setAttribute('data-src', src);
      b.setAttribute('data-label', src.split('/').pop());
      b.setAttribute('aria-label', 'お客様の声 ' + (i + 1) + ' を拡大');
      wrap.appendChild(b);
    });
  }

  var lb = document.getElementById('lightbox');
  document.addEventListener('click', function (e) {
    var v = e.target.closest && e.target.closest('.voice');
    if (!v || !lb) return;
    if (!v.classList.contains('loaded')) return;   // プレースホルダは拡大しない
    lb.querySelector('img').src = v.getAttribute('data-src');
    if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox-close')) lb.close ? lb.close() : lb.removeAttribute('open');
    });
  }

  /* ---------------------------------------------------------------
     6. 画像プレースホルダ → 実画像（ファイルを置くと自動で差し替え）
     --------------------------------------------------------------- */
  function loadImages() {
    $$('.ph[data-src]').forEach(function (el) {
      var src = el.getAttribute('data-src');
      var img = new Image();
      img.onload = function () {
        el.style.backgroundImage = 'url("' + src + '")';
        el.classList.add('loaded');
      };
      img.src = src;
    });
  }

  /* ---------------------------------------------------------------
     7. スクロール演出（フェードイン・層・カウンター）
     --------------------------------------------------------------- */
  function observe() {
    var targets = $$('.rv, .layers, [data-count-to]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in'); if (el.hasAttribute('data-count-to')) countUp(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        if (el.hasAttribute('data-count-to')) countUp(el);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
    targets.forEach(function (el) { io.observe(el); });
    body.classList.add('js-anim');
  }

  /* ---------------------------------------------------------------
     8. 固定CTAバー（FV・購入セクションが見えている間は隠す）
     --------------------------------------------------------------- */
  function sticky() {
    var bar = document.getElementById('sticky');
    if (!bar) return;
    var zones = $$('[data-sticky-hide]');
    var visible = new Set();
    function update() {
      var show = visible.size === 0;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      bar.querySelector('a').tabIndex = show ? 0 : -1;
    }
    if (!('IntersectionObserver' in window)) { visible.clear(); update(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
      });
      update();
    }, { threshold: 0 });
    zones.forEach(function (z) { io.observe(z); });
  }

  /* ---------------------------------------------------------------
     起動
     --------------------------------------------------------------- */
  bindStatic();
  buildStats();
  buildVoices();
  bindDynamic();
  tick();
  loadImages();
  observe();
  sticky();
})();
