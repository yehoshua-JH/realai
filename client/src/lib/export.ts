// RealAI 2.0 — Export utilities (CSV, JSON, printable HTML report)
import { Lead, Property, PipelineDeal, Agent } from "./data";

// ── CSV Export ────────────────────────────────────────────────────────────────
function toCSV(rows: string[][], headers: string[]): string {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers.map(escape), ...rows.map(r => r.map(escape))].join('\n');
}

function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob(['\ufeff' + content], { type: mime }); // BOM for Hebrew Excel
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLeadsCSV(leads: Lead[]) {
  const headers = ['שם', 'טלפון', 'סוג', 'סטטוס', 'אזור', 'חדרים', 'תקציב', 'סוכן', 'קשר אחרון'];
  const rows = leads.map(l => [
    l.name, l.phone,
    l.type === 'buyer' ? 'קונה' : 'מוכר',
    l.status === 'hot' ? 'חם' : l.status === 'warm' ? 'פושר' : 'קר',
    l.area, l.rooms, l.budget ?? '', l.agent, l.lastContact,
  ]);
  downloadFile(toCSV(rows, headers), `לידים_${today()}.csv`, 'text/csv;charset=utf-8');
}

export function exportPropertiesCSV(properties: Property[]) {
  const headers = ['כתובת', 'מחיר', 'תגיות', 'סוכן', 'קונים מתאימים'];
  const rows = properties.map(p => [p.name, p.price, p.tags.join(' | '), p.agent, String(p.matches)]);
  downloadFile(toCSV(rows, headers), `נכסים_${today()}.csv`, 'text/csv;charset=utf-8');
}

export function exportPipelineCSV(deals: PipelineDeal[]) {
  const stageLabel: Record<string, string> = { lead: 'ליד', tour: 'סיור', negotiation: 'מו"מ', contract: 'חוזה', closed: 'נסגר' };
  const headers = ['שם עסקה', 'שלב', 'פרטים', 'סוכן', 'ערך'];
  const rows = deals.map(d => [d.name, stageLabel[d.stage] ?? d.stage, d.detail.replace('\n', ' '), d.agent, d.value ?? '']);
  downloadFile(toCSV(rows, headers), `pipeline_${today()}.csv`, 'text/csv;charset=utf-8');
}

// ── Printable HTML Report ─────────────────────────────────────────────────────
export function exportManagerReport(leads: Lead[], properties: Property[], deals: PipelineDeal[]) {
  const hot = leads.filter(l => l.status === 'hot').length;
  const warm = leads.filter(l => l.status === 'warm').length;
  const cold = leads.filter(l => l.status === 'cold').length;
  const closed = deals.filter(d => d.stage === 'closed').length;

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<title>דוח מנהל – RealAI ${today()}</title>
<style>
  body { font-family: Arial, sans-serif; direction: rtl; color: #1a1a2e; padding: 30px; }
  h1 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
  h2 { color: #374151; margin-top: 28px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { background: #3b82f6; color: #fff; padding: 8px 12px; text-align: right; font-size: 13px; }
  td { padding: 7px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
  tr:nth-child(even) { background: #f9fafb; }
  .stats { display: flex; gap: 16px; margin: 16px 0; flex-wrap: wrap; }
  .stat { background: #f3f4f6; border-radius: 8px; padding: 12px 18px; min-width: 120px; }
  .stat-val { font-size: 24px; font-weight: 900; color: #3b82f6; }
  .stat-lbl { font-size: 11px; color: #6b7280; margin-top: 2px; }
  @media print { body { padding: 10px; } }
</style>
</head>
<body>
<h1>🏠 דוח מנהל – RealAI 2.0</h1>
<p style="color:#6b7280;font-size:12px">הופק: ${new Date().toLocaleString('he-IL')}</p>

<h2>סיכום לידים</h2>
<div class="stats">
  <div class="stat"><div class="stat-val">${leads.length}</div><div class="stat-lbl">סה״כ לידים</div></div>
  <div class="stat"><div class="stat-val" style="color:#ef4444">${hot}</div><div class="stat-lbl">🔥 חמים</div></div>
  <div class="stat"><div class="stat-val" style="color:#f59e0b">${warm}</div><div class="stat-lbl">🌡️ פושרים</div></div>
  <div class="stat"><div class="stat-val" style="color:#60a5fa">${cold}</div><div class="stat-lbl">❄️ קרים</div></div>
  <div class="stat"><div class="stat-val" style="color:#10b981">${closed}</div><div class="stat-lbl">✅ עסקאות נסגרו</div></div>
</div>

<h2>רשימת לידים</h2>
<table>
  <tr><th>שם</th><th>טלפון</th><th>סוג</th><th>סטטוס</th><th>אזור</th><th>חדרים</th><th>תקציב</th><th>סוכן</th></tr>
  ${leads.map(l => `<tr>
    <td>${l.name}</td><td>${l.phone}</td>
    <td>${l.type === 'buyer' ? 'קונה' : 'מוכר'}</td>
    <td>${l.status === 'hot' ? '🔥 חם' : l.status === 'warm' ? '🌡️ פושר' : '❄️ קר'}</td>
    <td>${l.area}</td><td>${l.rooms}</td><td>${l.budget ?? '—'}</td><td>${l.agent}</td>
  </tr>`).join('')}
</table>

<h2>נכסים פעילים</h2>
<table>
  <tr><th>כתובת</th><th>מחיר</th><th>תגיות</th><th>סוכן</th><th>קונים מתאימים</th></tr>
  ${properties.map(p => `<tr>
    <td>${p.name}</td><td>${p.price}</td><td>${p.tags.join(', ')}</td><td>${p.agent}</td><td>${p.matches}</td>
  </tr>`).join('')}
</table>

<h2>Pipeline עסקאות</h2>
<table>
  <tr><th>עסקה</th><th>שלב</th><th>פרטים</th><th>סוכן</th></tr>
  ${deals.map(d => {
    const sl: Record<string,string> = { lead:'ליד', tour:'סיור', negotiation:'מו"מ', contract:'חוזה', closed:'✅ נסגר' };
    return `<tr><td>${d.name}</td><td>${sl[d.stage]??d.stage}</td><td>${d.detail.replace('\n',' ')}</td><td>${d.agent}</td></tr>`;
  }).join('')}
</table>

<p style="margin-top:40px;font-size:10px;color:#9ca3af;text-align:center">RealAI 2.0 · דוח אוטומטי</p>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 400);
  }
}

export function exportAgentsCSV(agents: Agent[]) {
  const headers = ['שם', 'לידים', 'סיורים', 'סגירות', 'הכנסות'];
  const rows = agents.map(a => [a.name, String(a.leads), String(a.tours), String(a.closes), a.earnings]);
  downloadFile(toCSV(rows, headers), `סוכנים_${today()}.csv`, 'text/csv;charset=utf-8');
}

function today() {
  return new Date().toLocaleDateString('he-IL').replace(/\//g, '-');
}
