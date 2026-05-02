# Attendance Management System

A full-stack attendance tracking platform with location validation, selfie-based punching, and automated notifications.

## Project Overview
The system is divided into two main parts:
1. **Backend**: Node.js/Express server handling data, authentication, and background jobs.
2. **Frontend**: React-based dashboard for employees, managers, and admins.

## Getting Started

### Backend
1. Go to the `Backend` directory.
2. Run `npm install`.
3. Configure your `.env` file (see Backend README for details).
4. Start the server with `npm run dev`.

### Frontend
1. Go to the `frontend` directory.
2. Run `npm install`.
3. Set up your Firebase config in `src/config/firebase.js`.
4. Start the app with `npm run dev`.

## Core Features
- **Punch In/Out**: Requires a selfie and geolocation check (geofencing).
- **Notifications**: Automated 10:00 AM alerts for missed punches via FCM.
- **Approvals**: Managers can approve or reject overtime requests with real-time push alerts.
- **Reporting**: Export attendance and overtime data to Excel from the monitoring tabs.
- **Admin Tools**: Manage users, company settings, and validate biometric matches.

## Technical Assumptions
- User allows Camera and Location permissions in the browser.
- Notifications are enabled for the domain.
- The app is running on a secure context (HTTPS or localhost) for hardware access.
- MongoDB is accessible and properly configured.
