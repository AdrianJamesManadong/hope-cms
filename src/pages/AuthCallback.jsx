import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('Callback error:', error);
          navigate('/login');
          return;
        }

        let userRow = null;
        for (let i = 0; i < 5; i++) {
          await new Promise(res => setTimeout(res, 1000));

          const { data } = await supabase
            .from('users')
            .select('userid, record_status')
            .eq('userid', session.user.id)
            .single();

          if (data) { userRow = data; break; }
        }

        if (!userRow) {
          console.error('User profile not found after retries');
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (userRow.record_status === 'ACTIVE') {
          navigate('/customers');
        } else {
          await supabase.auth.signOut();
          navigate('/login?pending=true');
        }

      } catch (err) {
        console.error('Auth callback error:', err);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '4px solid rgba(59,130,246,0.2)',
          borderTopColor: '#3b82f6',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: 16, fontSize: 16, color: '#e8e8f0', fontWeight: 500 }}>Completing sign in...</p>
        <p style={{ marginTop: 8, fontSize: 13, color: '#5a5a72' }}>Please wait</p>
      </div>
    </div>
  );
}

export default AuthCallback;