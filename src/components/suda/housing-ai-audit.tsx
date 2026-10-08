import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  MapPin,
  Layers,
  FileCheck,
  Building,
  RefreshCw,
  Search,
  Check,
  Ban
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface HouseAudit {
  id: string;
  beneficiaryName: string;
  ulb: string;
  ward: string;
  claimedStage: "Foundation" | "Lintel" | "Roof" | "Completion";
  aiDetectedStage: "Foundation" | "Lintel" | "Roof" | "Completion";
  confidence: number;
  geoTagStatus: "Verified" | "Mismatch" | "Duplicate Geo-Coordinate";
  disbursementAmount: string;
  auditStatus: "Approved" | "Flagged Anomaly" | "Pending Field Re-inspection";
  anomalyReason?: string;
  imageUrl: string;
}

const SAMPLE_AUDITS: HouseAudit[] = [
  {
    id: "BB-WB-2026-90412",
    beneficiaryName: "Amina Bibi",
    ulb: "Howrah MC",
    ward: "Ward 14",
    claimedStage: "Roof",
    aiDetectedStage: "Foundation",
    confidence: 96.4,
    geoTagStatus: "Verified",
    disbursementAmount: "₹60,000 (2nd Instalment)",
    auditStatus: "Flagged Anomaly",
    anomalyReason: "Visual inspection confirms brickwork stopped at plinth/foundation level. Roof slab missing.",
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "BB-WB-2026-88104",
    beneficiaryName: "Bikash Mondal",
    ulb: "Bally Municipality",
    ward: "Ward 06",
    claimedStage: "Roof",
    aiDetectedStage: "Roof",
    confidence: 98.2,
    geoTagStatus: "Verified",
    disbursementAmount: "₹60,000 (2nd Instalment)",
    auditStatus: "Approved",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "BB-WB-2026-77319",
    beneficiaryName: "Tarun Das",
    ulb: "Uluberia Municipality",
    ward: "Ward 19",
    claimedStage: "Completion",
    aiDetectedStage: "Lintel",
    confidence: 91.5,
    geoTagStatus: "Duplicate Geo-Coordinate",
    disbursementAmount: "₹60,000 (Final Clearance)",
    auditStatus: "Flagged Anomaly",
    anomalyReason: "Geo-tag coordinates match with prior beneficiary (BB-WB-2024-1102). Structural plastering incomplete.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "BB-WB-2026-64010",
    beneficiaryName: "Geeta Sen",
    ulb: "Howrah MC",
    ward: "Ward 22",
    claimedStage: "Completion",
    aiDetectedStage: "Completion",
    confidence: 99.1,
    geoTagStatus: "Verified",
    disbursementAmount: "₹60,000 (Final Clearance)",
    auditStatus: "Approved",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&q=80"
  }
];

export function HousingAiAuditStudio() {
  const [audits, setAudits] = useState<HouseAudit[]>(SAMPLE_AUDITS);
  const [selectedAudit, setSelectedAudit] = useState<HouseAudit>(SAMPLE_AUDITS[0]);
  const [filter, setFilter] = useState<"all" | "flagged" | "approved">("all");

  const filtered = audits.filter((a) => {
    if (filter === "flagged") return a.auditStatus === "Flagged Anomaly";
    if (filter === "approved") return a.auditStatus === "Approved";
    return true;
  });

  const handleAction = (status: "Approved" | "Flagged Anomaly") => {
    setAudits((prev) =>
      prev.map((item) =>
        item.id === selectedAudit.id
          ? {
              ...item,
              auditStatus: status,
              anomalyReason: status === "Approved" ? undefined : "Manual override flag by Director command desk."
            }
          : item
      )
    );
    setSelectedAudit((prev) => ({
      ...prev,
      auditStatus: status
    }));
    toast.success(`Beneficiary ${selectedAudit.id} status updated to: ${status}`);
  };

  return (
    <SectionCard
      title="Banglar Bari AI Photo & Geo-Tagging Audit"
      description="Computer vision validation for four-stage construction milestones: Foundation → Lintel → Roof → Completion"
      className="mb-5 border-l-4 border-l-primary"
      action={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <Sparkles className="h-3 w-3 text-gold" /> CV Model Active (v3.2)
          </Badge>
          <div className="flex rounded-md border border-border p-0.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded px-2 py-0.5 ${filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              All ({audits.length})
            </button>
            <button
              onClick={() => setFilter("flagged")}
              className={`rounded px-2 py-0.5 ${filter === "flagged" ? "bg-destructive text-destructive-foreground" : "text-muted-foreground"}`}
            >
              Anomalies (2)
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`rounded px-2 py-0.5 ${filter === "approved" ? "bg-success text-success-foreground" : "text-muted-foreground"}`}
            >
              Approved
            </button>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Left List of Beneficiary Claims */}
        <div className="space-y-2 lg:col-span-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Pending Milestone Release Queue
          </p>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAudit(item)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedAudit.id === item.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-foreground">{item.beneficiaryName}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground font-mono">{item.id}</span>
                  </div>
                  {item.auditStatus === "Flagged Anomaly" ? (
                    <Badge variant="destructive" className="text-[10px] gap-1">
                      <AlertOctagon className="h-2.5 w-2.5" /> Anomaly
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-success/30 text-[10px] text-success gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" /> AI Validated
                    </Badge>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.ulb} · {item.ward}</span>
                  <span className="font-semibold text-foreground">{item.disbursementAmount}</span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                      <span>CV Confidence</span>
                      <span className="font-semibold">{item.confidence}%</span>
                    </div>
                    <Progress value={item.confidence} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Inspection & CV Telemetry View */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Photo Verification: {selectedAudit.beneficiaryName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {selectedAudit.ulb} — Stage Claimed: <strong className="text-foreground">{selectedAudit.claimedStage}</strong>
                </p>
              </div>
              <Badge
                variant={selectedAudit.auditStatus === "Flagged Anomaly" ? "destructive" : "default"}
                className="text-xs"
              >
                {selectedAudit.auditStatus}
              </Badge>
            </div>

            {/* Inspection Visuals */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black/10">
                <img
                  src={selectedAudit.imageUrl}
                  alt="Site verification"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white backdrop-blur">
                  Geo-Tag: 22.5958° N, 88.2636° E
                </div>
                <div className="absolute top-2 right-2 rounded bg-primary/90 px-2 py-0.5 text-[10px] text-white">
                  Stage: {selectedAudit.aiDetectedStage}
                </div>
              </div>

              {/* AI Diagnostics */}
              <div className="space-y-2 text-xs">
                <div className="rounded-md border border-border bg-card p-2.5">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Computer Vision Inference
                  </span>
                  <p className="mt-1 font-semibold text-foreground">
                    Detected: <span className="text-primary">{selectedAudit.aiDetectedStage}</span> (Confidence: {selectedAudit.confidence}%)
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Matches 4-stage WB PMAY benchmark trained on 1.4M state site photos.
                  </p>
                </div>

                <div className="rounded-md border border-border bg-card p-2.5">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Geo-Tag Integrity
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">{selectedAudit.geoTagStatus}</span>
                  </div>
                </div>

                {selectedAudit.anomalyReason && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-destructive">
                    <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <AlertOctagon className="h-3 w-3" /> Flag Reason
                    </span>
                    <p className="mt-0.5 text-[11px] font-medium leading-relaxed">
                      {selectedAudit.anomalyReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-xs text-muted-foreground">
              Direct Benefit Transfer: <strong className="text-foreground">{selectedAudit.disbursementAmount}</strong>
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs"
                onClick={() => handleAction("Flagged Anomaly")}
              >
                <Ban className="h-3.5 w-3.5" /> Freeze Release
              </Button>
              <Button
                size="sm"
                className="gap-1 bg-success hover:bg-success/90 text-success-foreground text-xs"
                onClick={() => handleAction("Approved")}
              >
                <Check className="h-3.5 w-3.5" /> Approve Disbursement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
