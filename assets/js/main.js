/* Figure viewer: per-paper prev/next, optional GIF on hover, and a lightbox.
   No dependencies. Nothing moves unless the visitor does something. */
(function () {
  'use strict';

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var chevronL = '<span class="disc"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></span>';
  var chevronR = '<span class="disc"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>';
  var cross    = '<span class="disc"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></span>';

  /* ---------- lightbox (one for the whole page) ---------- */
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Figure');
  lb.innerHTML =
    '<span class="lb-count"></span>' +
    '<button class="lb-close" type="button" aria-label="Close">' + cross + '</button>' +
    '<button class="lb-nav lb-prev" type="button" aria-label="Previous figure">' + chevronL + '</button>' +
    '<img class="lb-img" alt="">' +
    '<button class="lb-nav lb-next" type="button" aria-label="Next figure">' + chevronR + '</button>' +
    '<p class="lb-caption"></p>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector('.lb-img');
  var lbCap = lb.querySelector('.lb-caption');
  var lbCount = lb.querySelector('.lb-count');
  var lbPrev = lb.querySelector('.lb-prev');
  var lbNext = lb.querySelector('.lb-next');
  var lbClose = lb.querySelector('.lb-close');
  var current = null;   // the viewer that opened the lightbox
  var lastFocus = null;

  function lbRender() {
    var img = current.imgs[current.i];
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lbCount.textContent = current.imgs.length > 1 ? pad(current.i + 1) + ' / ' + pad(current.imgs.length) : '';
    lbPrev.style.display = lbNext.style.display = current.imgs.length > 1 ? '' : 'none';
  }
  function lbOpen(viewer) {
    current = viewer;
    lastFocus = document.activeElement;
    lbRender();
    lb.classList.add('is-open');
    document.body.classList.add('lb-open');
    lbClose.focus();
  }
  function lbShut() {
    if (!current) return;
    current.show(current.i);           // keep the thumbnail on the figure last viewed
    lb.classList.remove('is-open');
    document.body.classList.remove('lb-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    current = null;
  }
  function lbStep(d) {
    if (!current) return;
    current.i = (current.i + d + current.imgs.length) % current.imgs.length;
    lbRender();
  }
  lbClose.addEventListener('click', lbShut);
  lbPrev.addEventListener('click', function () { lbStep(-1); });
  lbNext.addEventListener('click', function () { lbStep(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lbShut(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') lbShut();
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
  });

  /* ---------- per-paper viewers ---------- */
  var figs = document.querySelectorAll('[data-fig]');
  Array.prototype.forEach.call(figs, function (fig) {
    var imgs = Array.prototype.slice.call(fig.querySelectorAll('.fig-img'));
    if (!imgs.length) return;
    var count = fig.querySelector('.fig-count');
    var viewer = { imgs: imgs, i: 0, show: null };

    viewer.show = function (k) {
      imgs[viewer.i].classList.remove('is-active');
      viewer.i = (k + imgs.length) % imgs.length;
      imgs[viewer.i].classList.add('is-active');
      if (count) count.textContent = pad(viewer.i + 1) + ' / ' + pad(imgs.length);
    };

    var prev = fig.querySelector('.fig-prev');
    var next = fig.querySelector('.fig-next');
    if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); viewer.show(viewer.i - 1); });
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); viewer.show(viewer.i + 1); });

    var zoom = fig.querySelector('.fig-zoom');
    if (zoom) zoom.addEventListener('click', function () { lbOpen(viewer); });

    // Optional GIF teaser: <img data-hover="…gif"> swaps in while the mouse is over the figure.
    var hasHover = imgs.some(function (im) { return im.dataset.hover; });
    if (hasHover) {
      fig.addEventListener('mouseenter', function () {
        var im = imgs[viewer.i];
        if (im.dataset.hover) { im.dataset.still = im.getAttribute('src'); im.src = im.dataset.hover; }
      });
      fig.addEventListener('mouseleave', function () {
        imgs.forEach(function (im) { if (im.dataset.still) { im.src = im.dataset.still; delete im.dataset.still; } });
      });
    }
  });
})();
