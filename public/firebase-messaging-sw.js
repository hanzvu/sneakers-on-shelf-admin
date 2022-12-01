// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyB2bS5tpICGjAOPsKnZwx1Kcsu_3ZY-ubo",
    authDomain: "western-creek-366715.firebaseapp.com",
    projectId: "western-creek-366715",
    storageBucket: "western-creek-366715.appspot.com",
    messagingSenderId: "352159650122",
    appId: "1:352159650122:web:f298122a0daa4ddc3bb1b3",
    measurementId: "G-M2LD84PKKG"
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    /* console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions); */
})
