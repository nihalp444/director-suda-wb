import { useState } from "react";
import {
  Sparkles,
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Scan,
  Download,
  Layers,
  Compass,
  Radio,
  Satellite,
  Crosshair,
  Maximize2,
  SlidersHorizontal,
  Columns,
  Eye,
  ZoomIn
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { downloadGovernmentMemo } from "@/lib/export-utils";

interface GisSite {
  id: string;
  name: string;
  cadastral: string;
  coordinates: string;
  zone: string;
  sensor: string;
  resolution: string;
  baselineDate: string;
  scanDate: string;
  waterLostHa: number;
  confidence: number;
  spectralAnomaly: string;
  mndwiDrop: number;
  actionStatus: "AI Alert Active" | "Statutory Notice Served" | "FIR / Demolition Scheduled";
  geometryType: "wetland" | "canal";
  baselineImg: string;
  encroachedImg: string;
  box: { top: string; left: string; width: string; height: string; label: string };
}

const GIS_SITES: GisSite[] = [
  {
    id: "EKW-CHOW-2026",
    name: "East Kolkata Wetlands — Chowbaga Bheri",
    cadastral: "Dag No. 412 / Mouza Chowbaga",
    coordinates: "22°31'14.2\"N, 88°24'36.8\"E",
    zone: "Ramsar Site (Statutory Conservation Buffer)",
    sensor: "ISRO Cartosat-3 Optical + Sentinel-2 SAR",
    resolution: "0.28m Ground Sample Distance",
    baselineDate: "15 Jan 2024",
    scanDate: "02 Feb 2026",
    waterLostHa: 1.84,
    confidence: 97.4,
    spectralAnomaly: "MNDWI (Modified Water Index) inverted from +0.68 to -0.42. Unauthorized masonry foundation plinth detected.",
    mndwiDrop: 91,
    actionStatus: "AI Alert Active",
    geometryType: "wetland",
    baselineImg: "/gis/wetland_baseline.jpg",
    encroachedImg: "/gis/wetland_encroached.jpg",
    box: {
      top: "32%",
      left: "32%",
      width: "22%",
      height: "36%",
      label: "AI DETECT: 1.84 Ha LANDFILL & PLINTH"
    }
  },
  {
    id: "HOW-BALLY-2026",
    name: "Bally Canal Drainage Basin",
    cadastral: "Dag No. 67 / Mouza Bally",
    coordinates: "22°39'08.4\"N, 88°20'12.1\"E",
    zone: "Municipal Stormwater Drainage Basin",
    sensor: "Sentinel-1 C-Band SAR Difference",
    resolution: "1.0m Multi-spectral",
    baselineDate: "10 Mar 2024",
    scanDate: "18 Jan 2026",
    waterLostHa: 0.72,
    confidence: 94.1,
    spectralAnomaly: "Drainage channel constricted by 35% through illegal debris dumping along north embankment.",
    mndwiDrop: 78,
    actionStatus: "Statutory Notice Served",
    geometryType: "canal",
    baselineImg: "/gis/canal_baseline.jpg",
    encroachedImg: "/gis/canal_encroached.jpg",
    box: {
      top: "22%",
      left: "29%",
      width: "48%",
      height: "52%",
      label: "AI DETECT: -35% CANAL CHUTE CONSTRICTION"
    }
  }
];

export function SatelliteEncroachmentDetector() {
  const [activeSite, setActiveSite] = useState<GisSite>(GIS_SITES[0]);
  const [bandView, setBandView] = useState<"optical" | "mndwi" | "sar">("optical");
  const [displayMode, setDisplayMode] = useState<"wipe-slider" | "side-by-side">("wipe-slider");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [noticeIssued, setNoticeIssued] = useState(false);
  const [showCadastre, setShowCadastre] = useState(true);

  const handleDownloadNotice = () => {
    setNoticeIssued(true);
    downloadGovernmentMemo({
      title: `Statutory Encroachment Demolition & Stop-Work Directive`,
      scheme: `East Kolkata Wetlands Protection Act & WB Town and Country Planning Act`,
      jurisdiction: activeSite.name,
      content: `OFFICIAL DIRECTIVE (NRSC / ICCC SATELLITE CADASTRE AUDIT):\n\nAutomated spatial intelligence from ${activeSite.sensor} (${activeSite.resolution}) has established conclusive evidence of illegal landfilling and waterbody alienation.\n\nParcel Dag: ${activeSite.cadastral}\nCoordinates: ${activeSite.coordinates}\nStatutory Buffer: ${activeSite.zone}\nWater Catchment Lost: ${activeSite.waterLostHa} Hectares (~18,400 sq. meters).\n\nSpectral Diagnostic:\n${activeSite.spectralAnomaly}\n\nThe Municipal Commissioner and Sub-Divisional Officer are directed to execute immediate sealing of the encroached parcel within 48 hours under Section 4 of the West Bengal Town and Country Planning Act.`,
      metadata: {
        "Incident ID": activeSite.id,
        "Cadastral Record": activeSite.cadastral,
        "Geo-Coordinates": activeSite.coordinates,
        "Sensor Telemetry": activeSite.sensor,
        "Waterbody Loss": `-${activeSite.waterLostHa} Hectares`,
        "Spectral Confidence": `${activeSite.confidence}%`,
        "Baseline Scan": `${activeSite.baselineDate} vs ${activeSite.scanDate}`
      }
    });
    toast.success("Statutory Stop-Work Notice downloaded (Printable PDF ready)");
  };

  // Spectral Band Filter style for images
  const getBandFilterStyle = () => {
    switch (bandView) {
      case "mndwi":
        // Water Index rendering: emphasizes water bodies in deep indigo/cobalt and dry landfill in warm rust
        return "hue-rotate(195deg) saturate(200%) contrast(130%)";
      case "sar":
        // Synthetic Aperture Radar microwave greyscale backscatter
        return "grayscale(100%) contrast(175%) brightness(90%)";
      case "optical":
      default:
        // High-resolution true-color satellite orthophoto
        return "none";
    }
  };

  return (
    <SectionCard
      title="GIS Satellite Encroachment & Waterbody Protection (HYDRAA Model)"
      description="Remote sensing surveillance: Satellite spectral change detection overlaying official revenue cadastres against multi-band radar to identify illegal wetland landfilling"
      className="mb-5 border-l-4 border-l-primary"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <Radio className="h-3 w-3 text-gold animate-pulse" /> Sentinel-2 & Cartosat-3 Active
          </Badge>
          <div className="flex rounded-md border border-border p-0.5 text-xs bg-muted/30">
            {GIS_SITES.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  setActiveSite(site);
                  setNoticeIssued(false);
                }}
                className={`rounded px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  activeSite.id === site.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {site.id.includes("EKW") ? "East Kolkata Wetlands" : "Bally Canal"}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {/* Site Header Telemetry */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{activeSite.name}</span>
          <span className="text-xs text-muted-foreground">({activeSite.coordinates})</span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono text-muted-foreground">{activeSite.cadastral}</span>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
            {activeSite.actionStatus}
          </Badge>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left: Real Satellite Orthophoto Remote Sensing Viewer */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            {/* Control Bar: Mode Toggle, Cadastre Switch & Band Selector */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Display Mode: Swipe Slider vs Side-by-Side */}
              <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
                <button
                  onClick={() => setDisplayMode("wipe-slider")}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    displayMode === "wipe-slider"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <SlidersHorizontal className="h-3 w-3" /> Interactive Wipe Slider
                </button>
                <button
                  onClick={() => setDisplayMode("side-by-side")}
                  className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    displayMode === "side-by-side"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Columns className="h-3 w-3" /> Side-by-Side Dual View
                </button>
              </div>

              {/* Spectral Band Selector */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-muted-foreground flex items-center gap-1 text-[11px]">
                  <Layers className="h-3 w-3 text-primary" /> Band:
                </span>
                {[
                  { key: "optical", label: "RGB Optical (True Color)" },
                  { key: "mndwi", label: "MNDWI Water Index" },
                  { key: "sar", label: "SAR Radar Coherence" }
                ].map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setBandView(b.key as any)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      bandView === b.key
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}

                <button
                  onClick={() => setShowCadastre(!showCadastre)}
                  className={`ml-1 rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                    showCadastre
                      ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  Cadastre Overlay: {showCadastre ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* SATELLITE VIEWER DISPLAY */}
            {displayMode === "wipe-slider" ? (
              /* REAL SATELLITE INTERACTIVE WIPE SLIDER */
              <div className="space-y-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-2 border-slate-700 shadow-xl bg-slate-950 select-none">
                  {/* LAYER 1 (BOTTOM): 2026 CURRENT AI DETECTION ORTHOPHOTO */}
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={activeSite.encroachedImg}
                      alt="Current AI Satellite Scan"
                      className="w-full h-full object-cover transition-[filter] duration-300"
                      style={{ filter: getBandFilterStyle() }}
                    />

                    {/* Cadastre & AI Anomaly Bounding Box on 2026 layer */}
                    {showCadastre && (
                      <div
                        className="absolute border-2 border-dashed border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all pointer-events-none"
                        style={{
                          top: activeSite.box.top,
                          left: activeSite.box.left,
                          width: activeSite.box.width,
                          height: activeSite.box.height
                        }}
                      >
                        <div className="absolute -top-6 left-0 rounded bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow">
                          {activeSite.box.label}
                        </div>
                        <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      </div>
                    )}

                    {/* Top-Right Badge: 2026 AI Flagged */}
                    <div className="absolute top-3 right-3 rounded-md bg-black/80 backdrop-blur border border-red-500/50 px-2.5 py-1 text-[11px] text-red-400 font-mono flex items-center gap-1.5 shadow-lg">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                      <span className="font-bold">{activeSite.scanDate} AI Scan: Encroachment Flagged</span>
                    </div>
                  </div>

                  {/* LAYER 2 (TOP): 2024 BASELINE ORTHOPHOTO (Wiped via CSS clipPath) */}
                  <div
                    className="absolute inset-0 w-full h-full overflow-hidden transition-none"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                    }}
                  >
                    <img
                      src={activeSite.baselineImg}
                      alt="Baseline Approved Satellite Scan"
                      className="w-full h-full object-cover transition-[filter] duration-300"
                      style={{ filter: getBandFilterStyle() }}
                    />

                    {/* Top-Left Badge: 2024 Approved Baseline */}
                    <div className="absolute top-3 left-3 rounded-md bg-black/80 backdrop-blur border border-emerald-500/50 px-2.5 py-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 shadow-lg">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold">{activeSite.baselineDate} Approved Waterbody</span>
                    </div>
                  </div>

                  {/* Vertical Hairline Divider & Interactive Drag Indicator */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-slate-900 border-2 border-white p-1.5 shadow-2xl text-white">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* GIS HUD OVERLAYS (Crosshair, Coordinates, Scale, True North) */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
                    <Crosshair className="h-8 w-8 text-white/80" />
                  </div>

                  {/* Top-Right True North Compass */}
                  <div className="absolute top-12 right-3 pointer-events-none rounded-full bg-black/70 p-1 border border-white/20 text-white flex flex-col items-center">
                    <span className="text-[8px] font-bold text-primary leading-none">N</span>
                    <Compass className="h-3.5 w-3.5 text-white/70" />
                  </div>

                  {/* Bottom GIS Telemetry HUD Bar */}
                  <div className="absolute bottom-2.5 inset-x-2.5 rounded-lg bg-black/85 backdrop-blur px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-200 border border-white/15 shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400">{activeSite.coordinates}</span>
                      <span className="text-white/40">|</span>
                      <span className="font-medium text-slate-300">{activeSite.cadastral}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-destructive font-black">
                        Surface Lost: -{activeSite.waterLostHa} Ha ({activeSite.confidence}% AI Confidence)
                      </span>
                      <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                        {activeSite.sensor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Slider Bar */}
                <div className="flex items-center gap-3 px-3 py-2 bg-secondary/50 rounded-lg border border-border">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    2024 Baseline ({sliderPos}%)
                  </span>
                  <Slider
                    value={[sliderPos]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => setSliderPos(val[0])}
                    className="cursor-pointer"
                  />
                  <span className="text-xs font-bold text-destructive whitespace-nowrap">
                    2026 Encroached ({100 - sliderPos}%)
                  </span>
                </div>
              </div>
            ) : (
              /* REAL SATELLITE SIDE-BY-SIDE DUAL VIEW */
              <div className="grid gap-3 sm:grid-cols-2">
                {/* PANEL 1: BASELINE APPROVED SATELLITE ORTHOPHOTO */}
                <div className="overflow-hidden rounded-xl border border-emerald-500/40 bg-slate-950 text-white shadow-md">
                  <div className="bg-emerald-950/90 px-3 py-2 flex items-center justify-between border-b border-emerald-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{activeSite.baselineDate} (Approved Baseline)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">HISTORICAL ORTHOPHOTO</span>
                  </div>

                  <div className="relative aspect-[4/3] w-full bg-black">
                    <img
                      src={activeSite.baselineImg}
                      alt="Baseline Satellite"
                      className="w-full h-full object-cover"
                      style={{ filter: getBandFilterStyle() }}
                    />
                    <div className="absolute bottom-2 left-2 rounded bg-black/80 backdrop-blur px-2 py-0.5 text-[10px] text-emerald-300 font-mono">
                      MNDWI: +0.68 · 100% Water Surface
                    </div>
                  </div>

                  <div className="p-2 text-[11px] text-slate-300 bg-slate-900/90 border-t border-slate-800 flex justify-between">
                    <span>Revenue Type: <strong>Jolbhum (Wetland)</strong></span>
                    <span className="text-emerald-400 font-semibold">Authorized State Asset</span>
                  </div>
                </div>

                {/* PANEL 2: CURRENT AI ENCROACHMENT SATELLITE ORTHOPHOTO */}
                <div className="overflow-hidden rounded-xl border-2 border-red-500 bg-slate-950 text-white shadow-md">
                  <div className="bg-red-950/90 px-3 py-2 flex items-center justify-between border-b border-red-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-300">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                      <span>{activeSite.scanDate} (Latest AI Pass)</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 font-bold">ANOMALY FLAGGED</span>
                  </div>

                  <div className="relative aspect-[4/3] w-full bg-black">
                    <img
                      src={activeSite.encroachedImg}
                      alt="Encroached Satellite"
                      className="w-full h-full object-cover"
                      style={{ filter: getBandFilterStyle() }}
                    />

                    {/* Cadastre / Bounding Box */}
                    {showCadastre && (
                      <div
                        className="absolute border-2 border-dashed border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                        style={{
                          top: activeSite.box.top,
                          left: activeSite.box.left,
                          width: activeSite.box.width,
                          height: activeSite.box.height
                        }}
                      >
                        <div className="absolute -top-5 left-0 rounded bg-red-600 px-1.5 py-0.5 text-[8px] font-black uppercase text-white shadow">
                          {activeSite.box.label}
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 rounded bg-black/80 backdrop-blur px-2 py-0.5 text-[10px] text-red-400 font-mono">
                      MNDWI: -0.42 · Dry Earth & Plinth
                    </div>
                  </div>

                  <div className="p-2 text-[11px] text-red-300 bg-red-950/70 border-t border-red-900/50 flex justify-between font-semibold">
                    <span>Encroachment Confirmed</span>
                    <span>Confidence: {activeSite.confidence}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Satellite Technical Diagnostic Log */}
          <div className="mt-3.5 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
            <div className="flex items-center justify-between font-bold text-primary">
              <span className="flex items-center gap-1.5">
                <Scan className="h-4 w-4" /> Remote Sensing Spectral Diagnostics:
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">{activeSite.sensor}</span>
            </div>
            <p className="mt-1 text-xs text-foreground/90 leading-relaxed font-mono">
              {activeSite.spectralAnomaly}
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded bg-card p-1.5 border border-border">
                <span className="text-muted-foreground block">2024 Water Index</span>
                <span className="font-bold text-emerald-600 font-mono text-xs">+0.68 (Deep Water)</span>
              </div>
              <div className="rounded bg-card p-1.5 border border-border">
                <span className="text-muted-foreground block">2026 Water Index</span>
                <span className="font-bold text-destructive font-mono text-xs">-0.42 (Filled Earth)</span>
              </div>
              <div className="rounded bg-card p-1.5 border border-border">
                <span className="text-muted-foreground block">Spatial Surface Lost</span>
                <span className="font-bold text-destructive font-mono text-xs">-{activeSite.waterLostHa} Hectares</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cadastral Revenue Record & Enforcement Directive */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-xs font-bold text-foreground">Revenue Cadastre Overlay</span>
                <p className="text-[10px] text-muted-foreground">GoWB Land & Land Reforms Dept.</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                Match: {activeSite.confidence}%
              </Badge>
            </div>

            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded-md bg-card p-2.5 border border-border">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Cadastral Record</span>
                <p className="font-bold text-foreground mt-0.5">{activeSite.cadastral}</p>
                <p className="text-[11px] text-muted-foreground">{activeSite.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-card p-2.5 border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Waterbody Lost</span>
                  <p className="text-lg font-black text-destructive font-mono mt-0.5">
                    -{activeSite.waterLostHa} Ha
                  </p>
                  <span className="text-[9px] text-muted-foreground">~18,400 sq. meters</span>
                </div>
                <div className="rounded-md bg-card p-2.5 border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Violation Type</span>
                  <p className="text-xs font-bold text-destructive mt-1">
                    Earth Fill + Plinth
                  </p>
                  <span className="text-[9px] text-muted-foreground">No Sanctioned Plan</span>
                </div>
              </div>

              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2.5">
                <span className="text-[10px] uppercase font-bold text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Statutory Conservation Protection
                </span>
                <p className="text-[11px] font-medium text-foreground mt-0.5 leading-relaxed">
                  {activeSite.zone} — Section 4 WBTP Act & EKW Conservation Rules prohibit alienation of public waterbodies.
                </p>
              </div>
            </div>
          </div>

          {/* Action: Real Government Stop-Work Directive (PDF) */}
          <div className="mt-4 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-muted-foreground">Enforcement Status:</span>
              <span className="text-[11px] font-bold text-destructive">
                {noticeIssued ? "Stop-Work Order Dispatched & Downloaded" : "Immediate Order Warranted"}
              </span>
            </div>

            <Button
              size="sm"
              onClick={handleDownloadNotice}
              className="w-full gap-1.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" />
              {noticeIssued ? "Re-Download Stop-Work Directive (PDF)" : "Issue & Download Stop-Work Directive (PDF)"}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
