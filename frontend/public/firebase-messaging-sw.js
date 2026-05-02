importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBkyYuyacZ1q_Lvai7WGgaXqV7NdSlQ2uo",
  authDomain: "attendance-8ee17.firebaseapp.com",
  projectId: "attendance-8ee17",
  storageBucket: "attendance-8ee17.firebasestorage.app",
  messagingSenderId: "33535082497",
  appId: "1:33535082497:web:2c9ced893b23963f9c4000",
  measurementId: "G-VFE73ET1EV"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("push", function (event) {
  console.log("[SW] Push received:", event);

  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.warn("[SW] Error parsing push data:", e);
    data = {};
  }

  const title = data.notification?.title || data.title || "Test Title";
  const body = data.notification?.body || data.body || "Test Body";

  const options = {
    body: body,
    icon: "/firebase-logo.png",
    badge: "/firebase-logo.png",
    data: data.data || data
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log("[SW] Notification clicked");
  event.notification.close();
});
