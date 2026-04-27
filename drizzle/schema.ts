import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Agents (CRM agents / staff) ─────────────────────────────────────────────
export const agents = mysqlTable("agents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  medal: varchar("medal", { length: 8 }).default("🥇"),
  leads: int("leads").default(0).notNull(),
  tours: int("tours").default(0).notNull(),
  closes: int("closes").default(0).notNull(),
  earnings: varchar("earnings", { length: 32 }).default("₪0"),
  color: varchar("color", { length: 32 }).default("var(--ra-blue)"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// ── Leads ─────────────────────────────────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  type: mysqlEnum("type", ["buyer", "seller"]).default("buyer").notNull(),
  status: mysqlEnum("status", ["hot", "warm", "cold"]).default("warm").notNull(),
  area: varchar("area", { length: 128 }).default(""),
  rooms: varchar("rooms", { length: 32 }).default(""),
  budget: varchar("budget", { length: 64 }),
  agent: varchar("agent", { length: 128 }).default(""),
  lastContact: varchar("lastContact", { length: 64 }).default(""),
  daysAgo: int("daysAgo").default(0),
  notes: text("notes"),
  avatar: varchar("avatar", { length: 8 }).default("👤"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ── Properties ──────────────────────────────────────────────────────────────────────
export const properties = mysqlTable("properties", {
  id: varchar("id", { length: 36 }).primaryKey(),
  emoji: varchar("emoji", { length: 8 }).default("🏠"),
  name: varchar("name", { length: 256 }).notNull(),
  tags: text("tags").notNull().default("[]"),
  price: varchar("price", { length: 64 }).notNull(),
  agent: varchar("agent", { length: 128 }).default(""),
  matches: int("matches").default(0),
  bgColor: varchar("bgColor", { length: 64 }).default("rgba(59,130,246,0.08)"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ── Pipeline Deals ──────────────────────────────────────────────────────────────────
export const pipelineDeals = mysqlTable("pipeline_deals", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  detail: text("detail").default(""),
  agent: varchar("agent", { length: 128 }).default(""),
  stage: mysqlEnum("stage", ["lead", "tour", "negotiation", "contract", "closed"]).default("lead").notNull(),
  tag: varchar("tag", { length: 64 }).default(""),
  tagColor: varchar("tagColor", { length: 64 }).default("var(--ra-blue)"),
  value: varchar("value", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type PipelineDeal = typeof pipelineDeals.$inferSelect;
export type InsertPipelineDeal = typeof pipelineDeals.$inferInsert;

// ── Appointments ──────────────────────────────────────────────────────────────────────────────
export const appointments = mysqlTable("appointments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  type: varchar("type", { length: 64 }).default(""),
  detail: text("detail").default(""),
  time: varchar("time", { length: 64 }).notNull(),
  agent: varchar("agent", { length: 128 }).default(""),
  status: mysqlEnum("status", ["confirmed", "pending", "cancelled"]).default("pending").notNull(),
  nightCallSent: boolean("nightCallSent").default(false),
  nightCallResult: mysqlEnum("nightCallResult", ["confirmed", "no-answer"]),
  morningCallStatus: mysqlEnum("morningCallStatus", ["scheduled", "retry", "done"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// ── Missed Calls ──────────────────────────────────────────────────────────────────────────────
export const missedCalls = mysqlTable("missed_calls", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }),
  phone: varchar("phone", { length: 32 }).notNull(),
  time: varchar("time", { length: 64 }).default(""),
  urgency: mysqlEnum("urgency", ["high", "medium", "low"]).default("medium"),
  source: varchar("source", { length: 64 }).default(""),
  handled: boolean("handled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type MissedCall = typeof missedCalls.$inferSelect;
export type InsertMissedCall = typeof missedCalls.$inferInsert;

// ── Follow-up Leads ───────────────────────────────────────────────────────────────────────────
export const followUpLeads = mysqlTable("follow_up_leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  lastMsg: text("lastMsg").default(""),
  daysAgo: int("daysAgo").default(0),
  status: mysqlEnum("status", ["pending", "sent", "replied"]).default("pending"),
  urgency: mysqlEnum("urgency", ["high", "medium", "low"]).default("medium"),
  avatar: varchar("avatar", { length: 8 }).default("👤"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type FollowUpLead = typeof followUpLeads.$inferSelect;
export type InsertFollowUpLead = typeof followUpLeads.$inferInsert;