// RealAI 2.0 — Properties View (fully functional with CRUD + localStorage + CSV export)
import { useState } from "react";
import { Property } from "@/lib/data";
import { usePropertiesApi } from "@/lib/api-store";
import AddPropertyModal from "@/components/modals/AddPropertyModal";
import { exportPropertiesCSV } from "@/lib/export";
import { toast } from "sonner";

function PropertyCard({ prop, onEdit, onDelete }: { prop: Property; onEdit: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      border: '1px solid var(--ra-border)',
      background: 'var(--ra-card)',
      position: 'relative',
      transition: 'transform 0.18s, box-shadow 0.18s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      {/* Image area */}
      <div style={{ height: 110, background: prop.bgColor ?? undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, position: 'relative' }}>
        {prop.emoji}
        <div style={{ position: 'absolute', bottom: 7, left: 7, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 800, color: '#fff' }}>
          {prop.price}
        </div>
        <div style={{ position: 'absolute', top: 7, left: 7, display: 'flex', gap: 4 }}>
          <button onClick={e => { e.stopPropagation(); onEdit(); }} style={{ fontSize: 10, padding: '3px 7px', borderRadius: 5, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.8)', color: '#fff', fontFamily: "'Heebo', sans-serif" }}>✏️</button>
          <button
            onClick={e => {
              e.stopPropagation();
              if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
              onDelete();
            }}
            style={{ fontSize: 10, padding: '3px 7px', borderRadius: 5, border: 'none', cursor: 'pointer', background: confirmDelete ? 'rgba(239,68,68,0.9)' : 'rgba(239,68,68,0.6)', color: '#fff', fontFamily: "'Heebo', sans-serif", transition: 'all 0.2s' }}
          >
            {confirmDelete ? '⚠️' : '🗑️'}
          </button>
        </div>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 5 }}>{prop.name}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {prop.tags.map(tag => (
            <span key={tag} style={{ fontSize: 9, color: 'var(--ra-muted)', background: 'var(--ra-card2)', border: '1px solid var(--ra-border)', borderRadius: 4, padding: '1px 6px' }}>
              {tag}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: 'var(--ra-muted)' }}>👤 {prop.agent}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ra-green)' }}>🎯 {prop.matches} קונים מתאימים</span>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesView() {
  const { properties, addProperty, updateProperty, deleteProperty, isLoading } = usePropertiesApi();
  const [showAdd, setShowAdd] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [search, setSearch] = useState('');

  const filtered = properties.filter(p =>
    !search || p.name.includes(search) || p.tags.some((t: string) => t.includes(search)) || (p.agent ?? "").includes(search)
  );

  const handleSave = (prop: Property) => {
    if (editProp) {
      updateProperty(prop.id, prop);
      toast.success(`✅ ${prop.name} עודכן`);
    } else {
      addProperty(prop);
      toast.success(`✅ נכס חדש נוסף: ${prop.name}`);
    }
    setEditProp(null);
  };

  return (
    <div>
      {/* Top Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ra-text)' }}>
          {properties.length} נכסים פעילים
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 חיפוש נכס..."
          style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--ra-border)', background: 'var(--ra-card2)', color: 'var(--ra-text)', fontSize: 11, fontFamily: "'Heebo', sans-serif", outline: 'none', width: 160, direction: 'rtl' }}
        />
        <button
          onClick={() => { exportPropertiesCSV(properties); toast.success('📊 קובץ CSV הורד'); }}
          style={{ padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer', fontFamily: "'Heebo', sans-serif" }}
        >
          📊 ייצוא CSV
        </button>
        <button
          onClick={() => { setEditProp(null); setShowAdd(true); }}
          style={{ padding: '6px 13px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--ra-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Heebo', sans-serif", boxShadow: '0 0 14px rgba(59,130,246,0.25)', marginRight: 'auto' }}
        >
          + נכס חדש
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ra-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>לא נמצאו נכסים</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>הוסף נכס חדש כדי להתחיל</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
        {filtered.map((prop, i) => (
          <div key={prop.id} style={{ animation: `fadeInUp 0.35s ease both`, animationDelay: `${i * 0.05}s` }}>
            <PropertyCard
              prop={prop}
              onEdit={() => { setEditProp(prop); setShowAdd(true); }}
              onDelete={() => { deleteProperty(prop.id); toast.success(`🗑️ ${prop.name} נמחק`); }}
            />
          </div>
        ))}
      </div>

      {/* Modals */}
      {(showAdd || editProp) && (
        <AddPropertyModal
          onClose={() => { setShowAdd(false); setEditProp(null); }}
          onSave={handleSave}
          existing={editProp ?? undefined}
        />
      )}
    </div>
  );
}
