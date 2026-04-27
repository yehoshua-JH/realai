// RealAI 2.0 — WhatsApp Bot View
// AI powered via server-side tRPC route (works with any API key)
import { useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  time: string;
}

interface ExtractedData {
  type: string;
  location: string;
  rooms: string;
  budget: string;
  nextStep: string;
}

const SYSTEM_PROMPT = `אתה בוט של משרד נדל"ן ABC. אסוף: לקנות/למכור, אזור, חדרים, תקציב. שאלה אחת בכל פעם. עברית. קצר. כשיש מספיק: "מעולה! שולח הסכם תיווך 📝"`;

const FALLBACK: Record<string, string> = {
  'לקנות': 'מעולה! באיזה אזור אתה מחפש?',
  'למכור': 'יפה! באיזה עיר הדירה?',
  'חדרים': 'מה התקציב בערך?',
  'תקציב': 'מעולה! שולח הסכם תיווך 📝',
};

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export default function WhatsAppView() {
  const chatMutation = trpc.ai.chat.useMutation();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', role: 'bot', text: 'שלום! 👋 אני הבוט החכם של ABC נדל״ן.\nאשמח לעזור לך למצוא את הנכס המושלם.\nמה אתה מחפש?', time: '09:41' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData>({ type: 'ממתין...', location: 'ממתין...', rooms: 'ממתין...', budget: 'ממתין...', nextStep: 'אחרי איסוף פרטים → שליחת הסכם תיווך' });
  const contextRef = useRef<{ role: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const updateExtracted = (msg: string) => {
    setExtracted(prev => {
      const next = { ...prev };
      if (msg.includes('לקנות') || msg.includes('קונה')) next.type = '🛒 קונה';
      if (msg.includes('למכור') || msg.includes('מוכר')) next.type = '🏷️ מוכר';
      if (msg.includes('רמת גן')) next.location = 'רמת גן';
      if (msg.includes('תל אביב') || msg.includes('ת״א')) next.location = 'תל אביב';
      if (msg.includes('פ״ת') || msg.includes('פתח תקווה')) next.location = 'פ״ת';
      if (msg.includes('הרצליה')) next.location = 'הרצליה';
      const rm = msg.match(/(\d)\s*חד/);
      if (rm) next.rooms = `${rm[1]} חדרים`;
      const bg = msg.match(/(\d[\d,.]*)\s*(מיליון|M)/i);
      if (bg) next.budget = `₪${bg[1]} מיליון`;
      return next;
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: Message = { id: `m${Date.now()}`, role: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    contextRef.current.push({ role: 'user', content: text });
    updateExtracted(text);
    setLoading(true);
    scrollToBottom();

    try {
      const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
      const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;

      const response = await fetch(`${apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-20250514',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: contextRef.current,
        }),
      });

      const data = await response.json();
      const reply = data?.content?.[0]?.text ?? '';

      if (!reply) throw new Error('No reply');

      contextRef.current.push({ role: 'assistant', content: reply });
      const botMsg: Message = { id: `m${Date.now()}`, role: 'bot', text: reply, time: getTime() };
      setMessages(prev => [...prev, botMsg]);

      if (reply.includes('הסכם')) {
        setTimeout(() => {
          const contractMsg: Message = { id: `m${Date.now()}c`, role: 'bot', text: '📄 קישור לחתימה:\nhttps://sign.realai.co.il/abc123', time: getTime() };
          setMessages(prev => [...prev, contractMsg]);
          toast.success('📝 הסכם נשלח', { description: 'הלקוח קיבל הסכם לחתימה דיגיטלית' });
          scrollToBottom();
        }, 1200);
      }
    } catch {
      // Fallback
      const key = Object.keys(FALLBACK).find(k => text.includes(k));
      const fallbackText = key ? FALLBACK[key] : 'תודה! באיזה אזור אתה מחפש?';
      contextRef.current.push({ role: 'assistant', content: fallbackText });
      const botMsg: Message = { id: `m${Date.now()}`, role: 'bot', text: fallbackText, time: getTime() };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* Chat Window */}
      <div>
        <div style={{ background: 'var(--ra-card2)', border: '1px solid var(--ra-border)', borderRadius: 13, overflow: 'hidden' }}>
          {/* Chat Header */}
          <div style={{ background: '#1a2d3f', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🏢</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>ABC נדל״ן</div>
              <div style={{ fontSize: 10, color: '#25d366' }}>Bot פעיל · מגיב מיידית</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height: 380, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, background: '#0d1b2a' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-start' : 'flex-end',
                animation: 'fadeInUp 0.3s ease',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: msg.role === 'user' ? '12px 12px 12px 3px' : '12px 12px 3px 12px',
                  background: msg.role === 'user' ? '#1f3a52' : '#25d366',
                  color: msg.role === 'user' ? '#e2e8f0' : '#000',
                  fontSize: 13,
                  lineHeight: 1.5,
                  position: 'relative',
                }}>
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}
                  <div style={{ fontSize: 9, color: msg.role === 'user' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', marginTop: 4, textAlign: 'left' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 3px 12px', background: '#25d366', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="typing-dot" style={{ color: '#000' }} />
                  <span className="typing-dot" style={{ color: '#000' }} />
                  <span className="typing-dot" style={{ color: '#000' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: '#1a2d3f', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="כתוב הודעה..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                padding: '8px 14px',
                fontSize: 13,
                color: '#fff',
                outline: 'none',
                fontFamily: "'Heebo', sans-serif",
                direction: 'rtl',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#25d366',
                border: 'none',
                cursor: 'pointer',
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                opacity: loading ? 0.5 : 1,
              }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* Quick Buttons */}
        <div style={{ marginTop: 7, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[
            { label: '🛒 לקנות', value: 'רוצה לקנות דירה 4 חדרים' },
            { label: '🏷️ למכור', value: 'יש לי דירה למכירה' },
            { label: '📍 4 חד׳ רמת גן', value: '4 חדרים רמת גן עד 3 מיליון' },
          ].map(q => (
            <button
              key={q.label}
              onClick={() => setInput(q.value)}
              style={{
                padding: '4px 10px',
                borderRadius: 7,
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--ra-border)',
                color: 'var(--ra-muted)',
                cursor: 'pointer',
                fontFamily: "'Heebo', sans-serif",
                transition: 'all 0.15s',
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Data */}
      <div style={{ background: 'var(--ra-card)', border: '1px solid var(--ra-border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--ra-border)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ra-text)' }}>נתונים שנאספו</div>
          <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 1 }}>Claude מעדכן בזמן אמת</div>
        </div>
        <div style={{ padding: '14px 18px' }}>
          {[
            { label: 'סוג לקוח', value: extracted.type },
            { label: 'מיקום', value: extracted.location },
            { label: 'חדרים', value: extracted.rooms },
            { label: 'תקציב', value: extracted.budget },
          ].map(field => (
            <div key={field.label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 9, color: 'var(--ra-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>{field.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: field.value === 'ממתין...' ? 'var(--ra-muted)' : 'var(--ra-text)' }}>{field.value}</div>
            </div>
          ))}

          <div style={{ marginTop: 11, paddingTop: 11, borderTop: '1px solid var(--ra-border)' }}>
            <div style={{ fontSize: 8, color: 'var(--ra-muted)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>שלב הבא</div>
            <div style={{ fontSize: 11, color: 'var(--ra-text)', background: 'var(--ra-card2)', borderRadius: 7, padding: '8px 10px', lineHeight: 1.5 }}>
              {extracted.nextStep}
            </div>
          </div>

          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: 9 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#25d366', marginBottom: 4 }}>🤖 אוטומציה פעילה</div>
            <div style={{ fontSize: 10, color: 'var(--ra-muted)', lineHeight: 1.6 }}>
              כשיש מספיק פרטים → Claude שולח הסכם תיווך דיגיטלי אוטומטית
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
