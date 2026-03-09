import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { mockUser } from "../lib/mockData";
import type { UserProfile } from "../types";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isNewUser: boolean;
}

interface AuthContextValue extends AuthState {
  signInAsFiller: () => void;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (
    email: string,
    token: string,
  ) => Promise<{ error: Error | null; isNew: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    updates: Partial<UserProfile>,
  ) => Promise<{ error: Error | null }>;
  setIsNewUser: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    loading: true,
    isNewUser: false,
  });

  // fetch profile from public.users
  async function fetchProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  }

  async function refreshProfile() {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    setState((prev) => ({ ...prev, profile }));
  }

  // listen to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          setState({
            session,
            user: session.user,
            profile,
            loading: false,
            isNewUser: !profile,
          });
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          setState({
            session,
            user: session.user,
            profile,
            loading: false,
            isNewUser: !profile,
          });
        });
      } else {
        setState({
          session: null,
          user: null,
          profile: null,
          loading: false,
          isNewUser: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function signInAsFiller() {
    const fakeUser = {
      id: mockUser.id,
      email: mockUser.email,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as User;
    const fakeSession = {
      user: fakeUser,
      access_token: "fake",
      refresh_token: "fake",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      token_type: "bearer",
    } as Session;
    setState({
      session: fakeSession,
      user: fakeUser,
      profile: mockUser,
      loading: false,
      isNewUser: false,
    });
  }

  async function signInWithOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    return { error: error as Error | null };
  }

  async function verifyOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) return { error: error as Error, isNew: false };

    // check if profile exists
    let isNew = false;
    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      isNew = !profile;
      setState((prev) => ({
        ...prev,
        isNewUser: isNew,
        profile,
      }));
    }

    return { error: null, isNew };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setState({
      session: null,
      user: null,
      profile: null,
      loading: false,
      isNewUser: false,
    });
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!state.user) return { error: new Error("not authenticated") };

    const { error } = await supabase
      .from("users")
      .upsert({ id: state.user.id, ...updates });

    if (!error) {
      const profile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile, isNewUser: false }));
    }

    return { error: error as Error | null };
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInAsFiller,
        signInWithOtp,
        verifyOtp,
        signOut,
        refreshProfile,
        updateProfile,
        setIsNewUser: (v: boolean) =>
          setState((prev) => ({ ...prev, isNewUser: v })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
