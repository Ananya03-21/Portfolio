// Layered-pinning scroll effect (GSAP + ScrollTrigger).
//
// Feel: you scroll through a section's full content normally, and only
// once you reach the bottom of that content does the next section slide
// up and stack over it. There is exactly ONE scroll context (the page),
// so the wheel behaves normally anywhere on screen.
//
// The key is the variable-height pin recipe: a panel taller than the
// viewport doesn't pin at "top top" (which would freeze it before you'd
// read it) — it pins at "bottom bottom", i.e. only once its last line
// has scrolled into view. Panels at exactly one viewport tall behave
// identically under both.
//
// No infinite looping — the page ends normally at the Contact footer.
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

  // Stacking order is assigned here rather than with hardcoded
  // :nth-of-type rules in CSS, so adding/removing a section can't
  // silently break the layering.
  panels.forEach(function (panel, i) {
    panel.style.zIndex = String(i + 1);
  });

  // The footer has to sit above every panel, otherwise it scrolls
  // underneath the last (pinned, position:fixed) panel and is never
  // visible. Derived from the panel count so it can't drift.
  var footer = document.querySelector('.close');
  if (footer) {
    footer.style.position = 'relative';
    footer.style.zIndex = String(panels.length + 1);
  }

  panels.forEach(function (panel) {
    ScrollTrigger.create({
      trigger: panel,
      // Short panel: pin as soon as it fills the screen.
      // Tall panel: let it scroll through completely first, then pin
      // once its bottom edge reaches the bottom of the viewport.
      start: function () {
        return panel.offsetHeight < window.innerHeight ? 'top top' : 'bottom bottom';
      },
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });
  });

  // Panels change height as images load and fonts swap in, which moves
  // every pin boundary — re-measure once things settle.
  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

  // --- Nav links -----------------------------------------------------
  //
  // Anchor scrolling can't use trigger.start: with pinSpacing:false a
  // tall panel's pin *starts* at its bottom, not its top, so jumping
  // there would land at the wrong end of the section.
  //
  // Because every pinned panel consumes exactly its own height of
  // scroll distance (tall panel: (h - vh) scrolling naturally, then vh
  // pinned while the next slides over = h), the scroll position that
  // puts panel i flush against the top of the viewport is simply the
  // sum of the heights of the panels before it.
  function scrollTargetFor(el) {
    var index = panels.indexOf(el);
    var total = 0;
    var upTo = index > -1 ? index : panels.length; // non-panel (footer) sits after all panels
    for (var i = 0; i < upTo; i++) {
      total += panels[i].offsetHeight;
    }
    return total;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      // #skills now lives inside the About panel rather than being its
      // own section, so resolve any in-panel anchor to its parent panel.
      var panelEl = target.closest('.panel') || target;

      var y = scrollTargetFor(panelEl);
      var maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (y > maxY) y = maxY;

      // Native smooth scroll rather than GSAP's ScrollToPlugin: tweening
      // the scroll position fights ScrollTrigger's own scroll observer
      // when a jump crosses several pin boundaries at once.
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
