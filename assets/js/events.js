/* ==========================================================================
   Basel Buddhist Vihara — Community event albums
   Reads data/events.json and draws, depending on the page:
   - home page: the 3 newest albums under the gallery (#community-strip)
   - community.html: all albums grouped by year, with year buttons
   - event.html?id=…: one album with its photo grid (lightbox: gallery.js)
   With no events in the list yet, both places show a calm preview of
   the albums that are coming ("photos coming soon").
   ========================================================================== */

(function () {
  'use strict';

  var EVENTS_URL = document.currentScript
    ? new URL('../../data/events.json', document.currentScript.src).href
    : 'data/events.json';

  var strip = document.getElementById('community-strip');
  var list = document.getElementById('community-list');
  var album = document.getElementById('event-album');
  if (!strip && !list && !album) return;

  var events = null;
  var activeYear = 'all';

  var locales = { de: 'de-CH', en: 'en-GB', si: 'si-LK' };
  var siMonths = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
    'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];

  function lang() {
    return window.i18n ? window.i18n.getLanguage() : 'de';
  }

  function t(key) {
    return window.i18n ? window.i18n.t(key) : key;
  }

  function pick(obj) {
    return obj ? (obj[lang()] || obj.de || '') : '';
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // "2025-04-13" -> "April 2025" / "April 2025" / "2025 අප්‍රේල්"
  function monthYear(iso) {
    var p = iso.split('-');
    if (lang() === 'si') return p[0] + ' ' + siMonths[parseInt(p[1], 10) - 1];
    try {
      return new Intl.DateTimeFormat(locales[lang()], { month: 'long', year: 'numeric' })
        .format(new Date(iso + 'T12:00:00'));
    } catch (e) {
      return iso;
    }
  }

  function photoCount(n) {
    return t('community.photos').replace('{n}', n);
  }

  function photoPath(ev, name, size) {
    return 'assets/images/events/' + ev.id + '/' + name + '-' + size + '.webp';
  }

  function albumCard(ev) {
    return '' +
      '<a class="album-card fade-in" href="event.html?id=' + encodeURIComponent(ev.id) + '">' +
        '<span class="album-card__cover">' +
          '<img src="' + photoPath(ev, ev.cover || ev.photos[0], 800) + '" alt="" loading="lazy" width="800" height="600">' +
        '</span>' +
        '<span class="album-card__body">' +
          '<span class="album-card__title">' + escapeHtml(pick(ev.title)) + '</span>' +
          '<span class="album-card__meta">' +
            '<i data-lucide="calendar" aria-hidden="true"></i>' +
            escapeHtml(monthYear(ev.date)) + ' · ' + escapeHtml(photoCount(ev.photos.length)) +
          '</span>' +
        '</span>' +
      '</a>';
  }

  // Preview while no photos are online yet: the yearly events that will get
  // an album, each with the lotus and a "photos coming soon" label
  var PREVIEW = ['newYear', 'vesak', 'kathina'];
  var LOTUS = '<svg class="album-card__lotus" viewBox="0 0 120 72" aria-hidden="true" focusable="false">' +
    '<path d="M32 66 C46 63 74 63 88 66 M60 56 C42 56 26 48 18 34 C32 34 48 42 60 56 M60 56 C78 56 94 48 102 34 C88 34 72 42 60 56 ' +
    'M60 54 C48 48 40 34 42 18 C50 26 56 38 60 54 M60 54 C72 48 80 34 78 18 C70 26 64 38 60 54 M60 6 C52 20 52 40 60 54 C68 40 68 20 60 6 Z"/></svg>';

  function previewCard(key) {
    return '' +
      '<div class="album-card album-card--soon fade-in">' +
        '<span class="album-card__cover">' + LOTUS +
          '<span class="album-card__soon">' + escapeHtml(t('community.soon')) + '</span>' +
        '</span>' +
        '<span class="album-card__body">' +
          '<span class="album-card__title">' + escapeHtml(t('community.preview.' + key)) + '</span>' +
          '<span class="album-card__meta">' + escapeHtml(t('community.soonText')) + '</span>' +
        '</span>' +
      '</div>';
  }

  function revealCards(root) {
    if (window.lucide) window.lucide.createIcons();
    // the cards are added after the page's fade-in observer started,
    // so they get their gentle entrance here
    var cards = root.querySelectorAll('.fade-in');
    window.requestAnimationFrame(function () {
      Array.prototype.forEach.call(cards, function (c) { c.classList.add('fade-in-visible'); });
    });
  }

  // ---- home page: the 3 newest albums
  function renderStrip() {
    strip.hidden = false;
    var grid = strip.querySelector('.album-grid');
    grid.innerHTML = events.length
      ? events.slice(0, 3).map(albumCard).join('')
      : PREVIEW.map(previewCard).join('');
    revealCards(grid);
  }

  // ---- community page: all albums by year
  function renderList() {
    var empty = document.getElementById('community-empty');
    var filters = document.getElementById('community-years');

    if (!events.length) {
      filters.hidden = true;
      empty.hidden = false;
      list.innerHTML = '<div class="album-grid album-grid--page">' + PREVIEW.map(previewCard).join('') + '</div>';
      revealCards(list);
      return;
    }
    empty.hidden = true;

    var years = [];
    events.forEach(function (ev) {
      var y = ev.date.slice(0, 4);
      if (years.indexOf(y) === -1) years.push(y);
    });

    // year buttons only make sense with more than one year
    filters.hidden = years.length < 2;
    filters.innerHTML = ['all'].concat(years).map(function (y) {
      return '<button type="button" class="year-chip' + (y === activeYear ? ' is-active' : '') +
        '" data-year="' + y + '" aria-pressed="' + (y === activeYear) + '">' +
        (y === 'all' ? escapeHtml(t('community.all')) : y) + '</button>';
    }).join('');

    list.innerHTML = years.filter(function (y) {
      return activeYear === 'all' || y === activeYear;
    }).map(function (y) {
      var cards = events.filter(function (ev) { return ev.date.slice(0, 4) === y; });
      return '<section class="album-year" aria-label="' + y + '">' +
               '<h2 class="album-year__title">' + y + '</h2>' +
               '<div class="album-grid album-grid--page">' + cards.map(albumCard).join('') + '</div>' +
             '</section>';
    }).join('');
    revealCards(list);
  }

  // ---- event page: one album
  function renderAlbum() {
    var id = new URLSearchParams(window.location.search).get('id');
    var ev = events.filter(function (e) { return e.id === id; })[0];
    var grid = document.getElementById('event-photos');

    if (!ev) {
      document.getElementById('event-title').textContent = t('community.notFound');
      document.getElementById('event-date').textContent = '';
      document.getElementById('event-text').textContent = '';
      grid.innerHTML = '';
      return;
    }

    var title = pick(ev.title);
    document.title = title + ' — Basel Buddhist Vihara';
    document.getElementById('event-date').textContent = monthYear(ev.date);
    document.getElementById('event-title').textContent = title;
    document.getElementById('event-text').textContent = pick(ev.text);

    grid.innerHTML = ev.photos.map(function (name, i) {
      var label = title + ' — ' + (i + 1) + ' / ' + ev.photos.length;
      return '<button type="button" class="album-photo" data-full="' + photoPath(ev, name, 1600) + '" aria-label="' + escapeHtml(label) + '">' +
               '<img src="' + photoPath(ev, name, 800) + '" alt="" loading="lazy" width="800" height="800">' +
             '</button>';
    }).join('');
  }

  function render() {
    if (!events) return;
    if (strip) renderStrip();
    if (list) renderList();
    if (album) renderAlbum();
  }

  if (list) {
    document.getElementById('community-years').addEventListener('click', function (e) {
      var btn = e.target.closest('.year-chip');
      if (!btn) return;
      activeYear = btn.getAttribute('data-year');
      renderList();
    });
  }

  fetch(EVENTS_URL)
    .then(function (response) { return response.json(); })
    .then(function (data) {
      // newest first
      events = (data.events || []).slice().sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      });
      render();
    })
    .catch(function (err) {
      console.warn('Could not load events.json', err);
      events = [];
      render();
    });

  // titles, months and counts follow the language switch
  document.addEventListener('i18n:change', render);
})();
