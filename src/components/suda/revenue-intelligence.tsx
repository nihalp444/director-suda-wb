import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Search,
  FileCheck2,
  Building,
  AlertTriangle,
  Receipt,
  FileText,
  BadgeAlert,
  ArrowRight
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface LeakageRecord {
  id: string;
  ulb: string;
  category: "Under-Assessed Commercial" | "Expired Trade Licence" | "GIS Footprint Mismatch" | "Unassessed Mobile Tower";
  propertyRef: string;
  currentAssessment: string;
  aiEstimatedTrueValue: string;
  estimatedLeakage: string;
  confidence: number;
  detectionMethod: string;
  status: "Flagged" | "Notice Served" | "Re-assessed";
}

const SAMPLE_LEAKAGES: LeakageRecord[] = [
  {
    id: "REV-HMC-2026-102",
    ulb: "Howrah MC",
    category: "GIS Footprint Mismatch",
    propertyRef: "Ward 12, Plot 401 (Commercial Complex)",
    currentAssessment: "₹18,000 / yr (Registered as 1,800 sq.ft residential)",
    aiEstimatedTrueValue: "₹1,42,000 / yr (G+4 Commercial Mall, 12,400 sq.ft)",
    estimatedLeakage: "₹1,24,000 / yr",
    confidence: 96.8,
    detectionMethod: "Drone / Satellite LiDAR 3D height reconstruction vs Municipal Tax Ledger",
    status: "Flagged"
  },
  {
    id: "REV-BAL-2026-088",
    ulb: "Bally Municipality",
    category: "Expired Trade Licence",
    propertyRef: "GT Road Industrial Estate, Unit 14",
    currentAssessment: "Expired 2023 (₹0 collected)",
    aiEstimatedTrueValue: "₹45,000 / yr + penalty",
    estimatedLeakage: "₹90,000 arrears",
    confidence: 94.2,
    detectionMethod: "WB GSTN e-waybill cross-match showing active commercial dispatch",
    status: "Flagged"
  },
  {
    id: "REV-ULU-2026-039",
    ulb: "Uluberia Municipality",
    category: "Unassessed Mobile Tower",
    propertyRef: "Rooftop Ward 07, Dag 812",
    currentAssessment: "Not in municipal tax net",
    aiEstimatedTrueValue: "₹36,000 / yr mandatory municipal fee",
    estimatedLeakage: "₹72,000 arrears",
    confidence: 98.1,
    detectionMethod: "High-resolution optical satellite edge detection identifying 4G/5G mast",
    status: "Notice Served"
  }
];

export function RevenueIntelligencePanel() {
  const [selectedRecord, setSelectedRecord] = useState<LeakageRecord>(SAMPLE_LEAKAGES[0]);
  const [served, setServed] = useState<Record<string, boolean>>({});

  const handleServeDemand = (id: string) => {
    setServed((prev) => ({ ...prev, [id]: true }));
    toast.success(`Supplemental Re-assessment Notice under Sec 132 WB Municipal Act generated & dispatched for ${id}`);
  };

  return (
    <SectionCard
      title="Revenue Intelligence & Leakage Detection Engine"
      description="Autonomous identification of under-assessed properties, GIS built-up footprint mismatches, and expired trade licences"
      className="mb-5 border-l-4 border-l-gold"
      action={
        <Badge variant="outline" className="gap-1 border-gold/40 text-gold-foreground bg-gold/10">
          <Sparkles className="h-3 w-3 text-gold" /> Tax-GIS Cross-Verification Engine
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left: Identified Leakage Pipeline */}
        <div className="space-y-2 lg:col-span-5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Detected Revenue Gaps</span>
            <span>Est. Recovery</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {SAMPLE_LEAKAGES.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedRecord.id === item.id
                    ? "border-gold bg-gold/5 shadow-sm"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-foreground">{item.id}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {item.category}
                  </Badge>
                </div>
                <p className="mt-1 text-xs font-bold text-foreground">{item.propertyRef}</p>
                <p className="text-[11px] text-muted-foreground">{item.ulb}</p>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">Leakage:</span>
                  <span className="font-bold text-destructive font-mono">{item.estimatedLeakage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Forensic Evidence & Demand Dispatch */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Audit: {selectedRecord.propertyRef}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {selectedRecord.ulb} · Classification: <strong className="text-foreground">{selectedRecord.category}</strong>
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Confidence: {selectedRecord.confidence}%
              </Badge>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-card p-2.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Recorded In Tax Ledger</span>
                  <p className="mt-1 text-xs font-medium text-foreground">{selectedRecord.currentAssessment}</p>
                </div>
                <div className="rounded-md border border-border bg-card p-2.5">
                  <span className="text-[10px] uppercase font-bold text-primary">AI True Valuation</span>
                  <p className="mt-1 text-xs font-bold text-primary">{selectedRecord.aiEstimatedTrueValue}</p>
                </div>
              </div>

              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-gold" /> Detection Source & Evidence
                </span>
                <p className="mt-1 text-xs text-foreground leading-relaxed">
                  {selectedRecord.detectionMethod}
                </p>
              </div>

              <div className="rounded-md border border-gold/30 bg-gold/10 p-2.5 flex items-center justify-between text-foreground">
                <span className="text-xs font-semibold">Immediate Potential Own-Source Recovery:</span>
                <span className="text-sm font-bold font-mono text-destructive">{selectedRecord.estimatedLeakage}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Statutory demand note auto-drafted under WB Municipal Valuation Rules
            </span>
            <Button
              size="sm"
              disabled={served[selectedRecord.id]}
              onClick={() => handleServeDemand(selectedRecord.id)}
              className="gap-1.5 bg-primary text-primary-foreground text-xs"
            >
              {served[selectedRecord.id] ? (
                <>
                  <FileCheck2 className="h-3.5 w-3.5 text-success" /> Re-assessment Order Dispatched
                </>
              ) : (
                <>
                  <Receipt className="h-3.5 w-3.5" /> Dispatch Supplementary Demand
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
