# Frontend Documentation

React application for the Attendance Management System.

## Architecture
Built with React and Vite. State management is handled via Redux Toolkit, and API communication uses RTK Query.

- **App State**: Managed in `src/app/store.js`.
- **API Layers**: Located in `src/features/` (auth, attendance, etc.).
- **UI Components**: Reusable components in `src/components/` and role-specific tabs.
- **Messaging**: FCM setup in `src/config/firebase.js` and `public/firebase-messaging-sw.js`.

## Setup
1. `npm install`
2. Update the Firebase credentials in `src/config/firebase.js`.
3. `npm run dev`

## Features
- **Punch In/Out UI**: Uses browser camera for selfies and Geolocation API for coordinate tracking.
- **Role-Based Views**: Dashboards dynamically change based on user role (Admin/Manager/Employee).
- **Push Notifications**:
    - Background: Handled by Service Worker.
    - Foreground: Handled by a custom Toast component in `App.jsx`.
- **Reporting**: Integrated Excel download functionality in monitoring views.
- **Theme Support**: Persistent Light/Dark mode with CSS transitions.

## Technical Details
- **Routing**: Handled by `react-router-dom`.
- **Service Worker**: Must be in the `public` folder to be served correctly at the root scope.
- **Hardware Access**: Camera and Location require HTTPS or localhost.
- **Permissions**: App checks for `Notification.permission` before requesting tokens to avoid UI hangups.
