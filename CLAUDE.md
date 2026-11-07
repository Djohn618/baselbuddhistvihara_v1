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
├── 404.html                    # Not-found page (absolute /paths, served by Vercel)
├── donate.html                 # Donation page (Swiss QR bill + bank details)
├── legal.html                  # Impressum + privacy policy on one page (noindex)
├── community.html              # All community event albums, grouped by year
├── event.html                  # One album: event.html?id=<event id>
├── robots.txt
├── sitemap.xml                 # add new pages here
├── vercel.json                 # security headers + asset caching
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
│   │   ├── settings.js         # On/off switches (e.g. poyaProgram: true/false)
│   │   ├── main.js             # Nav, hero slideshow, carousel, monks, form, dropdown
│   │   ├── moonstone.js        # Draws the Sandakada Pahana line-art ornament
│   │   ├── i18n.js             # Language switcher logic
│   │   ├── events.js           # Community albums (home strip, community, event pages)
│   │   └── gallery.js          # Gallery lightbox
│   └── images/
│       ├── og-image.jpg        # 1200x630 share preview (WhatsApp/Facebook)
│       ├── logo/               # logo.png (favicon, apple-touch, JSON-LD) + logo-160.webp (on page)
│       ├── vihara/             # real temple photos, each as <name>-1600.webp + <name>-800.webp
│       │                       # (hero, about collage, program cards, gallery all use these)
│       ├── monks/              # monk portraits <name>-400.webp (cards) + -800.webp (pages)
│       ├── donate/             # swiss-qr-bill.svg (shown) + .png (download)
│       ├── youtube/            # playlist covers <name>-640.webp (from YouTube, via PhotoCraft)
│       └── events/<id>/        # event album photos <name>-800.webp + <name>-1600.webp
├── data/
    ├── translations.json       # All text content in DE, EN, SI
    ├── events.json             # Community event albums (empty until real photos come)
│   └── monks.json              # Monk cards (new monk = new object)
└── source-files/               # NOT in git (.gitignore), local only, never delete
    ├── photos-raw/             # camera RAW originals (.CR2) + original phone pictures
    ├── photos-edited/          # graded full-size JPGs (PhotoCraft), named like the web
    │                           # files (e.g. buddha-altar.jpg)
    └── documents/              # skbz-qr-bill.pdf (SKBZ's paper QR bill, source of donate/)

Images: all photo grading, resizing and converting is done with PhotoCraft
(photocraft-photo-grading skill), never Python/PIL. Web versions: WebP,
1600px (quality 78) + 800px (quality 76), lowercase-dash names, always
width/height attributes, srcset where an image can be large. Alt texts are
translation keys images.<name> (data-i18n-attr="alt:..." / "aria-label:...").
Photo names (source JPG -> web file -> where it is used):
  buddha-altar (IMG_8761)        hero 1
  buddha-face (IMG_8778)         hero 2, gallery, og-image
  shrine-room (IMG_8744)         hero 3, gallery
  shrine-offerings (IMG_8748)    hero 4, about collage, gallery
  lotus-offerings (IMG_8764)     about collage, Dana card, gallery
  buddha-hands (IMG_8796)        about collage, gallery
  relic-stupa (IMG_8792)         Poya card, gallery
  buddha-statue (IMG_8749)       gallery
  shrine-cabinet (IMG_8757)      hero 5, gallery
  meditation-room (phone pic)    meditation (German) card only
  shrine-new-statues (phone pic) meditation (Sinhala) card only
  black-buddha (IMG_8752)        Kathina card only
  monks/ariyaseela-thero, monks/kalyanatissa-nayaka-thero: monk cards + pages
Hero: only the sharp camera photos, no phone pictures. The monk asked to
remove the meditation cushions photo (IMG_8789): do not use it again.
Hero slides are never lazy-loaded (a slide must be ready when it fades in).

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
- Sri Lankan Buddhist art touches (fine gold line-art, all calm). Keep each
  in its place, do not add more without asking:
  - Small sacred lotus (Nelumbo nucifera) above the hero title (inline SVG
    in index.html, `.hero__lotus`, draws itself in once on load). It replaced
    the earlier Makara Thorana arch: the home screen is kept minimal on purpose.
  - Sandakada Pahana (moonstone) in the footer only, drawn by
    assets/js/moonstone.js into `<div class="moonstone" data-moonstone>`,
    with caption key moonstone.caption; its swans turn very slowly
  - Liyawela vine with lotus bud under every `.section-head__title`
    (CSS data-URI), grows outward when the header fades in
  - Clay oil lamp with a softly flickering flame in the founder's
    "In Memory" badge (main.js renderMonks)
  - Lotus bud icons for the About bullets (`.lotus-icon`)
  - Kandyan curled-corner frame around the quotes on monks/*.html
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
Default language: de. Saved in localStorage key "bbv_lang". On the first
visit the browser language is used if it is en or si.
Switcher: DE | EN | සිං — active language bold + #E8762B
Every visible text must exist in all 3 languages. Sinhala was machine-written
and needs review by a native speaker.

---

## Page Sections (in order, all in index.html)

NAV (fixed):
- ≥1280px: 58/42 split mirroring the hero. Left: logo + name. Right: language
  switcher, Spenden button, divider, links Home | Über | Events | Galerie | Kontakt.
  Transparent over the hero, turns #FAF7F2 after scrolling (site-header--scrolled).
- <1280px: one light bar with logo (+ name from 480px), DE|EN|සිං and hamburger.
  Links and Spenden button are in the full-screen light overlay.

1.  #home      → Hero: 58% image slideshow (5 slides, 5s) left, 42% text right:
                 lotus, title, ONE short sentence (hero.description, no links),
                 one button, and one quiet facts line (hero.facts: Since 2024 ·
                 2 YouTube channels · 3 languages). Keep it minimal.
                 Phones: image on top, text below and centred.
                 Keep the hard left/right edge on desktop.
2.  #about     → Image collage + text + bullets, founder + leadership
                 (the old 4-number stats box was removed; only ONE resident monk)
3.  #monks     → Cards rendered by JS from data/monks.json, links to monks/*.html
                 (monk names are { de, en, si }; detail page texts use monkPages.* keys;
                 date of passing as passedAway "YYYY-MM-DD", formatted per language,
                 Sinhala by hand; never a "?" or a † cross).
                 Phones: one row per monk, round portrait, no excerpt.
                 Tablet+: two equal cards, "In memory" label in the photo corner.
                 No photo yet (future monks): lotus line drawing.
                 Portrait on a white background: set "imageOnWhite": true in
                 monks.json (and --on-white on the page's portrait) so the white
                 is blended into the warm parchment (mix-blend-mode: multiply).
                 Detail pages (monks/*.html): "Our monks" pill back to #monks,
                 centred round portrait in a gold ring (lotus if no photo),
                 role, name, memory line (monkPages.<slug>.memory), liyawela
                 vine (--liyawela), serif lead paragraph, Kandyan quote frame.
                 Pages without a .hero show the solid header from the start.
4.  #programs  → Tabs "Programme | Veranstaltungen", carousel (arrows on desktop,
                 2 square cards + swipe + one-time swipe hint on phones).
                 Programmes: Meditation DE (3rd Friday), Meditation SI (3rd
                 Saturday), Poya (3rd Sunday, switchable). Events: Vesak and
                 Kathina only (Dana and home visits removed on the monk's wish).
                 Poya switch: assets/js/settings.js -> poyaProgram: true/false
                 (any card with data-setting="<name>" can be switched the same
                 way). Fewer cards than fit in a row are centred.
5.  #youtube   → Dhamma Dana: the monk's 4 chosen playlists (keys youtube.playlists.p1–p4,
                 exact YouTube names without emojis; DE/EN parts per language):
                   p1 PLsSjdK2SRA-H19JgVLuUjE5QylYmBwgET  Besondere Eigenschaften… (course)
                   p2 PLsSjdK2SRA-GGhaHZzOzFcr8pN5myXbkk  8 Jhānas Explained… (course)
                   p3 PLsSjdK2SRA-EMGfXa5CAanQZXHB0xWUw_  Die Tiefe des Dhamma…
                   p4 PLsSjdK2SRA-ELGTcBlrpAqb61q1zPOe5_  Psychologisch betrachtet
                 Each card links to the playlist on YouTube; main.js opens it in a
                 calm player window instead (youtube-nocookie.com, frame created
                 only on click, removed on close). Phones: one row per playlist;
                 tablet 2x2; desktop 4 in a row. Covers softened (saturate 0.8).
                 If the counts change, update youtube.playlists.*.count.
                 The privacy policy must mention the embedded YouTube player.
6.  #gallery   → 12 real photos (data-full = 1600px version), lightbox (gallery.js);
                 shapes repeat tall / wide / square for any number of photos.
                 Below it: "Our community through the year", the 3 newest event
                 albums (#community-strip, events.js) + link to community.html.
                 While data/events.json is empty it shows a "coming soon"
                 preview (New Year, Vesak, Kathina with the lotus); real
                 albums replace it automatically.
7.  #contact   → Left: one sentence (contact.intro, "visits by appointment only"),
                 two pill buttons Call / Email (contact.actions), a quiet line
                 with number + email, address and hours side by side, then the
                 framed map filling down to the form's bottom edge.
                 Right: form card. Phones: all centred, form before the map.
FOOTER         → Light, centered: moonstone + caption, logo, tagline, link row,
                 address · phone · email, social icons, copyright (year set by JS)

DONATE PAGE (donate.html, own page; both Spenden buttons and the footer link
point to it): Dana label, title, one sentence, then two cards. Desktop: QR
card left, bank card right (IBAN + Copy button, holder, address, CHF).
Phones: bank card + big "Copy IBAN" first, QR second with "Save QR code"
(you can't scan your own screen). Texts: donate.* keys.
The QR code was recreated sharp from the exact data decoded from SKBZ's
paper QR bill (Swiss Payments Code 0200, no amount, NON reference) and
test-decoded. If the bank details ever change, regenerate it and test-scan
it with a real banking app before publishing. TWINT/PayPal: only if SKBZ asks.

LEGAL PAGE (legal.html): Impressum (#imprint: operator SKBZ, address,
contact, represented by the president) and privacy policy (#privacy: Formspree,
Google Maps, YouTube nocookie, Vercel/Google Fonts/unpkg, no cookies, rights,
FDPIC) on one page. Texts: legal.* keys. Linked once, small, from every
footer ("Impressum & Datenschutz"). If a new outside service is added to the
site, add it to the privacy part. The design credit stays only in the footer.

COMMUNITY ALBUMS (community.html + event.html, both drawn by events.js from
data/events.json; texts: community.* keys):
- community.html: albums grouped by year (year heading + thin line), year
  buttons when there is more than one year; while empty: a calm note and the
  same "coming soon" preview cards. Linked from the footer ("Gemeinschaft").
- event.html?id=<id>: "All events" pill, month + year, title, liyawela vine,
  one or two sentences, square photo grid (2/3/4 columns), lightbox with
  swipe (gallery.js picks up .album-photo), "photo removed? write to us" line.
- To add an event: photos with PhotoCraft into assets/images/events/<id>/ as
  <name>-800.webp + <name>-1600.webp, then one entry in data/events.json
  (id, date YYYY-MM-DD, title/text in de/en/si, cover, photos). No HTML
  editing. Pick 15–30 good photos per event.
- People in photos (revDSG): prefer group and atmosphere shots, no close-ups
  of children without their parents' OK, remove any photo on request.

---

## Contact Form

Formspree via AJAX (fetch) in main.js. Action URL in index.html:
  https://formspree.io/f/mbggeage   (form "Kontaktformular Website", sends to
  info@baselbuddhistvihara.ch; free plan: 50 messages per month)
Email subject: main.js adds "_subject" = "Website: <topic in German> – <name>".
Honeypot field: name="_gotcha" (hidden)
Success/error messages come from contact.form.success / contact.form.error.
Subject uses a custom dropdown (keyboard accessible) writing to a hidden input.

---

## Real Content (do not change these)

Address:    Feldbergstrasse 142, 4057 Basel, Switzerland
Phone:      +41 76 255 50 86  (tel:+41762555086; changed Nov 2026 on the owner's request)
Email:      info@baselbuddhistvihara.ch (Zoho Mail; switched Nov 2026 on the
            owner's request — the Formspree form target is set in the
            Formspree dashboard, not in the code)
SKBZ founded: March 17, 2021
Vihara founded: July 1, 2024. Opened: July 6, 2024 (5 monks, ~30 attendees)
Head Monk + Treasurer: Ven. Udumaththe Ariyaseela Thero
Secretary:  Ven. Henegama Sobitha Thero
President:  Fabienne Eglin. Vice president: Michael Joel Anneler
Founding president: Pascal Yannick Anneler
Committee:  Claudio Andrin Anneler, Nicola Caserio, Matheo Giampietro
Head monk appointed on the proposal of the founder, Ven. Henegama Sobitha
            Thero and Ven. Welagedara Sumanajothi Thero
Founder:    Most Ven. Dr. Walpola Kalyanatissa Nayaka Thero
            (passed away June 12, 2024, Geneva International Buddhist Center)

Bank account (SKBZ, used on donate.html — from the official QR bill):
  Holder:   Sri Kalyana Buddhistische Zentrum (SKBZ)   (spelled as on the bill)
  IBAN:     CH05 8080 8009 7919 6193 1   (21 characters, checksum valid;
            an older note had it cut short to "CH05 8080 8009 7919")
  Type:     Vereinskonto / CHF
  Address:  Neugrabenweg 29, 5702 Niederlenz

Source of truth: the Vihara's official text document (Nov 2026, DE/EN/SI) for
the story, people and services. For practical details (opening hours
daily 7:00–18:30, program days/times, phone, email, bank data) the site is
correct and the document is outdated. There is one resident monk (do not show
"5 monks" except for the opening day). Services in the document: monthly
programs, Kathina and special events, Dana offerings, home visits (Pirith,
Dana), Vihara visits by appointment, 2 YouTube channels (one video a week).

Google Maps: keep the embed URL that is in index.html.

---

## Placeholders (real content comes later)

When adding a placeholder:
- Use the soft placeholder tokens (var(--ph-1/2/3)), not dark gradients
- Always add a comment: <!-- replace with real image: assets/images/FOLDER/filename.jpg -->
- Real photos: object-fit: cover, real alt text

Pending: community event photos (see COMMUNITY ALBUMS).

Social profiles (footer, YouTube section, JSON-LD sameAs):
  Facebook: https://www.facebook.com/p/Basel-Buddhist-Vihara-61569741141373/
  YouTube:  https://www.youtube.com/@BaselBuddhistVihara

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
