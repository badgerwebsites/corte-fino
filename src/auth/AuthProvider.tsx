// auth/AuthProvider.tsx
import { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types/database.types';
import { AuthContext } from './auth.context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadCustomerData(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          loadCustomerData(session.user.id);
        } else {
          setCustomer(null);
          setLoading(false);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  const loadCustomerData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // If user was created, try to create the customer record
    // Don't throw on customer insert failure - the auth user exists and they need to verify email
    if (data.user) {
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          reward_points: 0,
        });

      if (customerError) {
        // Log but don't throw - auth user was created successfully
        // Customer record can be created on first login if needed
        console.error('Error creating customer record:', customerError);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshCustomer = async () => {
    if (user) {
      await loadCustomerData(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
