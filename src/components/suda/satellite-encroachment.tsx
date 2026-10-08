import { useState } from "react";
import {
  Sparkles,
  Layers,
  MapPin,
  AlertTriangle,
  FileText,
  Sliders,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Building2
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface EncroachmentIncident {
  id: string;
  locationName: string;
  zone: string;
  cadastralDagNo: string;
  detectedShrinkageHa: number;
  unauthorizedStructureDetected: boolean;
  priorityZone: boolean; // e.g. EKW Ramsar Site
  confidence: number;
  actionTaken: string;
  noticeStatus: "Pending Director Approval" | "Notice Issued (Sec 4 WBTP Act)" | "Demolition Scheduled";
}

const SAMPLE_ENCROACHMENTS: EncroachmentIncident[] = [
  {
    id: "GIS-EKW-2026-088",
    locationName: "East Kolkata Wetlands (EKW) - Bhagabanpur",
    zone: "Ramsar Site (125 km² Protected Zone)",
    cadastralDagNo: "Dag No. 412 / Mouza Chowbaga",
    detectedShrinkageHa: 1.84,
    unauthorizedStructureDetected: true,
    priorityZone: true,
    confidence: 97.8,
    actionTaken: "Satellite thermal & SAR multi-spectral change flagged unauthorized landfilling.",
    noticeStatus: "Pending Director Approval"
  },
  {
    id: "GIS-HOO-2026-042",
    locationName: "Hooghly Riverfront Buffer (Chandannagar)",
    zone: "CRZ / Riverfront No-Construction Buffer",
    cadastralDagNo: "Dag No. 109 / Strand Road",
    detectedShrinkageHa: 0.45,
    unauthorizedStructureDetected: true,
    priorityZone: false,
    confidence: 93.2,
    actionTaken: "Structural foundation detected within 50m high-tide statutory buffer line.",
    noticeStatus: "Notice Issued (Sec 4 WBTP Act)"
  },
  {
    id: "GIS-HOW-2026-019",
    locationName: "Bally Canal Tributary Waterbody",
    zone: "Municipal Natural Drainage Catchment",
    cadastralDagNo: "Dag No. 67 / Ward 08",
    detectedShrinkageHa: 0.72,
    unauthorizedStructureDetected: false,
    priorityZone: false,
    confidence: 89.5,
    actionTaken: "Illegal silt dumping & waterbody perimeter shrinkage exceeding 15%.",
    noticeStatus: "Demolition Scheduled"
  }
];

export function SatelliteEncroachmentDetector() {
  const [incidents, setIncidents] = useState<EncroachmentIncident>(SAMPLE_ENCROACHMENTS[0]);
  const [sliderPos, setSliderPos] = useState<number[]>([50]);
  const [noticeApproved, setNoticeApproved] = useState(false);

  const handleIssueNotice = () => {
    setNoticeApproved(true);
    toast.success("Statutory Stop-Work Notice generated and routed to District Magistrate & Police Commissionerate");
  };

  return (
    <SectionCard
      title="GIS Satellite Encroachment & Waterbody Protection (HYDRAA Model)"
      description="Automated satellite change detection over municipal waterbodies & East Kolkata Wetlands (Ramsar Site, 125 km²)"
      className="mb-5 border-l-4 border-l-primary"
      action={
        <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
          <Sparkles className="h-3 w-3 text-gold" /> Sentinel-2 & Cartosat-3 AI Pipeline
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Visual Before/After Satellite Comparison */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{incidents.locationName}</span>
                {incidents.priorityZone && (
                  <Badge className="bg-gold/20 text-gold-foreground border-gold/40 text-[10px]">
                    ★ Priority Ramsar Zone
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">{incidents.cadastralDagNo}</span>
            </div>

            {/* Interactive Before/After Split Container */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-slate-900 shadow-inner">
              {/* Baseline Imagery (2024) */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80')`
                }}
              >
                <div className="absolute top-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Baseline: 2024 Wetland
                </div>
              </div>

              {/* Current AI Satellite Scan (2026) with Clip Path */}
              <div
                className="absolute inset-0 bg-cover bg-center border-r-2 border-primary"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80')`,
                  clipPath: `polygon(0 0, ${sliderPos[0]}% 0, ${sliderPos[0]}% 100%, 0 100%)`
                }}
              >
                <div className="absolute top-2 right-2 rounded bg-destructive/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Current: Encroachment Flagged
                </div>

                {/* Simulated AI Detection Bounding Box */}
                <div className="absolute bottom-8 left-1/4 h-24 w-36 rounded border-2 border-dashed border-red-500 bg-red-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white bg-red-600 px-1 rounded shadow">
                    AI: Fill Detected (-1.84 Ha)
                  </span>
                </div>
              </div>
            </div>

            {/* Slider control */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">Baseline (2024)</span>
              <Slider
                value={sliderPos}
                onValueChange={setSliderPos}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">AI Scan (2026)</span>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground italic">
            💡 Drag slider to visually inspect waterbody perimeter shrinkage and unauthorized soil filling against cadastral revenue maps.
          </p>
        </div>

        {/* Action Panel & Cadastral Overlay Telemetry */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="text-xs font-bold text-foreground">Spatial Cadastral Overlay</span>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                AI Confidence {incidents.confidence}%
              </Badge>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded-md bg-card p-2.5 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Cadastral Record</span>
                <p className="font-semibold text-foreground mt-0.5">{incidents.cadastralDagNo}</p>
                <p className="text-[11px] text-muted-foreground">{incidents.zone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-card p-2 border border-border">
                  <span className="text-[10px] uppercase text-muted-foreground">Waterbody Lost</span>
                  <p className="text-sm font-bold text-destructive">-{incidents.detectedShrinkageHa} Ha</p>
                </div>
                <div className="rounded-md bg-card p-2 border border-border">
                  <span className="text-[10px] uppercase text-muted-foreground">Illegal Structure</span>
                  <p className="text-sm font-bold text-destructive">
                    {incidents.unauthorizedStructureDetected ? "Detected" : "None"}
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-card p-2.5 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">AI Intelligence Note</span>
                <p className="text-[11px] font-medium text-foreground mt-0.5 leading-relaxed">
                  {incidents.actionTaken}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-muted-foreground">Notice Status:</span>
              <span className="text-[11px] font-bold text-destructive">
                {noticeApproved ? "Demolition & FIR Routed" : incidents.noticeStatus}
              </span>
            </div>

            <Button
              size="sm"
              disabled={noticeApproved}
              onClick={handleIssueNotice}
              className="w-full gap-1.5 bg-primary text-primary-foreground text-xs"
            >
              {noticeApproved ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enforcement Notice Dispatched
                </>
              ) : (
                <>
                  <FileText className="h-3.5 w-3.5" /> Issue Statutory Stop-Work Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
