const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');

const sendTestNotification = asyncHandler(async (req, res) => {
    const { token, title, body } = req.body;

    if (!token) {
        res.status(400);
        throw new Error('FCM Token is required');
    }

    const message = {
        notification: {
            title: title || 'Test Notification',
            body: body || 'This is a test message from the Attendance System',
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('🚀 [FCM SUCCESS] Notification sent to Google servers. Message ID:', response);
        res.json({
            success: true,
            messageId: response,
            details: 'Notification sent successfully',
        });
    } catch (error) {
        console.error('FCM Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            tip: 'Ensure your serviceAccountKey.json is in src/config and firebase is initialized.'
        });
    }
});

module.exports = {
    sendTestNotification,
};
