(function () {
  var chips = document.querySelectorAll('[data-chip]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.classList.toggle('is-active');
    });
  });

  var toast = document.getElementById('demo-toast');
  var toastButton = document.querySelector('[data-show-toast]');
  var timer;
  if (toast && toastButton) {
    toastButton.addEventListener('click', function () {
      clearTimeout(timer);
      toast.classList.add('is-visible');
      timer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2800);
    });
  }

  var copyButton = document.querySelector('[data-copy-demo]');
  if (copyButton) {
    copyButton.addEventListener('click', function () {
      var code = document.getElementById('demo-code').textContent;
      navigator.clipboard.writeText(code).then(function () {
        copyButton.textContent = 'Copiado';
        setTimeout(function () { copyButton.textContent = 'Copiar'; }, 1600);
      });
    });
  }
})();
