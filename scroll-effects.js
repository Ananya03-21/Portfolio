// Layered-pinning scroll effect (GSAP + ScrollTrigger), based on the
// pattern in GSAP's own "Layered pinning" demo:
// https://codepen.io/GreenSock/pen/VwbywPd
// The infinite-loop part of that demo is intentionally left out —
// this page just ends normally after the last panel.
(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return; // CDN failed to load — page still works as a normal scrolling page.
  }

  gsap.registerPlugin(ScrollTrigger);

  var panels = gsap.utils.toArray('.panel');
  if (!panels.length) return;

  document.body.classList.add('panels-active');

  var triggers = panels.map(function (panel) {
    return ScrollTrigger.create({
      trigger: panel,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      pinSpacing: false,
    });
  });

  // Panels can change height (images loading, fonts swapping in, the
  // hamburger menu opening, etc.), so re-measure once things settle.
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

  // Nav links use plain "#id" hrefs. Native hash-jump doesn't account
  // for ScrollTrigger's pin spacers, so intercept clicks and scroll to
  // each panel's actual pinned position instead.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      var panelIndex = panels.indexOf(target);
      var y;
      if (panelIndex > -1) {
        y = triggers[panelIndex].start;
      } else {
        // Non-panel target (e.g. the Contact footer) — scroll to it normally.
        y = target.getBoundingClientRect().top + window.scrollY;
      }

      // Plain native smooth-scroll rather than GSAP's ScrollToPlugin:
      // animating window.scrollTo via a GSAP tween fights with
      // ScrollTrigger's own scroll observer when the jump crosses
      // multiple pin boundaries at once (the tween reports complete
      // early while a second, delayed correction actually finishes
      // the scroll). The browser's native smooth-scroll doesn't have
      // that conflict.
      window.scrollTo({ top: y, behavior: 'smooth' });

      var navLinks = document.querySelector('.nav-links');
      var navToggle = document.querySelector('.nav-toggle');
      if (navLinks && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
