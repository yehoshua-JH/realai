// RealAI 2.0 — Add / Edit Property Modal
import { useState } from "react";
import { Property } from "@/lib/data";
import { nanoid } from "nanoid";

interface AddPropertyModalProps {
  onClose: () => void;
  onSave: (prop: Property) => void;
  existing?: Property;
}

const EMOJIS = ['🏠', '🏢', '🏗️', '🏡', '🏬', '🏰', '🏛️', '🏘️'];
const AGENTS = ['רותי', 'דני', 'יואב'];
const BG_COLORS = [
  'linear-gradient(135deg, #1a2d3f, #0d1b2a)',
  'linear-gradient(135deg, #1a1a2e, #16213e)',
  'linear-gradient(135deg, #0f2027, #203a43)',
  'linear-gradient(135deg, #1a1a2e, #2d1b4e)',
];

export default function AddPropertyModal({ onClose, onSave, existing }: AddPropertyModalProps) {
  const [form, setForm] = useState({
    name: existing?.name ?? '',
    price: existing?.price ?? '',
    rooms: '',
    floor: '',
    area: '',
    size: '',
    agent: existing?.agent ?? 'רותי',
    emoji: existing?.emoji ?? '🏠',
    matches: existing?.matches ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'כתובת חובה';
    if (!form.price.trim()) e.price = 'מחיר חובה';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const tags: string[] = [];
    if (form.rooms) tags.push(`${form.rooms} חד׳`);
    if (form.floor) tags.push(`קומה ${form.floor}`);
    if (form.area) tags.push(form.area);
    if (form.size) tags.push(`${form.size} מ״ר`);

    const prop: Property = {
      id: existing?.id ?? nanoid(6),
      name: form.name.trim(),
      price: form.price.trim(),
      tags,
      agent: form.agent,
      emoji: form.emoji,
      matches: Number(form.matches),
      bgColor: existing?.bgColor ?? BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)],
    };
    onSave(prop);
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
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ra-text)' }}>
            {existing ? '✏️ עריכת נכס' : '🏠 נכס חדש'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Emoji picker */}
          <div>
            <label style={labelStyle}>אייקון נכס</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => set('emoji', e)} style={{
                  width: 36, height: 36, borderRadius: 8, fontSize: 18,
                  border: `1px solid ${form.emoji === e ? 'var(--ra-blue)' : 'var(--ra-border)'}`,
                  background: form.emoji === e ? 'rgba(59,130,246,0.1)' : 'var(--ra-card2)',
                  cursor: 'pointer',
                }}>{e}</button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>כתובת *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="רחוב הרצל 12, תל אביב" style={inputStyle(!!errors.name)} />
            {errors.name && <div style={errStyle}>{errors.name}</div>}
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>מחיר *</label>
            <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="₪2,500,000" style={inputStyle(!!errors.price)} />
            {errors.price && <div style={errStyle}>{errors.price}</div>}
          </div>

          {/* Rooms + Floor */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>חדרים</label>
              <select value={form.rooms} onChange={e => set('rooms', e.target.value)} style={selectStyle}>
                <option value="">בחר</option>
                {['1', '2', '3', '4', '5', '6', '7+'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>קומה</label>
              <input value={form.floor} onChange={e => set('floor', e.target.value)} placeholder="3" style={inputStyle(false)} />
            </div>
          </div>

          {/* Area + Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>שכונה / עיר</label>
              <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="פ״ת" style={inputStyle(false)} />
            </div>
            <div>
              <label style={labelStyle}>שטח (מ״ר)</label>
              <input value={form.size} onChange={e => set('size', e.target.value)} placeholder="90" style={inputStyle(false)} />
            </div>
          </div>

          {/* Agent */}
          <div>
            <label style={labelStyle}>סוכן מטפל</label>
            <select value={form.agent} onChange={e => set('agent', e.target.value)} style={selectStyle}>
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Matching buyers */}
          <div>
            <label style={labelStyle}>קונים מתאימים (ידני)</label>
            <input type="number" value={form.matches} onChange={e => set('matches', e.target.value)} placeholder="0" style={inputStyle(false)} />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
              ביטול
            </button>
            <button onClick={handleSave} style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: 'var(--ra-blue)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 16px rgba(59,130,246,0.3)' }}>
              {existing ? '💾 שמור שינויים' : '✅ הוסף נכס'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 5, fontWeight: 600 };
const errStyle: React.CSSProperties = { fontSize: 10, color: 'var(--ra-red)', marginTop: 3 };
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1px solid ${hasError ? 'var(--ra-red)' : 'var(--ra-border)'}`,
  background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 13,
  fontFamily: "'Heebo', sans-serif", outline: 'none', boxSizing: 'border-box', direction: 'rtl',
});
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--ra-border)', background: 'var(--ra-card2)',
  color: 'var(--ra-text)', fontSize: 13, fontFamily: "'Heebo', sans-serif",
  outline: 'none', cursor: 'pointer', direction: 'rtl',
};
