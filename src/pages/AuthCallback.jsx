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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Completing sign in...</p>
        <p className="mt-2 text-sm text-gray-400">Please wait</p>
      </div>
    </div>
  );
}

export default AuthCallback;