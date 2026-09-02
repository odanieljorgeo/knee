/* Knee Battle — all interactive modules. Vanilla, no dependencies.
   Everything is progressive enhancement: pages work fully with JS off. */
(function () {
  'use strict';
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- mobile nav ---------- */
  function initNav() {
    var t = $('.nav-toggle'), n = $('.nav-links');
    if (!t || !n) return;
    t.addEventListener('click', function () {
      var open = n.classList.toggle('open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- hero carousel ---------- */
  function initCarousel() {
    var car = $('.hero-carousel');
    if (!car) return;
    var slides = $$('.car-slide', car), dots = $$('.car-dot', car), i = 0, timer = null;
    if (slides.length < 2) return;
    var live = document.createElement('div');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    car.appendChild(live);
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, x) { s.classList.toggle('active', x === i); });
      dots.forEach(function (d, x) { d.setAttribute('aria-current', x === i ? 'true' : 'false'); });
      live.textContent = 'Slide ' + (i + 1) + ' of ' + slides.length;
    }
    function reset() { if (timer) clearInterval(timer); if (!RM) timer = setInterval(function () { go(i + 1); }, 6000); }
    var prev = $('.car-prev', car), next = $('.car-next', car);
    if (prev) prev.addEventListener('click', function () { go(i - 1); reset(); });
    if (next) next.addEventListener('click', function () { go(i + 1); reset(); });
    dots.forEach(function (d, x) { d.addEventListener('click', function () { go(x); reset(); }); });
    car.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    car.addEventListener('mouseleave', reset);
    go(0); reset();
  }

  /* ---------- ten fronts assessment ---------- */
  function initQuiz() {
    var btn = $('#quiz-start');
    if (!btn || !window.KB_QUIZ) return;
    var Q = window.KB_QUIZ.items, C = window.KB_QUIZ.copy, F = window.KB_QUIZ.fronts;
    var modal = $('#quiz-modal'), panel = $('#quiz-panel');
    var answers = [], idx = 0, lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      answers = []; idx = 0;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      render();
    }
    function close() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    function render() {
      if (idx >= Q.length) return result();
      var q = Q[idx], pct = Math.round((idx / Q.length) * 100);
      panel.innerHTML =
        '<p class="quiz-prog">' + (idx + 1) + ' ' + esc(C.of) + ' ' + Q.length + '</p>' +
        '<div class="quiz-progbar"><i style="width:' + pct + '%"></i></div>' +
        '<p class="quiz-q">' + esc(q[1]) + '</p>' +
        C.scale.map(function (s, v) {
          return '<button type="button" class="quiz-opt" data-v="' + v + '">' + esc(s) + '</button>';
        }).join('') +
        '<p class="small" style="margin-top:16px">' + esc(C.privacy) + '</p>';
      $$('.quiz-opt', panel).forEach(function (b) {
        b.addEventListener('click', function () {
          answers.push([Q[idx][0], parseInt(b.getAttribute('data-v'), 10)]);
          idx++; render();
        });
      });
      var f = $('.quiz-opt', panel); if (f) f.focus();
    }
    function result() {
      var totals = {};
      for (var k = 1; k <= 10; k++) totals[k] = 0;
      answers.forEach(function (a) { totals[a[0]] += a[1]; });
      var rank = Object.keys(totals).map(function (k) { return [parseInt(k, 10), totals[k]]; })
        .sort(function (a, b) { return b[1] - a[1]; });
      var top3 = rank.slice(0, 3).map(function (r) { return r[0]; });
      LS.set('kb-assessment', { top: top3, at: Date.now() });
      panel.innerHTML =
        '<p class="eyebrow i">' + esc(C.top3) + '</p>' +
        '<h2 style="font-size:27px;margin-bottom:12px">' + esc(C.resultH) + '</h2>' +
        '<p class="small" style="margin-bottom:22px">' + esc(C.resultP) + '</p>' +
        rank.map(function (r, n) {
          var f = F[r[0]] || { name: '', slug: '' };
          return '<div class="quiz-bar' + (n < 3 ? ' top' : '') + '">' +
            '<span class="lbl"><span>' + (n + 1) + '. ' + esc(f.name) + '</span><span>' + r[1] + '/12</span></span>' +
            '<span class="track"><i style="width:' + Math.round((r[1] / 12) * 100) + '%"></i></span></div>';
        }).join('') +
        '<div class="btn-row" style="margin-top:24px">' +
        '<a class="btn btn-primary" href="' + window.KB_BASE + 'cards?fronts=' + top3.join(',') + '">' + esc(C.buildWall) + ' <span class="arr">→</span></a>' +
        '<button type="button" class="btn btn-outline" id="q-print">' + esc(C.printResult) + '</button>' +
        '<button type="button" class="btn btn-outline" id="q-again">' + esc(C.retake) + '</button>' +
        '<button type="button" class="btn btn-outline" id="q-close">' + esc(C.close) + '</button></div>';
      $('#q-again').addEventListener('click', function () { answers = []; idx = 0; render(); });
      $('#q-close').addEventListener('click', close);
      $('#q-print').addEventListener('click', function () { window.print(); });
    }
    btn.addEventListener('click', open);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  /* ---------- prayer card builder ---------- */
  function initCards() {
    var form = $('#card-form');
    if (!form || !window.KB_CARDS) return;
    var F = window.KB_CARDS.fronts, C = window.KB_CARDS.copy;
    var list = $('#card-list'), cnt = $('#card-count');
    var cards = LS.get('kb-cards', []);

    var pre = new URLSearchParams(location.search).get('fronts');
    if (pre) { var s = $('#c-front'); if (s) s.value = pre.split(',')[0]; }

    function draw() {
      if (cnt) cnt.textContent = cards.length;
      if (!cards.length) { list.innerHTML = '<p class="small">' + esc(C.empty) + '</p>'; return; }
      list.innerHTML = cards.map(function (c, i) {
        var f = F[c.f] || { name: '', verse: '', ref: '' };
        return '<div class="pcard"><button type="button" class="pcard-x no-print" data-i="' + i + '" aria-label="' + esc(C.remove) + '">✕</button>' +
          '<span class="pcard-front">' + esc(f.name) + '</span>' +
          '<div class="pcard-name">' + esc(c.n) + '</div>' +
          '<p class="pcard-verse">' + esc(f.verse) + '</p>' +
          '<span class="pcard-ref">' + esc(f.ref) + '</span>' +
          (c.w ? '<div class="pcard-words">' + esc(c.w) + '</div>' : '') +
          '<div class="pcard-date">' + esc(C.started) + ' ' + esc(c.d) + '</div></div>';
      }).join('');
      $$('.pcard-x', list).forEach(function (b) {
        b.addEventListener('click', function () {
          cards.splice(parseInt(b.getAttribute('data-i'), 10), 1);
          LS.set('kb-cards', cards); draw();
        });
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#c-name').value.trim();
      if (!n) return;
      cards.push({ n: n, f: $('#c-front').value, w: $('#c-words').value.trim(), d: new Date().toLocaleDateString() });
      LS.set('kb-cards', cards);
      $('#c-name').value = ''; $('#c-words').value = '';
      draw();
      list.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' });
    });
    var pb = $('#card-print'); if (pb) pb.addEventListener('click', function () { window.print(); });
    var cb = $('#card-clear'); if (cb) cb.addEventListener('click', function () {
      if (confirm('?')) { cards = []; LS.del('kb-cards'); draw(); }
    });
    draw();
  }

  /* ---------- 31 days ---------- */
  function initDays() {
    var grid = $('#day-grid');
    if (!grid || !window.KB_DAYS) return;
    var D = window.KB_DAYS.days, C = window.KB_DAYS.copy, F = window.KB_DAYS.fronts;
    var done = LS.get('kb-31', {});
    var panel = $('#day-panel'), streak = $('#day-streak');
    var today = new Date().getDate();

    function count() { return Object.keys(done).filter(function (k) { return done[k]; }).length; }
    function paint() {
      $$('.day-cell', grid).forEach(function (b) {
        var d = b.getAttribute('data-d');
        b.classList.toggle('done', !!done[d]);
        b.setAttribute('aria-pressed', done[d] ? 'true' : 'false');
      });
      if (streak) streak.innerHTML = '<b>' + count() + '</b> ' + esc(C.streak);
    }
    function show(d) {
      var e = D[d - 1], f = F[e.f] || { name: '' };
      panel.innerHTML =
        '<p class="eyebrow i">' + esc(C.dayWord) + ' ' + d + ' · ' + esc(C.frontWord) + ' ' + e.f + ' — ' + esc(f.name) + '</p>' +
        '<h3 style="font-size:24px;margin-bottom:12px">' + esc(e.p) + '</h3>' +
        '<div class="scripture"><p>' + esc(e.pr) + '</p><cite>' + esc(e.v) + '</cite></div>' +
        '<div class="btn-row no-print"><button type="button" class="btn ' + (done[d] ? 'btn-outline' : 'btn-primary') + '" id="d-mark">' +
        esc(done[d] ? C.done + ' ✓' : C.markDone) + '</button>' +
        '<a class="btn btn-outline" href="' + window.KB_BASE + 'battle-plan#f' + e.f + '">' + esc(f.name) + ' <span class="arr">→</span></a></div>';
      $('#d-mark').addEventListener('click', function () {
        done[d] = !done[d]; LS.set('kb-31', done); paint(); show(d);
      });
      panel.style.display = 'block';
    }
    $$('.day-cell', grid).forEach(function (b) {
      var d = parseInt(b.getAttribute('data-d'), 10);
      if (d === today) b.classList.add('today');
      b.addEventListener('click', function () { show(d); });
    });
    var rb = $('#day-reset'); if (rb) rb.addEventListener('click', function () {
      if (confirm('?')) { done = {}; LS.del('kb-31'); paint(); panel.style.display = 'none'; }
    });
    var pb = $('#day-print'); if (pb) pb.addEventListener('click', function () { window.print(); });
    paint();
  }

  /* ---------- guided timer ---------- */
  function initTimer() {
    var box = $('#timer');
    if (!box || !window.KB_TIMER) return;
    var T = window.KB_TIMER;
    var dial = $('#t-dial'), stepEl = $('#t-step'), promptEl = $('#t-prompt'),
        btn = $('#t-btn'), sel = $('#t-mins');
    var iv = null, left = 0, total = 0;
    function fmt(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
    function tick() {
      left--;
      if (left <= 0) {
        stop();
        dial.textContent = '0:00';
        stepEl.textContent = '';
        promptEl.textContent = T.done;
        return;
      }
      dial.textContent = fmt(left);
      var elapsed = total - left;
      var si = Math.min(T.steps.length - 1, Math.floor((elapsed / total) * T.steps.length));
      stepEl.textContent = T.steps[si][0];
      promptEl.textContent = T.steps[si][1];
    }
    function start() {
      total = left = parseInt(sel.value, 10) * 60;
      dial.textContent = fmt(left);
      stepEl.textContent = T.steps[0][0];
      promptEl.textContent = T.steps[0][1];
      iv = setInterval(tick, 1000);
      btn.textContent = T.stop;
      btn.setAttribute('data-on', '1');
    }
    function stop() {
      if (iv) clearInterval(iv); iv = null;
      btn.textContent = T.start;
      btn.removeAttribute('data-on');
    }
    btn.addEventListener('click', function () { btn.getAttribute('data-on') ? stop() : start(); });
  }

  /* ---------- room picker ---------- */
  function initRooms() {
    var tabs = $$('.room-tab');
    if (!tabs.length) return;
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var id = t.getAttribute('data-r');
        tabs.forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
        $$('.room-panel').forEach(function (p) { p.classList.toggle('on', p.id === 'room-' + id); });
      });
    });
  }

  /* ---------- verse of the day ---------- */
  function initVerse() {
    var el = $('#votd');
    if (!el || !window.KB_VERSES) return;
    var V = window.KB_VERSES;
    var n = new Date(), key = ('0' + (n.getMonth() + 1)).slice(-2) + '-' + ('0' + n.getDate()).slice(-2);
    var v = V[key] || V['__default'];
    if (!v) return;
    el.innerHTML = '<p>' + esc(v[0]) + '</p><cite>' + esc(v[1]) + '</cite>';
  }

  /* ---------- copy buttons ---------- */
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = document.getElementById(b.getAttribute('data-copy'));
        if (!t) return;
        var txt = t.textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(txt);
        var o = b.textContent; b.textContent = '✓'; setTimeout(function () { b.textContent = o; }, 1400);
      });
    });
  }

  /* ---------- print buttons ---------- */
  function initPrint() {
    $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
  }

  function boot() {
    initNav(); initCarousel(); initQuiz(); initCards(); initDays();
    initTimer(); initRooms(); initVerse(); initCopy(); initPrint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
