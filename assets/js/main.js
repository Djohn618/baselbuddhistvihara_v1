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

  function init() {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initNavToggle();
    initLinkClicks();
    initEscapeClose();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
