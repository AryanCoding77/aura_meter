import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { onAuthStateChange, getUserProfile, UserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    // Initial session check - important for OAuth redirects
    const checkInitialSession = async () => {
      console.log('Checking initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Initial session:', session);
      console.log('Initial session error:', error);
      
      if (session) {
        setSession(session);
        setUser(session.user);
        const userProfile = await getUserProfile(session.user.id);
        console.log('User profile:', userProfile);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    checkInitialSession();

    // Subscribe to auth changes
    const { data: { subscription } } = onAuthStateChange(async (session) => {
      console.log('Auth state changed:', session);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
