import { createContext, useContext, type ReactNode } from "react";

type DsImmersiveContextValue = {
  immersive: boolean;
  setImmersive: (value: boolean) => void;
};

const DsImmersiveContext = createContext<DsImmersiveContextValue | null>(null);

export function DsImmersiveProvider({
  immersive,
  setImmersive,
  children,
}: DsImmersiveContextValue & { children: ReactNode }) {
  return (
    <DsImmersiveContext.Provider value={{ immersive, setImmersive }}>
      {children}
    </DsImmersiveContext.Provider>
  );
}

export function useDsImmersive(): DsImmersiveContextValue {
  const ctx = useContext(DsImmersiveContext);
  if (!ctx) {
    throw new Error("useDsImmersive must be used within DsImmersiveProvider");
  }
  return ctx;
}
