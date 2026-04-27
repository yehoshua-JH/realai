// RealAI 2.0 — Missed Calls View
import { MissedCall } from "@/lib/data";
import { useMissedCallsStore } from "@/lib/store";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

interface MissedCallsViewProps {
  onMissedCountChange: (count: number) => void;
}

export default function MissedCallsView({ onMissedCountChange }: MissedCallsViewProps) {
  const { push } = useNotifications();
  const { calls, markHandled, markAllHandled } = useMissedCallsStore();

  const unhandledCount = calls.filter(c => !c.handled).length;

  const handleCall = (call: MissedCall) => {
    markHandled(call.id);
    const remaining = unhandledCount - 1;
    onMissedCountChange(remaining);
    push('📞', 'מתחבר...', `מתקשר חזרה אל ${call.name ?? call.phone}`);
    toast.success(`📞 מתקשר ל${call.name ?? call.phone}`, { description: call.phone });
  };

  const handleAll = () => {
    markAllHandled();
    onMissedCountChange(0);
    push('📞', 'מתקשר לכולם', `${unhandledCount} שיחות חוזרות מתוזמנות אוטומטית`);
    toast.success('📞 מתקשר לכולם', { description: `${unhandledCount} שיחות חוזרות מתוזמנות` });
  };

  return (
    <div>
      {/* Header Alert */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(245,158,11,0.04))',
        border: '1px solid rgba(239,68,68,0.18)',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 26 }}>📵</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>{unhandledCount} שיחות שלא נענו</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>AI שלח WhatsApp אוטומטי לכולם · החזר שיחה עכשיו</div>
        </div>
        <button
          onClick={handleAll}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-red)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
        >
          📞 החזר לכולם
        </button>
      </div>

      {/* Calls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {calls.map((call, i) => {
          const isHandled = !!call.handled;
          const urgencyColor = call.urgency === 'high' ? 'var(--ra-red)' : call.urgency === 'medium' ? 'var(--ra-yellow)' : 'var(--ra-cold)';
          const urgencyBorder = call.urgency === 'high' ? 'rgba(239,68,68,0.15)' : call.urgency === 'medium' ? 'rgba(116,185,255,0.15)' : 'rgba(116,185,255,0.1)';

          return (
            <div key={call.id} style={{
              background: 'var(--ra-card)',
              border: `1px solid ${urgencyBorder}`,
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              position: 'relative',
              overflow: 'hidden',
              opacity: isHandled ? 0.4 : 1,
              pointerEvents: isHandled ? 'none' : 'auto',
              transition: 'all 0.2s',
              animation: `fadeInUp 0.35s ease both`,
              animationDelay: `${i * 0.06}s`,
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: urgencyColor }} />
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${urgencyColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                📵
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {call.name ?? call.phone}
                  {!call.isKnown && (
                    <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 100, background: 'rgba(59,130,246,0.13)', color: '#93c5fd', animation: 'pulseBadge 2s infinite' }}>
                      לא מוכר
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>
                  {call.isKnown ? `${call.phone} · ` : ''}ניסה <strong style={{ color: call.attempts >= 3 ? 'var(--ra-red)' : 'var(--ra-text)' }}>{call.attempts} פעמים</strong> · {call.timeAgo}
                </div>
                {call.stage && <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>{call.status} · {call.stage}</div>}
                {call.attempts >= 3 && <div style={{ fontSize: 10, color: 'var(--ra-red)', marginTop: 1 }}>⚠️ ניסה הרבה פעמים – לקוח מתעניין!</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
                {isHandled ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ra-green)' }}>✅ טופל</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleCall(call)}
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ff6b6b', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                    >
                      📞 החזר שיחה
                    </button>
                    <button
                      onClick={() => toast.success(`💬 WhatsApp נשלח ל${call.name ?? call.phone}`)}
                      style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.04)', color: 'var(--ra-muted)', border: '1px solid var(--ra-border)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
                    >
                      💬 שלח WhatsApp
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Automation Explanation */}
      <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>אוטומציה – מה קורה כשמגיעה שיחה שלא נענת</div>
        </div>
        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { step: 1, text: 'שיחה נכנסת ולא נענית → המערכת מזהה אוטומטית' },
            { step: 2, text: 'מיד נשלח WhatsApp: "שלום! ראיתי שניסית להתקשר, אחזור אליך תוך מספר דקות 🙏"', highlight: true },
            { step: 3, text: 'הסוכן מקבל התראה עם כפתור "החזר שיחה" ישירות מהמערכת' },
            { step: 4, text: 'אחרי 30 דק׳ ולא חזרו – תזכורת אוטומטית נוספת לסוכן' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: 'var(--ra-text)' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', color: '#7db3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                {item.step}
              </div>
              <div style={item.highlight ? { color: '#25d366' } : {}}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
