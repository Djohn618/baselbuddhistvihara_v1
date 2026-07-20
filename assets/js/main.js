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
    statusEl.classList.add(status === 'sent' ? 'form-status--success' : 'form-status--error');

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

  function initHeroSlideshow() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero__slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero__dot'));
    if (!slides.length) return;

    var SLIDE_INTERVAL_MS = 5000;
    var currentIndex = 0;
    var timer = null;

    function show(index) {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === currentIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function startAutoplay() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(currentIndex + 1);
      }, SLIDE_INTERVAL_MS);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        startAutoplay();
      });
    });

    show(0);
    startAutoplay();
  }

  function initProgramsCarousel() {
    var track = document.getElementById('programs-track');
    var prevBtn = document.getElementById('programs-prev');
    var nextBtn = document.getElementById('programs-next');
    var dotsContainer = document.getElementById('programs-dots');
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab-btn[data-tab]'));
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var CARD_FADE_MS = 300;
    var allCards = Array.prototype.slice.call(track.children);
    if (!allCards.length) return;

    var visibleCards = allCards;
    var dots = [];
    var currentIndex = 0;
    var filterTimer = null;

    function getPerView() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, visibleCards.length - getPerView());
    }

    function getStep() {
      if (!visibleCards.length) return 0;
      var gapValue = window.getComputedStyle(track).columnGap;
      if (!gapValue || gapValue === 'normal') gapValue = window.getComputedStyle(track).gap;
      var gap = parseFloat(gapValue) || 0;
      return visibleCards[0].getBoundingClientRect().width + gap;
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      dots = visibleCards.map(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'programs__dot';
        dot.setAttribute('aria-label', 'Karte ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsContainer.appendChild(dot);
        return dot;
      });
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

    function applyFilter(type, skipAnimation) {
      window.clearTimeout(filterTimer);

      allCards.forEach(function (card) {
        var matches = card.getAttribute('data-type') === type;
        if (matches) {
          card.classList.remove('program-card--removed');
          if (!skipAnimation) void card.offsetWidth; // force reflow so the fade-in transition runs
          card.classList.remove('program-card--hidden');
        } else {
          card.classList.add('program-card--hidden');
          if (skipAnimation) card.classList.add('program-card--removed');
        }
      });

      function finish() {
        visibleCards = allCards.filter(function (card) {
          return card.getAttribute('data-type') === type;
        });
        currentIndex = 0;
        buildDots();
        track.style.transform = 'translateX(0px)';
        render();
      }

      if (skipAnimation) {
        finish();
      } else {
        filterTimer = window.setTimeout(function () {
          allCards.forEach(function (card) {
            if (card.classList.contains('program-card--hidden')) {
              card.classList.add('program-card--removed');
            }
          });
          finish();
        }, CARD_FADE_MS);
      }
    }

    function initTabs() {
      if (!tabs.length) return;
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          if (tab.classList.contains('tab-active')) return;
          tabs.forEach(function (t) {
            t.classList.remove('tab-active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('tab-active');
          tab.setAttribute('aria-selected', 'true');
          applyFilter(tab.getAttribute('data-tab'));
        });
      });
    }

    prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

    window.addEventListener('resize', render);

    initTabs();

    var initialTab = tabs.length ? tabs[0].getAttribute('data-tab') : null;
    if (initialTab) {
      applyFilter(initialTab, true);
    } else {
      buildDots();
      render();
    }
  }

  function init() {
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initNavToggle();
    initLinkClicks();
    initEscapeClose();
    initScrollSpy();
    initFadeIn();
    initHeroSlideshow();
    initProgramsCarousel();
    initContactFormStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
