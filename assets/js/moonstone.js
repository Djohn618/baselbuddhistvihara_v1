/* ==========================================================================
   Basel Buddhist Vihara — Sandakada Pahana (moonstone) ornament
   Draws a half moonstone in fine line-art into every [data-moonstone]
   element. Rings from outside to inside, as on the carved stone:
   fire, beads, creeper, swans (hamsa), lotus petals, lotus centre.
   ========================================================================== */

(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CX = 200;
  var CY = 200;
  var instance = 0;

  // Point on a circle around the centre; angle in degrees, 0 = right, 90 = top
  function pt(r, deg) {
    var a = deg * Math.PI / 180;
    return (CX + r * Math.cos(a)).toFixed(2) + ' ' + (CY - r * Math.sin(a)).toFixed(2);
  }

  // Upper half circle from left to right
  function halfArc(r) {
    return 'M' + pt(r, 180) + ' A' + r + ' ' + r + ' 0 0 1 ' + pt(r, 0);
  }

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function path(d) {
    return el('path', { d: d, pathLength: '1' });
  }

  function group(className) {
    return el('g', { 'class': className });
  }

  // Fire band (gini dalu): small flames pointing outward
  function fireRing() {
    var g = group('ms-ring ms-ring--1');
    g.appendChild(path(halfArc(196)));
    for (var a = 3.75; a < 180; a += 7.5) {
      g.appendChild(path(
        'M' + pt(174, a - 3.2) +
        ' Q' + pt(184, a - 2.4) + ' ' + pt(192, a) +
        ' Q' + pt(184, a + 2.4) + ' ' + pt(174, a + 3.2)
      ));
    }
    g.appendChild(path(halfArc(170)));
    return g;
  }

  // Bead band
  function beadRing() {
    var g = group('ms-ring ms-ring--2');
    for (var a = 2; a < 180; a += 4) {
      var p = pt(163, a).split(' ');
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r: '1.6', pathLength: '1' }));
    }
    g.appendChild(path(halfArc(156)));
    return g;
  }

  // Creeper (liyavela): a soft wave with small curls
  function creeperRing() {
    var g = group('ms-ring ms-ring--3');
    var d = '';
    for (var a = 0; a <= 180; a += 1) {
      var r = 141 + 6 * Math.sin(a * Math.PI / 7.5);
      d += (a === 0 ? 'M' : ' L') + pt(r, a);
    }
    g.appendChild(path(d));
    for (var c = 3.75; c < 180; c += 7.5) {
      var up = Math.round((c - 3.75) / 7.5) % 2 === 0;
      var p = pt(up ? 149.2 : 132.8, c).split(' ');
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r: '2.2', pathLength: '1' }));
    }
    g.appendChild(path(halfArc(126)));
    return g;
  }

  // Swans (hamsa): a full ring that slowly turns; the lower half is clipped away
  function hamsaRing(clipId) {
    var outer = group('ms-ring ms-ring--4');
    outer.setAttribute('clip-path', 'url(#' + clipId + ')');
    var turning = group('ms-hamsa');
    var swan =
      'M-7 2 C-5 6 4 6 6 2 C3 2 1 0 -2 0 C-4 0 -6 1 -7 2 Z' +
      ' M4 1 C6 -2 3 -5 5 -8 C6 -10 8 -9.5 8.5 -8.5 L10.5 -8' +
      ' M-7 2 L-9 -1';
    for (var a = 0; a < 360; a += 15) {
      var p = pt(109, a);
      var s = path(swan);
      s.setAttribute('transform', 'translate(' + p + ') rotate(' + (90 - a) + ') scale(1.3)');
      turning.appendChild(s);
    }
    outer.appendChild(turning);
    return outer;
  }

  // Lotus petals
  function petalRing() {
    var g = group('ms-ring ms-ring--5');
    g.appendChild(path(halfArc(96)));
    for (var a = 6; a < 180; a += 12) {
      g.appendChild(path(
        'M' + pt(64, a) +
        ' Q' + pt(80, a - 6.5) + ' ' + pt(92, a) +
        ' Q' + pt(80, a + 6.5) + ' ' + pt(64, a) +
        ' M' + pt(68, a) + ' L' + pt(84, a)
      ));
    }
    g.appendChild(path(halfArc(60)));
    return g;
  }

  // Lotus centre: small petals around a calm half circle
  function lotusCentre() {
    var g = group('ms-ring ms-ring--6');
    for (var a = 10; a < 180; a += 20) {
      g.appendChild(path(
        'M' + pt(30, a) +
        ' Q' + pt(44, a - 8) + ' ' + pt(54, a) +
        ' Q' + pt(44, a + 8) + ' ' + pt(30, a)
      ));
    }
    g.appendChild(path(halfArc(26)));
    g.appendChild(path(halfArc(16)));
    return g;
  }

  function build(container) {
    instance += 1;
    var clipId = 'ms-clip-' + instance;

    var svg = el('svg', {
      viewBox: '0 0 400 202',
      'aria-hidden': 'true',
      focusable: 'false'
    });

    var defs = el('defs', {});
    var clip = el('clipPath', { id: clipId });
    clip.appendChild(el('rect', { x: '0', y: '0', width: '400', height: '200' }));
    defs.appendChild(clip);
    svg.appendChild(defs);

    svg.appendChild(fireRing());
    svg.appendChild(beadRing());
    svg.appendChild(creeperRing());
    svg.appendChild(hamsaRing(clipId));
    svg.appendChild(petalRing());
    svg.appendChild(lotusCentre());

    // Threshold line the stone rests on
    var base = group('ms-ring ms-ring--1');
    base.appendChild(path('M0 200 L400 200'));
    svg.appendChild(base);

    container.appendChild(svg);
  }

  // Lines draw themselves once the stone comes into view
  function revealOnView(container) {
    if (!('IntersectionObserver' in window)) {
      container.classList.add('is-drawn');
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        container.classList.add('is-drawn');
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(container);
  }

  function init() {
    document.querySelectorAll('[data-moonstone]').forEach(function (container) {
      build(container);
      revealOnView(container);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
