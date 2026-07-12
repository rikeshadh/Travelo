import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/chat/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchNotifications();
      // Setup a periodic check for notifications
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [token, user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/chat/notifications/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
