import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  contentId?: string;
  contentType?: string;
  contentTitle?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user._id || user.id;
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    return null;
  };

  const fetchUnreadCount = useCallback(async () => {
    const userId = getUserId();
    console.log('📊 Fetching unread count for user:', userId);
    if (!userId) {
      console.log('⚠️ No user ID found, skipping notification fetch');
      return;
    }

    try {
      const url = `${API_URL}/notifications/unread-count`;
      console.log('📡 Fetching from:', url);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        }
      });
      
      console.log('📥 Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Unread count data:', data);
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoading(true);
      const url = `${API_URL}/notifications?limit=2${unreadOnly ? '&unreadOnly=true' : ''}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter out notifications older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentNotifications = (data.notifications || []).filter((notif: Notification) => 
          new Date(notif.createdAt) > thirtyDaysAgo
        );
        setNotifications(recentNotifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationIds?: string[]) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ notificationIds })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
        
        // Update local state
        setNotifications(prev => 
          prev.map(notif => {
            if (!notificationIds || notificationIds.includes(notif._id)) {
              return { ...notif, isRead: true };
            }
            return notif;
          })
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        }
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [fetchUnreadCount]);

  // Auto-fetch unread count on mount and every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification
  };
};
