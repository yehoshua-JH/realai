// RealAI 2.0 — Leads View (fully functional with CRUD + localStorage)
import { useState } from "react";
import { Lead } from "@/lib/data";
import { useLeadsStore } from "@/lib/store";
import AddLeadModal from "@/components/modals/AddLeadModal";
import LeadDetailModal from "@/components/modals/LeadDetailModal";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, { border: string; bg: string; label: string; color: string }> = {
  hot: { border: 'rgba(255,71,87,0.3)', bg: 'rgba(255,71,87,0.04)', label: '🔥 חם', color: '#ff6b6b' },
  warm: { border: 'rgba(255,165,2,0.25)', bg: 'rgba(255,165,2,0.03)', label: '🌡️ פושר', color: 'var(--ra-yellow)' },
  cold: { border: 'rgba(116,185,255,0.2)', bg: 'rgba(116,185,255,0.03)', label: '❄️ קר', color: 'var(--ra-cold)' },
};

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const sc = STATUS_COLORS[lead.status];
  return (
    <div
      style={{
        background: 'var(--ra-card)',
        border: `1px solid ${sc.border}`,
        borderRadius: 12,
        padding: 12,
        cursor: 'pointer',
        transition: 'all 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
      onClick={onClick}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: sc.color }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--ra-card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            {lead.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--ra-text)' }}>{lead.name}</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>{lead.phone}</div>
          </div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 100, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
          {sc.label}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {[
          lead.type === 'buyer' ? 'קונה' : 'מוכר',
          lead.area,
          `${lead.rooms} חד׳`,
          ...(lead.budget ? [`${lead.budget}`] : []),
          `סוכן: ${lead.agent}`,
        ].map(tag => (
          <span key={tag} style={{ fontSize: 9, color: 'var(--ra-text)', background: 'var(--ra-card2)', border: '1px solid var(--ra-border)', borderRadius: 5, padding: '2px 6px' }}>
            {tag}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: 'var(--ra-muted)' }}>{lead.lastContact}</span>
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            onClick={e => { e.stopPropagation(); toast.success(`📞 מתקשר ל${lead.name}`, { description: lead.phone }); }}
            style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.12)', color: '#7db3ff', fontFamily: "'Heebo', sans-serif" }}
          >📞</button>
          <button
            onClick={e => { e.stopPropagation(); toast.success(`💬 WhatsApp נשלח ל${lead.name}`); }}
            style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(37,211,102,0.12)', color: '#25d366', fontFamily: "'Heebo', sans-serif" }}
          >💬</button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsView() {
  const { leads, addLead, updateLead, deleteLead } = useLeadsStore();
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');

  const filtered = leads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => !search || l.name.includes(search) || l.phone.includes(search) || l.area.includes(search));

  const handleSave = (lead: Lead) => {
    if (editLead) {
      updateLead(lead.id, lead);
      toast.success(`✅ ${lead.name} עודכן`);
    } else {
      addLead(lead);
      toast.success(`✅ ליד חדש נוסף: ${lead.name}`);
    }
    setEditLead(null);
  };

  return (
    <div>
      {/* Top Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'hot', 'warm', 'cold'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700,
              border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", transition: 'all 0.15s',
              background: filter === f ? 'var(--ra-blue)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#fff' : 'var(--ra-muted)',
            }}>
              {f === 'all' ? `כולם (${leads.length})` : f === 'hot' ? `🔥 חמים (${leads.filter(l=>l.status==='hot').length})` : f === 'warm' ? `🌡️ פושרים (${leads.filter(l=>l.status==='warm').length})` : `❄️ קרים (${leads.filter(l=>l.status==='cold').length})`}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 חיפוש..."
          style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 11, fontFamily: "'Heebo', sans-serif", outline: 'none', width: 160, direction: 'rtl' }}
        />
        <button
          onClick={() => { setEditLead(null); setShowAdd(true); }}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)', marginRight: 'auto' }}
        >
          + ליד חדש
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ra-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>לא נמצאו לידים</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>נסה לשנות את הסינון או להוסיף ליד חדש</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map((lead, i) => (
          <div key={lead.id} style={{ animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 0.04}s` }}>
            <LeadCard lead={lead} onClick={() => setDetailLead(lead)} />
          </div>
        ))}
      </div>

      {/* Modals */}
      {(showAdd || editLead) && (
        <AddLeadModal
          onClose={() => { setShowAdd(false); setEditLead(null); }}
          onSave={handleSave}
          existing={editLead ?? undefined}
        />
      )}
      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setDetailLead(null)}
          onEdit={lead => { setDetailLead(null); setEditLead(lead); setShowAdd(true); }}
          onDelete={id => { deleteLead(id); setDetailLead(null); }}
          onStatusChange={(id, status) => { updateLead(id, { status }); setDetailLead(prev => prev ? { ...prev, status } : null); }}
        />
      )}
    </div>
  );
}
