/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

firebase.initializeApp({
    apiKey: "AIzaSyB-aEYjSIMXtAI7Z7jILhrR81quV9L319s",
    authDomain: "enliteu-crayond.firebaseapp.com",
    projectId: "enliteu-crayond",
    storageBucket: "enliteu-crayond.appspot.com",
    messagingSenderId: "16677502716",
    appId: "1:16677502716:web:8791605d0ee88792912179",
    measurementId: "G-T4PFZZTKZV"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();