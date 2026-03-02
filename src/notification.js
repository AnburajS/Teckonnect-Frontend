import { REST_CONFIG } from './constants/rest-config';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

export const firebaseInitialization = () => {
  try {
    const firebaseConfig = {
      apiKey: REST_CONFIG.FIREBASE_API_KEY,
      authDomain: REST_CONFIG.FIREBASE_AUTH_DOMAIN,
      projectId: REST_CONFIG.FIREBASE_PROJECT_ID,
      storageBucket: REST_CONFIG.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: REST_CONFIG.FIREBASE_MESSAGING_SENDER_ID,
      appId: REST_CONFIG.FIREBASE_APP_ID,
      measurementId: REST_CONFIG.FIREBASE_MEASUREMENT_ID,
    };
    const intializedApp = initializeApp(firebaseConfig);
    enableNotification(intializedApp);
  } catch (error) {}
};

export const enableNotification = async (intializedApp) => {
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    getTokenFunction(intializedApp);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    let permission = await Notification.requestPermission();
    // If the user accepts, let's create a notification
    if (permission === 'granted') {
      getTokenFunction(intializedApp);
    }
  }
};

const getTokenFunction = async (intializedApp) => {
  const messaging = getMessaging(intializedApp);
  try {
    let currentToken = await getToken(messaging, {
      vapidKey: REST_CONFIG.FIREBASE_VAPIDKEY,
    });
    localStorage.setItem('deviceToken', currentToken);
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
};
