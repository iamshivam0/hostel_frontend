/**
 * Firebase Cloud Messaging service worker (required for web push).
 * Replace the config below with your Firebase web app config from:
 * Firebase Console > Project Settings > General > Your apps > Web app.
 * Use the same Firebase project as your mobile app.
 */
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js");
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
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
