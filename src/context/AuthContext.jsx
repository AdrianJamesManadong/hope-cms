import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data: userRow, error } = await supabase
        .from('users')
        .select('user_type, record_status, username')
        .eq('userid', authUser.id)
        .single();

      if (error) throw error;

      if (userRow?.record_status === 'ACTIVE') {
        setCurrentUser({ ...authUser, ...userRow });
        setAuthError(null);
      } else {
        await supabase.auth.signOut();
        setAuthError('Your account is pending activation by a Sales Manager.');
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchUserProfile(session.user);
      else setCurrentUser(null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) fetchUserProfile(session.user);
      else setCurrentUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { data, error };

    if (data?.user) {
      const { error: profileError } = await supabase
        .from('users')
        .update({ username })
        .eq('userid', data.user.id);

      if (profileError) console.error('Failed to save username:', profileError);
    }

    return { data, error };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      authError,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};