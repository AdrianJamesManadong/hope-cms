import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Register() {
  document.title = 'Register | Hope CMS'
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('The Passwords do not match.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const username = `${formData.firstName.trim().toLowerCase()}.${formData.lastName.trim().toLowerCase()}`;
    const { error } = await signUp(formData.email, formData.password, username);
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const EyeOpen = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const EyeClosed = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const inputGroup = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '0 12px',
    width: '100%',
    transition: 'border-color 0.2s',
  };

  const inputStyle = {
    flex: 1,
    minWidth: 0,
    padding: '11px 6px',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f1f5f9',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
    width: '100%',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#4b5563',
    marginBottom: 6,
  };

  const iconStyle = { width: 16, height: 16, flexShrink: 0, color: '#4b5563' };

  if (success) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', width: '100%', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Account Created!</h2>
              <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 16 }}>Your account was created successfully.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fbbf24', letterSpacing: '0.05em' }}>PENDING ACTIVATION</span>
              </div>
              <p style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
                A SUPERADMIN will activate your account. You'll be able to login once approved.
              </p>
              <Link to="/login" style={{ display: 'block', padding: 13, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; background: #0a0f1e; }
        .reg-root { font-family: 'Inter', sans-serif; min-height: 100vh; width: 100%; display: flex; background: #0a0f1e; overflow-x: hidden; }
        .reg-left { display: none; }
        @media(min-width: 1024px) {
          .reg-left { display: flex; flex-direction: column; justify-content: space-between; width: 42%; min-height: 100vh; padding: 48px 56px; background: linear-gradient(135deg, rgba(30,58,138,0.25) 0%, transparent 100%); border-right: 1px solid rgba(255,255,255,0.05); }
        }
        .reg-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px 24px; overflow-y: auto; }
        .reg-card { width: 100%; max-width: 420px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 32px; }
        .reg-input-focus:focus-within { border-color: rgba(59,130,246,0.5) !important; background: rgba(59,130,246,0.04) !important; }
        .reg-input-focus input::placeholder { color: #374151; }
        .reg-btn { width: 100%; padding: 13px; border-radius: 12px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; color: white; background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 4px 20px rgba(59,130,246,0.3); transition: all 0.2s; }
        .reg-btn:hover:not(:disabled) { box-shadow: 0 4px 28px rgba(59,130,246,0.5); transform: translateY(-1px); }
        .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .reg-google { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-size: 13px; font-weight: 500; font-family: 'Inter', sans-serif; color: #cbd5e1; background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
        .reg-google:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }
        .reg-eye { background: none; border: none; cursor: pointer; padding: 4px; color: #4b5563; display: flex; align-items: center; flex-shrink: 0; transition: color 0.2s; }
        .reg-eye:hover { color: #60a5fa; }
        .reg-step { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.1); border-radius: 12px; margin-bottom: 10px; }
        .name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; width: 100%; }
        .name-grid > div { min-width: 0; width: 100%; }
      `}</style>

      <div className="reg-root">
        {/* Ambient */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse at 80% 10%, rgba(59,130,246,0.06) 0%, transparent 50%)' }} />

        {/* Left panel */}
        <div className="reg-left" style={{ position: 'relative', zIndex: 1 }}>
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 100, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#93c5fd', letterSpacing: '0.05em' }}>JOIN HOPE CMS</span>
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 14 }}>
              Create your<br />
              <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>account.</span>
            </h1>
            <p style={{ color: '#4b5563', fontSize: 13, lineHeight: 1.7, marginBottom: 28, maxWidth: 300 }}>
              Fill in your details. Your account will be pending until a SUPERADMIN approves it.
            </p>
            {['Fill in your details', 'Account created as Pending', 'SUPERADMIN reviews & activates', 'Login and get started'].map((s, i) => (
              <div key={i} className="reg-step">
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i + 1}</div>
                <span style={{ color: '#6b7280', fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#1f2937' }}>© 2026 Hope, Inc.</div>
        </div>

        {/* Right panel */}
        <div className="reg-right" style={{ position: 'relative', zIndex: 1 }}>
          <div className="reg-card">
            {/* Logo (always visible) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Hope CMS</span>
            </div>

            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Create an account</h2>
            <p style={{ color: '#374151', fontSize: 12, marginBottom: 20 }}>All fields are required</p>

            {error && (
              <div style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ flexShrink: 0 }}>⛔</span><span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Name row */}
              <div className="name-grid">
                <div>
                  <label style={labelStyle}>First Name</label>
                  <div className="reg-input-focus" style={{ ...inputGroup }}>
                    <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <div className="reg-input-focus" style={{ ...inputGroup }}>
                    <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Username preview */}
              {formData.firstName && formData.lastName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', marginBottom: 12 }}>
                  <span style={{ fontSize: 11, color: '#4b5563' }}>Username:</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#60a5fa' }}>{formData.firstName.trim().toLowerCase()}.{formData.lastName.trim().toLowerCase()}</span>
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Email</label>
                <div className="reg-input-focus" style={{ ...inputGroup }}>
                  <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Password</label>
                <div className="reg-input-focus" style={{ ...inputGroup }}>
                  <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required style={inputStyle} />
                  <button type="button" className="reg-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Confirm Password</label>
                <div className="reg-input-focus" style={{ ...inputGroup }}>
                  <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required style={inputStyle} />
                  <button type="button" className="reg-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="reg-btn">
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <button onClick={signInWithGoogle} className="reg-google">
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 16, height: 16 }} />
              Register with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#374151' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;