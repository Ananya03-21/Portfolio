document.addEventListener('click', function (e) {
  var btn = e.target.closest('.js-copy-email');
  if (!btn) return;

  var email = btn.getAttribute('data-email');
  var original = btn.textContent;

  navigator.clipboard.writeText(email).then(function () {
    btn.textContent = 'Copied!';
    btn.classList.add('is-copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-copied');
    }, 1600);
  });
});

var navToggle = document.querySelector('.nav-toggle');
var navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Flip card: skull-and-roses video
document.querySelectorAll('.play-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var card = btn.closest('.flip-card');
    var video = card.querySelector('video');
    card.classList.add('is-flipped');
    video.currentTime = 0;
    video.play();
  });
});

document.querySelectorAll('.flip-back-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var card = btn.closest('.flip-card');
    var video = card.querySelector('video');
    card.classList.remove('is-flipped');
    video.pause();
  });
});

// Lightbox: click a gallery image to view it larger (desktop/tablet only)
var lightbox = document.getElementById('lightbox');

if (lightbox) {
  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');

  var lightboxEnabled = function () {
    return window.matchMedia('(min-width: 861px)').matches;
  };

  var openLightbox = function (src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  var closeLightbox = function () {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.addEventListener('click', function () {
      if (!lightboxEnabled()) return;
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
}
