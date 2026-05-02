const express = require('express');
const router = express.Router();
const { sendTestNotification } = require('../controllers/testController');

router.post('/notification', sendTestNotification);

module.exports = router;
