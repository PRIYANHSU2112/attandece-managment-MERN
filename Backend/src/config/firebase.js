const admin = require('firebase-admin');

const serviceAccount = require("./attendance-8ee17-firebase-adminsdk-fbsvc-27ae1f9d70.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
