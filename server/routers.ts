import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import {
  getLeads, createLead, updateLead, deleteLead,
  getProperties, createProperty, updateProperty, deleteProperty,
  getPipelineDeals, createPipelineDeal, updatePipelineDeal, deletePipelineDeal,
  getAppointments, createAppointment, updateAppointment, deleteAppointment,
  getMissedCalls, createMissedCall, markMissedCallHandled, markAllMissedCallsHandled,
  getFollowUpLeads, updateFollowUpLead,
  getAgents,
  seedInitialData,
} from "./db-helpers";

const leadsRouter = router({
  list: publicProcedure.query(() => getLeads()),
  create: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), phone: z.string(), type: z.enum(["buyer","seller"]).default("buyer"), status: z.enum(["hot","warm","cold"]).default("warm"), area: z.string().optional(), rooms: z.string().optional(), budget: z.string().optional(), agent: z.string().optional(), lastContact: z.string().optional(), daysAgo: z.number().optional(), notes: z.string().optional(), avatar: z.string().optional() }))
    .mutation(({ input }) => createLead(input)),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ name: z.string().optional(), phone: z.string().optional(), type: z.enum(["buyer","seller"]).optional(), status: z.enum(["hot","warm","cold"]).optional(), area: z.string().optional(), rooms: z.string().optional(), budget: z.string().optional(), agent: z.string().optional(), lastContact: z.string().optional(), daysAgo: z.number().optional(), notes: z.string().optional(), avatar: z.string().optional() }) }))
    .mutation(({ input }) => updateLead(input.id, input.data)),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => deleteLead(input.id)),
});

const propertiesRouter = router({
  list: publicProcedure.query(() => getProperties()),
  create: publicProcedure
    .input(z.object({ id: z.string(), emoji: z.string().optional(), name: z.string(), tags: z.string().default("[]"), price: z.string(), agent: z.string().optional(), matches: z.number().optional(), bgColor: z.string().optional() }))
    .mutation(({ input }) => createProperty(input)),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ emoji: z.string().optional(), name: z.string().optional(), tags: z.string().optional(), price: z.string().optional(), agent: z.string().optional(), matches: z.number().optional(), bgColor: z.string().optional() }) }))
    .mutation(({ input }) => updateProperty(input.id, input.data)),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => deleteProperty(input.id)),
});

const pipelineRouter = router({
  list: publicProcedure.query(() => getPipelineDeals()),
  create: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), detail: z.string().optional(), agent: z.string().optional(), stage: z.enum(["lead","tour","negotiation","contract","closed"]).default("lead"), tag: z.string().optional(), tagColor: z.string().optional(), value: z.string().optional() }))
    .mutation(({ input }) => createPipelineDeal(input)),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ name: z.string().optional(), detail: z.string().optional(), agent: z.string().optional(), stage: z.enum(["lead","tour","negotiation","contract","closed"]).optional(), tag: z.string().optional(), tagColor: z.string().optional(), value: z.string().optional() }) }))
    .mutation(({ input }) => updatePipelineDeal(input.id, input.data)),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => deletePipelineDeal(input.id)),
});

const appointmentsRouter = router({
  list: publicProcedure.query(() => getAppointments()),
  create: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), type: z.string().optional(), detail: z.string().optional(), time: z.string(), agent: z.string().optional(), status: z.enum(["confirmed","pending","cancelled"]).default("pending"), nightCallSent: z.boolean().optional(), nightCallResult: z.enum(["confirmed","no-answer"]).optional(), morningCallStatus: z.enum(["scheduled","retry","done"]).default("scheduled") }))
    .mutation(({ input }) => createAppointment(input)),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ name: z.string().optional(), type: z.string().optional(), detail: z.string().optional(), time: z.string().optional(), agent: z.string().optional(), status: z.enum(["confirmed","pending","cancelled"]).optional(), nightCallSent: z.boolean().optional(), nightCallResult: z.enum(["confirmed","no-answer"]).optional(), morningCallStatus: z.enum(["scheduled","retry","done"]).optional() }) }))
    .mutation(({ input }) => updateAppointment(input.id, input.data)),
  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => deleteAppointment(input.id)),
});

const missedCallsRouter = router({
  list: publicProcedure.query(() => getMissedCalls()),
  create: publicProcedure
    .input(z.object({ id: z.string(), name: z.string().optional(), phone: z.string(), time: z.string().optional(), urgency: z.enum(["high","medium","low"]).optional(), source: z.string().optional(), handled: z.boolean().optional() }))
    .mutation(({ input }) => createMissedCall(input)),
  markHandled: publicProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => markMissedCallHandled(input.id)),
  markAllHandled: publicProcedure.mutation(() => markAllMissedCallsHandled()),
});

const followUpRouter = router({
  list: publicProcedure.query(() => getFollowUpLeads()),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: z.object({ status: z.enum(["pending","sent","replied"]).optional(), urgency: z.enum(["high","medium","low"]).optional() }) }))
    .mutation(({ input }) => updateFollowUpLead(input.id, input.data)),
});

const agentsRouter = router({
  list: publicProcedure.query(() => getAgents()),
});

const aiRouter = router({
  chat: publicProcedure
    .input(z.object({ messages: z.array(z.object({ role: z.enum(["system","user","assistant"]), content: z.string() })) }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({ messages: input.messages });
      const content = (response as any).choices?.[0]?.message?.content ?? "";
      return { content };
    }),
});

const seedRouter = router({
  run: publicProcedure.mutation(() => seedInitialData()),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  leads: leadsRouter,
  properties: propertiesRouter,
  pipeline: pipelineRouter,
  appointments: appointmentsRouter,
  missedCalls: missedCallsRouter,
  followUp: followUpRouter,
  agents: agentsRouter,
  ai: aiRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;
