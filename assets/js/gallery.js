/* ==========================================================================
   Basel Buddhist Vihara — Gallery Lightbox
   ========================================================================== */

(function () {
  'use strict';

  // Home gallery photos and event album photos (albums are drawn later by
  // events.js, so the list is read again each time a photo is opened)
  var ITEM_SELECTOR = '.gallery__item, .album-photo';
  var items = [];
  var lightbox = document.getElementById('lightbox');
  var content = document.getElementById('lightbox-content');
  var counter = document.getElementById('lightbox-counter');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  var currentIndex = 0;

  function render(index) {
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];

    // Real photo: show the large version, uncropped; otherwise the gradient placeholder
    var full = item.getAttribute('data-full');
    content.innerHTML = '';
    if (full) {
      var img = document.createElement('img');
      img.src = full;
      img.alt = item.getAttribute('aria-label') || '';
      content.appendChild(img);
      content.style.aspectRatio = '3 / 2';
      // portrait phone photos keep their own shape
      img.addEventListener('load', function () {
        if (img.naturalWidth && img.naturalHeight) {
          content.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight;
        }
      });
    } else {
      content.style.aspectRatio = item.getAttribute('data-aspect') || '4 / 3';
    }
    content.classList.toggle('lightbox__content--photo', !!full);
    content.classList.toggle('lightbox__content--odd', !full && currentIndex % 2 === 0);
    content.classList.toggle('lightbox__content--even', !full && currentIndex % 2 !== 0);
    counter.textContent = (currentIndex + 1) + ' / ' + items.length;
  }

  function open(index) {
    render(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  function initItemClicks() {
    document.addEventListener('click', function (event) {
      var item = event.target.closest(ITEM_SELECTOR);
      if (!item) return;
      items = Array.prototype.slice.call(document.querySelectorAll(ITEM_SELECTOR));
      open(items.indexOf(item));
    });
  }

  function initControls() {
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () {
      render(currentIndex - 1);
    });
    nextBtn.addEventListener('click', function () {
      render(currentIndex + 1);
    });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) close();
    });

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') render(currentIndex - 1);
      if (event.key === 'ArrowRight') render(currentIndex + 1);
    });

    // Swipe left/right to change photos (helper from main.js)
    if (window.bbvOnSwipe) {
      window.bbvOnSwipe(lightbox, function (direction) {
        render(currentIndex + direction);
      });
    }

    // Swipe down to close, like in a phone's photo app
    var startY = null;
    var startX = null;
    lightbox.addEventListener('touchstart', function (event) {
      startY = event.touches[0].clientY;
      startX = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      if (startY === null) return;
      var dy = event.changedTouches[0].clientY - startY;
      var dx = event.changedTouches[0].clientX - startX;
      startY = null;
      if (dy > 80 && dy > Math.abs(dx) * 1.5) close();
    }, { passive: true });
  }

  function init() {
    if (!lightbox) return;
    initItemClicks();
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
