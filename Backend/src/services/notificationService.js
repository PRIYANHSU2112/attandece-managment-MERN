const admin = require('../config/firebase');
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

const sendNotification = async (userId, title, message, type = 'SYSTEM') => {
    try {
        const internalNotification = await Notification.create({
            user: userId,
            title,
            message,
            type,
        });

        const user = await User.findById(userId);
        if (user && user.fcmToken) {
            const payload = {
                notification: {
                    title,
                    body: message,
                },
                data: {
                    notificationId: internalNotification._id.toString(),
                    type,
                }
            };

            try {
                const response = await admin.messaging().send({
                    ...payload,
                    token: user.fcmToken
                });
                console.log(`[NotificationService] Push sent to ${user.name}:`, response);
            } catch (fcmError) {
                console.warn(`[NotificationService] FCM failed for ${user.name}:`, fcmError.message);
            }
        }

        return internalNotification;
    } catch (error) {
        console.error('[NotificationService] Error:', error);
    }
};

module.exports = {
    sendNotification,
};
