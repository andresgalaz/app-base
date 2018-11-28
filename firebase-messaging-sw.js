// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '332329094674'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
var msg = firebase.messaging();

msg.setBackgroundMessageHandler(function(payload) {
    if (DEBUG) console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    var servidor = window.location.origin + window.location.pathname,
        notificationTitle = 'HA - App Programas Especiales',
        notificationOptions = {
        body: payload.notification.body,
        icon: '/resources/pwa96.png',
        click_action : payload.data.url ? servidor + '#' + payload.data.url : null
      };
  
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
    if (DEBUG) console.log('[notificationclick] event', event);
    const clickedNotification = event.notification;
    clickedNotification.close();
  
    // Do something as the result of the notification click
    // const promiseChain = doSomething();
    // event.waitUntil(promiseChain);
});
// console.log('firebase-messaging-sw');