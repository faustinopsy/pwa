self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request) 
      .then(cached => cached || fetch(event.request)) 
    );
  });
  
  const CACHE_NAME = 'v1';
  const STATIC_CACHE_URLS = ['/',
   'index.html', 
   'css/styles.css',
   'js/scripts.js',
   '404.html',
  'img/logo.jpg'
   
   ];
  
  self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    event.waitUntil(
      caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))  
    )
  }); 
  
  
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys()
      .then(keys => keys.filter(key => key !== CACHE_NAME))
      .then(keys => Promise.all(keys.map(key => {
          console.log(`Deleting cache ${key}`);
          return caches.delete(key)
      })))
    );
  });
  
  self.addEventListener("notificationclick", function (event) {
    if (!event.action) {
      console.log("sem Notificação Clique em OPÇÃO");
      return;
    }
    switch (event.action) {
      case "yes-action":
        console.log("YES");
        // abrir o site caso clique no icone trocar sitepwa por um site válido
        clients.openWindow("https://sitepwa.com/");
        break;
  
      case "no-action":
        console.log("NO");
        break;
  
      default:
        console.log(`Ação dada : ${event.action}`);
        break;
    }
    event.notification.close();
  });
  // caso haja inclusão para notificação push
  self.addEventListener("push", function (event) {
    let body = "";
    if (event.data) {
      body = event.data.text();
    } else {
      body = "Novidades do site";
    }
  
    let options = {
      body: body,
      icon: "img/logo.jpg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };
    event.waitUntil(
      self.registration.showNotification("Push Notification", options),
    );
  });