import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Profile = { id: string; display_name: string; avatar_url: string | null };

const NEXT_KEY = 'dorm-dump-next';

/** Surfaces that need an account. Anything else stays open to visitors. */
export const gatedDestinations = ['/saved', '/my-listings', '/messages', '/sell', '/profile'] as const;
export type GatedDestination = (typeof gatedDestinations)[number];

export function rememberDestination(href: string) {
  if (typeof window === 'undefined') return;
  const path = href.startsWith('/') && !href.startsWith('//') ? href : '/';
  try {
    sessionStorage.setItem(NEXT_KEY, path);
  } catch {
    /* storage unavailable: the visitor still lands on the sign-in page */
  }
}

export function readDestination(): GatedDestination | null {
  if (typeof window === 'undefined') return null;
  let value: string | null = null;
  try {
    value = sessionStorage.getItem(NEXT_KEY);
    if (value) sessionStorage.removeItem(NEXT_KEY);
  } catch {
    return null;
  }
  return (gatedDestinations as readonly string[]).includes(value ?? '') ? (value as GatedDestination) : null;
}

type AuthState = {
  ready: boolean;
  signedIn: boolean;
  userId: string | null;
  profile: Profile | null;
  refresh: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('id, display_name, avatar_url').eq('id', userId).maybeSingle();
  return (data as Profile | null) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [state, setState] = useState<{ ready: boolean; userId: string | null; profile: Profile | null }>({ ready: false, userId: null, profile: null });

  const hydrate = useCallback(async (userId: string | null) => {
    const profile = userId ? await fetchProfile(userId) : null;
    setState({ ready: true, userId, profile });
  }, []);

  useEffect(() => {
    let active = true;
    const fromSession = () =>
      supabase.auth.getSession().then(({ data }) => {
        if (active) void hydrate(data.session?.user.id ?? null);
      });
    void fromSession();

    // Single auth listener for the app: keeps the header, the route gate and the
    // query cache in step when a session appears or clears.
    const { data: subscription } = supabase.auth.onAuthStateChange(event => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT' && event !== 'USER_UPDATED') return;
      void fromSession();
      router.invalidate();
      if (event !== 'SIGNED_OUT') queryClient.invalidateQueries();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [hydrate, router, queryClient]);

  // Return the student to whatever they were trying to reach before signing in.
  useEffect(() => {
    if (!state.ready || !state.userId) return;
    const destination = readDestination();
    if (destination) void navigate({ to: destination, replace: true });
  }, [state.ready, state.userId, navigate]);

  const value = useMemo<AuthState>(
    () => ({ ready: state.ready, signedIn: state.userId !== null, userId: state.userId, profile: state.profile, refresh: () => void hydrate(state.userId) }),
    [state, hydrate],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is required');
  return value;
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: '/auth', replace: true });
  }, [queryClient, navigate]);
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return 'CC';
  const second = parts[1];
  return (first.charAt(0) + (second ? second.charAt(0) : first.charAt(1))).toUpperCase();
}
