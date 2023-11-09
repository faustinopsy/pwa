let deferredPrompt; 
let setupButton;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .then(serviceWorker => {
        console.log('Rodando serviço: ' + serviceWorker);
      })
      .catch(error => {
        console.log('Error registering the Service Worker: ' + error);
      });
  }
  function registerNotification() {
      Notification.requestPermission(permission => {
          if (permission === 'granted'){ registerBackgroundSync() }
          else console.error("Sem permissão.")
      })
  }
  function registerBackgroundSync() {
      if (!navigator.serviceWorker){
          return console.error("Serviço não suportado")
      }
      navigator.serviceWorker.ready
      .then(registration => registration.sync.register('syncAttendees'))
      .then(() => console.log("Registered background sync"))
      .catch(err => console.error("Error registering background sync", err))
  }
  window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      console.log("beforeinstallprompt fired");
      if (setupButton == undefined) {
          setupButton = document.getElementById("buttonInstall");
      }
      // mostrar o botão de instalção
      setupButton.style.display = "block";
      setupButton.disabled = false;
  });
  function installApp() {
      // abre a função para instalar
      deferredPrompt.prompt();
      setupButton.disabled = true;
      deferredPrompt.userChoice
          .then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                  console.log('PWA setup accepted');
                  // ocultar o botão em caso de o app esta instalado
                  setupButton.style.display = 'none';
              } else {
                  console.log('PWA setup rejected');
              }
              deferredPrompt = null;
          });
  }
  window.addEventListener('appinstalled', (evt) => {
      console.log("appinstalled fired", evt);
  });
  
  