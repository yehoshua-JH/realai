// RealAI 2.0 — Manager View
import { agents } from "@/lib/data";
import { exportAgentsCSV } from "@/lib/export";
import { toast } from "sonner";

const TEAM_STATS = [
  { icon: '🎯', label: 'סה״כ לידים', value: 60, color: 'var(--ra-blue)' },
  { icon: '🏠', label: 'סיורים', value: 20, color: 'var(--ra-green)' },
  { icon: '🤝', label: 'סגירות', value: 3, color: 'var(--ra-purple)' },
  { icon: '💰', label: 'הכנסות', value: '₪42K', color: 'var(--ra-yellow)' },
];

export default function ManagerView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Team Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {TEAM_STATS.map(stat => (
          <div key={stat.label} style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 13, padding: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 8 }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Agent Leaderboard */}
        <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>ביצועי סוכנים</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>החודש הנוכחי</div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }} id="agentsTable">
            {agents.map((agent, i) => (
              <div key={agent.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'var(--ra-card2)',
                borderRadius: 9,
                padding: '11px 14px',
                animation: `fadeInUp 0.35s ease both`,
                animationDelay: `${i * 0.06}s`,
              }}>
                <div style={{ fontSize: 18 }}>{agent.medal}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)' }}>{agent.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--ra-muted)', marginTop: 2 }}>
                    {agent.leads} לידים · {agent.tours} סיורים · {agent.closes} סגירות
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: agent.color }}>{agent.earnings}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Chart */}
        <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>ביצועים חודשיים</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>לידים · סיורים · סגירות</div>
          </div>
          <div style={{ padding: '14px 18px' }}>
            {/* Simple bar chart */}
            {[
              { label: 'ינואר', leads: 18, tours: 7, closes: 2 },
              { label: 'פברואר', leads: 22, tours: 9, closes: 1 },
              { label: 'מרץ', leads: 19, tours: 8, closes: 3 },
              { label: 'אפריל', leads: 24, tours: 8, closes: 3 },
            ].map((month, i) => (
              <div key={month.label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginBottom: 5 }}>{month.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'לידים', value: month.leads, max: 30, color: 'var(--ra-blue)' },
                    { label: 'סיורים', value: month.tours, max: 15, color: 'var(--ra-green)' },
                    { label: 'סגירות', value: month.closes, max: 5, color: 'var(--ra-purple)' },
                  ].map(bar => (
                    <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 9, color: 'var(--ra-muted)', width: 40, textAlign: 'right', flexShrink: 0 }}>{bar.label}</div>
                      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(bar.value / bar.max) * 100}%`, background: bar.color, borderRadius: 100, transition: 'width 1s ease' }} />
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--ra-text)', width: 20, textAlign: 'left', flexShrink: 0 }}>{bar.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>ייצוא דוחות</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>הפק דוחות מפורטים לכל סוכן</div>
        </div>
        {[
          { label: '📊 דוח CSV', action: () => { exportAgentsCSV(agents); toast.success('📊 דוח CSV הורד'); } },
          { label: '📋 ייצוא Excel', action: () => { exportAgentsCSV(agents); toast.success('📋 קובץ הורד'); } },
          { label: '📧 שלח לסוכנים', action: () => toast.success('📧 נשלח', { description: 'הדוח נשלח לכל הסוכנים' }) },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--ra-border)',
              color: 'var(--ra-text)',
              cursor: 'pointer',
              fontFamily: "'Heebo', sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ra-border2)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ra-border)'}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
