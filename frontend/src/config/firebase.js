import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBkyYuyacZ1q_Lvai7WGgaXqV7NdSlQ2uo",
  authDomain: "attendance-8ee17.firebaseapp.com",
  projectId: "attendance-8ee17",
  storageBucket: "attendance-8ee17.firebasestorage.app",
  messagingSenderId: "33535082497",
  appId: "1:33535082497:web:2c9ced893b23963f9c4000",
  measurementId: "G-VFE73ET1EV"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return null;
  }
  if (Notification.permission === 'denied') {
    console.log('Notification permission is denied by user');
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: "BOF-uRA54lActJ80urlNWyYag74wpurVUvB8VuvSnAYyslTqo9yi3Jpd5NygM3zhr0LJPpZNdb7yJHqMSfVtfxs"
      });
      if (currentToken) {
        console.log('Generated FCM Token:', currentToken);
        return currentToken;
      }
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
  }
  return null;
};

export const onMessageListener = (callback) => {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
};

export default app;
