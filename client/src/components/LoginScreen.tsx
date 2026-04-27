// RealAI 2.0 — Login Screen
import { useState } from "react";
import { AgentUser } from "@/lib/store";

const AGENTS = [
  { name: 'רותי לוי', role: 'סוכנת', avatar: '👩', password: '1234' },
  { name: 'דני כהן', role: 'סוכן', avatar: '👨', password: '1234' },
  { name: 'יואב מזרחי', role: 'סוכן', avatar: '👨', password: '1234' },
  { name: 'מנהל ראשי', role: 'מנהל', avatar: '👑', password: 'admin123' },
];

interface LoginScreenProps {
  onLogin: (name: string, password: string) => boolean;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const ok = onLogin(selected, password);
    if (!ok) {
      setError('סיסמה שגויה. נסה שוב.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ra-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Heebo', sans-serif",
      direction: 'rtl',
      padding: 20,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        animation: 'fadeInUp 0.5s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--ra-blue), var(--ra-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            margin: '0 auto 14px',
            boxShadow: '0 0 40px rgba(59,130,246,0.3)',
          }}>🏠</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--ra-text)', letterSpacing: -1 }}>RealAI</div>
          <div style={{ fontSize: 11, color: 'var(--ra-muted)', marginTop: 2 }}>מערכת ניהול נדל״ן חכמה</div>
        </div>

        <div style={{
          background: 'var(--ra-card)',
          border: '1px solid var(--ra-border)',
          borderRadius: 16,
          padding: 28,
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ra-text)', marginBottom: 16 }}>בחר סוכן</div>

          {/* Agent Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {AGENTS.map(agent => (
              <button
                key={agent.name}
                onClick={() => { setSelected(agent.name); setPassword(''); setError(''); }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${selected === agent.name ? 'var(--ra-blue)' : 'var(--ra-border)'}`,
                  background: selected === agent.name ? 'rgba(59,130,246,0.1)' : 'var(--ra-card2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                  fontFamily: "'Heebo', sans-serif",
                  textAlign: 'right',
                }}
              >
                <span style={{ fontSize: 20 }}>{agent.avatar}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ra-text)' }}>{agent.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--ra-muted)' }}>{agent.role}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Password */}
          {selected && (
            <div style={{ marginBottom: 16, animation: 'fadeInUp 0.25s ease' }}>
              <label style={{ fontSize: 11, color: 'var(--ra-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                סיסמה
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="הכנס סיסמה..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 9,
                  border: `1px solid ${error ? 'var(--ra-red)' : 'var(--ra-border)'}`,
                  background: 'var(--ra-card2)',
                  color: 'var(--ra-text)',
                  fontSize: 14,
                  fontFamily: "'Heebo', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {error && (
                <div style={{ fontSize: 11, color: 'var(--ra-red)', marginTop: 5 }}>{error}</div>
              )}
              <div style={{ fontSize: 10, color: 'var(--ra-muted)', marginTop: 5 }}>
                💡 סיסמת דמו: סוכנים → <strong>1234</strong> · מנהל → <strong>admin123</strong>
              </div>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={!selected || loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: selected ? 'var(--ra-blue)' : 'rgba(255,255,255,0.05)',
              color: selected ? '#fff' : 'var(--ra-muted)',
              fontSize: 14,
              fontWeight: 800,
              cursor: selected ? 'pointer' : 'default',
              fontFamily: "'Heebo', sans-serif",
              transition: 'all 0.2s',
              boxShadow: selected ? '0 0 20px rgba(59,130,246,0.25)' : 'none',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ מתחבר...' : '🔐 כניסה למערכת'}
          </button>
        </div>
      </div>
    </div>
  );
}
