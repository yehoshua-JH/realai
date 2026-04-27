// RealAI 2.0 — Add / Edit Lead Modal
import { useState } from "react";
import { Lead } from "@/lib/data";
import { nanoid } from "nanoid";

interface AddLeadModalProps {
  onClose: () => void;
  onSave: (lead: Lead) => void;
  existing?: Lead;
}

const AREAS = ['תל אביב', 'פתח תקווה', 'רמת גן', 'הרצליה', 'גבעתיים', 'בני ברק', 'ראשון לציון', 'נתניה', 'חיפה', 'ירושלים'];
const AGENTS = ['רותי', 'דני', 'יואב'];

export default function AddLeadModal({ onClose, onSave, existing }: AddLeadModalProps) {
  const [form, setForm] = useState({
    name: existing?.name ?? '',
    phone: existing?.phone ?? '',
    type: existing?.type ?? 'buyer',
    status: existing?.status ?? 'warm',
    area: existing?.area ?? 'תל אביב',
    rooms: existing?.rooms ?? '4',
    budget: existing?.budget ?? '',
    agent: existing?.agent ?? 'רותי',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'שם חובה';
    if (!form.phone.trim()) e.phone = 'טלפון חובה';
    else if (!/^0\d{8,9}$/.test(form.phone.replace(/-/g, ''))) e.phone = 'מספר לא תקין';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const lead: Lead = {
      id: existing?.id ?? nanoid(6),
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type as Lead['type'],
      status: form.status as Lead['status'],
      area: form.area,
      rooms: form.rooms,
      budget: form.budget || undefined,
      agent: form.agent,
      avatar: form.type === 'buyer' ? '👤' : '🏠',
      lastContact: 'עכשיו',
      daysAgo: 0,
    };
    onSave(lead);
    onClose();
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
        maxWidth: 480,
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'fadeInUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ra-text)' }}>
            {existing ? '✏️ עריכת ליד' : '➕ ליד חדש'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <Field label="שם מלא *" error={errors.name}>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="ישראל ישראלי" style={inputStyle(!!errors.name)} />
          </Field>

          {/* Phone */}
          <Field label="טלפון *" error={errors.phone}>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="050-1234567" style={inputStyle(!!errors.phone)} />
          </Field>

          {/* Type + Status row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="סוג לקוח">
              <select value={form.type} onChange={e => set('type', e.target.value)} style={selectStyle}>
                <option value="buyer">🛒 קונה</option>
                <option value="seller">🏷️ מוכר</option>
              </select>
            </Field>
            <Field label="סטטוס">
              <select value={form.status} onChange={e => set('status', e.target.value)} style={selectStyle}>
                <option value="hot">🔥 חם</option>
                <option value="warm">🌡️ פושר</option>
                <option value="cold">❄️ קר</option>
              </select>
            </Field>
          </div>

          {/* Area + Rooms row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="אזור">
              <select value={form.area} onChange={e => set('area', e.target.value)} style={selectStyle}>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="חדרים">
              <select value={form.rooms} onChange={e => set('rooms', e.target.value)} style={selectStyle}>
                {['1', '2', '3', '4', '5', '6', '7+'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Budget */}
          <Field label="תקציב (אופציונלי)">
            <input value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="לדוגמה: 2.5M" style={inputStyle(false)} />
          </Field>

          {/* Agent */}
          <Field label="סוכן מטפל">
            <select value={form.agent} onChange={e => set('agent', e.target.value)} style={selectStyle}>
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
              ביטול
            </button>
            <button onClick={handleSave} style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: 'var(--ra-blue)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 16px rgba(59,130,246,0.3)' }}>
              {existing ? '💾 שמור שינויים' : '✅ הוסף ליד'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 10, color: 'var(--ra-red)', marginTop: 3 }}>{error}</div>}
    </div>
  );
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: `1px solid ${hasError ? 'var(--ra-red)' : 'var(--ra-border)'}`,
  background: 'var(--ra-card2)',
  color: 'var(--ra-text)',
  fontSize: 13,
  fontFamily: "'Heebo', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
  direction: 'rtl',
});

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid var(--ra-border)',
  background: 'var(--ra-card2)',
  color: 'var(--ra-text)',
  fontSize: 13,
  fontFamily: "'Heebo', sans-serif",
  outline: 'none',
  cursor: 'pointer',
  direction: 'rtl',
};
