import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminStatus = sessionStorage.getItem("isAdmin");
    setIsAdmin(adminStatus === "true");
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });

      if (error) {
        toast.error("লগইনে সমস্যা হয়েছে");
        return false;
      }

      if (data.success) {
        setIsAdmin(true);
        sessionStorage.setItem("isAdmin", "true");
        toast.success("এডমিন হিসেবে লগইন সফল");
        return true;
      } else {
        toast.error(data.message || "ভুল পাসওয়ার্ড");
        return false;
      }
    } catch (error) {
      toast.error("লগইনে সমস্যা হয়েছে");
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("isAdmin");
    toast.success("লগআউট সফল");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, login, logout }}>
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
