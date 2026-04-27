// RealAI 2.0 — Leads View
import { useState } from "react";
import { leads, Lead } from "@/lib/data";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, { border: string; bg: string; label: string; color: string }> = {
  hot: { border: 'rgba(255,71,87,0.3)', bg: 'rgba(255,71,87,0.04)', label: '🔥 חם', color: '#ff6b6b' },
  warm: { border: 'rgba(255,165,2,0.25)', bg: 'rgba(255,165,2,0.03)', label: '🌡️ פושר', color: 'var(--ra-yellow)' },
  cold: { border: 'rgba(116,185,255,0.2)', bg: 'rgba(116,185,255,0.03)', label: '❄️ קר', color: 'var(--ra-cold)' },
};

function LeadCard({ lead }: { lead: Lead }) {
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
      onClick={() => toast.info(`📋 ${lead.name}`, { description: `${lead.type === 'buyer' ? 'קונה' : 'מוכר'} · ${lead.area} · ${lead.rooms} חד׳` })}
    >
      {/* Status accent bar */}
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
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <div>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          {(['all', 'hot', 'warm', 'cold'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 13px',
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Heebo', sans-serif",
                transition: 'all 0.15s',
                background: filter === f ? 'var(--ra-blue)' : 'rgba(255,255,255,0.04)',
                color: filter === f ? '#fff' : 'var(--ra-muted)',
              }}
            >
              {f === 'all' ? 'כולם' : f === 'hot' ? '🔥 חמים' : f === 'warm' ? '🌡️ פושרים' : '❄️ קרים'}
            </button>
          ))}
        </div>
        <button
          onClick={() => toast.success('➕ ליד חדש', { description: 'טופס הוספת ליד נפתח' })}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)' }}
        >
          + ליד חדש
        </button>
      </div>

      {/* Leads Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
        {filtered.map((lead, i) => (
          <div key={lead.id} style={{ animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 0.05}s` }}>
            <LeadCard lead={lead} />
          </div>
        ))}
      </div>
    </div>
  );
}
