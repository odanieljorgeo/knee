/* Knee Battle — static site generator.
   node static/build.mjs  →  emits ./site
   Pure HTML/CSS/JS output. EN at root, PT under /pt/, ES under /es/. */
import { mkdirSync, writeFileSync, readdirSync, copyFileSync, statSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as S from './data/site.mjs';
import { FRONTS, FRONTS_INTRO } from './data/fronts.mjs';
import { PAGES } from './data/pages.mjs';
import { LIFE, INFO } from './data/pages2.mjs';
import { DAYS, DAYS_COPY, QUIZ, QUIZ_COPY, CARDS_COPY, RESOURCES, LEGAL, TIMER } from './data/extras.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'site');
const V = '20260902a';
const YEAR = new Date().getFullYear();

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const out = (rel, html) => { const p = join(OUT, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, html, 'utf8'); };
const base = (lang) => S.LANG_PATH[lang];
const url = (lang, slug) => S.BASE + base(lang) + (slug ? slug + '/' : '');
const href = (lang, slug) => base(lang) + (slug ? slug + '/' : '');

/* every page slug, in order */
const SLUGS = ['', 'start-here', 'prayer-room', 'battle-plan', 'cards', '31-days', 'how-to-pray',
  'marriage', 'children', 'fear', 'provision', 'fasting', 'mentor', 'testimonies', 'gospel',
  'about', 'resources', 'inspired-by', 'contact', 'privacy', 'terms', 'sitemap'];

/* ---------------- chrome ---------------- */
function head(lang, title, desc, slug, extraLd = '') {
  const canon = url(lang, slug);
  const alts = S.LANGS.map((l) => `<link rel="alternate" hreflang="${S.HTML_LANG[l]}" href="${url(l, slug)}"/>`).join('') +
    `<link rel="alternate" hreflang="x-default" href="${url('en', slug)}"/>`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': S.BASE + '/#org', name: 'Knee Battle', url: S.BASE,
        description: 'A free trilingual prayer resource, a ministry of CBA Orlando.',
        parentOrganization: { '@type': 'Organization', name: 'CBA Orlando', url: 'https://cbaorlando.org' },
        email: 'info@cbaorlando.org', telephone: '+1-321-689-2973' },
      { '@type': 'WebSite', '@id': S.BASE + '/#site', name: 'Knee Battle', url: S.BASE,
        publisher: { '@id': S.BASE + '/#org' }, inLanguage: S.HTML_LANG[lang] },
      { '@type': 'WebPage', '@id': canon + '#page', url: canon, name: title, description: desc,
        isPartOf: { '@id': S.BASE + '/#site' }, inLanguage: S.HTML_LANG[lang] },
    ],
  };
  return `<!doctype html><html lang="${S.HTML_LANG[lang]}"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}"/>
<meta name="theme-color" content="#2E1F6B"/>
<link rel="canonical" href="${canon}"/>
${alts}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="Knee Battle"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:url" content="${canon}"/>
<meta property="og:image" content="${S.BASE}/assets/img/og-image.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:locale" content="${S.OG_LOCALE[lang]}"/>
${S.LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${S.OG_LOCALE[l]}"/>`).join('')}
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(desc)}"/>
<meta name="twitter:image" content="${S.BASE}/assets/img/og-image.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/assets/css/site.css?v=${V}"/>
<script type="application/ld+json">${JSON.stringify(ld)}</script>${extraLd}
</head><body>
<a class="skip" href="#main">${esc(S.UI.skip[lang])}</a>`;
}

function topbar(lang) {
  return `<div class="site-topbar"><div class="wrap"><span class="tb-left">${esc(S.UI.topbarLeft[lang])}</span>` +
    `<a class="crisis-link" href="${href(lang, 'about')}#safety">${esc(S.UI.topbarCrisis[lang])}</a></div></div>`;
}

function header(lang, slug) {
  const nav = S.NAV.map((n) => `<a href="${href(lang, n.href)}"${n.href === slug ? ' aria-current="page"' : ''}>${esc(n[lang])}</a>`).join('');
  const langs = S.LANGS.map((l) => `<a href="${href(l, slug)}" hreflang="${S.HTML_LANG[l]}" class="${l === lang ? 'on' : ''}" aria-label="${esc(S.UI.langLabel[lang])}: ${l.toUpperCase()}">${l}</a>`).join('');
  const sub = S.BRAND.sub[lang];
  return `${topbar(lang)}
<header class="site-header"><div class="wrap">
<a class="brand" href="${base(lang)}">${S.KB_MARK}<span class="brand-txt"><span>Knee Battle</span>${sub ? `<em>${esc(sub)}</em>` : ''}</span></a>
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="main-nav">${esc(S.UI.menu[lang])}</button>
<nav class="nav-links" id="main-nav" aria-label="Main">${nav}</nav>
<div class="nav-wrap"><div class="langs">${langs}</div><a class="nav-cta" href="${href(lang, 'gospel')}">${esc(S.UI.navCta[lang])}</a></div>
</div></header>`;
}

function familyBar(lang) {
  const links = S.FAMILY.map((f) => `<a href="${f.url}" rel="noopener"><i class="dot" style="--c:${f.dot}" aria-hidden="true"></i><span>${esc(f[lang])}</span></a>`).join('');
  return `<nav class="cba-family-bar" aria-label="${esc(S.UI.familyEyebrow[lang])}"><span class="cba-family-eyebrow">${esc(S.UI.familyEyebrow[lang])}</span>${links}</nav>`;
}

function footer(lang) {
  const cols = S.FOOT_COLS[lang].map((c) =>
    `<div><h3>${esc(c.h)}</h3><ul class="footer-list">${c.l.map(([s, t]) => `<li><a href="${href(lang, s)}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('');
  const legal = S.LEGAL_LINKS[lang].map(([s, t]) => `<a href="${href(lang, s)}">${esc(t)}</a>`).join(' · ');
  const cr = S.CRISIS_STRIP[lang];
  return `${familyBar(lang)}
<footer class="site-footer">
<div class="foot-crisis"><div class="wrap"><span class="lbl">${esc(cr.lbl)}</span><span>${cr.txt}</span></div></div>
<div class="footer-inner">
<div><h2>Knee Battle</h2><p class="lede">${esc(S.FOOT_LEDE[lang])}</p>
<a class="cba-colophon" href="https://cbaorlando.org/" rel="noopener">${S.CBA_MARK}<span>${esc(S.UI.colophon[lang])} <strong>CBA Orlando</strong></span></a></div>
${cols}
</div>
<div class="section-inner family-legal"><span>${esc(S.FAMILY_LEGAL[lang])}</span> &middot; <a href="tel:+13216892973">321-689-2973</a></div>
<div class="section-inner legal-line"><span>${esc(S.INDEPENDENCE[lang])}</span><span class="legal-links">${legal}</span></div>
<div class="section-inner legal-line"><span>&copy; ${YEAR} Knee Battle. ${esc(S.UI.colophon[lang])} CBA Orlando. ${esc(S.NON_AFFILIATION[lang])}</span></div>
</footer>`;
}

function page(lang, slug, title, desc, main, { extraLd = '', inline = '' } = {}) {
  return head(lang, title, desc, slug, extraLd) + header(lang, slug) +
    `<main id="main">${main}</main>` + footer(lang) +
    inline + `<script src="/assets/js/site.js?v=${V}"></script></body></html>`;
}

/* ---------------- helpers ---------------- */
const crumbs = (lang, label) =>
  `<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="${base(lang)}">${esc(S.UI.home[lang])}</a> › ${esc(label)}</nav></div>`;

const hero = (lang, eyebrow, h1, lede, btns = '') =>
  `<section class="hero"><div class="wrap">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${esc(h1)}</h1>${lede ? `<p class="lead">${esc(lede)}</p>` : ''}${btns}</div></section>`;

const secHead = (eyebrow, h2, lede, center) =>
  `<div class="sec-head${center ? ' center' : ''}">${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${esc(h2)}</h2>${lede ? `<p class="lead">${esc(lede)}</p>` : ''}</div>`;

const prayerBox = (lang, text) =>
  `<div class="prayer-box"><p class="eyebrow">${lang === 'en' ? 'A prayer you can pray tonight' : lang === 'pt' ? 'Uma oração para hoje à noite' : 'Una oración para esta noche'}</p><p>${esc(text)}</p></div>`;

const img = (src, alt, cls = '') => `<img src="/assets/img/${src}.png" alt="${esc(alt)}" width="768" height="432" loading="lazy"${cls ? ` class="${cls}"` : ''}/>`;

const photoFeature = (src, alt, eyebrow, h2, p, tone = 'indigo', rev = false, cta = null, lang = 'en') =>
  `<section class="photo-feature ${tone}${rev ? ' rev' : ''}"><div class="wrap photo-feature-grid">
<div class="photo-feature-photo">${img(src, alt)}</div>
<div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(h2)}</h2><p class="lead">${esc(p)}</p>
${cta ? `<div class="btn-row"><a class="btn btn-primary" href="${href(lang, cta[0])}">${esc(cta[1])} <span class="arr">→</span></a></div>` : ''}</div>
</div></section>`;

/* ---------------- pages ---------------- */

function homePage(lang) {
  const P = PAGES.home[lang], X = P.sections, av = S.ANCHOR_VERSE[lang];
  const slides = [
    { img: 'carousel/c1', alt: lang === 'en' ? 'A closet door standing ajar with warm light spilling into a dark hallway' : lang === 'pt' ? 'Porta de armário entreaberta com luz quente no corredor escuro' : 'Puerta de clóset entreabierta con luz cálida en un pasillo oscuro', e: X.whatKicker, h: P.h1, p: P.lede, c: ['start-here', P.ctas[0][1]], h1: true },
    { img: 'carousel/c2', alt: lang === 'en' ? 'A woman kneeling by a bed at first light' : lang === 'pt' ? 'Mulher ajoelhada ao lado da cama ao amanhecer' : 'Mujer arrodillada junto a la cama al amanecer', e: X.roomKicker, h: X.roomH, p: X.roomP, c: ['prayer-room', X.roomCta] },
    { img: 'carousel/c3', alt: lang === 'en' ? 'A man at a kitchen table before sunrise with an open Bible and a notebook' : lang === 'pt' ? 'Homem à mesa da cozinha antes do amanhecer com Bíblia aberta e caderno' : 'Hombre en la mesa de la cocina antes del amanecer con Biblia abierta y cuaderno', e: FRONTS_INTRO[lang].kicker, h: FRONTS_INTRO[lang].h, p: FRONTS_INTRO[lang].lede, c: ['battle-plan', X.three[1][3]] },
    { img: 'carousel/c4', alt: lang === 'en' ? 'An older woman writing in a notebook while a younger woman watches' : lang === 'pt' ? 'Senhora escrevendo num caderno enquanto uma jovem observa' : 'Señora escribiendo en un cuaderno mientras una joven observa', e: LIFE.mentor[lang].h1, h: LIFE.mentor[lang].h1, p: LIFE.mentor[lang].lede, c: ['mentor', LIFE.mentor[lang].askH] },
    { img: 'carousel/c5', alt: lang === 'en' ? 'A wall covered in handwritten prayer cards in morning light' : lang === 'pt' ? 'Parede coberta de cartões de oração escritos à mão sob a luz da manhã' : 'Pared cubierta de tarjetas de oración escritas a mano bajo la luz de la mañana', e: X.thirtyKicker, h: X.thirtyH, p: X.thirtyP, c: ['31-days', X.thirtyCta] },
    { img: 'carousel/c6', alt: lang === 'en' ? 'Two parents praying in the doorway of a sleeping child\u2019s room' : lang === 'pt' ? 'Pais orando na porta do quarto de um filho que dorme' : 'Padres orando en la puerta del cuarto de un hijo dormido', e: X.gospelKicker, h: X.gospelH, p: X.gospelP, c: ['gospel', X.gospelCta] },
  ];
  const carousel = `<section class="hero-carousel" aria-roledescription="carousel" aria-label="Knee Battle">
<div class="car-track">${slides.map((s, i) => `<div class="car-slide${i === 0 ? ' active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${slides.length}">
${img(s.img, s.alt)}<div class="car-overlay"><div class="car-inner"><p class="eyebrow">${esc(s.e)}</p>${s.h1 ? `<h1>${esc(s.h)}</h1>` : `<h2>${esc(s.h)}</h2>`}<p>${esc(s.p)}</p>
<a class="btn btn-gold" href="${href(lang, s.c[0])}">${esc(s.c[1])} <span class="arr">→</span></a></div></div></div>`).join('')}</div>
<div class="car-nav"><button type="button" class="car-prev" aria-label="Previous">‹</button><button type="button" class="car-next" aria-label="Next">›</button></div>
<div class="car-dots">${slides.map((_, i) => `<button type="button" class="car-dot" aria-current="${i === 0 ? 'true' : 'false'}" aria-label="${i + 1}"></button>`).join('')}</div>
</section>`;

  const main = carousel +
`<section class="section"><div class="wrap">
${secHead(X.whatKicker, X.whatH, X.whatP)}
<div class="grid c3">${X.three.map(([h, p, s, c]) => `<a class="card card-link accent" href="${href(lang, s)}"><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="more">${esc(c)} <span class="arr">→</span></span></a>`).join('')}</div>
</div></section>

<section class="verse-band"><div class="wrap"><p class="eyebrow">${esc(S.UI.verseToday[lang])}</p><div id="votd"><p>${esc(av.t)}</p><cite>${esc(av.r)}</cite></div></div></section>

${photoFeature('prayer-room-closet', slides[1].alt, X.roomKicker, X.roomH, X.roomP, 'indigo', false, ['prayer-room', X.roomCta], lang)}

<section class="section soft"><div class="wrap">
${secHead(FRONTS_INTRO[lang].kicker, FRONTS_INTRO[lang].h, FRONTS_INTRO[lang].lede)}
<div class="front-grid">${FRONTS.map((f) => `<a class="front-card" href="${href(lang, 'battle-plan')}#f${f.id}" style="border-top-color:${f.hue}"><span class="front-num" style="background:${f.soft};color:${f.hue}">${f.id}</span><h3>${esc(f[lang].name)}</h3><p>${esc(f[lang].def)}</p></a>`).join('')}</div>
<div class="btn-row" style="margin-top:28px"><a class="btn btn-primary" href="${href(lang, 'battle-plan')}">${esc(X.three[1][3])} <span class="arr">→</span></a></div>
</div></section>

${photoFeature('days31-calendar', slides[4].alt, X.thirtyKicker, X.thirtyH, X.thirtyP, 'gold', true, ['31-days', X.thirtyCta], lang)}

<section class="section"><div class="wrap">
${secHead('', X.forWhoH, '')}
<div class="grid c3">${X.forWho.map(([h, p, s]) => `<a class="card card-link soft" href="${href(lang, s)}"><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="more">${esc(S.UI.readMore[lang])} <span class="arr">→</span></span></a>`).join('')}</div>
</div></section>

${photoFeature('gospel-open-door', lang === 'en' ? 'An open door with sunrise beyond it' : lang === 'pt' ? 'Uma porta aberta com o nascer do sol além dela' : 'Una puerta abierta con el amanecer detrás', X.gospelKicker, X.gospelH, X.gospelP, 'indigo', false, ['gospel', X.gospelCta], lang)}`;
  return page(lang, '', P.title, P.desc, main);
}

function startHerePage(lang) {
  const P = PAGES['start-here'][lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap"><div class="doors">
${P.doors.map((d) => `<div class="door"><h3>${esc(d.h)}</h3><p>${esc(d.p)}</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="${href(lang, d.href)}">${esc(d.cta)} <span class="arr">→</span></a></div></div>`).join('')}
</div>
<div class="note" style="margin-top:34px"><strong>${esc(P.afterH)}</strong> — ${esc(P.afterP)}</div>
</div></section>`;
  return page(lang, 'start-here', P.title, P.desc, main);
}

function prayerRoomPage(lang) {
  const P = PAGES['prayer-room'][lang];
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'HowTo', name: P.h1, description: P.desc,
    inLanguage: S.HTML_LANG[lang], totalTime: 'PT2H',
    step: P.spaces[0].steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
  })}</script>`;
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
<h2>${esc(P.whyH)}</h2><p>${esc(P.whyP)}</p>
<div class="scripture"><p>${esc(S.ANCHOR_VERSE[lang].t)}</p><cite>${esc(S.ANCHOR_VERSE[lang].r)}</cite></div>
</div></section>

<section class="section soft"><div class="wrap">
${secHead('', P.spacesH, '')}
<div class="room-tabs" role="tablist">${P.spaces.map((s, i) => `<button type="button" class="room-tab${i === 0 ? ' on' : ''}" data-r="${i}" role="tab" aria-selected="${i === 0}">${esc(s.n)}</button>`).join('')}</div>
${P.spaces.map((s, i) => `<div class="room-panel${i === 0 ? ' on' : ''}" id="room-${i}" role="tabpanel">
<div class="card"><span class="tier">${esc(s.tier)}</span><h3 style="margin-top:12px">${esc(s.n)}</h3><p><strong>${lang === 'en' ? 'What you need' : lang === 'pt' ? 'O que você precisa' : 'Lo que necesitas'}:</strong> ${esc(s.need)}</p>
<ol class="steps">${s.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></div></div>`).join('')}
<div class="btn-row no-print"><button type="button" class="btn btn-outline" data-print="1">${esc(S.UI.print[lang])}</button></div>
</div></section>

<section class="section"><div class="wrap">
<div class="photo-feature-grid" style="align-items:start">
<div class="photo-feature-photo">${img('cards-wall', lang === 'en' ? 'A wall of handwritten prayer cards' : lang === 'pt' ? 'Parede de cartões de oração escritos à mão' : 'Pared de tarjetas de oración escritas a mano')}</div>
<div><h2>${esc(P.wallH)}</h2>
${P.wall.map(([h, p]) => `<h3 style="margin-top:20px">${esc(h)}</h3><p>${esc(p)}</p>`).join('')}</div>
</div>
<div class="note" style="margin-top:30px"><strong>${esc(P.notH)}</strong> ${esc(P.notP)}</div>
</div></section>

<section class="section soft"><div class="wrap center">
${secHead('', P.ctaH, P.ctaP, true)}
<div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="${href(lang, 'cards')}">${esc(P.cta)} <span class="arr">→</span></a></div>
</div></section>`;
  return page(lang, 'prayer-room', P.title, P.desc, main, { extraLd: ld });
}

function battlePlanPage(lang) {
  const I = FRONTS_INTRO[lang], C = QUIZ_COPY[lang];
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'ItemList', name: I.h, inLanguage: S.HTML_LANG[lang],
    itemListElement: FRONTS.map((f) => ({ '@type': 'ListItem', position: f.id, name: f[lang].name, description: f[lang].def })),
  })}</script>`;
  const inline = `<script>window.KB_BASE=${JSON.stringify(base(lang))};window.KB_QUIZ=${JSON.stringify({
    items: QUIZ[lang], copy: C,
    fronts: Object.fromEntries(FRONTS.map((f) => [f.id, { name: f[lang].name, slug: f.slug }])),
  })};</script>`;
  const main = crumbs(lang, I.h) + hero(lang, I.kicker, I.h, I.lede) +
`<section class="section tight soft"><div class="wrap center">
${secHead('', C.h1, C.lede, true)}
<div class="btn-row" style="justify-content:center"><button type="button" class="btn btn-primary" id="quiz-start">${esc(C.start)} <span class="arr">→</span></button></div>
<p class="small" style="margin-top:14px">${esc(C.privacy)}</p>
</div></section>

<section class="section"><div class="wrap narrow">
${FRONTS.map((f) => { const d = f[lang]; return `<article class="front-block" id="f${f.id}">
<div class="front-head"><span class="front-num" style="background:${f.soft};color:${f.hue}">${f.id}</span><h2 style="font-size:30px">${esc(d.name)}</h2></div>
<p class="lead">${esc(d.def)}</p>
<div class="front-body">${esc(d.teach)}</div>
<ul class="front-verses">${d.verses.map((v) => `<li><cite>${esc(v.r)}</cite><span>${esc(v.t)}</span></li>`).join('')}</ul>
<div class="front-q"><p>${esc(d.question)}</p></div>
${prayerBox(lang, d.prayer)}
<div class="btn-row no-print"><a class="btn btn-outline btn-sm" href="${href(lang, 'cards')}?fronts=${f.id}">${esc(CARDS_COPY[lang].add)} <span class="arr">→</span></a></div>
</article>`; }).join('')}
</div></section>

<div class="quiz-modal" id="quiz-modal" role="dialog" aria-modal="true" aria-label="${esc(C.h1)}"><div class="quiz-panel" id="quiz-panel"></div></div>`;
  return page(lang, 'battle-plan', I.h + ' — Knee Battle', I.lede, main, { extraLd: ld, inline });
}

function cardsPage(lang) {
  const C = CARDS_COPY[lang];
  const fronts = Object.fromEntries(FRONTS.map((f) => [f.id, { name: f[lang].name, verse: f[lang].verses[0].t, ref: f[lang].verses[0].r }]));
  const inline = `<script>window.KB_BASE=${JSON.stringify(base(lang))};window.KB_CARDS=${JSON.stringify({ fronts, copy: C })};</script>`;
  const main = crumbs(lang, C.h1) + hero(lang, '', C.h1, C.lede) +
`<section class="section"><div class="wrap">
<div class="grid c2" style="align-items:start">
<form class="card-builder no-print" id="card-form">
<div class="field"><label for="c-name">${esc(C.nameL)}</label><input type="text" id="c-name" placeholder="${esc(C.namePh)}" required maxlength="60"/></div>
<div class="field"><label for="c-front">${esc(C.frontL)}</label><select id="c-front">${FRONTS.map((f) => `<option value="${f.id}">${f.id} — ${esc(f[lang].name)}</option>`).join('')}</select></div>
<div class="field"><label for="c-words">${esc(C.wordsL)}</label><textarea id="c-words" placeholder="${esc(C.wordsPh)}" maxlength="400"></textarea></div>
<div class="btn-row" style="margin-top:6px"><button type="submit" class="btn btn-primary">${esc(C.add)}</button>
<button type="button" class="btn btn-outline" id="card-print">${esc(C.printAll)}</button>
<button type="button" class="btn btn-outline" id="card-clear">${esc(C.clear)}</button></div>
<p class="small" style="margin-top:14px">${esc(C.privacy)}</p>
</form>
<div><div class="photo-feature-photo">${img('cards-wall', lang === 'en' ? 'Handwritten prayer cards on a wall' : lang === 'pt' ? 'Cartões de oração escritos à mão numa parede' : 'Tarjetas de oración escritas a mano en una pared')}</div>
<div class="note" style="margin-top:18px">${esc(C.tip)}</div></div>
</div>
<p class="small no-print" style="margin-top:32px"><b id="card-count">0</b> ${esc(C.count)}</p>
<div class="pcard-grid" id="card-list"></div>
</div></section>`;
  return page(lang, 'cards', C.title, C.desc, main, { inline });
}

function daysPage(lang) {
  const C = DAYS_COPY[lang];
  const days = DAYS.map((d) => ({ f: d.f, p: d[lang][0], v: d[lang][1], pr: d[lang][2] }));
  const inline = `<script>window.KB_BASE=${JSON.stringify(base(lang))};window.KB_DAYS=${JSON.stringify({
    days, copy: C, fronts: Object.fromEntries(FRONTS.map((f) => [f.id, { name: f[lang].name }])),
  })};</script>`;
  const main = crumbs(lang, C.h1) + hero(lang, '', C.h1, C.lede) +
`<section class="section"><div class="wrap">
<div class="btn-row no-print" style="margin-top:0;align-items:center"><span class="streak" id="day-streak"><b>0</b> ${esc(C.streak)}</span>
<button type="button" class="btn btn-outline btn-sm" id="day-print">${esc(C.printAll)}</button>
<button type="button" class="btn btn-outline btn-sm" id="day-reset">${esc(C.reset)}</button></div>
<p class="small no-print">${esc(C.how)}</p>
<div class="day-grid no-print" id="day-grid">${DAYS.map((d) => `<button type="button" class="day-cell" data-d="${d.d}" aria-pressed="false" aria-label="${esc(C.dayWord)} ${d.d}">${d.d}</button>`).join('')}</div>
<div class="day-panel" id="day-panel" style="display:none"></div>
</div></section>

<section class="section soft"><div class="wrap narrow prose">
<h2>${esc(C.dayWord)} 1 – 31</h2>
${DAYS.map((d) => { const e = d[lang], f = FRONTS[d.f - 1][lang]; return `<div class="card" style="margin-bottom:14px"><p class="eyebrow" style="margin-bottom:6px">${esc(C.dayWord)} ${d.d} · ${esc(f.name)}</p><h3>${esc(e[0])}</h3><div class="scripture" style="margin:14px 0 0"><p>${esc(e[2])}</p><cite>${esc(e[1])}</cite></div></div>`; }).join('')}
</div></section>`;
  return page(lang, '31-days', C.title, C.desc, main, { inline });
}

function howToPrayPage(lang) {
  const P = PAGES['how-to-pray'][lang], T = TIMER[lang];
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: S.HTML_LANG[lang],
    mainEntity: [{ '@type': 'Question', name: P.hearH, acceptedAnswer: { '@type': 'Answer', text: P.hearP } },
      { '@type': 'Question', name: P.firstH, acceptedAnswer: { '@type': 'Answer', text: P.firstP } }],
  })}</script>`;
  const inline = `<script>window.KB_TIMER=${JSON.stringify(T)};</script>`;
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
<h2>${esc(P.firstH)}</h2><p>${esc(P.firstP)}</p>
<h2>${esc(P.frameH)}</h2>
<div class="grid c2" style="margin:18px 0">${P.frames.map((f) => `<div class="card accent"><h3>${esc(f.n)}</h3><p>${esc(f.d)}</p></div>`).join('')}</div>
<h2>${esc(P.writeH)}</h2><p>${esc(P.writeP)}</p>
</div></section>

<section class="section soft"><div class="wrap narrow">
${secHead('', P.hearH, P.hearP)}
<div class="grid c2">${P.hear.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>

<section class="section"><div class="wrap narrow">
<div class="timer no-print" id="timer">
<h3>${esc(P.timerH)}</h3><p>${esc(P.timerP)}</p>
<div class="timer-step" id="t-step">${esc(T.steps[0][0])}</div>
<div class="timer-dial" id="t-dial">5:00</div>
<p id="t-prompt">${esc(T.steps[0][1])}</p>
<div class="btn-row"><select id="t-mins" aria-label="${esc(T.minutes)}"><option value="5">5 ${esc(T.minutes)}</option><option value="10">10 ${esc(T.minutes)}</option><option value="20">20 ${esc(T.minutes)}</option></select>
<button type="button" class="btn btn-gold" id="t-btn">${esc(T.start)}</button></div>
</div>
</div></section>`;
  return page(lang, 'how-to-pray', P.title, P.desc, main, { extraLd: ld, inline });
}

function gospelPage(lang) {
  const P = PAGES.gospel[lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.blocks.map((b) => `<h2>${esc(b.h)}</h2><p>${esc(b.p)}</p>`).join('')}
${prayerBox(lang, P.prayer)}
</div></section>

<section class="section soft"><div class="wrap">
${secHead('', P.nextH, '')}
<div class="grid c2">${P.next.map(([h, p]) => `<div class="card accent"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>

<section class="photo-feature indigo"><div class="wrap photo-feature-grid">
<div class="photo-feature-photo">${img('gospel-open-door', lang === 'en' ? 'An open door with sunrise beyond' : lang === 'pt' ? 'Porta aberta com o nascer do sol' : 'Puerta abierta con el amanecer')}</div>
<div><h2>${esc(P.baptismH)}</h2><p class="lead">${esc(P.baptismP)}</p>
<div class="btn-row"><a class="btn btn-primary" href="https://tothewaters.com" rel="noopener">${esc(P.baptismCta)} <span class="arr">→</span></a></div>
<h3 style="margin-top:30px">${esc(P.contactH)}</h3><p>${esc(P.contactP)}</p>
<div class="btn-row"><a class="btn btn-outline" href="mailto:info@cbaorlando.org">info@cbaorlando.org</a></div></div>
</div></section>`;
  return page(lang, 'gospel', P.title, P.desc, main);
}

function lifePage(lang, key) {
  const L = LIFE[key], P = L[lang], f = FRONTS[L.front - 1];
  const main = crumbs(lang, P.h1) + hero(lang, `${lang === 'en' ? 'Front' : lang === 'pt' ? 'Frente' : 'Frente'} ${L.front} — ${f[lang].name}`, P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.blocks.map((b) => `<h2>${esc(b.h)}</h2><p>${esc(b.p)}</p>`).join('')}
<h2>${esc(P.practiceH)}</h2>
<ol class="steps">${P.practice.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
${prayerBox(lang, P.prayer)}
${P.safetyH ? `<div class="caution" id="safety"><h3>${esc(P.safetyH)}</h3><p>${esc(P.safetyP)}</p>${L.sister ? `<div class="btn-row"><a class="btn btn-outline btn-sm" href="${L.sister}" rel="noopener">${esc(P.sisterCta)} <span class="arr">→</span></a></div>` : ''}</div>` : ''}
${L.cautionH ? '' : ''}
${P.cautionH ? `<div class="caution"><h3>${esc(P.cautionH)}</h3><p>${esc(P.cautionP)}</p></div>` : ''}
</div></section>

<section class="section soft"><div class="wrap narrow">
<div class="card accent"><p class="eyebrow i">${lang === 'en' ? 'Go deeper' : lang === 'pt' ? 'Aprofunde' : 'Profundiza'}</p>
<h3>${esc(f[lang].name)} — ${esc(f[lang].def)}</h3>
<div class="btn-row"><a class="btn btn-primary btn-sm" href="${href(lang, 'battle-plan')}#f${L.front}">${esc(S.UI.readMore[lang])} <span class="arr">→</span></a>
<a class="btn btn-outline btn-sm" href="${href(lang, 'cards')}?fronts=${L.front}">${esc(CARDS_COPY[lang].add)}</a>
<a class="btn btn-outline btn-sm" href="${href(lang, '31-days')}">${esc(DAYS_COPY[lang].h1)}</a></div></div>
</div></section>`;
  return page(lang, key === 'fasting' ? 'fasting' : key, P.title, P.desc, main);
}

function mentorPage(lang) {
  const P = LIFE.mentor[lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.blocks.map((b) => `<h2>${esc(b.h)}</h2><p>${esc(b.p)}</p>`).join('')}
</div></section>
<section class="section soft"><div class="wrap narrow">
${secHead('', P.outlineH, '')}
<div class="grid c2">${P.outline.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
<div class="narrow" style="width:100%;padding:0">${prayerBox(lang, P.prayer)}</div>
<div class="card gold"><h3>${esc(P.askH)}</h3><p>${esc(P.askP)}</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="mailto:info@cbaorlando.org">info@cbaorlando.org</a></div></div>
</div></section>`;
  return page(lang, 'mentor', P.title, P.desc, main);
}

function testimoniesPage(lang) {
  const P = INFO.testimonies[lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap">
<div class="grid c2">${P.stories.map((s) => `<div class="story"><span class="tag">${esc(s.tag)}</span><p>“${esc(s.t)}”</p></div>`).join('')}</div>
<div class="note" style="margin-top:30px"><strong>${esc(P.noteH)}</strong> ${esc(P.noteP)}</div>
</div></section>
<section class="section soft"><div class="wrap narrow center">
${secHead('', P.shareH, P.shareP, true)}
<div class="btn-row" style="justify-content:center"><a class="btn btn-primary" href="mailto:info@cbaorlando.org">info@cbaorlando.org</a></div>
</div></section>`;
  return page(lang, 'testimonies', P.title, P.desc, main);
}

function aboutPage(lang) {
  const P = INFO.about[lang];
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: S.HTML_LANG[lang],
    mainEntity: P.sections.slice(0, 5).map((s) => ({ '@type': 'Question', name: s.h, acceptedAnswer: { '@type': 'Answer', text: s.p } })),
  })}</script>`;
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.sections.map((s, i) => `<h2${i === 5 ? ' id="safety"' : ''}>${esc(s.h)}</h2><p>${esc(s.p)}</p>`).join('')}
<div class="caution" style="margin-top:30px"><h3>${esc(S.NO_PROMISE[lang].split('.')[0])}.</h3><p>${esc(S.SAFETY_LINE[lang])}</p></div>
<h2>${esc(P.contactH)}</h2><p>${esc(P.contactP)}</p>
<div class="btn-row"><a class="btn btn-primary" href="mailto:info@cbaorlando.org">info@cbaorlando.org</a><a class="btn btn-outline" href="${href(lang, 'inspired-by')}">${esc(INFO['inspired-by'][lang].h1)} <span class="arr">→</span></a></div>
</div></section>`;
  return page(lang, 'about', P.title, P.desc, main, { extraLd: ld });
}

function inspiredPage(lang) {
  const P = INFO['inspired-by'][lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.body.map((p) => `<p>${esc(p)}</p>`).join('')}
<div class="caution"><h3>${esc(P.disclaimerH)}</h3><p>${esc(P.disclaimer)}</p></div>
<h2>${esc(P.ctaH)}</h2><p>${esc(P.ctaP)}</p>
<div class="btn-row"><a class="btn btn-primary" href="${href(lang, 'battle-plan')}">${esc(P.cta)} <span class="arr">→</span></a></div>
</div></section>`;
  return page(lang, 'inspired-by', P.title, P.desc, main);
}

function resourcesPage(lang) {
  const R = RESOURCES[lang];
  const embed = `<script src="https://kneebattle.com/widget/kb-card.js" data-lang="${lang}"></script>`;
  const main = crumbs(lang, R.h1) + hero(lang, '', R.h1, R.lede) +
`<section class="section"><div class="wrap">
${secHead('', R.printH, '')}
<div class="grid c2">${R.print.map(([h, p, s]) => `<a class="card card-link accent" href="${href(lang, s)}"><h3>${esc(h)}</h3><p>${esc(p)}</p><span class="more">${esc(S.UI.readMore[lang])} <span class="arr">→</span></span></a>`).join('')}</div>
</div></section>

<section class="section soft"><div class="wrap narrow">
${secHead('', R.embedH, R.embedP)}
<div class="embed-box" id="embed-code">${esc(embed)}</div>
<div class="btn-row"><button type="button" class="btn btn-outline btn-sm" data-copy="embed-code">${lang === 'en' ? 'Copy' : lang === 'pt' ? 'Copiar' : 'Copiar'}</button></div>
</div></section>

<section class="section"><div class="wrap">
${secHead('', R.booksH, R.booksP)}
<div class="grid c2">${R.books.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>

<section class="section soft"><div class="wrap">
${secHead('', R.familyH, R.familyP)}
<div class="grid c4">${S.FAMILY.filter((f) => !f.url.includes('kneebattle')).map((f) => `<a class="card card-link" href="${f.url}" rel="noopener"><h3 style="font-size:17px"><i class="dot" style="--c:${f.dot};margin-right:8px"></i>${esc(f[lang])}</h3><p class="small">${f.url.replace('https://', '')}</p></a>`).join('')}</div>
</div></section>`;
  return page(lang, 'resources', R.title, R.desc, main);
}

function legalPage(lang, key) {
  const P = LEGAL[key][lang];
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow prose">
${P.body.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join('')}
</div></section>`;
  return page(lang, key, P.title, P.desc, main);
}

function sitemapPage(lang) {
  const P = LEGAL.sitemap[lang];
  const label = (s) => {
    const n = S.NAV.find((x) => x.href === s); if (n) return n[lang];
    if (s === '') return S.UI.home[lang];
    if (PAGES[s]) return PAGES[s][lang].h1;
    if (LIFE[s]) return LIFE[s][lang].h1;
    if (INFO[s]) return INFO[s][lang].h1;
    if (LEGAL[s]) return LEGAL[s][lang].h1;
    if (s === 'cards') return CARDS_COPY[lang].h1;
    if (s === '31-days') return DAYS_COPY[lang].h1;
    if (s === 'resources') return RESOURCES[lang].h1;
    if (s === 'battle-plan') return FRONTS_INTRO[lang].h;
    return s;
  };
  const main = crumbs(lang, P.h1) + hero(lang, '', P.h1, P.lede) +
`<section class="section"><div class="wrap narrow">
<ul class="sitemap-list">${SLUGS.map((s) => `<li><a href="${href(lang, s)}">${esc(label(s))}</a> <span class="small">${esc(href(lang, s))}</span></li>`).join('')}</ul>
<h2 style="margin-top:36px">${esc(S.UI.langLabel[lang])}</h2>
<ul class="sitemap-list">${S.LANGS.map((l) => `<li><a href="${base(l)}" hreflang="${S.HTML_LANG[l]}">${l === 'en' ? 'English' : l === 'pt' ? 'Português' : 'Español'}</a> <span class="small">${S.BASE + base(l)}</span></li>`).join('')}</ul>
</div></section>`;
  return page(lang, 'sitemap', P.title, P.desc || P.lede, main);
}

/* ---------------- assets & meta ---------------- */
function copyDir(src, dst) {
  if (!existsSync(src)) return 0;
  mkdirSync(dst, { recursive: true });
  let n = 0;
  for (const e of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, e.name), d = join(dst, e.name);
    if (e.isDirectory()) n += copyDir(s, d);
    else { copyFileSync(s, d); n++; }
  }
  return n;
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="9" fill="#2E1F6B"/><path d="M13 9h11a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H13z" fill="#221650"/><path d="M26 11.5 33 8v24l-7-3.5z" fill="#F0B429"/><circle cx="23.2" cy="20" r="1.2" fill="#F0B429"/><path d="M9 31h6" stroke="#F0B429" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function sitemapXml() {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [];
  for (const s of SLUGS) for (const l of S.LANGS) {
    urls.push(`<url><loc>${url(l, s)}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${s === '' ? '1.0' : '0.8'}</priority>` +
      S.LANGS.map((x) => `<xhtml:link rel="alternate" hreflang="${S.HTML_LANG[x]}" href="${url(x, s)}"/>`).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${url('en', s)}"/></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>`;
}

function headers() {
  return `/assets/*
  Cache-Control: public, max-age=3600
/widget/*
  Cache-Control: public, max-age=3600
  Access-Control-Allow-Origin: *
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'
`;
}

function feed(lang) {
  const items = FRONTS.map((f) => `<item><title>${esc(f[lang].name)}</title><link>${url(lang, 'battle-plan')}#f${f.id}</link><guid isPermaLink="false">kb-front-${f.id}-${lang}</guid><description>${esc(f[lang].def)}</description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Knee Battle — ${S.BRAND.tagline[lang]}</title><link>${S.BASE + base(lang)}</link>
<description>${esc(PAGES.home[lang].desc)}</description><language>${S.HTML_LANG[lang]}</language>
<atom:link href="${S.BASE}/feed${lang === 'en' ? '' : '-' + lang}.xml" rel="self" type="application/rss+xml"/>
${items}</channel></rss>`;
}

function widget() {
  const data = {};
  for (const l of S.LANGS) data[l] = FRONTS.map((f) => ({ n: f[l].name, v: f[l].verses[0].t, r: f[l].verses[0].r }));
  return `/* Knee Battle prayer card widget — kneebattle.com. Zero dependencies. */
(function(){var D=${JSON.stringify(data)};
var s=document.currentScript,l=(s&&s.getAttribute('data-lang'))||'en';if(!D[l])l='en';
var i=new Date().getDate()%D[l].length,c=D[l][i];
var h=document.createElement('div');var r=h.attachShadow?h.attachShadow({mode:'open'}):h;
r.innerHTML='<style>*{box-sizing:border-box}.kb{font:15px/1.6 system-ui,sans-serif;background:#fff;border:1px solid #e6e4f0;border-left:5px solid #F0B429;border-radius:10px;padding:18px;max-width:340px;color:#171528}.kb b{display:block;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#2E1F6B;margin-bottom:6px}.kb q{display:block;font-style:italic;color:#3a3559;quotes:none}.kb cite{display:block;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#2E1F6B;margin-top:8px}.kb a{display:inline-block;margin-top:12px;font-size:13px;font-weight:700;color:#2E1F6B;text-decoration:none}</style>'+
'<div class="kb"><b>'+c.n+'</b><q>'+c.v+'</q><cite>'+c.r+'</cite><a href="https://kneebattle.com" target="_blank" rel="noopener">Knee Battle →</a></div>';
if(s&&s.parentNode)s.parentNode.insertBefore(h,s);})();`;
}

/* ---------------- run ---------------- */
mkdirSync(OUT, { recursive: true });
let count = 0;
const w = (lang, slug, html) => { out(join(base(lang).slice(1), slug, 'index.html'), html); count++; };

for (const lang of S.LANGS) {
  w(lang, '', homePage(lang));
  w(lang, 'start-here', startHerePage(lang));
  w(lang, 'prayer-room', prayerRoomPage(lang));
  w(lang, 'battle-plan', battlePlanPage(lang));
  w(lang, 'cards', cardsPage(lang));
  w(lang, '31-days', daysPage(lang));
  w(lang, 'how-to-pray', howToPrayPage(lang));
  w(lang, 'marriage', lifePage(lang, 'marriage'));
  w(lang, 'children', lifePage(lang, 'children'));
  w(lang, 'fear', lifePage(lang, 'fear'));
  w(lang, 'provision', lifePage(lang, 'provision'));
  w(lang, 'fasting', lifePage(lang, 'fasting'));
  w(lang, 'mentor', mentorPage(lang));
  w(lang, 'testimonies', testimoniesPage(lang));
  w(lang, 'gospel', gospelPage(lang));
  w(lang, 'about', aboutPage(lang));
  w(lang, 'resources', resourcesPage(lang));
  w(lang, 'inspired-by', inspiredPage(lang));
  w(lang, 'contact', legalPage(lang, 'contact'));
  w(lang, 'privacy', legalPage(lang, 'privacy'));
  w(lang, 'terms', legalPage(lang, 'terms'));
  w(lang, 'sitemap', sitemapPage(lang));
  out(join(base(lang).slice(1), 'feed.xml'), feed(lang));
}

out('favicon.svg', favicon());
out('sitemap.xml', sitemapXml());
out('_headers', headers());
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${S.BASE}/sitemap.xml\n`);
out('widget/kb-card.js', widget());
out('feed.xml', feed('en'));
out('feed-pt.xml', feed('pt'));
out('feed-es.xml', feed('es'));

const assets = copyDir(join(ROOT, 'static/assets'), join(OUT, 'assets'));
console.log(`built: ${count} pages across ${S.LANGS.length} languages, ${assets} asset files`);
console.log(`pages per language: ${count / S.LANGS.length}`);
