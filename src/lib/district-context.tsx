import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_DISTRICTS } from "./suda-data";

type Ctx = {
  district: string;
  setDistrict: (d: string) => void;
  fy: string;
  setFy: (f: string) => void;
};

const DistrictContext = createContext<Ctx | null>(null);

export function DistrictProvider({ children }: { children: ReactNode }) {
  const [district, setDistrict] = useState<string>(ALL_DISTRICTS);
  const [fy, setFy] = useState<string>("2026-27");

  useEffect(() => {
    const saved = window.localStorage.getItem("suda.district");
    if (saved) setDistrict(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("suda.district", district);
  }, [district]);

  const value = useMemo(() => ({ district, setDistrict, fy, setFy }), [district, fy]);
  return <DistrictContext.Provider value={value}>{children}</DistrictContext.Provider>;
}

export function useDistrict() {
  const ctx = useContext(DistrictContext);
  if (!ctx) throw new Error("useDistrict must be used inside DistrictProvider");
  return ctx;
}
