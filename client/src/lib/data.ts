// ============================================================
// RealAI 2.0 — Mock Data Store
// All data matches the Hebrew prototype exactly
// ============================================================

export type LeadStatus = 'hot' | 'warm' | 'cold';
export type LeadType = 'buyer' | 'seller';
export type PipelineStage = 'lead' | 'tour' | 'negotiation' | 'contract' | 'closed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: LeadType;
  status: LeadStatus;
  area: string;
  rooms: string;
  budget?: string;
  agent: string;
  lastContact: string;
  daysAgo: number;
  notes?: string;
  avatar: string;
}

export interface Property {
  id: string;
  emoji: string;
  name: string;
  tags: string[];
  price: string;
  agent: string;
  matches: number;
  bgColor: string;
}

export interface PipelineDeal {
  id: string;
  name: string;
  detail: string;
  agent: string;
  stage: PipelineStage;
  tag: string;
  tagColor: string;
  value?: string;
}

export interface Agent {
  id: string;
  name: string;
  medal: string;
  leads: number;
  tours: number;
  closes: number;
  earnings: string;
  color: string;
}

export interface Appointment {
  id: string;
  name: string;
  type: string;
  detail: string;
  time: string;
  agent: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  nightCallSent: boolean;
  nightCallResult?: 'confirmed' | 'no-answer' | null;
  morningCallStatus: 'scheduled' | 'retry' | 'done';
}

export interface MissedCall {
  id: string;
  name?: string;
  phone: string;
  isKnown: boolean;
  attempts: number;
  timeAgo: string;
  status?: string;
  stage?: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface FollowUpLead {
  id: string;
  name: string;
  type: LeadType;
  detail: string;
  daysAgo: number;
  sent: boolean;
  avatar: string;
}

// ── Dashboard Stats ──
export const dashboardStats = [
  { id: 'leads', label: 'לידים חדשים', value: 24, delta: '+12%', icon: '🎯', color: '#3b82f6', barWidth: 72 },
  { id: 'tours', label: 'סיורים השבוע', value: 8, delta: '+3', icon: '🏠', color: '#10b981', barWidth: 55 },
  { id: 'contracts', label: 'הסכמים נחתמו', value: 3, delta: '+1', icon: '📝', color: '#8b5cf6', barWidth: 38 },
  { id: 'revenue', label: 'הכנסות החודש', value: '₪42K', delta: '+18%', icon: '💰', color: '#f59e0b', barWidth: 85 },
];

// ── Activity Feed ──
export const activityFeed = [
  { id: '1', icon: '📞', name: 'יוסי דוד', badge: 'קונה', badgeClass: 'buy', text: 'שיחה נכנסת · 3 חד׳ פ״ת · תקציב 2M', time: 'לפני 2 דק׳', isNew: true },
  { id: '2', icon: '📝', name: 'מירי כהן', badge: 'מוכרת', badgeClass: 'sell', text: 'חתמה על הסכם תיווך דיגיטלי', time: 'לפני 8 דק׳', isNew: false },
  { id: '3', icon: '🎯', name: 'AI התאמה', badge: 'חם', badgeClass: 'hot', text: 'שרה גולן ↔ דוד כהן · 89% התאמה', time: 'לפני 15 דק׳', isNew: false },
  { id: '4', icon: '🏆', name: 'עסקה נסגרה!', badge: 'חם', badgeClass: 'hot', text: 'לימור ורד · 3 חד׳ גבעתיים · ₪28,800', time: 'לפני 1 ש׳', isNew: false },
  { id: '5', icon: '🔁', name: 'Follow-up', badge: 'קר', badgeClass: 'cold', text: 'אורן בן-דוד · לא ענה 4 ימים · נשלח אוטומטית', time: 'לפני 2 ש׳', isNew: false },
];

// ── Leads ──
export const leads: Lead[] = [
  { id: 'l1', name: 'יוסי דוד', phone: '052-1234567', type: 'buyer', status: 'hot', area: 'פ״ת', rooms: '3', budget: '2M', agent: 'רותי', lastContact: 'לפני 2 דק׳', daysAgo: 0, avatar: '👨' },
  { id: 'l2', name: 'שרה גולן', phone: '054-7654321', type: 'buyer', status: 'hot', area: 'הרצליה', rooms: '5', budget: '4M', agent: 'דני', lastContact: 'לפני 1 ש׳', daysAgo: 0, avatar: '👩' },
  { id: 'l3', name: 'אורן בן-דוד', phone: '050-9876543', type: 'buyer', status: 'warm', area: 'ת״א', rooms: '4', budget: '4.5M', agent: 'יואב', lastContact: 'לפני 4 ימים', daysAgo: 4, avatar: '👨' },
  { id: 'l4', name: 'לימור ורד', phone: '050-4445555', type: 'seller', status: 'warm', area: 'גבעתיים', rooms: '3', agent: 'רותי', lastContact: 'לפני 7 ימים', daysAgo: 7, avatar: '👩' },
  { id: 'l5', name: 'דוד כהן', phone: '058-3332222', type: 'seller', status: 'cold', area: 'הרצליה', rooms: '5', agent: 'יואב', lastContact: 'לפני 1 יום', daysAgo: 1, avatar: '👨' },
  { id: 'l6', name: 'עדנה בן-דוד', phone: '052-8887766', type: 'buyer', status: 'warm', area: 'בני ברק', rooms: '4', agent: 'דני', lastContact: 'לפני 3 ימים', daysAgo: 3, avatar: '👩' },
];

// ── Follow-up ──
export const followUpLeads: FollowUpLead[] = [
  { id: 'f1', name: 'יוסי דוד', type: 'buyer', detail: 'קונה · 3 חד׳ פ״ת · שיחה ראשונה לפני 3 ימים', daysAgo: 3, sent: false, avatar: '👨' },
  { id: 'f2', name: 'רינת שרון', type: 'seller', detail: 'מוכרת · 4 חד׳ רמת גן · קראה הסכם לפני 2 ימים', daysAgo: 2, sent: false, avatar: '👩' },
  { id: 'f3', name: 'אורן בן-דוד', type: 'buyer', detail: 'קונה · 4 חד׳ ת״א · לא ענה לשתי שיחות', daysAgo: 4, sent: false, avatar: '👨' },
  { id: 'f4', name: 'לימור ורד', type: 'buyer', detail: 'קונה · 3 חד׳ גבעתיים · פגישה בוטלה', daysAgo: 7, sent: false, avatar: '👩' },
  { id: 'f5', name: 'דוד כהן', type: 'seller', detail: 'מוכר · 5 חד׳ הרצליה · ביקש להתקשר מחדש', daysAgo: 1, sent: false, avatar: '👨' },
  { id: 'f6', name: 'עדנה בן-דוד', type: 'buyer', detail: 'קונה · 4 חד׳ בני ברק · ראתה נכס ולא חזרה', daysAgo: 3, sent: false, avatar: '👩' },
  { id: 'f7', name: 'מאיר לוי', type: 'buyer', detail: 'קונה · 4 חד׳ כפ״ס · שאל שאלות ונעלם', daysAgo: 5, sent: false, avatar: '👨' },
];

// ── Properties ──
export const properties: Property[] = [
  { id: 'p1', emoji: '🏢', name: 'רמת גן · 4 חד׳ קומה 4', tags: ['4 חד׳', '105 מ״ר', 'קומה 4', 'מרפסת'], price: '₪2,750,000', agent: 'יואב', matches: 15, bgColor: '#0f1a2e' },
  { id: 'p2', emoji: '🏠', name: 'פ״ת · 3 חד׳ קומה 7', tags: ['3 חד׳', '88 מ״ר', 'קומה 7', 'חנייה'], price: '₪1,850,000', agent: 'רותי', matches: 8, bgColor: '#0a0f1a' },
  { id: 'p3', emoji: '🏗️', name: 'הרצליה · 5 חד׳ + גינה', tags: ['5 חד׳', '145 מ״ר', 'גינה', 'חדשה'], price: '₪4,100,000', agent: 'דני', matches: 6, bgColor: '#1a0f0a' },
  { id: 'p4', emoji: '🏘️', name: 'גבעתיים · 3 חד׳ משופצת', tags: ['3 חד׳', '82 מ״ר', 'משופצת', 'מרפסת'], price: '₪2,200,000', agent: 'יואב', matches: 11, bgColor: '#0f0a1a' },
  { id: 'p5', emoji: '🏢', name: 'ת״א · 4 חד׳ מגדל', tags: ['4 חד׳', '115 מ״ר', 'קומה 18', 'נוף ים'], price: '₪4,800,000', agent: 'רותי', matches: 4, bgColor: '#0a1a14' },
  { id: 'p6', emoji: '🏠', name: 'כפ״ס · 4 חד׳ גינה', tags: ['4 חד׳', '120 מ״ר', 'גינה', 'חנייה כפולה'], price: '₪3,100,000', agent: 'דני', matches: 9, bgColor: '#1a1a0a' },
];

// ── Pipeline ──
export const pipelineDeals: PipelineDeal[] = [
  { id: 'd1', name: 'דני לוי', detail: '4 חד׳ רמת גן\n15 התאמות', agent: 'יואב', stage: 'lead', tag: '🔥 חם', tagColor: 'rgba(255,71,87,0.15)', value: '' },
  { id: 'd2', name: 'שרה גולן', detail: '5 חד׳ הרצליה', agent: 'דני', stage: 'lead', tag: '🔥 חם', tagColor: 'rgba(255,71,87,0.15)', value: '' },
  { id: 'd3', name: 'אורן בן-דוד', detail: '4 חד׳ ת״א\nיום ד׳', agent: 'יואב', stage: 'tour', tag: 'קרוב', tagColor: 'rgba(59,130,246,0.15)', value: '' },
  { id: 'd4', name: 'שרה גולן', detail: '5 חד׳ הרצליה\nהצעה 3.2M', agent: 'דני', stage: 'negotiation', tag: 'חם', tagColor: 'rgba(255,71,87,0.15)', value: '3.2M' },
  { id: 'd5', name: 'לימור ורד', detail: '3 חד׳ גבעתיים\nהצעה 2.4M', agent: 'רותי', stage: 'negotiation', tag: 'חם', tagColor: 'rgba(255,71,87,0.15)', value: '2.4M' },
  { id: 'd6', name: 'מירי כהן', detail: '4 חד׳ רמת גן\n2.75M ✓', agent: 'יואב', stage: 'contract', tag: 'עו״ד', tagColor: 'rgba(139,92,246,0.15)', value: '2.75M' },
  { id: 'd7', name: 'רון אביב 🎉', detail: '4 חד׳ כפ״ס\n3.0M ✅', agent: 'דני', stage: 'closed', tag: '₪36K', tagColor: 'rgba(16,185,129,0.15)', value: '3.0M' },
];

// ── Agents ──
export const agents: Agent[] = [
  { id: 'a1', name: 'יואב כהן', medal: '🥇', leads: 18, tours: 6, closes: 2, earnings: '₪28K', color: '#f59e0b' },
  { id: 'a2', name: 'דני לוי', medal: '🥈', leads: 14, tours: 4, closes: 1, earnings: '₪14K', color: '#94a3b8' },
  { id: 'a3', name: 'רותי שרון', medal: '🥉', leads: 12, tours: 5, closes: 0, earnings: '₪0', color: '#cd7f32' },
  { id: 'a4', name: 'מיקה אדלר', medal: '👤', leads: 9, tours: 2, closes: 0, earnings: '₪0', color: '#64748b' },
  { id: 'a5', name: 'אבי שטרן', medal: '👤', leads: 7, tours: 3, closes: 0, earnings: '₪0', color: '#64748b' },
];

// ── Appointments ──
export const appointments: Appointment[] = [
  { id: 'r1', name: 'יוסי דוד', type: 'סיור', detail: '3 חד׳ פ״ת · מחר 10:00', agent: 'רותי', status: 'confirmed', nightCallSent: true, nightCallResult: 'confirmed', morningCallStatus: 'scheduled', time: '10:00' },
  { id: 'r2', name: 'שרה גולן', type: 'סיור', detail: '5 חד׳ הרצליה · מחר 14:00', agent: 'דני', status: 'confirmed', nightCallSent: true, nightCallResult: 'confirmed', morningCallStatus: 'scheduled', time: '14:00' },
  { id: 'r3', name: 'אורן בן-דוד', type: 'סיור', detail: '4 חד׳ ת״א · מחר 11:00', agent: 'יואב', status: 'pending', nightCallSent: true, nightCallResult: 'no-answer', morningCallStatus: 'retry', time: '11:00' },
  { id: 'r4', name: 'מירי כהן', type: 'פגישה', detail: '4 חד׳ רמת גן · מחר 16:00', agent: 'יואב', status: 'cancelled', nightCallSent: true, nightCallResult: null, morningCallStatus: 'done', time: '16:00' },
];

// ── Missed Calls ──
export const missedCalls: MissedCall[] = [
  { id: 'm1', name: 'יוסי דוד', phone: '052-1234567', isKnown: true, attempts: 2, timeAgo: 'לפני 30 דק׳', status: 'קונה', stage: '3 חד׳ פ״ת · שלב ראשוני', urgency: 'high' },
  { id: 'm2', phone: '054-7773333', isKnown: false, attempts: 3, timeAgo: 'לפני 1 ש׳', urgency: 'high' },
  { id: 'm3', name: 'לימור ורד', phone: '050-4445555', isKnown: true, attempts: 1, timeAgo: 'לפני 2 ש׳', status: 'מוכרת', stage: '3 חד׳ גבעתיים · בשלב מו"מ', urgency: 'medium' },
];

// ── WhatsApp Bot Fallback Responses ──
export const waBotFallback: Record<string, string> = {
  'לקנות': 'מעולה! באיזה אזור אתה מחפש?',
  'למכור': 'יפה! באיזה עיר הדירה?',
  'חדרים': 'מה התקציב בערך?',
  'תקציב': 'מעולה! שולח הסכם תיווך 📝',
};

export const waSystemPrompt = `אתה בוט של משרד נדל"ן ABC. אסוף: לקנות/למכור, אזור, חדרים, תקציב. שאלה אחת בכל פעם. עברית. קצר. כשיש מספיק: "מעולה! שולח הסכם תיווך 📝"`;
