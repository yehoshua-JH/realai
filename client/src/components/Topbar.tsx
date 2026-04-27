// RealAI 2.0 — Topbar
// Design: Dark fintech, sticky, backdrop blur, RTL Hebrew
import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

const VIEW_LABELS: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'דשבורד ראשי', subtitle: 'סקירה כללית · עדכון בזמן אמת' },
  leads: { title: 'ניהול לידים', subtitle: '6 לידים פעילים · ממוינים לפי חום' },
  followup: { title: 'Follow-up אוטומטי', subtitle: '7 לידים ממתינים לתגובה' },
  missed: { title: 'שיחות שלא נענו', subtitle: '5 שיחות דורשות טיפול' },
  whatsapp: { title: 'WhatsApp Bot', subtitle: 'Claude AI · מגיב מיידית 24/7' },
  properties: { title: 'נכסים פעילים', subtitle: '12 נכסים · לחץ לראות קונים מתאימים' },
  pipeline: { title: 'Pipeline עסקאות', subtitle: '6 עסקאות פעילות · מעקב אוטומטי' },
  reminders: { title: 'תזכורות פגישות', subtitle: '4 פגישות מחר · תזכורות אוטומטיות' },
  manager: { title: 'דוח מנהל', subtitle: 'ביצועי סוכנים · החודש הנוכחי' },
};

interface TopbarProps {
  activeView: string;
  onLogout?: () => void;
  userName?: string;
  userAvatar?: string;
}

export default function Topbar({ activeView, onLogout, userName, userAvatar }: TopbarProps) {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const meta = VIEW_LABELS[activeView] ?? VIEW_LABELS.dashboard;

  const toggleNotifs = () => {
    setShowNotifs(v => !v);
    if (!showNotifs) markAllRead();
  };

  return (
    <header style={{
      padding: '14px 24px',
      borderBottom: '1px solid var(--ra-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(15,22,35,0.97)',
      backdropFilter: 'blur(14px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      fontFamily: "'Heebo', sans-serif",
    }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1.2 }}>{meta.title}</div>
        <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>{meta.subtitle}</div>
      </div>

      <div style={{ display: 'flex', gap: 7, alignItems: 'center', position: 'relative' }}>
        {/* User info + logout */}
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--ra-border)' }}>
            <span style={{ fontSize: 14 }}>{userAvatar}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ra-text)' }}>{userName}</span>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            title="התנתק"
            style={{ padding: '6px 10px', borderRadius: 7, fontSize: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', transition: 'all 0.15s' }}
          >
            🚪
          </button>
        )}
        {/* Notification Bell */}
        <button
          onClick={toggleNotifs}
          style={{
            position: 'relative',
            padding: '6px 10px',
            borderRadius: 7,
            fontSize: 14,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--ra-border)',
            color: 'var(--ra-text)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              left: -4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--ra-red)',
              color: '#fff',
              fontSize: 8,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </button>

        {/* Demo Button */}
        <button
          onClick={() => toast.success('🚀 Demo מופעל', { description: 'סימולציה של כל תהליכי האוטומציה' })}
          style={{
            padding: '6px 13px',
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--ra-border)',
            color: 'var(--ra-text)',
            cursor: 'pointer',
            fontFamily: "'Heebo', sans-serif",
            transition: 'all 0.15s',
          }}
        >
          ▶ הפעל Demo
        </button>

        <button
          onClick={() => toast.info('📊 דוח חודשי', { description: 'מייצר דוח PDF...' })}
          style={{
            padding: '6px 13px',
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 700,
            background: 'var(--ra-blue)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: "'Heebo', sans-serif",
            boxShadow: '0 0 14px rgba(59,130,246,0.25)',
            transition: 'all 0.15s',
          }}
        >
          📊 דוח חודשי
        </button>

        {/* Notifications Dropdown */}
        {showNotifs && (
          <div style={{
            position: 'absolute',
            top: 44,
            left: 0,
            width: 320,
            background: 'var(--ra-card)',
            border: '1px solid var(--ra-border)',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: 200,
            maxHeight: 400,
            overflowY: 'auto',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--ra-border)', fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>
              התראות אחרונות
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--ra-muted)', fontSize: 12 }}>אין התראות</div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n.id} style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--ra-border)',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  animation: 'slideInRight 0.3s ease',
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ra-text)' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginTop: 2 }}>{n.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
