import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Practice {
  id: string;
  name: string;
  email: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [practice, setPractice] = useState<Practice | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPractice = useCallback(async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('practice_id, role')
      .eq('id', userId)
      .single();

    if (profile) {
      setRole(profile.role as 'admin' | 'user');

      const { data: practiceData } = await supabase
        .from('practices')
        .select('id, name, email')
        .eq('id', profile.practice_id)
        .single();

      if (practiceData) {
        setPractice(practiceData);
      }
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadPractice(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadPractice(session.user.id);
        } else {
          setPractice(null);
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadPractice]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, practiceName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { practice_name: practiceName || 'Meine Praxis' },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const updatePractice = async (updates: Partial<Pick<Practice, 'name' | 'email'>>) => {
    if (!practice) return { error: new Error('No practice loaded') };
    const { error } = await supabase
      .from('practices')
      .update(updates)
      .eq('id', practice.id);
    if (!error) {
      setPractice(prev => prev ? { ...prev, ...updates } : prev);
    }
    return { error };
  };

  return {
    user, session, practice, role, loading,
    signIn, signUp, signOut, resetPassword,
    updatePractice, loadPractice,
  };
}
