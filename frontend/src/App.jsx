import { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { onMessageListener } from './config/firebase';
import Toast from './components/Toast';

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      console.log("Notification received in foreground:", payload);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-700">
      {notification && (
        <Toast 
          title={notification.title} 
          body={notification.body} 
          onClose={() => setNotification(null)} 
        />
      )}
      <AppRoutes />
    </div>
  );
}

export default App;
