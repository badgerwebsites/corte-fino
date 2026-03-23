// auth/AuthProvider.tsx
import { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types/database.types';
import { AuthContext } from './auth.context';

const CUSTOMER_CACHE_KEY = 'cf_customer_cache';

function getCachedCustomer(): Customer | null {
  try {
    const raw = localStorage.getItem(CUSTOMER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Customer) : null;
  } catch {
    return null;
  }
}

function setCachedCustomer(c: Customer | null) {
  if (c) localStorage.setItem(CUSTOMER_CACHE_KEY, JSON.stringify(c));
  else localStorage.removeItem(CUSTOMER_CACHE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(getCachedCustomer);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        if (getCachedCustomer()) {
          setLoading(false); // unblock routing immediately — cache has data
          loadCustomerData(session.user.id, session.user.email); // refresh silently
        } else {
          loadCustomerData(session.user.id, session.user.email);
        }
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setLoading(true);
          loadCustomerData(session.user.id, session.user.email);
        } else {
          setCachedCustomer(null);
          setCustomer(null);
          setLoading(false);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  const loadCustomerData = async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      const needsUpdate = data && !data.first_name && !data.last_name;

      if (data && !needsUpdate) {
        setCachedCustomer(data);
        setCustomer(data);
      } else if (userEmail) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const meta = authUser?.user_metadata ?? {};

        await supabase
          .from('customers')
          .upsert(
            {
              id: userId,
              email: userEmail,
              first_name: meta.first_name ?? data?.first_name ?? '',
              last_name: meta.last_name ?? data?.last_name ?? '',
              phone: meta.phone ?? data?.phone ?? '',
              reward_points: data?.reward_points ?? 0,
            },
            { onConflict: 'id' }
          );

        const { data: existing } = await supabase
          .from('customers')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (existing) { setCachedCustomer(existing); setCustomer(existing); }
      }
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
    phone: string,
    redirectTo?: string
  ) => {
    const emailRedirectUrl = redirectTo?.startsWith('/book')
      ? `${window.location.origin}/auth/callback?next=/book`
      : `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectUrl,
        data: { first_name: firstName, last_name: lastName, phone },
      },
    });

    if (error) throw error;

    if (data.user?.identities?.length === 0) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }

    if (data.user) {
      const { error: customerError } = await supabase
        .from('customers')
        .upsert(
          {
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
            reward_points: 0,
          },
          { onConflict: 'id' }
        );

      if (customerError) {
        console.error('Error creating customer record:', customerError);
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    setCachedCustomer(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshCustomer = async () => {
    if (user) {
      await loadCustomerData(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, customer, session, loading, signUp, signIn, signOut, refreshCustomer }}
    >
      {children}
    </AuthContext.Provider>
  );
}
