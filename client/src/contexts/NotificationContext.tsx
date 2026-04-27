import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  push: (icon: string, title: string, message: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const counterRef = useRef(0);

  const push = useCallback((icon: string, title: string, message: string) => {
    const id = `n-${Date.now()}-${counterRef.current++}`;
    setNotifications(prev => [
      { id, icon, title, message, timestamp: new Date(), read: false },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-events matching the prototype
  useEffect(() => {
    const events = [
      () => push('📞', 'שיחה נכנסת', 'יעל גבאי – מוכרת 3 חד׳ גבעתיים'),
      () => push('📵', 'שיחה שלא נענתה!', '058-7776543 · ניסה 2 פעמים – צריך להחזיר!'),
      () => push('🔁', 'Follow-up', 'אורן בן-דוד לא ענה 4 ימים – נשלח אוטומטית'),
      () => push('🎯', 'התאמה!', 'שרה גולן ↔ דוד כהן – 89%'),
      () => push('✅', 'הסכם נחתם', 'פנינה טל חתמה דיגיטלית'),
      () => push('🏆', 'עסקה נסגרה!', 'לימור ורד · 2.4M · ₪28,800'),
    ];
    let idx = 0;
    const interval = setInterval(() => {
      events[idx % events.length]();
      idx++;
    }, 10000);
    return () => clearInterval(interval);
  }, [push]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, push, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
