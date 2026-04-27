// RealAI 2.0 — Database query helpers for all CRM tables
import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  leads, properties, pipelineDeals, appointments, missedCalls, followUpLeads, agents,
} from "../drizzle/schema";
import type {
  InsertLead, InsertProperty, InsertPipelineDeal, InsertAppointment,
  InsertMissedCall, InsertFollowUpLead, InsertAgent,
} from "../drizzle/schema";

// ── Leads ─────────────────────────────────────────────────────────────────────
export async function getLeads() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}
export async function createLead(lead: InsertLead) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(leads).values(lead); return lead;
}
export async function updateLead(id: string, data: Partial<InsertLead>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(leads).set(data).where(eq(leads.id, id));
}
export async function deleteLead(id: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(leads).where(eq(leads.id, id));
}

// ── Properties ────────────────────────────────────────────────────────────────
export async function getProperties() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}
export async function createProperty(p: InsertProperty) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(properties).values(p); return p;
}
export async function updateProperty(id: string, data: Partial<InsertProperty>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(properties).set(data).where(eq(properties.id, id));
}
export async function deleteProperty(id: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(properties).where(eq(properties.id, id));
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
export async function getPipelineDeals() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(pipelineDeals).orderBy(desc(pipelineDeals.createdAt));
}
export async function createPipelineDeal(d: InsertPipelineDeal) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(pipelineDeals).values(d); return d;
}
export async function updatePipelineDeal(id: string, data: Partial<InsertPipelineDeal>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(pipelineDeals).set(data).where(eq(pipelineDeals.id, id));
}
export async function deletePipelineDeal(id: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(pipelineDeals).where(eq(pipelineDeals.id, id));
}

// ── Appointments ──────────────────────────────────────────────────────────────
export async function getAppointments() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(appointments).orderBy(desc(appointments.createdAt));
}
export async function createAppointment(a: InsertAppointment) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(appointments).values(a); return a;
}
export async function updateAppointment(id: string, data: Partial<InsertAppointment>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}
export async function deleteAppointment(id: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(appointments).where(eq(appointments.id, id));
}

// ── Missed Calls ──────────────────────────────────────────────────────────────
export async function getMissedCalls() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(missedCalls).orderBy(desc(missedCalls.createdAt));
}
export async function createMissedCall(c: InsertMissedCall) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(missedCalls).values(c); return c;
}
export async function markMissedCallHandled(id: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(missedCalls).set({ handled: true }).where(eq(missedCalls.id, id));
}
export async function markAllMissedCallsHandled() {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(missedCalls).set({ handled: true });
}

// ── Follow-up Leads ───────────────────────────────────────────────────────────
export async function getFollowUpLeads() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(followUpLeads).orderBy(desc(followUpLeads.createdAt));
}
export async function updateFollowUpLead(id: string, data: Partial<InsertFollowUpLead>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(followUpLeads).set(data).where(eq(followUpLeads.id, id));
}

// ── Agents ────────────────────────────────────────────────────────────────────
export async function getAgents() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(agents).orderBy(desc(agents.closes));
}

// ── Seed initial demo data ────────────────────────────────────────────────────
export async function seedInitialData() {
  const db = await getDb(); if (!db) return;
  const existing = await db.select().from(leads).limit(1);
  if (existing.length > 0) return; // Already seeded

  const agentRows: InsertAgent[] = [
    { id: "ag1", name: "רותי לוי", medal: "🥇", leads: 24, tours: 10, closes: 3, earnings: "₪18K", color: "var(--ra-green)" },
    { id: "ag2", name: "דני כהן", medal: "🥈", leads: 19, tours: 7, closes: 2, earnings: "₪12K", color: "var(--ra-blue)" },
    { id: "ag3", name: "יואב מזרחי", medal: "🥉", leads: 17, tours: 3, closes: 0, earnings: "₪0", color: "var(--ra-yellow)" },
  ];
  for (const a of agentRows) await db.insert(agents).values(a).onDuplicateKeyUpdate({ set: { name: a.name } });

  const leadRows: InsertLead[] = [
    { id: "l1", name: "אבי כהן", phone: "054-1234567", type: "buyer", status: "hot", area: "תל אביב", rooms: "4 חדרים", budget: "₪2.8M", agent: "רותי לוי", lastContact: "לפני יומיים", daysAgo: 2, avatar: "👨" },
    { id: "l2", name: "שרה לוי", phone: "052-9876543", type: "buyer", status: "hot", area: "רמת גן", rooms: "3 חדרים", budget: "₪1.9M", agent: "דני כהן", lastContact: "אתמול", daysAgo: 1, avatar: "👩" },
    { id: "l3", name: "משה גולן", phone: "050-5555555", type: "seller", status: "warm", area: "הרצליה", rooms: "5 חדרים", budget: "₪3.5M", agent: "רותי לוי", lastContact: "לפני 4 ימים", daysAgo: 4, avatar: "👨" },
    { id: "l4", name: "רחל ברק", phone: "058-7777777", type: "buyer", status: "warm", area: "פתח תקווה", rooms: "3 חדרים", budget: "₪1.6M", agent: "יואב מזרחי", lastContact: "לפני שבוע", daysAgo: 7, avatar: "👩" },
    { id: "l5", name: "יוסי דוד", phone: "053-3333333", type: "buyer", status: "cold", area: "ראשון לציון", rooms: "4 חדרים", budget: "₪2.2M", agent: "דני כהן", lastContact: "לפני 12 ימים", daysAgo: 12, avatar: "👨" },
    { id: "l6", name: "נועה שמיר", phone: "054-6666666", type: "seller", status: "cold", area: "נתניה", rooms: "3 חדרים", budget: "₪1.4M", agent: "רותי לוי", lastContact: "לפני 3 שבועות", daysAgo: 21, avatar: "👩" },
  ];
  for (const l of leadRows) await db.insert(leads).values(l).onDuplicateKeyUpdate({ set: { name: l.name } });

  const propRows: InsertProperty[] = [
    { id: "p1", emoji: "🏠", name: "רוטשילד 45, תל אביב", tags: JSON.stringify(["4 חדרים","קומה 8","מרפסת"]), price: "₪3.2M", agent: "רותי לוי", matches: 8, bgColor: "rgba(59,130,246,0.08)" },
    { id: "p2", emoji: "🏢", name: "ביאליק 12, רמת גן", tags: JSON.stringify(["3 חדרים","חניה","מחסן"]), price: "₪1.95M", agent: "דני כהן", matches: 5, bgColor: "rgba(139,92,246,0.08)" },
    { id: "p3", emoji: "🏡", name: "הנשיא 8, הרצליה פיתוח", tags: JSON.stringify(["5 חדרים","גינה","בריכה"]), price: "₪4.8M", agent: "רותי לוי", matches: 3, bgColor: "rgba(16,185,129,0.08)" },
  ];
  for (const p of propRows) await db.insert(properties).values(p).onDuplicateKeyUpdate({ set: { name: p.name } });

  const dealRows: InsertPipelineDeal[] = [
    { id: "d1", name: 'אבי כהן – רוטשילד 45', detail: "מחיר מבוקש: ₪3.2M\nהצעה: ₪3.0M", agent: "רותי לוי", stage: "negotiation", tag: 'מו"מ חם', tagColor: "var(--ra-yellow)", value: "₪3.0M" },
    { id: "d2", name: "שרה לוי – ביאליק 12", detail: "סיור ראשון בוצע\nמעוניינת מאוד", agent: "דני כהן", stage: "tour", tag: "סיור שני", tagColor: "var(--ra-blue)", value: "₪1.95M" },
    { id: "d3", name: "משה גולן – הנשיא 8", detail: "חוזה בהכנה\nעו\"ד מטפל", agent: "רותי לוי", stage: "contract", tag: "חוזה", tagColor: "var(--ra-green)", value: "₪4.8M" },
  ];
  for (const d of dealRows) await db.insert(pipelineDeals).values(d).onDuplicateKeyUpdate({ set: { name: d.name } });

  const apptRows: InsertAppointment[] = [
    { id: "ap1", name: "אבי כהן", type: "סיור נכס", detail: "רוטשילד 45 תל אביב", time: "מחר 10:00", agent: "רותי לוי", status: "confirmed", nightCallSent: true, nightCallResult: "confirmed", morningCallStatus: "done" },
    { id: "ap2", name: "שרה לוי", type: "פגישת ייעוץ", detail: "משרד רמת גן", time: "מחר 14:30", agent: "דני כהן", status: "pending", nightCallSent: false, morningCallStatus: "scheduled" },
  ];
  for (const a of apptRows) await db.insert(appointments).values(a).onDuplicateKeyUpdate({ set: { name: a.name } });

  const callRows: InsertMissedCall[] = [
    { id: "mc1", name: "אבי כהן", phone: "054-1234567", time: "לפני 20 דקות", urgency: "high", source: "WhatsApp", handled: false },
    { id: "mc2", name: "לקוח לא ידוע", phone: "052-9999999", time: "לפני שעה", urgency: "medium", source: "שיחה נכנסת", handled: false },
    { id: "mc3", name: "רחל ברק", phone: "058-7777777", time: "לפני 2 שעות", urgency: "low", source: "WhatsApp", handled: false },
  ];
  for (const c of callRows) await db.insert(missedCalls).values(c).onDuplicateKeyUpdate({ set: { phone: c.phone } });

  const followRows: InsertFollowUpLead[] = [
    { id: "fu1", name: "יוסי דוד", phone: "053-3333333", lastMsg: "שלום, ראיתי את הנכס ברחוב הרצל...", daysAgo: 5, status: "pending", urgency: "high", avatar: "👨" },
    { id: "fu2", name: "נועה שמיר", phone: "054-6666666", lastMsg: "מתי אפשר לראות את הדירה?", daysAgo: 7, status: "pending", urgency: "medium", avatar: "👩" },
    { id: "fu3", name: "דוד ברגר", phone: "050-1111111", lastMsg: "האם המחיר סופי?", daysAgo: 12, status: "pending", urgency: "low", avatar: "👨" },
  ];
  for (const f of followRows) await db.insert(followUpLeads).values(f).onDuplicateKeyUpdate({ set: { name: f.name } });

  console.log("[DB] Initial data seeded successfully");
}
