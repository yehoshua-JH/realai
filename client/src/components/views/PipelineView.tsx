// RealAI 2.0 — Pipeline View
import { pipelineDeals, PipelineDeal, PipelineStage } from "@/lib/data";
import { toast } from "sonner";

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'lead', label: 'ליד' },
  { id: 'tour', label: 'סיור' },
  { id: 'negotiation', label: 'מו"מ' },
  { id: 'contract', label: 'חוזה' },
  { id: 'closed', label: 'נסגר 🎉' },
];

function PipelineCard({ deal }: { deal: PipelineDeal }) {
  return (
    <div
      onClick={() => toast.info(`📋 ${deal.name}`, { description: deal.detail.replace('\n', ' · ') })}
      style={{
        background: deal.stage === 'closed' ? 'rgba(16,185,129,0.04)' : 'var(--ra-card)',
        border: `1px solid ${deal.stage === 'closed' ? 'rgba(16,185,129,0.28)' : 'var(--ra-border)'}`,
        borderRadius: 10,
        padding: '10px 12px',
        marginBottom: 7,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 4 }}>{deal.name}</div>
      <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginBottom: 8, lineHeight: 1.4 }}>
        {deal.detail.split('\n').map((l, i) => <span key={i}>{l}{i === 0 && <br />}</span>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 8, color: 'var(--ra-muted)' }}>{deal.agent}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: deal.tagColor, color: deal.stage === 'closed' ? '#34d399' : deal.tag.includes('חם') ? '#ff6b6b' : deal.tag === 'עו״ד' ? '#c4b5fd' : '#7db3ff' }}>
          {deal.tag}
        </span>
      </div>
    </div>
  );
}

export default function PipelineView() {
  const dealsByStage = (stage: PipelineStage) => pipelineDeals.filter(d => d.stage === stage);

  return (
    <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>עסקאות פעילות</div>
        <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>6 עסקאות · מעקב אוטומטי</div>
      </div>
      <div style={{ padding: '14px 18px', overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', gap: 10, minWidth: 800 }}>
          {STAGES.map(stage => {
            const deals = dealsByStage(stage.id);
            return (
              <div key={stage.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                  padding: '6px 10px',
                  background: 'var(--ra-card2)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ra-text)' }}>{stage.label}</span>
                  <span style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: 100,
                    background: 'rgba(59,130,246,0.12)',
                    color: '#7db3ff',
                  }}>{deals.length}</span>
                </div>
                {deals.map(deal => <PipelineCard key={deal.id} deal={deal} />)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
