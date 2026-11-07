/* イルミ 公式LINE登録特典ページ ― CONFIG の反映と、静かなフェードイン */
(function () {
  'use strict';
  var C = window.CONFIG || {};

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function placeholder(el, label) {
    el.classList.add('is-placeholder');
    el.textContent = '★差し替え待ち：' + (label || el.getAttribute('data-cfg') || '');
  }

  // テキスト（1行）
  $$('[data-cfg]').forEach(function (el) {
    var v = get(el.getAttribute('data-cfg'));
    if (v == null) { placeholder(el, el.getAttribute('data-placeholder')); return; }
    el.textContent = v;
  });

  // テキスト（「\n」で改行）
  $$('[data-cfg-lines]').forEach(function (el) {
    var v = get(el.getAttribute('data-cfg-lines'));
    if (v === '') { el.hidden = true; return; }
    if (v == null) { placeholder(el, el.getAttribute('data-placeholder')); return; }
    el.innerHTML = String(v).split('\n').map(esc).join('<br>');
  });

  // リンク
  $$('[data-cfg-href]').forEach(function (el) {
    var v = get(el.getAttribute('data-cfg-href'));
    if (v) el.setAttribute('href', v);
  });

  // <title>
  if (C.gift && C.gift.pageTitle) document.title = C.gift.pageTitle;

  // 画像：ファイルがあれば差し替え、なければプレースホルダのまま
  $$('.ph[data-img]').forEach(function (el) {
    var src = get(el.getAttribute('data-img'));
    el.setAttribute('data-label', el.getAttribute('data-label') || src || '');
    if (!src) return;
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add('is-loaded');
    };
    img.src = src;
  });

  // フェードイン
  var items = $$('.rv');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  document.documentElement.classList.add('js-rv');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
