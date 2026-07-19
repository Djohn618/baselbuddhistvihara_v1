# CLAUDE.md — Basel Buddhist Vihara

This file is read automatically by Claude Code at the start of every session.
Always follow these rules and conventions throughout the entire project.

---

## Project Overview

**Project:** Basel Buddhist Vihara — full website redesign
**Domain:** baselbuddhistvihara.ch (hosted on Cyon.ch, Apache server)
**Repo:** https://github.com/Djohn618/baselbuddhistvihara.git
**Design reference:** Plum Village (plumvillage.org) + Aether Atlas — calm, minimal, warm, spiritual
**Languages:** German (de, DEFAULT), English (en), Sinhala (si)

---

## Tech Stack — STRICT RULES

- Vanilla HTML, CSS, JavaScript ONLY
- NO Bootstrap, NO jQuery, NO React, NO Tailwind, NO Formspree, NO external CSS frameworks
- Lucide Icons (CDN) is the ONLY allowed external library for icons
- PHP only for contact.php (contact form handler)
- No emojis anywhere — use Lucide icons instead
- Google Fonts allowed: Cormorant Garamond (headings) + Inter (body)

---

## Folder Structure

baselbuddhistvihara/
├── index.html                  # Main single-page file
├── contact.php                 # PHP contact form handler (Cyon)
├── .htaccess                   # Apache config (HTTPS, caching, GZIP)
├── robots.txt
├── sitemap.xml
├── 404.html
├── CLAUDE.md                   # This file
├── README.md                   # GitHub documentation
├── assets/
│   ├── css/
│   │   ├── style.css           # Main stylesheet
│   │   └── fonts.css           # Google Fonts imports
│   ├── js/
│   │   ├── main.js             # Main JS (animations, lightbox, scroll)
│   │   └── i18n.js             # Language switcher logic
│   └── images/
│       ├── logo/               # V2.png (SKBZ logo)
│       ├── hero/               # Hero images (real photos come later)
│       ├── about/              # Temple/monk photos (real photos come later)
│       └── gallery/            # Gallery photos (real photos come later)
└── data/
    └── translations.json       # All text content in DE, EN, SI

---

## Design System

Colors (CSS custom properties in style.css):
--color-primary:     #6B2737   (dark burgundy)
--color-secondary:   #C9922A   (warm gold)
--color-accent:      #E8762B   (saffron orange — from logo)
--color-bg-light:    #FAF7F2   (warm off-white)
--color-bg-paper:    #F5ECD7   (aged parchment)
--color-bg-dark:     #1A1A1A   (near black)
--color-text-dark:   #2C2C2C
--color-text-muted:  #6B6B6B
--color-border-light:#E8E0D5
--color-gold-border: rgba(180,140,80,0.25)

Typography:
- Headings: Cormorant Garamond (elegant, spiritual)
- Body: Inter (clean, modern)

Key CSS class — .paper-card (used on cards, fact rows, contact info):
Warm parchment texture — NOT AI-looking, NOT digital-flat.
background: #F5ECD7 with subtle repeating-linear-gradient texture
border: 1px solid rgba(180,140,80,0.25)
box-shadow: inset soft warm shadow + outer soft shadow

---

## Icons — Lucide Only, No Emojis

Add to index.html before </body>:
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>lucide.createIcons();</script>

Icon reference:
  map-pin          → address
  phone            → phone number
  mail             → email
  clock            → opening hours
  calendar-check   → appointment notice
  wind             → meditation
  moon             → poya program
  heart-handshake  → dana / donations
  star             → ceremony
  calendar         → events
  landmark         → founding date
  user             → person / monk
  users            → community / group
  book-open        → dhamma / teaching
  play-circle      → video / youtube
  arrow-right      → link / CTA
  facebook         → facebook social
  youtube          → youtube social
  home             → home visits
  menu             → hamburger (mobile nav)
  x                → close button
  chevron-down     → scroll down arrow
  chevron-up       → back to top
  chevron-left     → previous
  chevron-right    → next

Icon CSS:
  .lucide          { width:20px; height:20px; stroke:#C9922A; stroke-width:1.5; fill:none; }
  .lucide-lg       { width:28px; height:28px; }
  .lucide-white    { stroke:#FAF7F2; }
  .lucide-dark     { stroke:#2C2C2C; }

---

## Multilingual System

File: data/translations.json
All text content in 3 languages with keys like: "hero.tagline", "about.title", etc.

HTML elements: data-i18n="key.name"
JS file: assets/js/i18n.js reads translations.json and updates all data-i18n elements
Default language: de (Deutsch)
Saved in: localStorage key "bbv-lang"
Language switcher buttons: DE | EN | සිං
Active language: bold + color #E8762B

---

## Page Sections (in order, all in index.html)

1.  #home          → Hero (split layout: text left, image right)
2.  #ueber-uns     → About Us (two-column, paper-card facts)
3.  #programme     → Programs & Events (card carousel, 6 cards)
4.  #dhamma        → Dhamma Dana / YouTube (4 video placeholder cards)
5.  #galerie       → Gallery (masonry grid, lightbox)
6.  #spenden       → Donations (dark bg, bank details, 2 cards)
7.  #kontakt       → Contact (Google Maps, PHP form)
                   → Footer

---

## Contact Form

File: contact.php
Sends to: ariyaseela@gmail.com
Method: PHP mail()
Honeypot field: name="website" (hidden, if filled → discard)
On success: redirect index.html?success=1
On error: redirect index.html?error=1
JS in main.js checks URL params and shows message

---

## Real Content (do not change these)

Address:    Feldbergstrasse 142, 4057 Basel, Switzerland
Phone:      +41 792 303 699
Email:      ariyaseela@gmail.com
Founded:    July 1, 2024
Opened:     July 6, 2024 (5 monks, ~30 attendees)
Head Monk:  Ven. Udumaththe Ariyaseela Thero
President:  Fabienne Eglin
Founder:    Most Ven. Dr. Walpola Kalyanatissa Nayaka Thero (passed away June 12, 2024)

Bank account (SKBZ):
  Holder:   Sri Kalyana Buddhistisches Zentrum (SKBZ)
  IBAN:     CH05 8080 8009 7919
  Type:     Vereinskonto / CHF
  Address:  Neugrabenweg 29, 5702 Niederlenz

Google Maps embed src:
  https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.1213891651228!2d7.594330377081455!3d47.56718479069762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b9537b349647%3A0x7032a3cb4e594aaa!2sBasel%20Buddhist%20Vihara!5e1!3m2!1sen!2sch!4v1784121869506!5m2!1sen!2sch

---

## Placeholders (real content comes later)

All images are placeholders for now. When adding a placeholder:
- Use a warm CSS gradient (e.g. linear-gradient(135deg, #2C1810, #6B2737, #C9922A))
- Always add a comment: <!-- replace with real image: assets/images/FOLDER/filename.jpg -->

Placeholder locations:
- Hero image:    assets/images/hero/hero-1.jpg
- About image:   assets/images/about/temple.jpg
- Gallery:       assets/images/gallery/photo-1.jpg through photo-N.jpg
- YouTube links: real URLs come later (use href="#" for now)
- Social media:  Facebook + YouTube URLs come later (use href="#" for now)

---

## Git Commit Rules

- Always commit in English
- Commit after each completed stable phase
- Commit message format: short imperative sentence
  Examples:
    "Add hero section split layout"
    "Add navigation with language switcher"
    "Fix responsive design for all breakpoints"

---

## Responsive Breakpoints

Mobile:       375px
Mobile L:     414px
Tablet:       768px
Laptop:       1024px
Desktop:      1280px
Wide:         1440px+

Rules:
- Mobile-first CSS
- All touch targets minimum 44px height
- No horizontal scroll at any breakpoint
- Font sizes use clamp() where helpful

---

## Deployment (Cyon.ch)

- Hosting: Cyon.ch, Apache server
- Upload all files to: public_html/
- SSL: Let's Encrypt via Cyon panel
- .htaccess handles: HTTPS redirect, GZIP, browser caching, deny data/*.json access
