// RealAI 2.0 — Pipeline View (fully functional with stage moves + localStorage + CSV export)
import { useState } from "react";
import { PipelineDeal, PipelineStage } from "@/lib/data";
import { usePipelineStore } from "@/lib/store";
import { exportPipelineCSV } from "@/lib/export";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const STAGES: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'lead', label: 'ליד', color: '#7db3ff' },
  { id: 'tour', label: 'סיור', color: '#a78bfa' },
  { id: 'negotiation', label: 'מו"מ', color: '#fbbf24' },
  { id: 'contract', label: 'חוזה', color: '#fb923c' },
  { id: 'closed', label: 'נסגר 🎉', color: '#34d399' },
];

const STAGE_ORDER = STAGES.map(s => s.id);

function PipelineCard({ deal, onMoveForward, onMoveBack, onDelete }: {
  deal: PipelineDeal;
  onMoveForward: () => void;
  onMoveBack: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentIdx = STAGE_ORDER.indexOf(deal.stage);
  const canForward = currentIdx < STAGE_ORDER.length - 1;
  const canBack = currentIdx > 0;
  const isClosed = deal.stage === 'closed';

  return (
    <div style={{
      background: isClosed ? 'rgba(16,185,129,0.05)' : 'var(--ra-card)',
      border: `1px solid ${isClosed ? 'rgba(16,185,129,0.28)' : 'var(--ra-border)'}`,
      borderRadius: 10,
      padding: '10px 12px',
      marginBottom: 7,
      transition: 'all 0.15s',
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 3 }}>{deal.name}</div>
      <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginBottom: 7, lineHeight: 1.4 }}>
        {deal.detail.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: 8, color: 'var(--ra-muted)' }}>👤 {deal.agent}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: deal.tagColor, color: isClosed ? '#34d399' : deal.tag.includes('חם') ? '#ff6b6b' : '#7db3ff' }}>
          {deal.tag}
        </span>
      </div>
      {/* Stage move buttons */}
      <div style={{ display: 'flex', gap: 4 }}>
        {canBack && (
          <button onClick={onMoveBack} style={{ flex: 1, fontSize: 9, padding: '4px', borderRadius: 5, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-muted)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>
            ← הקודם
          </button>
        )}
        {canForward && (
          <button onClick={onMoveForward} style={{ flex: 2, fontSize: 9, padding: '4px', borderRadius: 5, border: 'none', background: 'rgba(59,130,246,0.15)', color: '#7db3ff', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", fontWeight: 700 }}>
            {isClosed ? '' : `הבא →`}
          </button>
        )}
        {isClosed && <div style={{ flex: 1, fontSize: 10, textAlign: 'center', color: '#34d399' }}>✅ נסגר</div>}
        <button
          onClick={() => {
            if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
            onDelete();
          }}
          style={{ fontSize: 9, padding: '4px 6px', borderRadius: 5, border: 'none', cursor: 'pointer', background: confirmDelete ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.1)', color: '#f87171', fontFamily: "'Heebo', sans-serif" }}
        >
          {confirmDelete ? '⚠️' : '🗑️'}
        </button>
      </div>
    </div>
  );
}

function AddDealModal({ onClose, onSave }: { onClose: () => void; onSave: (d: PipelineDeal) => void }) {
  const [form, setForm] = useState({ name: '', detail: '', agent: 'רותי', stage: 'lead' as PipelineStage, value: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => {
    if (!form.name.trim()) { toast.error('שם עסקה חובה'); return; }
    onSave({ id: nanoid(6), name: form.name, detail: form.detail, agent: form.agent, stage: form.stage, tag: 'חדש', tagColor: 'rgba(59,130,246,0.12)', value: form.value || undefined });
    onClose();
    toast.success(`✅ עסקה חדשה נוספה: ${form.name}`);
  };
  const iStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 13, fontFamily: "'Heebo', sans-serif", outline: 'none', boxSizing: 'border-box', direction: 'rtl' };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Heebo', sans-serif", direction: 'rtl' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 16, width: '100%', maxWidth: 420, animation: 'fadeInUp 0.3s ease' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ra-text)' }}>📈 עסקה חדשה</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ra-muted)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          {[
            { label: 'שם עסקה / לקוח *', key: 'name', placeholder: 'יוסי דוד – 4 חד׳ ת״א' },
            { label: 'פרטים', key: 'detail', placeholder: 'נכס ברחוב הרצל 12' },
            { label: 'ערך עסקה (אופציונלי)', key: 'value', placeholder: '₪28,800' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={iStyle} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>שלב</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)} style={iStyle}>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 5, fontWeight: 600 }}>סוכן</label>
              <select value={form.agent} onChange={e => set('agent', e.target.value)} style={iStyle}>
                {['רותי', 'דני', 'יואב'].map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid var(--ra-border)', background: 'transparent', color: 'var(--ra-muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>ביטול</button>
            <button onClick={handleSave} style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: 'var(--ra-blue)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}>✅ הוסף עסקה</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PipelineView() {
  const { deals, updateDealStage, addDeal, deleteDeal } = usePipelineStore();
  const [showAdd, setShowAdd] = useState(false);

  const dealsByStage = (stage: PipelineStage) => deals.filter(d => d.stage === stage);

  const moveForward = (deal: PipelineDeal) => {
    const idx = STAGE_ORDER.indexOf(deal.stage);
    if (idx < STAGE_ORDER.length - 1) {
      const next = STAGE_ORDER[idx + 1];
      updateDealStage(deal.id, next);
      const nextLabel = STAGES.find(s => s.id === next)?.label ?? next;
      toast.success(`📈 ${deal.name} → ${nextLabel}`);
    }
  };

  const moveBack = (deal: PipelineDeal) => {
    const idx = STAGE_ORDER.indexOf(deal.stage);
    if (idx > 0) {
      const prev = STAGE_ORDER[idx - 1];
      updateDealStage(deal.id, prev);
      const prevLabel = STAGES.find(s => s.id === prev)?.label ?? prev;
      toast.info(`↩️ ${deal.name} → ${prevLabel}`);
    }
  };

  return (
    <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>עסקאות פעילות</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>{deals.length} עסקאות · לחץ על כפתורי שלב להזזה</div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <button
            onClick={() => { exportPipelineCSV(deals); toast.success('📊 Pipeline יוצא'); }}
            style={{ padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
          >
            📊 ייצוא CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
          >
            + עסקה חדשה
          </button>
        </div>
      </div>
      <div style={{ padding: '14px 18px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', gap: 10, minWidth: 800 }}>
          {STAGES.map(stage => {
            const stageDeals = dealsByStage(stage.id);
            return (
              <div key={stage.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '6px 10px', background: 'var(--ra-card2)', borderRadius: 8, borderBottom: `2px solid ${stage.color}` }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)' }}>{stage.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 100, background: 'rgba(59,130,246,0.12)', color: '#7db3ff' }}>{stageDeals.length}</span>
                </div>
                {stageDeals.map(deal => (
                  <PipelineCard
                    key={deal.id}
                    deal={deal}
                    onMoveForward={() => moveForward(deal)}
                    onMoveBack={() => moveBack(deal)}
                    onDelete={() => { deleteDeal(deal.id); toast.success(`🗑️ ${deal.name} נמחק`); }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {showAdd && <AddDealModal onClose={() => setShowAdd(false)} onSave={addDeal} />}
    </div>
  );
}
