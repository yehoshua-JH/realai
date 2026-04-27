// RealAI 2.0 — Centralized localStorage-backed store
// All data persists across page refreshes via localStorage
import { useState, useEffect, useCallback } from "react";
import { Lead, Property, Appointment, FollowUpLead, MissedCall, PipelineDeal } from "./data";
import {
  leads as defaultLeads,
  properties as defaultProperties,
  appointments as defaultAppointments,
  followUpLeads as defaultFollowUps,
  missedCalls as defaultMissedCalls,
  pipelineDeals as defaultPipeline,
} from "./data";

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`realai_${key}`);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`realai_${key}`, JSON.stringify(value));
  } catch {}
}

// ── Leads Store ──────────────────────────────────────────────────────────────
export function useLeadsStore() {
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage('leads', defaultLeads));

  const save = useCallback((updated: Lead[]) => {
    setLeads(updated);
    saveToStorage('leads', updated);
  }, []);

  const addLead = useCallback((lead: Lead) => {
    save([lead, ...leads]);
  }, [leads, save]);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    save(leads.map(l => l.id === id ? { ...l, ...patch } : l));
  }, [leads, save]);

  const deleteLead = useCallback((id: string) => {
    save(leads.filter(l => l.id !== id));
  }, [leads, save]);

  return { leads, addLead, updateLead, deleteLead };
}

// ── Properties Store ─────────────────────────────────────────────────────────
export function usePropertiesStore() {
  const [properties, setProperties] = useState<Property[]>(() => loadFromStorage('properties', defaultProperties));

  const save = useCallback((updated: Property[]) => {
    setProperties(updated);
    saveToStorage('properties', updated);
  }, []);

  const addProperty = useCallback((prop: Property) => {
    save([prop, ...properties]);
  }, [properties, save]);

  const updateProperty = useCallback((id: string, patch: Partial<Property>) => {
    save(properties.map(p => p.id === id ? { ...p, ...patch } : p));
  }, [properties, save]);

  const deleteProperty = useCallback((id: string) => {
    save(properties.filter(p => p.id !== id));
  }, [properties, save]);

  return { properties, addProperty, updateProperty, deleteProperty };
}

// ── Pipeline Store ────────────────────────────────────────────────────────────
export function usePipelineStore() {
  const [deals, setDeals] = useState<PipelineDeal[]>(() => loadFromStorage('pipeline', defaultPipeline));

  const save = useCallback((updated: PipelineDeal[]) => {
    setDeals(updated);
    saveToStorage('pipeline', updated);
  }, []);

  const updateDealStage = useCallback((id: string, stage: PipelineDeal['stage']) => {
    save(deals.map(d => d.id === id ? { ...d, stage } : d));
  }, [deals, save]);

  const addDeal = useCallback((deal: PipelineDeal) => {
    save([deal, ...deals]);
  }, [deals, save]);

  const deleteDeal = useCallback((id: string) => {
    save(deals.filter(d => d.id !== id));
  }, [deals, save]);

  return { deals, updateDealStage, addDeal, deleteDeal };
}

// ── Follow-up Store ───────────────────────────────────────────────────────────
export function useFollowUpStore() {
  const [items, setItems] = useState<FollowUpLead[]>(() => loadFromStorage('followups', defaultFollowUps));

  const save = useCallback((updated: FollowUpLead[]) => {
    setItems(updated);
    saveToStorage('followups', updated);
  }, []);

  const markSent = useCallback((id: string) => {
    save(items.map(i => i.id === id ? { ...i, sent: true } : i));
  }, [items, save]);

  const markAllSent = useCallback(() => {
    save(items.map(i => ({ ...i, sent: true })));
  }, [items, save]);

  const resetAll = useCallback(() => {
    save(items.map(i => ({ ...i, sent: false })));
  }, [items, save]);

  return { items, markSent, markAllSent, resetAll };
}

// ── Missed Calls Store ────────────────────────────────────────────────────────
export function useMissedCallsStore() {
  const [calls, setCalls] = useState<MissedCall[]>(() => loadFromStorage('missedcalls', defaultMissedCalls));

  const save = useCallback((updated: MissedCall[]) => {
    setCalls(updated);
    saveToStorage('missedcalls', updated);
  }, []);

  const markHandled = useCallback((id: string) => {
    save(calls.map(c => c.id === id ? { ...c, handled: true } : c));
  }, [calls, save]);

  const markAllHandled = useCallback(() => {
    save(calls.map(c => ({ ...c, handled: true })));
  }, [calls, save]);

  return { calls, markHandled, markAllHandled };
}

// ── Appointments Store ────────────────────────────────────────────────────────
export function useAppointmentsStore() {
  const [appts, setAppts] = useState<Appointment[]>(() => loadFromStorage('appointments', defaultAppointments));

  const save = useCallback((updated: Appointment[]) => {
    setAppts(updated);
    saveToStorage('appointments', updated);
  }, []);

  const updateStatus = useCallback((id: string, status: Appointment['status']) => {
    save(appts.map(a => a.id === id ? { ...a, status, nightCallResult: status === 'confirmed' ? 'confirmed' : a.nightCallResult } : a));
  }, [appts, save]);

  const addAppointment = useCallback((appt: Appointment) => {
    save([appt, ...appts]);
  }, [appts, save]);

  return { appts, updateStatus, addAppointment };
}

// ── Auth Store ────────────────────────────────────────────────────────────────
const AGENTS = [
  { id: 'a1', name: 'רותי לוי', role: 'agent', password: '1234', avatar: '👩' },
  { id: 'a2', name: 'דני כהן', role: 'agent', password: '1234', avatar: '👨' },
  { id: 'a3', name: 'יואב מזרחי', role: 'agent', password: '1234', avatar: '👨' },
  { id: 'mgr', name: 'מנהל ראשי', role: 'manager', password: 'admin123', avatar: '👑' },
];

export type AgentUser = typeof AGENTS[0];

export function useAuthStore() {
  const [user, setUser] = useState<AgentUser | null>(() => {
    try {
      const raw = sessionStorage.getItem('realai_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const login = useCallback((name: string, password: string): boolean => {
    const found = AGENTS.find(a => a.name === name && a.password === password);
    if (found) {
      setUser(found);
      sessionStorage.setItem('realai_user', JSON.stringify(found));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('realai_user');
  }, []);

  return { user, login, logout };
}
