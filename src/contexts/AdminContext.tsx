import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role check with setTimeout to avoid deadlocks
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id).then(setIsAdmin);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id).then(setIsAdmin);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("ভুল ইমেইল বা পাসওয়ার্ড");
        } else {
          toast.error("লগইনে সমস্যা হয়েছে");
        }
        return false;
      }

      if (data.user) {
        const isUserAdmin = await checkAdminRole(data.user.id);
        if (!isUserAdmin) {
          toast.error("আপনার এডমিন অনুমতি নেই");
          await supabase.auth.signOut();
          return false;
        }
        toast.success("এডমিন হিসেবে লগইন সফল");
        return true;
      }

      return false;
    } catch (error) {
      toast.error("লগইনে সমস্যা হয়েছে");
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে");
        } else {
          toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে");
        }
        return false;
      }

      if (data.user) {
        toast.success("রেজিস্ট্রেশন সফল! এডমিন রোল যোগ করতে যোগাযোগ করুন।");
        return true;
      }

      return false;
    } catch (error) {
      toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে");
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
    setSession(null);
    toast.success("লগআউট সফল");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, user, session, login, signup, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
