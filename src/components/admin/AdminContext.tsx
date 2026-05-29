import { createContext, useContext, type ReactNode } from "react";
import { useAdminData } from "../../lib/admin/useAdminData";

export type AdminContextValue = ReturnType<typeof useAdminData>;

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const value = useAdminData();
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin doit \u00eatre utilis\u00e9 dans AdminProvider");
  }
  return ctx;
}
