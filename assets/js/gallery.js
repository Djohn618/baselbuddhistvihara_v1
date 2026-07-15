/* ==========================================================================
   Basel Buddhist Vihara — Gallery Lightbox
   ========================================================================== */

(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var lightbox = document.getElementById('lightbox');
  var lightboxPlaceholder = document.getElementById('lightbox-placeholder');
  var lightboxLabel = document.getElementById('lightbox-label');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  var currentIndex = 0;

  function render(index) {
    currentIndex = (index + items.length) % items.length;
    var item = items[currentIndex];
    var placeholder = item.querySelector('.gallery__placeholder');
    var variant = placeholder.className.match(/gallery__placeholder--\d+/)[0];

    lightboxPlaceholder.className = 'lightbox__placeholder ' + variant;
    lightboxLabel.textContent = item.querySelector('.gallery__label').textContent;
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
    items.forEach(function (item, index) {
      item.addEventListener('click', function () {
        open(index);
      });
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
  }

  function init() {
    if (!items.length || !lightbox) return;
    initItemClicks();
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
