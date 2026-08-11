import { createContext, useContext, useRef, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const idCounter = useRef(0);

  const push = (notif) => {
    const id = `n-${idCounter.current++}`;
    setNotifications((prev) => [{ id, read: false, time: Date.now(), ...notif }, ...prev].slice(0, 30));
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const clear = () => setNotifications([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, push, markAllRead, dismiss, clear }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
