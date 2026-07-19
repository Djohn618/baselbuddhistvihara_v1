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

  function initFadeIn() {
    var fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    if (!('IntersectionObserver' in window)) {
      fadeEls.forEach(function (el) { el.classList.add('fade-in-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) { observer.observe(el); });
  }

  function initProgramsCarousel() {
    var track = document.getElementById('programs-track');
    var prevBtn = document.getElementById('programs-prev');
    var nextBtn = document.getElementById('programs-next');
    var dotsContainer = document.getElementById('programs-dots');
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var cards = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(dotsContainer.children);
    if (!cards.length) return;

    var currentIndex = 0;

    function getPerView() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getPerView());
    }

    function getStep() {
      var gapValue = window.getComputedStyle(track).columnGap;
      if (!gapValue || gapValue === 'normal') gapValue = window.getComputedStyle(track).gap;
      var gap = parseFloat(gapValue) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function render() {
      var maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      track.style.transform = 'translateX(-' + (currentIndex * getStep()) + 'px)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIndex);
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === maxIndex;
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      render();
    }

    prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    window.addEventListener('resize', render);

    render();
  }

  function init() {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initNavToggle();
    initLinkClicks();
    initEscapeClose();
    initScrollSpy();
    initFadeIn();
    initProgramsCarousel();
    initContactFormStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
