// RealAI 2.0 — Reminders View
import { useState } from "react";
import { appointments, Appointment } from "@/lib/data";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

const STATUS_CONFIG = {
  confirmed: { border: 'rgba(16,185,129,0.3)', accent: 'var(--ra-green)', badge: '✅ אישר', badgeBg: 'rgba(16,185,129,0.12)', badgeColor: 'var(--ra-green)', icon: '🤝' },
  pending: { border: 'rgba(245,158,11,0.3)', accent: 'var(--ra-yellow)', badge: '⏳ לא ענה', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: 'var(--ra-yellow)', icon: '⏳' },
  cancelled: { border: 'rgba(239,68,68,0.25)', accent: 'var(--ra-red)', badge: '❌ ביטל', badgeBg: 'rgba(239,68,68,0.12)', badgeColor: 'var(--ra-red)', icon: '❌' },
};

export default function RemindersView() {
  const { push } = useNotifications();
  const [appts, setAppts] = useState<Appointment[]>(appointments);
  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [showSim, setShowSim] = useState(false);

  const confirmed = appts.filter(a => a.status === 'confirmed').length;
  const pending = appts.filter(a => a.status === 'pending').length;
  const cancelled = appts.filter(a => a.status === 'cancelled').length;

  const confirmAppt = (id: string, name: string) => {
    setAppts(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed', nightCallResult: 'confirmed' } : a));
    push('✅', 'אישר פגישה!', `${name} אישר את הפגישה מחר`);
    toast.success(`✅ ${name} אישר!`);
  };

  const runSimulation = async () => {
    setSimulating(true);
    setShowSim(true);
    setSimLog([]);
    const lines = [
      '📞 מתקשרים ליוסי דוד...',
      '',
      '🤖 המערכת: "שלום יוסי!"',
      '🤖 "יש לך פגישת סיור מחר ב-10:00"',
      '🤖 "עם הנכס ברחוב הרצל 12, פ״ת"',
      '🤖 "לאישור – לחץ 1"',
      '🤖 "לשינוי זמן – לחץ 2"',
      '',
      '📱 יוסי לוחץ: 1',
      '',
      '🤖 "מעולה! הפגישה מאושרת. להתראות מחר! 👋"',
      '',
      '✅ סטטוס עודכן: אישר',
      '✅ סוכן רותי קיבל אישור אוטומטי',
      '✅ תזכורת בוקר מתוזמנת ל-08:00',
    ];
    for (let i = 0; i < lines.length; i++) {
      await new Promise(r => setTimeout(r, i === 0 ? 0 : 500));
      setSimLog(prev => [...prev, lines[i]]);
    }
    await new Promise(r => setTimeout(r, 600));
    confirmAppt('r3', 'אורן בן-דוד');
    setSimulating(false);
  };

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '📅', label: 'פגישות מחר', value: 4, color: 'var(--ra-blue)' },
          { icon: '✅', label: 'אישרו', value: confirmed, color: 'var(--ra-green)' },
          { icon: '⏳', label: 'ממתינים', value: pending, color: 'var(--ra-yellow)' },
          { icon: '❌', label: 'ביטלו', value: cancelled, color: 'var(--ra-red)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 13, padding: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 8 }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 13,
        padding: '14px 18px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 26 }}>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>איך עובדת תזכורת אוטומטית?</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { time: '20:00 לילה', label: 'שיחה אוטומטית ראשונה', color: 'var(--ra-purple)' },
              { time: '08:00 בוקר', label: 'שיחה שנייה אם לא ענה', color: 'var(--ra-yellow)' },
              { time: 'לחץ 1', label: 'אישור', color: 'var(--ra-green)' },
              { time: 'לחץ 2', label: 'ביטול / שינוי', color: 'var(--ra-red)' },
            ].map(step => (
              <div key={step.time} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ra-text)' }}>
                <span style={{ background: `${step.color}22`, color: step.color, padding: '2px 8px', borderRadius: 100, fontWeight: 700, fontSize: 9 }}>{step.time}</span>
                {step.label}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={runSimulation}
          disabled={simulating}
          style={{
            padding: '6px 13px',
            borderRadius: 7,
            fontSize: 11,
            fontWeight: 700,
            background: 'var(--ra-blue)',
            color: '#fff',
            border: 'none',
            cursor: simulating ? 'default' : 'pointer',
            fontFamily: "'Heebo', sans-serif",
            opacity: simulating ? 0.7 : 1,
          }}
        >
          {simulating ? '⏳ מדגים...' : '▶ הדגם שיחת תזכורת'}
        </button>
      </div>

      {/* Simulation Log */}
      {showSim && (
        <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 8 }}>🎬 סימולציה</div>
          <pre style={{ fontSize: 11, color: 'var(--ra-text)', lineHeight: 1.8, fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>
            {simLog.join('\n')}
          </pre>
        </div>
      )}

      {/* Appointments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {appts.map((appt, i) => {
          const sc = STATUS_CONFIG[appt.status];
          return (
            <div key={appt.id} style={{
              background: 'var(--ra-card)',
              border: `1px solid ${sc.border}`,
              borderRadius: 13,
              padding: '16px 18px',
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeInUp 0.35s ease both`,
              animationDelay: `${i * 0.06}s`,
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: sc.accent }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `${sc.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {sc.icon}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--ra-text)' }}>{appt.name}</div>
                    <span style={{ background: sc.badgeBg, color: sc.badgeColor, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 100 }}>{sc.badge}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ra-muted)' }}>{appt.type} · {appt.detail} · סוכן: {appt.agent}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 10 }}>
                      <div style={{ color: 'var(--ra-muted)', marginBottom: 3, fontWeight: 600 }}>🌙 שיחת לילה (20:00)</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {appt.nightCallSent && <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--ra-green)', padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700 }}>✅ נשלחה</span>}
                        {appt.nightCallResult === 'confirmed' && <span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--ra-green)', padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700 }}>לחץ 1 – אישר</span>}
                        {appt.nightCallResult === 'no-answer' && <span style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--ra-yellow)', padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700 }}>📵 לא ענה</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 10 }}>
                      <div style={{ color: 'var(--ra-muted)', marginBottom: 3, fontWeight: 600 }}>☀️ שיחת בוקר (08:00)</div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 100, fontSize: 9, fontWeight: 700,
                        background: appt.morningCallStatus === 'scheduled' ? 'rgba(245,158,11,0.1)' : appt.morningCallStatus === 'retry' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
                        color: appt.morningCallStatus === 'scheduled' ? 'var(--ra-yellow)' : appt.morningCallStatus === 'retry' ? 'var(--ra-blue)' : 'var(--ra-green)',
                      }}>
                        {appt.morningCallStatus === 'scheduled' ? '⏳ מתוזמנת' : appt.morningCallStatus === 'retry' ? '🔄 תנסה שוב' : '✅ בוצע'}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                  {appt.status === 'pending' ? (
                    <button
                      onClick={() => confirmAppt(appt.id, appt.name)}
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                    >
                      📞 התקשר עכשיו
                    </button>
                  ) : (
                    <button
                      onClick={() => toast.info(`📞 מתקשר ל${appt.name}`)}
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.04)', color: 'var(--ra-muted)', border: '1px solid var(--ra-border)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                    >
                      📞 התקשר
                    </button>
                  )}
                  <button
                    onClick={() => toast.success(`💬 WhatsApp נשלח ל${appt.name}`)}
                    style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.04)', color: 'var(--ra-muted)', border: '1px solid var(--ra-border)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
