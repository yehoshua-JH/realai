// RealAI 2.0 — Properties View
import { properties } from "@/lib/data";
import { toast } from "sonner";

export default function PropertiesView() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ra-text)' }}>12 נכסים פעילים</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>לחץ על נכס לראות קונים מתאימים</div>
        </div>
        <button
          onClick={() => toast.success('🏠 נכס חדש', { description: 'טופס הוספת נכס נפתח' })}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)' }}
        >
          + הוסף נכס
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
        {properties.map((prop, i) => (
          <div
            key={prop.id}
            onClick={() => toast.info(`🎯 קונים מתאימים`, { description: `${prop.matches} קונים מתאימים ל${prop.name}` })}
            style={{
              background: 'var(--ra-card)',
              border: '1px solid var(--ra-border)',
              borderRadius: 13,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              animation: `fadeInUp 0.35s ease both`,
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border2)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--ra-border)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {/* Image area */}
            <div style={{
              height: 120,
              background: prop.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              position: 'relative',
            }}>
              {prop.emoji}
              <div style={{
                position: 'absolute',
                bottom: 7,
                left: 7,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                borderRadius: 6,
                padding: '3px 9px',
                fontSize: 11,
                fontWeight: 800,
                color: '#fff',
              }}>
                {prop.price}
              </div>
            </div>

            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 4 }}>{prop.name}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                {prop.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 9, color: 'var(--ra-muted)', background: 'var(--ra-card2)', border: '1px solid var(--ra-border)', borderRadius: 4, padding: '1px 6px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--ra-muted)' }}>סוכן: {prop.agent}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ra-green)' }}>{prop.matches} קונים מתאימים</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
