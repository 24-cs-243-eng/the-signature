import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface GuestProfile {
  name: string;
  phone: string;
}

interface AuthContextType {
  // Google OAuth user
  googleUser: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;

  // Guest (name + phone) profile
  guest: GuestProfile | null;
  saveGuest: (profile: GuestProfile) => void;
  clearGuest: () => void;

  // Unified user reference (for CartPanel & other consumers)
  user: { user_metadata?: { full_name?: string; phone?: string; avatar_url?: string } } | null;
}

const AuthContext = createContext<AuthContextType>({
  googleUser: null,
  session: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  guest: null,
  saveGuest: () => {},
  clearGuest: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [session, setSession]       = useState<Session | null>(null);
  const [guest, setGuest]           = useState<GuestProfile | null>(null);

  // Restore guest from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sig_guest");
      if (saved) setGuest(JSON.parse(saved));
    } catch {}
  }, []);

  // Subscribe to Supabase auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setGoogleUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setGoogleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/menu`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setGoogleUser(null);
    setSession(null);
  };

  const saveGuest = (profile: GuestProfile) => {
    setGuest(profile);
    localStorage.setItem("sig_guest", JSON.stringify(profile));
  };

  const clearGuest = () => {
    setGuest(null);
    localStorage.removeItem("sig_guest");
  };

  // Unified `user` shim — Google user takes priority over guest
  const user = googleUser
    ? {
        user_metadata: {
          full_name: googleUser.user_metadata?.full_name ?? googleUser.email ?? "User",
          phone: googleUser.user_metadata?.phone ?? guest?.phone,
          avatar_url: googleUser.user_metadata?.avatar_url,
        },
      }
    : guest
    ? { user_metadata: { full_name: guest.name, phone: guest.phone } }
    : null;

  return (
    <AuthContext.Provider value={{ googleUser, session, signInWithGoogle, signOut, guest, saveGuest, clearGuest, user }}>
      {children}
    </AuthContext.Provider>
  );
};
