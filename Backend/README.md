# Backend Documentation

Node.js/Express server for the Attendance Management System.

## Architecture
The server uses a standard MVC structure with a service layer for background tasks and external integrations.

- **Controllers**: Define route logic and handle input validation.
- **Services**: Business logic for Cron jobs, FCM notifications, and Excel generation.
- **Models**: Mongoose schemas for MongoDB.
- **Routes**: API endpoints protected by JWT middleware.

## Setup
1. Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

2. Add your Firebase service account JSON to `src/config/`.
3. Install dependencies: `npm install`
4. Start development: `npm run dev`

## Features
- **Auth**: JWT-based login and registration with role levels (Admin, Manager, Employee).
- **Geofencing**: Logic to verify if punch-in coordinates are within the office radius.
- **Cron Jobs**: Scheduled daily check at 10:00 AM to notify employees who haven't punched in.
- **Notification Service**: Centralized handler for DB records and FCM push delivery.
- **Excel Export**: Streaming Excel generation using `ExcelJS` for attendance and OT reports.
- **Image Handling**: Integration with Cloudinary for selfie storage.

## Assumptions
- Server time is used for cron scheduling.
- FCM tokens are sent from the frontend during auth.
- Managers are linked to employees via `managerId` for data scoping.
