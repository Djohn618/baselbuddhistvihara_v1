/* ==========================================================================
   Basel Buddhist Vihara — Gallery Lightbox
   ========================================================================== */

(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
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

    content.style.aspectRatio = item.getAttribute('data-aspect') || '4 / 3';
    content.classList.toggle('lightbox__content--odd', currentIndex % 2 === 0);
    content.classList.toggle('lightbox__content--even', currentIndex % 2 !== 0);
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
