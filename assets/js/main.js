/* ==========================================================================
   Basel Buddhist Vihara — Navigation behavior
   ========================================================================== */

(function () {
  'use strict';

  var SCROLL_THRESHOLD = 80;

  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var navLinkEls = navLinks ? navLinks.querySelectorAll('.nav__link') : [];
  var sections = document.querySelectorAll('main [id]');

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('site-header--scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  function closeMobileMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  function toggleMobileMenu() {
    if (!navLinks || !navToggle) return;
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  }

  function setActiveLink(id) {
    navLinkEls.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('nav__link--active', isActive);
    });
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window) || !sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-' + (SCROLL_THRESHOLD + 20) + 'px 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function initNavToggle() {
    if (!navToggle) return;
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  function initLinkClicks() {
    navLinkEls.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  function initEscapeClose() {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  function initContactFormStatus() {
    var statusEl = document.getElementById('form-status');
    if (!statusEl) return;

    var status = new URLSearchParams(window.location.search).get('status');
    if (status !== 'sent' && status !== 'error') return;

    var key = status === 'sent' ? 'contact.form.success' : 'contact.form.error';
    statusEl.classList.add(status === 'sent' ? 'form__status--success' : 'form__status--error');

    function applyMessage() {
      statusEl.textContent = window.i18n.t(key);
    }

    applyMessage();
    document.addEventListener('i18n:change', applyMessage);

    var url = new URL(window.location.href);
    url.searchParams.delete('status');
    window.history.replaceState({}, '', url.pathname + url.hash);
  }

  function initProgramsCarousel() {
    var track = document.getElementById('programs-cards');
    var prevBtn = document.getElementById('programs-prev');
    var nextBtn = document.getElementById('programs-next');
    if (!track || !prevBtn || !nextBtn) return;

    function scrollByCard(direction) {
      var card = track.querySelector('.program-card');
      var amount = card ? card.getBoundingClientRect().width + 16 : 260;
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    nextBtn.addEventListener('click', function () { scrollByCard(1); });
  }

  function init() {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initNavToggle();
    initLinkClicks();
    initEscapeClose();
    initScrollSpy();
    initProgramsCarousel();
    initContactFormStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
