// RealAI 2.0 — Lead Detail Modal with full info and actions
import { useState } from "react";
import { Lead } from "@/lib/data";
import { toast } from "sonner";

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Lead['status']) => void;
}

const STATUS_CONFIG = {
  hot: { label: '🔥 חם', bg: 'rgba(255,71,87,0.12)', color: '#ff6b6b', border: 'rgba(255,71,87,0.25)' },
  warm: { label: '🌡️ פושר', bg: 'rgba(255,165,2,0.12)', color: 'var(--ra-yellow)', border: 'rgba(255,165,2,0.25)' },
  cold: { label: '❄️ קר', bg: 'rgba(116,185,255,0.12)', color: 'var(--ra-cold)', border: 'rgba(116,185,255,0.2)' },
};

const NOTES_HISTORY = [
  { time: 'לפני 2 ימים', text: 'שוחח עם הלקוח, מעוניין ב-4 חדרים באזור המרכז' },
  { time: 'לפני שבוע', text: 'ביקור ראשוני בנכס ברחוב הרצל — אהב את הנכס' },
];

export default function LeadDetailModal({ lead, onClose, onEdit, onDelete, onStatusChange }: LeadDetailModalProps) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(NOTES_HISTORY);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const sc = STATUS_CONFIG[lead.status];

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [{ time: 'עכשיו', text: note.trim() }, ...prev]);
    setNote('');
    toast.success('📝 הערה נשמרה');
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(lead.id);
    onClose();
    toast.success('🗑️ ליד נמחק');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      fontFamily: "'Heebo', sans-serif",
      direction: 'rtl',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--ra-card)',
        border: '1px solid var(--ra-border)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'fadeInUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ra-border)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--ra-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {lead.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ra-text)' }}>{lead.name}</div>
            <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginTop: 1 }}>{lead.phone}</div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            {sc.label}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', fontSize: 20, cursor: 'pointer', marginRight: 4 }}>×</button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'סוג', value: lead.type === 'buyer' ? '🛒 קונה' : '🏷️ מוכר' },
              { label: 'אזור', value: `📍 ${lead.area}` },
              { label: 'חדרים', value: `🛏️ ${lead.rooms} חדרים` },
              { label: 'תקציב', value: lead.budget ? `💰 ${lead.budget}` : '—' },
              { label: 'סוכן', value: `👤 ${lead.agent}` },
              { label: 'קשר אחרון', value: `🕐 ${lead.lastContact}` },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--ra-card2)', borderRadius: 9, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: 'var(--ra-muted)', marginBottom: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ra-text)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Status Change */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginBottom: 8, fontWeight: 600 }}>שנה סטטוס</div>
            <div style={{ display: 'flex', gap: 7 }}>
              {(['hot', 'warm', 'cold'] as Lead['status'][]).map(s => {
                const c = STATUS_CONFIG[s];
                return (
                  <button key={s} onClick={() => { onStatusChange(lead.id, s); toast.success(`סטטוס עודכן ל${c.label}`); }} style={{
                    flex: 1, padding: '7px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${lead.status === s ? c.border : 'var(--ra-border)'}`,
                    background: lead.status === s ? c.bg : 'transparent',
                    color: lead.status === s ? c.color : 'var(--ra-muted)',
                    fontFamily: "'Heebo', sans-serif", transition: 'all 0.15s',
                  }}>{c.label}</button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 7 }}>
            {[
              { icon: '📞', label: 'התקשר', action: () => toast.success(`📞 מתקשר ל${lead.name}`, { description: lead.phone }) },
              { icon: '💬', label: 'WhatsApp', action: () => toast.success(`💬 WhatsApp נשלח ל${lead.name}`) },
              { icon: '📧', label: 'מייל', action: () => toast.success(`📧 מייל נשלח ל${lead.name}`) },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} style={{
                flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)',
                fontFamily: "'Heebo', sans-serif", transition: 'all 0.15s',
              }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>

          {/* Notes */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginBottom: 8, fontWeight: 600 }}>📝 הערות</div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 10 }}>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                placeholder="הוסף הערה..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 12, fontFamily: "'Heebo', sans-serif", outline: 'none', direction: 'rtl' }}
              />
              <button onClick={addNote} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--ra-blue)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
                הוסף
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {notes.map((n, i) => (
                <div key={i} style={{ background: 'var(--ra-card2)', borderRadius: 8, padding: '9px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--ra-text)', lineHeight: 1.5 }}>{n.text}</div>
                  <div style={{ fontSize: 9, color: 'var(--ra-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit / Delete */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '1px solid var(--ra-border)' }}>
            <button onClick={() => { onEdit(lead); onClose(); }} style={{ flex: 2, padding: '10px', borderRadius: 9, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-text)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
              ✏️ ערוך ליד
            </button>
            <button onClick={handleDelete} style={{ flex: 1, padding: '10px', borderRadius: 9, border: `1px solid ${confirmDelete ? 'var(--ra-red)' : 'var(--ra-border)'}`, background: confirmDelete ? 'rgba(239,68,68,0.1)' : 'transparent', color: confirmDelete ? 'var(--ra-red)' : 'var(--ra-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif", transition: 'all 0.2s' }}>
              {confirmDelete ? '⚠️ אשר מחיקה' : '🗑️ מחק'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
