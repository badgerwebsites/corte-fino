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
      const session = data.session;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check if user just confirmed email (Supabase returns hash tokens)
        const hash = window.location.hash;

        if (hash.includes('access_token') || hash.includes('type=signup')) {
          const pendingBooking = localStorage.getItem('pendingBooking');

          if (pendingBooking) {
            loadCustomerData(session.user.id, session.user.email);
            window.location.replace('/book');
            history.replaceState(null, '', '/book');
            return;
          }

          loadCustomerData(session.user.id, session.user.email);
          window.location.replace('/login');
          return;
        }

        loadCustomerData(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Handle email confirmation redirect — getSession() may return null
          // initially before onAuthStateChange processes the hash tokens
          if (event === 'SIGNED_IN') {
            const hash = window.location.hash;
            if (hash.includes('access_token') || hash.includes('type=signup')) {
              const pendingBooking = localStorage.getItem('pendingBooking');
              if (pendingBooking) {
                loadCustomerData(session.user.id, session.user.email);
                window.location.replace('/book');
                return;
              }
              loadCustomerData(session.user.id, session.user.email);
              window.location.replace('/login');
              return;
            }
          }
          loadCustomerData(session.user.id, session.user.email);
        } else {
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

      // If the record exists but has empty name fields, it was created by a race
      // condition before the real data arrived — patch it with user metadata.
      const needsUpdate = data && !data.first_name && !data.last_name;

      if (data && !needsUpdate) {
        setCustomer(data);
      } else if (userEmail) {
        // Pull name/phone from user metadata saved during signUp
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
        if (existing) setCustomer(existing);
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
    // Build the email redirect URL - when user clicks confirmation link, they'll be sent here
    let emailRedirectUrl = `${window.location.origin}/login`;

    if (redirectTo?.startsWith('/book')) {
      emailRedirectUrl = `${window.location.origin}/book`;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone,
        },
      },
    });

    if (error) throw error;

    // Supabase returns an empty identities array when the email is already registered
    // (it does this silently to prevent email enumeration attacks)
    if (data.user?.identities?.length === 0) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }

    // If user was created, upsert the customer record.
    // Using upsert (not insert) so that if a race condition already created an empty
    // record (e.g. from onAuthStateChange firing during signUp), we overwrite it with
    // the real name/phone values.
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
      await loadCustomerData(user.id, user.email);
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
