# CLAUDE.md — Basel Buddhist Vihara

This file is read automatically by Claude Code at the start of every session.
Always follow these rules and conventions throughout the entire project.

---

## Project Overview

**Project:** Basel Buddhist Vihara — full website redesign
**Owner:** SKBZ (Sri Kalyana Buddhistisches Zentrum). Developer: Deshan (apprentice, explain simply)
**Domain:** baselbuddhistvihara.ch (registered at Cyon.ch)
**Hosting:** Vercel (free), deployed from the GitHub repo. No PHP on the server.
**Repo:** https://github.com/Djohn618/baselbuddhistvihara.git
**Design reference:** plumvillage.org, ibf-geneva.org — calm, minimal, warm, spiritual, modern
**Languages:** German (de, DEFAULT), English (en), Sinhala (si)

---

## Tech Stack — STRICT RULES

- Vanilla HTML, CSS, JavaScript ONLY
- NO Bootstrap, NO jQuery, NO React, NO Tailwind, NO Swiper, NO external CSS frameworks
- Lucide Icons (CDN, pinned version) is the ONLY allowed external library
- Contact form posts to Formspree via AJAX (no PHP)
- No emojis anywhere (UI, translations, footer) — use Lucide icons or plain text
- Google Fonts allowed: Cormorant Garamond (headings) + Inter (body)

---

## Folder Structure

baselbuddhistvihara/
├── index.html                  # Main single-page file
├── CLAUDE.md                   # This file
├── README.md                   # GitHub documentation
├── monks/
│   ├── kalyanatissa.html       # Founder detail page
│   └── ariyaseela.html         # Head monk detail page
├── assets/
│   ├── css/
│   │   ├── style.css           # Main stylesheet
│   │   └── fonts.css           # Google Fonts import
│   ├── js/
│   │   ├── main.js             # Nav, hero slideshow, carousel, monks, form, dropdown
│   │   ├── moonstone.js        # Draws the Sandakada Pahana line-art ornament
│   │   ├── i18n.js             # Language switcher logic
│   │   └── gallery.js          # Gallery lightbox
│   └── images/
│       ├── logo/               # V2.png (SKBZ logo, also used as favicon)
│       ├── hero/               # Home_page.png, Budda.png, our_monk.png
│       ├── other/              # Walpola_Maha Thero.jpg
│       ├── monks/              # monk portraits (ariyaseela.jpg still missing)
│       ├── about/              # about collage photos (pending)
│       └── gallery/            # photo-1.jpg ... photo-N.jpg (pending)
└── data/
    ├── translations.json       # All text content in DE, EN, SI
    └── monks.json              # Monk cards (new monk = new object)

Not yet created: robots.txt, sitemap.xml, 404.html, vercel.json.

---

## Design System

Colors (CSS custom properties in style.css):
--color-primary:     #6B2737   (burgundy — headings, buttons)
--color-secondary:   #C9922A   (warm gold — labels, lines, icons, links)
--color-accent:      #E8762B   (saffron — active language only)
--color-bg-light:    #FAF7F2   (warm off-white — main background, footer)
--color-bg-soft:     #F4EEE3   (alternating section background)
--color-bg-paper:    #F5ECD7   (aged parchment)
--color-text-dark:   #2C2C2C
--color-text-muted:  #6B6B6B
--color-border-light:#E8E0D5
--color-gold-border: rgba(180,140,80,0.25)

Section backgrounds alternate: about (light) → monks (soft) → programs (light)
→ youtube (soft) → gallery (light) → contact (soft) → footer (light).
No dark sections. The whole site is light and calm.

Typography:
- Headings: Cormorant Garamond, weight 500–600, burgundy
- Body: Inter

Shared building blocks (reuse these, do not invent new variants):
- Section header: `.section-head` > `.section-head__label` (small gold uppercase)
  + `.section-head__title` (serif, burgundy, short gold line underneath)
- Cards: white, `border: var(--border-soft)`, `border-radius: var(--radius-lg)`,
  `box-shadow: var(--shadow-soft)`, hover lifts 4px with `var(--shadow-lift)`
- Buttons: pill shaped (`var(--radius-full)`), burgundy outline or fill
- Placeholders: `var(--ph-1)`, `var(--ph-2)`, `var(--ph-3)` (soft parchment gradients)
- Spacing: every section uses `padding-block: var(--section-padding-y)`
- Sandakada Pahana (moonstone): fine gold line-art half moonstone drawn by
  assets/js/moonstone.js into any `<div class="moonstone" data-moonstone>`.
  Used at the "entrance" (bottom of the hero text column) and the "exit"
  (footer, with the caption key moonstone.caption). Rings: fire, beads,
  creeper, slowly turning swans (hamsa), lotus petals, lotus centre.
  Lines draw in when visible. Keep it rare: two places only.
- Motion: slow and calm. `var(--ease-calm)`, ~0.6–1s. `.fade-in` on scroll,
  hero text rises in, hero slides crossfade with a gentle zoom.
  `prefers-reduced-motion` disables all of it.

---

## Icons — Lucide Only, No Emojis

Loaded before </body> (pinned version, do not use @latest):
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>
  <script>lucide.createIcons();</script>

Use current icon names (old aliases like check-circle, play-circle, home are deprecated):
  map-pin, phone, mail, clock, calendar-check, wind (meditation), moon (poya),
  heart-handshake (dana), star (ceremony), house (home visits), circle-check,
  circle-play, arrow-right, arrow-up-right, arrow-left,
  menu, x, chevron-down/left/right

Facebook/YouTube logos in the footer are inline SVG (Lucide has no brand icons).

---

## Multilingual System

File: data/translations.json (keys like "hero.description", "contact.form.success")
HTML: data-i18n="key" (text), data-i18n-html="key" (text with inline links),
      data-i18n-attr="attr:key|attr:key"
JS: assets/js/i18n.js loads the JSON, updates all elements, sets <html lang>,
    and dispatches the "i18n:change" event (monk cards and the subject dropdown listen to it).
Public API: window.i18n.t(key), window.i18n.setLanguage(lang), window.i18n.getLanguage()
Default language: de. Saved in localStorage key "bbv_lang".
Switcher: DE | EN | සිං — active language bold + #E8762B
Every visible text must exist in all 3 languages. Sinhala was machine-written
and needs review by a native speaker.

---

## Page Sections (in order, all in index.html)

NAV (fixed):
- ≥1280px: 58/42 split mirroring the hero. Left: logo + name. Right: language
  switcher, Spenden button, divider, links Kontakt | Galerie | Events | Über | Home.
  Transparent over the hero, turns #FAF7F2 after scrolling (site-header--scrolled).
- <1280px: one light bar with logo (+ name from 480px), DE|EN|සිං and hamburger.
  Links and Spenden button are in the full-screen light overlay.

1.  #home      → Hero: 58% image slideshow (3 slides, 5s) left, 42% text right.
                 Phones: image on top, text below. Keep the hard left/right edge.
2.  #about     → Stats bar, image collage + text + bullets, founder + leadership
3.  #monks     → Cards rendered by JS from data/monks.json, links to monks/*.html
                 (monk names are { de, en, si }; detail page texts use monkPages.* keys)
4.  #programs  → Tabs "Programme | Veranstaltungen", carousel (arrows on desktop,
                 2 square cards + swipe + one-time swipe hint on phones)
5.  #youtube   → Dhamma Dana, 4 placeholder video cards
6.  #gallery   → 8 placeholders, lightbox (gallery.js)
7.  #contact   → Contact rows + appointment note + map (left), form card (right)
FOOTER         → Light, centered: moonstone + caption, logo, tagline, link row,
                 address · phone · email, social icons, copyright (year set by JS)

The Donations section was removed on purpose. Do not re-add it without asking
(planned later: bank details + TWINT/PayPal).

---

## Contact Form

Formspree via AJAX (fetch) in main.js. Action URL in index.html:
  https://formspree.io/f/YOUR_FORMSPREE_ID   ← placeholder, real ID pending
Honeypot field: name="_gotcha" (hidden)
Success/error messages come from contact.form.success / contact.form.error.
Subject uses a custom dropdown (keyboard accessible) writing to a hidden input.

---

## Real Content (do not change these)

Address:    Feldbergstrasse 142, 4057 Basel, Switzerland
Phone:      +41 792 303 699
Email:      ariyaseela@gmail.com (will become info@baselbuddhistvihara.ch once
            the owner confirms the Zoho mailbox works — do not change before)
SKBZ founded: March 17, 2021
Vihara founded: July 1, 2024. Opened: July 6, 2024 (5 monks, ~30 attendees)
Head Monk + Treasurer: Ven. Udumaththe Ariyaseela Thero
Secretary:  Ven. Henegama Sobitha Thero
President:  Fabienne Eglin. Vice president: Michael Joel Anneler
Founder:    Most Ven. Dr. Walpola Kalyanatissa Nayaka Thero
            (passed away June 12, 2024, Geneva International Buddhist Center)

Bank account (SKBZ, for the future donation section):
  Holder:   Sri Kalyana Buddhistisches Zentrum (SKBZ)
  IBAN:     CH05 8080 8009 7919
  Type:     Vereinskonto / CHF
  Address:  Neugrabenweg 29, 5702 Niederlenz

Unverified (Vihara must confirm): opening hours "daily 7:00–18:30", stats
numbers, founder birth date, bullet texts.

Google Maps: keep the embed URL that is in index.html.

---

## Placeholders (real content comes later)

When adding a placeholder:
- Use the soft placeholder tokens (var(--ph-1/2/3)), not dark gradients
- Always add a comment: <!-- replace with real image: assets/images/FOLDER/filename.jpg -->
- Real photos: object-fit: cover, real alt text

Pending: new temple photos (owner has them), Ariyaseela portrait, gallery,
about collage, YouTube video links, Facebook + YouTube URLs (href="#" for now;
main.js stops href="#" links from jumping to the top).

---

## Git Commit Rules

- Always commit in English
- Commit after each completed stable phase
- Commit message format: short imperative sentence

---

## Responsive Breakpoints

Mobile 375px · Mobile L 414px · Tablet 768px · Laptop 1024px · Desktop 1280px · Wide 1440px+

Rules:
- All touch targets minimum 44px
- No horizontal scroll at any breakpoint
- Check the desktop nav at exactly 1280px in all 3 languages (it is tight)
- Verify visual fixes in the browser at 375px, 1024px and 1280px+

---

## Deployment

- Vercel, deployed from GitHub (main branch)
- Domain DNS at Cyon: when adding the Vercel A/CNAME records, NEVER delete the
  MX, SPF, DKIM or TXT records (Zoho Mail)
