if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      console.log('Service Worker registrado correctamente:', reg.scope);
    }).catch(function (err) {
      console.log('Error registrando el service worker:', err);
    });
  });
}
