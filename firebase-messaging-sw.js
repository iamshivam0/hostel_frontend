import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
    apiKey: "AIzaSyCaN_a5mqyexlHmf6emRuwR-C2PgNSlWcg",
    authDomain: "first-project-b7e96.firebaseapp.com",
    projectId: "first-project-b7e96",
    storageBucket: "first-project-b7e96.firebasestorage.app",
    messagingSenderId: "842145969374",
    appId: "1:842145969374:web:780d33c996f32893d03e4f",
    measurementId: "G-K0WR5RC353"
};
const app = initializeApp(firebaseConfig)


const messaging = getMessaging(app);
onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});