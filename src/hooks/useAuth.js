import { useState, useEffect, useCallback } from 'react';
import { supabase, signInWithGoogle, signOut } from '../lib/supabase';

/**
 * Custom hook for authentication with Supabase
 * Handles OAuth sign-in, sign-out, and session management
 */
export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from our User table
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        // User might not exist yet (trigger hasn't fired)
        if (fetchError.code === 'PGRST116') {
          console.log('Profile not found, will be created by trigger');
          return null;
        }
        throw fetchError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          if (currentSession?.user) {
            await fetchProfile(currentSession.user.id);
          }
          
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Auth init error:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user || null);

          if (newSession?.user) {
            // Small delay to allow trigger to create profile
            if (event === 'SIGNED_IN') {
              setTimeout(() => fetchProfile(newSession.user.id), 500);
            } else {
              await fetchProfile(newSession.user.id);
            }
          } else {
            setProfile(null);
          }

          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Sign in with Google
  const handleGoogleSignIn = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    const { error: signInError } = await signInWithGoogle();
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
    // Loading will be set to false by auth state change listener
  }, []);

  // Sign out
  const handleSignOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    const { error: signOutError } = await signOut();
    
    if (signOutError) {
      setError(signOutError.message);
    }
    
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    if (!user?.id) {
      setError('No user logged in');
      return { error: 'No user logged in' };
    }

    try {
      const { data, error: updateError } = await supabase
        .from('User')
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      return { data: null, error: err.message };
    }
  }, [user?.id]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  return {
    // State
    session,
    user,
    profile,
    loading,
    error,
    
    // Computed
    isAuthenticated: !!session,
    isAdmin: profile?.role === 'ADMIN',
    isJudge: profile?.role === 'JUDGE' || profile?.role === 'ADMIN',
    
    // Actions
    signInWithGoogle: handleGoogleSignIn,
    signOut: handleSignOut,
    updateProfile,
    refreshProfile,
    clearError: () => setError(null),
  };
}

export default useAuth;

