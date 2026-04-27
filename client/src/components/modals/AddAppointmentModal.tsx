// RealAI 2.0 — Add Appointment Modal
import { useState } from "react";
import { Appointment } from "@/lib/data";
import { nanoid } from "nanoid";

interface AddAppointmentModalProps {
  onClose: () => void;
  onSave: (appt: Appointment) => void;
}

const AGENTS = ['רותי', 'דני', 'יואב'];

export default function AddAppointmentModal({ onClose, onSave }: AddAppointmentModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    type: 'סיור בנכס',
    detail: '',
    agent: 'רותי',
    date: '',
    time: '10:00',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'שם חובה';
    if (!form.detail.trim()) e.detail = 'פרטים חובה';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const appt: Appointment = {
      id: nanoid(6),
      name: form.name.trim(),
      type: form.type,
      detail: `${form.detail}${form.date ? ` · ${form.date}` : ''}`,
      time: form.time,
      agent: form.agent,
      status: 'pending',
      nightCallSent: false,
      nightCallResult: 'no-answer',
      morningCallStatus: 'scheduled',
    };
    onSave(appt);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: "'Heebo', sans-serif", direction: 'rtl',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--ra-card)', border: '1px solid var(--ra-border)',
        borderRadius: 16, width: '100%', maxWidth: 440,
        animation: 'fadeInUp 0.3s ease',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ra-text)' }}>📅 פגישה חדשה</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          <Field label="שם לקוח *" error={errors.name}>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="ישראל ישראלי" style={iStyle(!!errors.name)} />
          </Field>
          <Field label="טלפון">
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="050-1234567" style={iStyle(false)} />
          </Field>
          <Field label="סוג פגישה">
            <select value={form.type} onChange={e => set('type', e.target.value)} style={sStyle}>
              {['סיור בנכס', 'פגישת ייעוץ', 'חתימת חוזה', 'שיחת טלפון', 'אחר'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="פרטי הנכס / מיקום *" error={errors.detail}>
            <input value={form.detail} onChange={e => set('detail', e.target.value)} placeholder="רחוב הרצל 12, תל אביב" style={iStyle(!!errors.detail)} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="תאריך">
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={iStyle(false)} />
            </Field>
            <Field label="שעה">
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} style={iStyle(false)} />
            </Field>
          </div>
          <Field label="סוכן">
            <select value={form.agent} onChange={e => set('agent', e.target.value)} style={sStyle}>
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>ביטול</button>
            <button onClick={handleSave} style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: 'var(--ra-blue)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>✅ הוסף פגישה</button>
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
const iStyle = (e: boolean): React.CSSProperties => ({ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${e ? 'var(--ra-red)' : 'var(--ra-border)'}`, background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 13, fontFamily: "'Heebo', sans-serif", outline: 'none', boxSizing: 'border-box', direction: 'rtl' });
const sStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 13, fontFamily: "'Heebo', sans-serif", outline: 'none', cursor: 'pointer', direction: 'rtl' };
