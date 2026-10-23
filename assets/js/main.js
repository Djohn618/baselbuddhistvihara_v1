/* ==========================================================================
   Basel Buddhist Vihara — Navigation behavior
   ========================================================================== */

(function () {
  'use strict';

  // Resolved relative to this script's own location (assets/js/main.js) so it
  // still finds data/monks.json when the page lives in a subfolder
  // (e.g. monks/kalyanatissa.html). Must be captured now — document.currentScript
  // is only valid during this script's initial synchronous execution.
  var MONKS_URL = document.currentScript
    ? new URL('../../data/monks.json', document.currentScript.src).href
    : 'data/monks.json';

  var SCROLL_THRESHOLD = 80;

  var header = document.getElementById('site-header');
  var navHamburger = document.getElementById('nav-hamburger');
  var navOverlay = document.getElementById('nav-overlay');
  var navOverlayClose = document.getElementById('nav-overlay-close');
  var navLinks = document.getElementById('nav-links');
  var navLinkEls = navLinks ? navLinks.querySelectorAll('.nav__link') : [];
  var navOverlayLinkEls = navOverlay ? navOverlay.querySelectorAll('.nav-overlay__link') : [];
  var allNavLinkEls = document.querySelectorAll('.nav__link, .nav-overlay__link');
  var sections = document.querySelectorAll('main [id]');

  function handleHeaderScroll() {
    if (!header) return;
    header.classList.toggle('site-header--scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  function closeMobileMenu() {
    if (!navOverlay || !navHamburger) return;
    navOverlay.classList.remove('is-open');
    navHamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  function toggleMobileMenu() {
    if (!navOverlay || !navHamburger) return;
    var isOpen = navOverlay.classList.toggle('is-open');
    navHamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  }

  function setActiveLink(id) {
    allNavLinkEls.forEach(function (link) {
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
    if (navHamburger) {
      navHamburger.addEventListener('click', toggleMobileMenu);
    }
    if (navOverlayClose) {
      navOverlayClose.addEventListener('click', closeMobileMenu);
    }
  }

  function initLinkClicks() {
    navOverlayLinkEls.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  function initEscapeClose() {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMobileMenu();
    });
  }

  function t(key) {
    return window.i18n ? window.i18n.t(key) : key;
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.contact__submit');
      var originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = '...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = t('contact.form.success');
            status.className = 'form-status form-status--success';
            form.reset();
            document.dispatchEvent(new CustomEvent('contact-form:reset'));
          } else {
            status.textContent = t('contact.form.error');
            status.className = 'form-status form-status--error';
          }
        })
        .catch(function () {
          status.textContent = t('contact.form.error');
          status.className = 'form-status form-status--error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;

          setTimeout(function () {
            status.textContent = '';
            status.className = 'form-status';
          }, 6000);
        });
    });
  }

  var fadeObserver = null;

  function observeFadeIn(el) {
    if (!fadeObserver) {
      el.classList.add('fade-in-visible');
      return;
    }
    fadeObserver.observe(el);
  }

  function initFadeIn() {
    var fadeEls = document.querySelectorAll('.fade-in');
    if (!fadeEls.length) return;

    if (!('IntersectionObserver' in window)) {
      fadeEls.forEach(function (el) { el.classList.add('fade-in-visible'); });
      return;
    }

    fadeObserver = new IntersectionObserver(
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

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  }

  // Load data/monks.json once; render again on every language change
  var monksData = null;

  function loadMonks() {
    if (!document.getElementById('monks-grid')) return;

    fetch(MONKS_URL)
      .then(function (response) { return response.json(); })
      .then(function (data) {
        monksData = data;
        renderMonks();
      })
      .catch(function (err) {
        console.warn('Could not load monks.json', err);
      });
  }

  function renderMonks() {
    var grid = document.getElementById('monks-grid');
    if (!grid || !monksData) return;

    var data = monksData;
    var lang = window.i18n ? window.i18n.getLanguage() : 'de';
    var featured = data.monks.filter(function (m) { return m.featured; });

    var badgeText = { de: 'In Erinnerung', en: 'In Memory', si: 'සිහිකිරීමෙහිලා' };
    var readMoreText = { de: 'Mehr erfahren', en: 'Read more', si: 'තව දැනගන්න' };

    grid.innerHTML = featured.map(function (monk) {
      var isPassed = monk.status === 'passed';

      return '' +
        '<article class="monk-card ' + (isPassed ? 'monk-card--passed' : '') + ' fade-in">' +
          '<div class="monk-card__image-wrap">' +
            (isPassed ? '<span class="monk-card__badge">' + badgeText[lang] + '</span>' : '') +
            (monk.image ? '<img src="' + monk.image + '" alt="' + monk.name + '" onerror="this.style.display=\'none\'" loading="lazy">' : '') +
          '</div>' +
          '<div class="monk-card__body">' +
            '<p class="monk-card__role">' + monk.role[lang] + '</p>' +
            '<h3 class="monk-card__name">' + monk.name + '</h3>' +
            (monk.dates ? '<p class="monk-card__dates">' + monk.dates + '</p>' : '') +
            '<p class="monk-card__excerpt">' + monk.excerpt[lang] + '</p>' +
            '<div class="monk-card__divider"></div>' +
            '<a href="' + monk.detailPage + '" class="monk-card__link">' +
              readMoreText[lang] +
              '<i data-lucide="arrow-right"></i>' +
            '</a>' +
          '</div>' +
        '</article>';
    }).join('');

    if (window.lucide) lucide.createIcons();

    Array.prototype.slice.call(grid.querySelectorAll('.monk-card.fade-in')).forEach(observeFadeIn);
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

    // Must match the card widths in style.css: 3 per view from 1024px,
    // otherwise 2 (on phones the cards are 44vw each, side by side).
    function getPerView() {
      return window.innerWidth >= 1024 ? 3 : 2;
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

    // One dot per reachable position, not per card; hidden when everything fits.
    function buildDots() {
      var count = getMaxIndex() + 1;
      dotsContainer.innerHTML = '';
      dotsContainer.hidden = count < 2;
      dots = visibleCards.slice(0, count).map(function (card, i) {
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

      // Nothing to scroll (all cards fit): hide the arrows but keep their space
      prevBtn.style.visibility = nextBtn.style.visibility = maxIndex === 0 ? 'hidden' : '';
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

    window.addEventListener('resize', function () {
      if (dots.length !== getMaxIndex() + 1) buildDots();
      render();
    });

    // Touch swipe (the arrows are hidden on phones)
    var viewport = track.parentElement;
    var touchStartX = null;
    var touchStartY = null;

    viewport.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      goTo(currentIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // Play the swipe hint once, when the carousel actually comes into view
    var swipeHint = document.getElementById('swipe-hint');
    if (swipeHint && 'IntersectionObserver' in window) {
      var hintObserver = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          swipeHint.classList.add('is-playing');
          obs.disconnect();
        }
      }, { threshold: 0.6 });
      hintObserver.observe(swipeHint);
    }

    initTabs();

    var initialTab = tabs.length ? tabs[0].getAttribute('data-tab') : null;
    if (initialTab) {
      applyFilter(initialTab, true);
    } else {
      buildDots();
      render();
    }
  }

  // Links whose real URL is still pending (href="#") do nothing instead of
  // jumping to the top of the page.
  function initPlaceholderLinks() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="#"]');
      if (link) e.preventDefault();
    });
  }

  function initFooterYear() {
    document.querySelectorAll('.footer__year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function init() {
    initFooterYear();
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    initNavToggle();
    initLinkClicks();
    initEscapeClose();
    initScrollSpy();
    initFadeIn();
    initHeroSlideshow();
    initProgramsCarousel();
    initContactForm();
    initPlaceholderLinks();
    loadMonks();
    document.addEventListener('i18n:change', renderMonks);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Custom select dropdown
(function() {
  const select = document.getElementById('custom-select');
  const hiddenInput = document.getElementById('contact-subject');
  if (!select || !hiddenInput) return;

  const trigger = select.querySelector('.custom-select__trigger');
  const valueEl = select.querySelector('.custom-select__value');
  const options = Array.prototype.slice.call(select.querySelectorAll('.custom-select__option'));

  function open() {
    select.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    const active = select.querySelector('.custom-select__option--active') || options[0];
    active.focus();
  }

  function close(returnFocus) {
    if (!select.classList.contains('is-open')) return;
    select.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus();
  }

  function choose(option) {
    hiddenInput.value = option.dataset.value;
    valueEl.textContent = option.textContent;
    options.forEach(function(o) {
      o.classList.remove('custom-select__option--active');
      o.setAttribute('aria-selected', 'false');
    });
    option.classList.add('custom-select__option--active');
    option.setAttribute('aria-selected', 'true');
  }

  options.forEach(function(option) {
    option.setAttribute('tabindex', '-1');

    option.addEventListener('click', function() {
      choose(option);
      close(true);
    });

    // Arrow keys move, Enter/Space choose, Tab closes
    option.addEventListener('keydown', function(e) {
      const i = options.indexOf(option);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        options[Math.min(i + 1, options.length - 1)].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        options[Math.max(i - 1, 0)].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        choose(option);
        close(true);
      } else if (e.key === 'Tab') {
        close(false);
      }
    });
  });

  trigger.addEventListener('click', function() {
    if (select.classList.contains('is-open')) close(false);
    else open();
  });

  trigger.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      open();
    }
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!select.contains(e.target)) close(false);
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close(select.contains(document.activeElement));
  });

  // After a language switch, show the chosen subject in the new language
  document.addEventListener('i18n:change', function() {
    const active = select.querySelector('.custom-select__option--active') || options[0];
    valueEl.textContent = active.textContent;
  });

  // After a successful send the form resets to "general"
  document.addEventListener('contact-form:reset', function() {
    choose(options[0]);
  });
})();
