import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

function Login() {
     document.title = 'Login | Hope CMS';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signInWithGoogle, authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingFromGoogle = searchParams.get('pending') === 'true';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else navigate('/customers');
    setLoading(false);
  };

  const displayError = error || authError || (pendingFromGoogle ? 'Your account is pending activation by a SUPERADMIN.' : null);
  const isWarning = !error && (authError || pendingFromGoogle);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .hope-login { font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; background: #0a0f1e; width: 100%;  overflow-x: hidden;  }
        .hope-left { display: none; }
        @media(min-width: 1024px) {
          .hope-left { display: flex; flex-direction: column; justify-content: space-between; width: 50%; padding: 48px 64px; background: linear-gradient(135deg, rgba(30,58,138,0.3) 0%, transparent 100%);}
        }
        .hope-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .hope-card { width: 100%; max-width: 400px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px; }
        .hope-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #4b5563; margin-bottom: 6px; }
        .hope-input-group { position: relative; display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0 14px; transition: border-color 0.2s, background 0.2s; }
        .hope-input-group:focus-within { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.04); }
        .hope-input-group svg { width: 16px; height: 16px; flex-shrink: 0; color: #4b5563; }
        .hope-input-group input { flex: 1; padding: 12px 10px; background: transparent; border: none; outline: none; color: #f1f5f9; font-size: 14px; font-family: 'Inter', sans-serif; }
        .hope-input-group input::placeholder { color: #374151; }
        .hope-eye { background: none; border: none; cursor: pointer; padding: 4px; color: #4b5563; display: flex; align-items: center; transition: color 0.2s; }
        .hope-eye:hover { color: #60a5fa; }
        .hope-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; color: white; background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 4px 20px rgba(59,130,246,0.3); transition: all 0.2s; letter-spacing: 0.01em; }
        .hope-btn:hover:not(:disabled) { box-shadow: 0 4px 28px rgba(59,130,246,0.5); transform: translateY(-1px); }
        .hope-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .hope-google { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif; color: #cbd5e1; background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
        .hope-google:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .hope-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .hope-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .hope-divider span { font-size: 11px; color: #374151; font-weight: 500; }
        .hope-error { padding: 12px 14px; border-radius: 10px; font-size: 13px; display: flex; align-items: flex-start; gap: 8px; margin-bottom: 20px; }
        .hope-error.warn { background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.2); color: #fbbf24; }
        .hope-error.err { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #f87171; }
        .hope-feature { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .hope-feature-dot { width: 7px; height: 7px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
        .hope-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); margin-bottom: 24px; }
        .hope-title { font-size: 42px; font-weight: 800; color: white; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 16px; }
        .hope-gradient-text { background: linear-gradient(90deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      <div className="hope-login">
        {/* Ambient glow */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 50%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 50%)' }} />

        {/* Left panel */}
        <div className="hope-left">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Hope CMS</span>
          </div>

          {/* Hero */}
          <div>
            <div className="hope-chip">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#93c5fd', letterSpacing: '0.05em' }}>CUSTOMER MANAGEMENT SYSTEM</span>
            </div>
            <div className="hope-title">
              Run your<br />
              business<br />
              <span className="hope-gradient-text">smarter.</span>
            </div>
            <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.7, maxWidth: 340, marginBottom: 36 }}>
              Manage customers, track sales, control access, and generate real-time reports.
            </p>
            {[
              'Customer Management & Soft Delete',
              'Role-Based Access (USER / ADMIN / SUPERADMIN)',
              'Sales Summary & Product Revenue Reports',
              'Row-Level Security on all tables',
            ].map(f => (
              <div key={f} className="hope-feature">
                <div className="hope-feature-dot" />
                <span style={{ color: '#6b7280', fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#1f2937' }}>© 2026 Hope, Inc. — Powered by Supabase + React</div>
        </div>

        {/* Right panel */}
        <div className="hope-right">
          <div className="hope-card">
            {/* Mobile logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }} className="lg-hidden">
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Hope CMS</span>
            </div>

            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Sign in</h2>
            <p style={{ color: '#374151', fontSize: 13, marginBottom: 24 }}>Welcome back — enter your credentials to continue</p>

            {displayError && (
              <div className={`hope-error ${isWarning ? 'warn' : 'err'}`}>
                <span style={{ flexShrink: 0 }}>{isWarning ? '⚠️' : '⛔'}</span>
                <span>{displayError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label className="hope-label">Email</label>
                <div className="hope-input-group">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <label className="hope-label">Password</label>
                <div className="hope-input-group">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
                  <button type="button" className="hope-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="hope-btn">
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="hope-divider">
              <div className="hope-divider-line" />
              <span>OR</span>
              <div className="hope-divider-line" />
            </div>

            <button onClick={signInWithGoogle} className="hope-google">
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 16, height: 16 }} />
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#374151' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;