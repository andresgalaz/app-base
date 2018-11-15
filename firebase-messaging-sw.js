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
const msg = firebase.messaging();

// msg.setBackgroundMessageHandler(function(payload) {
//     if (DEBUG) console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     var notificationTitle = 'Background Message Title';
//     var notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/resources/pwa96.png'
//     };
  
//     return self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('notificationclick', function(event) {
    if (DEBUG) console.log('[notificationclick] event', event);
    const clickedNotification = event.notification;
    clickedNotification.close();
  
    // Do something as the result of the notification click
    const promiseChain = doSomething();
    event.waitUntil(promiseChain);
});
// console.log('firebase-messaging-sw');