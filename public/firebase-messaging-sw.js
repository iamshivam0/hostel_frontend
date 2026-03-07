/**
 * Firebase Cloud Messaging service worker (required for web push).
 * Replace the config below with your Firebase web app config from:
 * Firebase Console > Project Settings > General > Your apps > Web app.
 * Use the same Firebase project as your mobile app.
 */
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDLeCgx8SZbAj5z0r3O5HYZ3uPa9y4p7pI",
  authDomain: "nivas-c9c18.firebaseapp.com",
  projectId: "nivas-c9c18",
  storageBucket: "nivas-c9c18.firebasestorage.app",
  messagingSenderId: "1062291144163",
  appId: "1:1062291144163:web:1234567890abcdef1234567890abcdef",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? payload.data?.title ?? "Announcement";
  const options = {
    body: payload.notification?.body ?? payload.data?.body ?? "",
    icon: "/icons/icon-192x192.png",
    data: payload.data ?? {},
  };
  self.registration.showNotification(title, options);
});
