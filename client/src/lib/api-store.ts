// RealAI 2.0 — tRPC-backed store hooks
// These replace the localStorage store with real database API calls.
// The interface is kept compatible so views need minimal changes.

import { trpc } from "@/lib/trpc";
import { nanoid } from "nanoid";

// ── Leads ─────────────────────────────────────────────────────────────────────
export function useLeadsApi() {
  const utils = trpc.useUtils();
  const { data: leads = [], isLoading } = trpc.leads.list.useQuery();
  const createMutation = trpc.leads.create.useMutation({ onSuccess: () => utils.leads.list.invalidate() });
  const updateMutation = trpc.leads.update.useMutation({ onSuccess: () => utils.leads.list.invalidate() });
  const deleteMutation = trpc.leads.delete.useMutation({ onSuccess: () => utils.leads.list.invalidate() });

  return {
    leads,
    isLoading,
    addLead: (lead: any) => createMutation.mutate({ id: nanoid(), ...lead }),
    updateLead: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteLead: (id: string) => deleteMutation.mutate({ id }),
  };
}

// ── Properties ────────────────────────────────────────────────────────────────
export function usePropertiesApi() {
  const utils = trpc.useUtils();
  const { data: rawProperties = [], isLoading } = trpc.properties.list.useQuery();
  const createMutation = trpc.properties.create.useMutation({ onSuccess: () => utils.properties.list.invalidate() });
  const updateMutation = trpc.properties.update.useMutation({ onSuccess: () => utils.properties.list.invalidate() });
  const deleteMutation = trpc.properties.delete.useMutation({ onSuccess: () => utils.properties.list.invalidate() });

  // Parse tags from JSON string to array
  const properties = rawProperties.map(p => ({
    ...p,
    tags: (() => { try { return JSON.parse(p.tags); } catch { return []; } })(),
  }));

  return {
    properties,
    isLoading,
    addProperty: (property: any) => createMutation.mutate({
      id: nanoid(),
      ...property,
      tags: JSON.stringify(Array.isArray(property.tags) ? property.tags : []),
    }),
    updateProperty: (id: string, data: any) => updateMutation.mutate({
      id,
      data: { ...data, tags: data.tags ? JSON.stringify(Array.isArray(data.tags) ? data.tags : []) : undefined },
    }),
    deleteProperty: (id: string) => deleteMutation.mutate({ id }),
  };
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
export function usePipelineApi() {
  const utils = trpc.useUtils();
  const { data: deals = [], isLoading } = trpc.pipeline.list.useQuery();
  const createMutation = trpc.pipeline.create.useMutation({ onSuccess: () => utils.pipeline.list.invalidate() });
  const updateMutation = trpc.pipeline.update.useMutation({ onSuccess: () => utils.pipeline.list.invalidate() });
  const deleteMutation = trpc.pipeline.delete.useMutation({ onSuccess: () => utils.pipeline.list.invalidate() });

  return {
    deals,
    isLoading,
    addDeal: (deal: any) => createMutation.mutate({ id: nanoid(), ...deal }),
    updateDeal: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteDeal: (id: string) => deleteMutation.mutate({ id }),
    moveDeal: (id: string, stage: string) => updateMutation.mutate({ id, data: { stage: stage as any } }),
  };
}

// ── Appointments ──────────────────────────────────────────────────────────────
export function useAppointmentsApi() {
  const utils = trpc.useUtils();
  const { data: appointments = [], isLoading } = trpc.appointments.list.useQuery();
  const createMutation = trpc.appointments.create.useMutation({ onSuccess: () => utils.appointments.list.invalidate() });
  const updateMutation = trpc.appointments.update.useMutation({ onSuccess: () => utils.appointments.list.invalidate() });
  const deleteMutation = trpc.appointments.delete.useMutation({ onSuccess: () => utils.appointments.list.invalidate() });

  return {
    appointments,
    isLoading,
    addAppointment: (appt: any) => createMutation.mutate({ id: nanoid(), ...appt }),
    updateAppointment: (id: string, data: any) => updateMutation.mutate({ id, data }),
    deleteAppointment: (id: string) => deleteMutation.mutate({ id }),
    confirmAppointment: (id: string) => updateMutation.mutate({ id, data: { status: "confirmed" } }),
    cancelAppointment: (id: string) => updateMutation.mutate({ id, data: { status: "cancelled" } }),
  };
}

// ── Missed Calls ──────────────────────────────────────────────────────────────
export function useMissedCallsApi() {
  const utils = trpc.useUtils();
  const { data: calls = [], isLoading } = trpc.missedCalls.list.useQuery();
  const markHandledMutation = trpc.missedCalls.markHandled.useMutation({ onSuccess: () => utils.missedCalls.list.invalidate() });
  const markAllHandledMutation = trpc.missedCalls.markAllHandled.useMutation({ onSuccess: () => utils.missedCalls.list.invalidate() });

  return {
    calls,
    isLoading,
    unhandledCount: calls.filter(c => !c.handled).length,
    markHandled: (id: string) => markHandledMutation.mutate({ id }),
    markAllHandled: () => markAllHandledMutation.mutate(),
  };
}

// ── Follow-up Leads ───────────────────────────────────────────────────────────
export function useFollowUpApi() {
  const utils = trpc.useUtils();
  const { data: followUpLeads = [], isLoading } = trpc.followUp.list.useQuery();
  const updateMutation = trpc.followUp.update.useMutation({ onSuccess: () => utils.followUp.list.invalidate() });

  return {
    followUpLeads,
    isLoading,
    markSent: (id: string) => updateMutation.mutate({ id, data: { status: "sent" } }),
    updateFollowUp: (id: string, data: any) => updateMutation.mutate({ id, data }),
  };
}

// ── Agents ────────────────────────────────────────────────────────────────────
export function useAgentsApi() {
  const { data: agents = [], isLoading } = trpc.agents.list.useQuery();
  return { agents, isLoading };
}

// ── AI Chat ───────────────────────────────────────────────────────────────────
export function useAiChat() {
  const chatMutation = trpc.ai.chat.useMutation();
  return {
    sendMessage: (messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) =>
      chatMutation.mutateAsync({ messages }),
    isLoading: chatMutation.isPending,
  };
}
