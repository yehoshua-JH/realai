// RealAI 2.0 — Sidebar Navigation
// Design: Dark fintech, fixed right sidebar, RTL Hebrew, Heebo font
import { useNotifications } from "@/contexts/NotificationContext";

export type ViewId = 'dashboard' | 'leads' | 'followup' | 'properties' | 'whatsapp' | 'pipeline' | 'reminders' | 'missed' | 'manager';

interface NavItem {
  id: ViewId;
  icon: string;
  label: string;
  section?: string;
  badge?: number;
  badgeType?: 'red' | 'yellow' | 'green';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: '📊', label: 'דשבורד', section: 'ראשי' },
  { id: 'leads', icon: '🎯', label: 'לידים', badge: 3, badgeType: 'red' },
  { id: 'followup', icon: '🔁', label: 'Follow-up', badge: 7, badgeType: 'yellow' },
  { id: 'missed', icon: '📵', label: 'שיחות שלא נענו', badge: 5, badgeType: 'red', section: 'תקשורת' },
  { id: 'whatsapp', icon: '💬', label: 'WhatsApp Bot' },
  { id: 'properties', icon: '🏠', label: 'נכסים', section: 'ניהול' },
  { id: 'pipeline', icon: '📈', label: 'Pipeline' },
  { id: 'reminders', icon: '📅', label: 'תזכורות', badge: 4, badgeType: 'green' },
  { id: 'manager', icon: '👑', label: 'מנהל', section: 'דוחות' },
];

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  missedCount: number;
}

export default function Sidebar({ activeView, onNavigate, missedCount }: SidebarProps) {
  const { unreadCount } = useNotifications();

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 220,
        height: '100vh',
        background: 'var(--ra-card)',
        borderLeft: '1px solid var(--ra-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        fontFamily: "'Heebo', sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid var(--ra-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, var(--ra-blue), var(--ra-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          flexShrink: 0,
          boxShadow: '0 0 16px rgba(59,130,246,0.35)',
        }}>🏠</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1.2 }}>
            Real<span style={{ color: 'var(--ra-blue)' }}>AI</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--ra-muted)', letterSpacing: 1.5, textTransform: 'uppercase' }}>v2.0</div>
        </div>
        {unreadCount > 0 && (
          <div style={{
            marginRight: 'auto',
            background: 'rgba(239,68,68,0.18)',
            color: '#ff6b6b',
            fontSize: 9,
            fontWeight: 800,
            padding: '1px 6px',
            borderRadius: 100,
          }}>{unreadCount}</div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item, i) => {
          const prevItem = NAV_ITEMS[i - 1];
          const showSection = item.section && item.section !== prevItem?.section;
          const badge = item.id === 'missed' ? missedCount : item.badge;

          return (
            <div key={item.id}>
              {showSection && (
                <div style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'var(--ra-muted)',
                  padding: '0 10px',
                  margin: '12px 0 4px',
                }}>
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '8px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  color: activeView === item.id ? 'var(--ra-blue)' : 'var(--ra-muted)',
                  background: activeView === item.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                  border: 'none',
                  width: '100%',
                  textAlign: 'right',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  marginBottom: 1,
                  fontFamily: "'Heebo', sans-serif",
                }}
                onMouseEnter={e => {
                  if (activeView !== item.id) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.06)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--ra-text)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeView !== item.id) {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--ra-muted)';
                  }
                }}
              >
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {badge && badge > 0 ? (
                  <span style={{
                    fontSize: 9,
                    fontWeight: 800,
                    borderRadius: 100,
                    padding: '1px 6px',
                    background: item.badgeType === 'red' ? 'rgba(239,68,68,0.18)' : item.badgeType === 'yellow' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.13)',
                    color: item.badgeType === 'red' ? '#ff6b6b' : item.badgeType === 'yellow' ? 'var(--ra-yellow)' : 'var(--ra-green)',
                  }}>{badge}</span>
                ) : null}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Live Bar */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--ra-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--ra-green)',
        fontWeight: 600,
      }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'var(--ra-green)',
          boxShadow: '0 0 5px var(--ra-green)',
          animation: 'blink 1.5s infinite',
          flexShrink: 0,
        }} />
        מערכת פעילה · Bot ON
      </div>
    </aside>
  );
}
