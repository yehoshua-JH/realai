// RealAI 2.0 — Dashboard View
// Design: Dark fintech, stats grid, activity feed, lead score pills
import { useEffect, useState } from "react";
import { activityFeed, dashboardStats, leads } from "@/lib/data";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

export default function DashboardView() {
  const { push } = useNotifications();
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setEventCount(c => c + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const hotLeads = leads.filter(l => l.status === 'hot').length;
  const warmLeads = leads.filter(l => l.status === 'warm').length;
  const coldLeads = leads.filter(l => l.status === 'cold').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {dashboardStats.map(stat => (
          <div key={stat.id} style={{
            background: 'var(--ra-card)',
            border: '1px solid var(--ra-border)',
            borderRadius: 13,
            padding: 16,
            transition: 'all 0.2s',
            cursor: 'default',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border2)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: 'var(--ra-green)' }}>
                {stat.delta}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1, letterSpacing: -1 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>{stat.label}</div>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 100, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 100, background: stat.color, width: `${stat.barWidth}%`, transition: 'width 1.2s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>

        {/* Activity Feed */}
        <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>פעילות בזמן אמת</div>
              <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>עדכון אוטומטי</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: 'var(--ra-green)' }}>
              {eventCount + activityFeed.length} אירועים
            </span>
          </div>
          <div style={{ padding: '0 18px' }}>
            {activityFeed.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '10px 0',
                borderBottom: i < activityFeed.length - 1 ? '1px solid var(--ra-border)' : 'none',
                animation: 'slideInRight 0.3s ease both',
                animationDelay: `${i * 0.05}s`,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, background: 'rgba(255,255,255,0.04)' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {item.name}
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 100,
                      background: item.badgeClass === 'buy' ? 'rgba(59,130,246,0.13)' : item.badgeClass === 'sell' ? 'rgba(139,92,246,0.13)' : item.badgeClass === 'hot' ? 'rgba(255,71,87,0.13)' : 'rgba(116,185,255,0.1)',
                      color: item.badgeClass === 'buy' ? '#7db3ff' : item.badgeClass === 'sell' ? '#c4b5fd' : item.badgeClass === 'hot' ? '#ff6b6b' : 'var(--ra-cold)',
                      ...(item.isNew ? { animation: 'pulseBadge 2s infinite' } : {}),
                    }}>
                      {item.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ra-muted)', marginTop: 2, lineHeight: 1.4 }}>{item.text}</div>
                </div>
                <div style={{ fontSize: 9, color: 'var(--ra-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{item.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Lead Score Pills */}
          <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>ניקוד לידים</div>
              <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>AI מדרג בזמן אמת</div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[
                  { label: 'חמים', emoji: '🔥', count: hotLeads, borderColor: 'rgba(255,71,87,0.25)', bg: 'rgba(255,71,87,0.04)', color: '#ff6b6b' },
                  { label: 'פושרים', emoji: '🌡️', count: warmLeads, borderColor: 'rgba(255,165,2,0.2)', bg: 'rgba(255,165,2,0.03)', color: 'var(--ra-yellow)' },
                  { label: 'קרים', emoji: '❄️', count: coldLeads, borderColor: 'rgba(116,185,255,0.15)', bg: 'rgba(116,185,255,0.03)', color: 'var(--ra-cold)' },
                ].map(pill => (
                  <div key={pill.label} style={{
                    border: `1px solid ${pill.borderColor}`,
                    borderRadius: 12,
                    padding: 12,
                    textAlign: 'center',
                    background: pill.bg,
                    cursor: 'pointer',
                    transition: 'all 0.18s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{pill.emoji}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: pill.color, marginBottom: 3 }}>{pill.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1 }}>{pill.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>פעולות מהירות</div>
            </div>
            <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { icon: '🚀', label: 'שלח Follow-up לכולם', color: 'var(--ra-blue)', action: () => { push('🚀', 'נשלח לכולם', '7 הודעות follow-up נשלחו אוטומטית'); toast.success('🚀 נשלח לכולם', { description: '7 הודעות follow-up נשלחו' }); } },
                { icon: '📞', label: 'החזר שיחות שלא נענו', color: 'var(--ra-red)', action: () => { push('📞', 'מתקשר לכולם', '5 שיחות חוזרות מתוזמנות'); toast.info('📞 מתוזמן', { description: '5 שיחות חוזרות' }); } },
                { icon: '📊', label: 'הפק דוח שבועי', color: 'var(--ra-green)', action: () => toast.success('📊 דוח מוכן', { description: 'הדוח השבועי נשלח למייל' }) },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '9px 12px',
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--ra-border)',
                    color: 'var(--ra-text)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: "'Heebo', sans-serif",
                    textAlign: 'right',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ra-border2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ra-border)';
                  }}
                >
                  <span style={{ fontSize: 16 }}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Missed Calls Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(245,158,11,0.04))',
            border: '1px solid rgba(239,68,68,0.18)',
            borderRadius: 12,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: 24 }}>📵</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>
                <span id="dashMissedBadge" style={{ color: 'var(--ra-red)' }}>5</span> שיחות שלא נענו
              </div>
              <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>דורשות טיפול מיידי</div>
            </div>
            <button
              onClick={() => toast.warning('📞 מתקשר לכולם', { description: '5 שיחות חוזרות מתוזמנות' })}
              style={{
                padding: '5px 11px',
                borderRadius: 7,
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(239,68,68,0.12)',
                color: '#ff6b6b',
                border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer',
                fontFamily: "'Heebo', sans-serif",
              }}
            >
              📞 טפל
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
