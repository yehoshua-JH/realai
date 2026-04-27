// RealAI 2.0 — Follow-Up View
import { useState } from "react";
import { followUpLeads, FollowUpLead } from "@/lib/data";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";

function ageStyle(days: number) {
  if (days >= 5) return { bg: 'rgba(139,92,246,0.13)', color: 'var(--ra-purple)' };
  if (days >= 3) return { bg: 'rgba(239,68,68,0.13)', color: 'var(--ra-red)' };
  return { bg: 'rgba(245,158,11,0.13)', color: 'var(--ra-yellow)' };
}

export default function FollowUpView() {
  const { push } = useNotifications();
  const [items, setItems] = useState<FollowUpLead[]>(followUpLeads);

  const sendOne = (id: string, name: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, sent: true } : i));
    push('💬', 'Follow-up נשלח', `הודעה אוטומטית נשלחה ל${name}`);
    toast.success(`💬 נשלח ל${name}`);
  };

  const sendAll = () => {
    setItems(prev => prev.map(i => ({ ...i, sent: true })));
    push('🚀', 'נשלח לכולם', '7 הודעות follow-up נשלחו אוטומטית');
    toast.success('🚀 נשלח לכולם', { description: '7 הודעות follow-up נשלחו אוטומטית' });
  };

  return (
    <div>
      {/* Alert Banner */}
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
        <span style={{ fontSize: 26 }}>🔁</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>7 לידים ממתינים לfollow-up</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 2 }}>AI זיהה לידים שלא ענו · שלח הודעות בלחיצה</div>
        </div>
        <button
          onClick={sendAll}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)' }}
        >
          🚀 שלח לכולם
        </button>
      </div>

      {/* Follow-up List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
        {items.map((item, i) => {
          const ag = ageStyle(item.daysAgo);
          return (
            <div key={item.id} style={{
              background: 'var(--ra-card)',
              border: '1px solid var(--ra-border)',
              borderRadius: 11,
              padding: '11px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              transition: 'all 0.15s',
              animation: `fadeInUp 0.35s ease both`,
              animationDelay: `${i * 0.04}s`,
              opacity: item.sent ? 0.45 : 1,
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border2)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border)'}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                {item.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>{item.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginTop: 1 }}>{item.detail}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 100, marginRight: 'auto', whiteSpace: 'nowrap', background: ag.bg, color: ag.color }}>
                {item.daysAgo} ימים
              </span>
              <button
                onClick={() => !item.sent && sendOne(item.id, item.name)}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: item.sent ? 'default' : 'pointer',
                  fontFamily: "'Heebo', sans-serif",
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  background: item.sent ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.12)',
                  color: item.sent ? 'var(--ra-green)' : '#7db3ff',
                  pointerEvents: item.sent ? 'none' : 'auto',
                }}
              >
                {item.sent ? '✅ נשלח' : '💬 שלח'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Sample Message Card */}
      <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>דוגמה – הודעה שClaude כותב</div>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <div style={{
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: 'var(--ra-text)',
            fontWeight: 600,
            lineHeight: 1.9,
            fontFamily: 'monospace',
          }}>
            שלום יוסי! 👋<br />
            דני מ-ABC נדל״ן.<br />
            דיברנו על דירה בפ״ת לפני כמה ימים.<br /><br />
            נכנסו 3 נכסים חדשים שמתאימים בדיוק ✨<br /><br />
            מתי נוח ל-5 דקות?
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--ra-muted)' }}>
            ⚡ Claude כותב הודעה מותאמת לכל ליד לפי ההיסטוריה שלו
          </div>
        </div>
      </div>
    </div>
  );
}
