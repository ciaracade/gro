import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { UserProfile } from "../types";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isNewUser: boolean;
}

interface AuthContextValue extends AuthState {
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (
    phone: string,
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

  async function signInWithOtp(phone: string) {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error: error as Error | null };
  }

  async function verifyOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
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
