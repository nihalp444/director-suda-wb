import { useState } from "react";
import {
  Sparkles,
  Bug,
  Trash2,
  AlertTriangle,
  Send,
  Droplets,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface WardVectorRisk {
  ward: string;
  ulb: string;
  rfidMissedPct: number;
  waterloggingHours: number;
  historicalLarvalIndex: number;
  aiRiskScore: number; // 0 - 100
  riskCategory: "Critical" | "High" | "Moderate";
  predictedCaseSpike: string;
  suggestedAction: string;
}

const SAMPLE_WARD_RISKS: WardVectorRisk[] = [
  {
    ward: "Ward 14 (Howrah MC)",
    ulb: "Howrah MC",
    rfidMissedPct: 42.5,
    waterloggingHours: 14.2,
    historicalLarvalIndex: 8.4,
    aiRiskScore: 92,
    riskCategory: "Critical",
    predictedCaseSpike: "+48% dengue surge in 14 days",
    suggestedAction: "Immediate anti-larval chemical spray & deploy auxiliary conservancy crew"
  },
  {
    ward: "Ward 22 (Howrah MC)",
    ulb: "Howrah MC",
    rfidMissedPct: 38.0,
    waterloggingHours: 11.5,
    historicalLarvalIndex: 7.1,
    aiRiskScore: 84,
    riskCategory: "Critical",
    predictedCaseSpike: "+35% case spike projected",
    suggestedAction: "Flush choked roadside drains & 100% door-to-door waste sweep"
  },
  {
    ward: "Ward 07 (Bally)",
    ulb: "Bally Municipality",
    rfidMissedPct: 29.1,
    waterloggingHours: 8.0,
    historicalLarvalIndex: 5.6,
    aiRiskScore: 71,
    riskCategory: "High",
    predictedCaseSpike: "+18% seasonal increase",
    suggestedAction: "Intensify ASHA worker larval checks & water tank bio-larvicide dosing"
  },
  {
    ward: "Ward 12 (Uluberia)",
    ulb: "Uluberia Municipality",
    rfidMissedPct: 18.4,
    waterloggingHours: 4.5,
    historicalLarvalIndex: 3.2,
    aiRiskScore: 48,
    riskCategory: "Moderate",
    predictedCaseSpike: "Baseline transmission",
    suggestedAction: "Routine surveillance and weekly fogging cycle"
  }
];

export function VectorOutbreakPredictor() {
  const [selectedWard, setSelectedWard] = useState<WardVectorRisk>(SAMPLE_WARD_RISKS[0]);
  const [dispatched, setDispatched] = useState<Record<string, boolean>>({});

  const handleDispatch = (wardName: string) => {
    setDispatched((prev) => ({ ...prev, [wardName]: true }));
    toast.success(`Action Protocol Dispatched: Emergency Vector Unit mobilized for ${wardName}`);
  };

  return (
    <SectionCard
      title="Smart Waste & Vector Disease Correlation Model"
      description="Cross-referencing Door-to-Door RFID waste collection lapses with monsoon drainage stagnation to predict Dengue / Malaria outbreak clusters"
      className="mb-5 border-l-4 border-l-destructive"
      action={
        <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
          <Sparkles className="h-3 w-3 text-gold" /> Predictive ML Model (NVBDCP-SBM)
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Ward Risk Matrix */}
        <div className="space-y-2 lg:col-span-6">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>High-Risk Ward Hotspots</span>
            <span>AI Risk Index</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {SAMPLE_WARD_RISKS.map((w) => (
              <div
                key={w.ward}
                onClick={() => setSelectedWard(w)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedWard.ward === w.ward
                    ? "border-destructive bg-destructive/5 shadow-sm"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bug className={`h-4 w-4 ${w.riskCategory === "Critical" ? "text-destructive" : "text-warning"}`} />
                    <span className="text-xs font-bold text-foreground">{w.ward}</span>
                  </div>
                  <Badge
                    variant={w.riskCategory === "Critical" ? "destructive" : "outline"}
                    className="text-[10px]"
                  >
                    {w.riskCategory} ({w.aiRiskScore}/100)
                  </Badge>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Trash2 className="h-3 w-3 text-muted-foreground" /> RFID Missed: <strong className="text-foreground">{w.rfidMissedPct}%</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-muted-foreground" /> Stagnation: <strong className="text-foreground">{w.waterloggingHours}h</strong>
                  </span>
                </div>

                <div className="mt-2 text-[11px] font-medium text-destructive">
                  ⚡ {w.predictedCaseSpike}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Breakdown & Fast Dispatch */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">{selectedWard.ward}</h4>
                <p className="text-xs text-muted-foreground">{selectedWard.ulb} · Predictive Outbreak Profile</p>
              </div>
              <span className="text-lg font-black text-destructive font-mono">
                {selectedWard.aiRiskScore} <span className="text-xs font-sans text-muted-foreground">/ 100 Risk</span>
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">RFID Uncollected Household Waste (Breeding Risk)</span>
                  <span className="font-bold text-foreground">{selectedWard.rfidMissedPct}% missed</span>
                </div>
                <Progress value={selectedWard.rfidMissedPct} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Water Stagnation Index post-rainfall</span>
                  <span className="font-bold text-foreground">{selectedWard.waterloggingHours} hrs delay</span>
                </div>
                <Progress value={(selectedWard.waterloggingHours / 24) * 100} className="h-1.5" />
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-warning" /> AI Recommended Tactical Response
                </span>
                <p className="mt-1 text-xs font-medium text-foreground leading-relaxed">
                  {selectedWard.suggestedAction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Automated Alert Protocol (SOP #09-V)
            </span>
            <Button
              size="sm"
              disabled={dispatched[selectedWard.ward]}
              onClick={() => handleDispatch(selectedWard.ward)}
              className="gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              {dispatched[selectedWard.ward] ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Team Mobilized
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Dispatch Emergency Fogging
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
