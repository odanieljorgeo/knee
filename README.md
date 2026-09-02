# Knee Battle — [kneebattle.com](https://kneebattle.com)

**Every battle is won on your knees.**

A free, trilingual (EN / PT / ES) prayer-strategy resource — the ninth site in the
[CBA Orlando](https://cbaorlando.org) ministry family.

Knee Battle is a practical field manual for prayer: how to build a prayer room in an afternoon
(a closet, a corner, or a parked car), ten fronts where life actually gets attacked, a 31-day
plan, and words for the nights you have none. Everything is free, has no login, and can be
printed, copied, and given away.

**Live site → [https://kneebattle.com](https://kneebattle.com)**

---

## What's here

| | |
|---|---|
| **Pages** | 22 page types × 3 languages = 66 URLs |
| **Languages** | English (root), Português (`/pt/`), Español (`/es/`) |
| **Stack** | Pure HTML / CSS / JS — no framework, no runtime dependencies |
| **Build** | Custom Node ESM static-site generator (`static/build.mjs`) |
| **Hosting** | Cloudflare Pages |
| **Storage** | `localStorage` only — nothing is ever uploaded |

### The Ten Fronts

An original, Scripture-derived framework: **The Fire · The Target · The Name · The House ·
The Ledger · The Night · The Eyes · The Weight · The Wound · The Table.**
Each has a teaching, Scripture, an honest question, and a written prayer, in three languages.

### Interactive modules (all client-side)

- Hero carousel with reduced-motion support
- Ten Fronts assessment — 30 statements, modal quiz, ranked result
- Prayer card builder — printable 4×6 cards for your prayer wall
- 31-day tracker with streak counter
- Guided prayer timer (PRAY: Praise · Repent · Ask · Yes)
- Prayer-room space picker with printable checklist
- Embeddable prayer-card widget (`/widget/kb-card.js`) — Shadow DOM, zero dependencies

---

## Build and deploy

```bash
node static/build.mjs                                    # → site/
npx wrangler pages deploy site --project-name=knee --branch=main --commit-dirty=true
```

**Never edit `site/`** — it is generated output. All source lives in `static/`.

```
static/
  build.mjs              the generator
  data/
    site.mjs             config, chrome, family bar, legal blocks
    fronts.mjs           the Ten Fronts, trilingual
    pages.mjs            home, start-here, prayer-room, how-to-pray, gospel
    pages2.mjs           life pages (marriage, children, fear, provision, fasting, mentor) + about
    extras.mjs           31 days, assessment, card builder, resources, legal
  assets/css/site.css    design system
  assets/js/site.js      all interactive modules
  assets/img/            illustrations
```

---

## Editorial guardrails

These are enforced, not aspirational:

- **No outcome promises.** Nothing here says prayer will save a marriage, heal a body, or change
  a spouse. Obedience is ours; results are God's.
- **Christ-centred, not devil-centred.** No demon dialogue, no deliverance scripts, no
  generational-curse teaching, no ritual language.
- **Prayer is never presented as a substitute for help.** Pages touching marriage, fear, money,
  and health carry explicit safety and medical routing.
- **Original content only.** All writing, frameworks, and imagery are original to CBA Orlando.

---

## Independence and non-affiliation

This independent educational website is a ministry of CBA Orlando. It is not an official website
of the Seventh-day Adventist Church's General Conference, a union, conference, or local
congregation, and it is not endorsed by those organizations.

Knee Battle is **not affiliated with, endorsed by, or connected to** Kendrick Brothers
Productions, Provident Films, Affirm Films, TriStar Pictures, or Sony Pictures Releasing.

---

Published by **Comunidade Brasileira Inc** (CBA Orlando) · Orlando, Florida · info@cbaorlando.org · 321-689-2973
