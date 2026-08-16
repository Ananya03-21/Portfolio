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
