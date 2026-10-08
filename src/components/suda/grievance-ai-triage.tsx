import { useState } from "react";
import {
  Sparkles,
  Languages,
  CheckCircle,
  Clock,
  Send,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  UserCheck
} from "lucide-react";
import { SectionCard } from "@/components/suda/ui-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TriageTicket {
  id: string;
  sourceText: string;
  language: "Bengali" | "English";
  translatedSummary: string;
  category: "Water Supply" | "Drainage / Monsoon" | "Solid Waste" | "Health / Vector";
  sentiment: "Critical / Outraged" | "Urgent" | "Moderate";
  extractedWard: string;
  assignedOfficer: string;
  suggestedAction: string;
  slaHours: number;
}

const SAMPLE_GRIEVANCES: TriageTicket[] = [
  {
    id: "GRV-2026-WB-8831",
    language: "Bengali",
    sourceText: "আমাদের ১৪ নম্বর ওয়ার্ডে গত ৩ দিন ধরে ড্রেন উপচে নোংরা জল রাস্তায় জমছে। মশার উপদ্রব চরম, শিশুরা অসুস্থ হচ্ছে। অবিলম্বে ব্যবস্থা নিন!",
    translatedSummary: "Sewage overflow on main road for 3 days in Ward 14. Extreme mosquito infestation, children falling sick. Immediate action required.",
    category: "Drainage / Monsoon",
    sentiment: "Critical / Outraged",
    extractedWard: "Ward 14 (Howrah MC)",
    assignedOfficer: "Sri D. Ghosh, Executive Engineer (Drainage)",
    suggestedAction: "Dispatch suction tanker & notify vector control team for chemical fogging.",
    slaHours: 12
  },
  {
    id: "GRV-2026-WB-8794",
    language: "English",
    sourceText: "Water supply pipeline ruptured near Netaji Subhash Road junction since 5 AM. Drinking water contaminated with silt.",
    translatedSummary: "Drinking water main rupture; muddy water reported across 200 households.",
    category: "Water Supply",
    sentiment: "Critical / Outraged",
    extractedWard: "Ward 04 (Bally Municipality)",
    assignedOfficer: "Smt. R. Mondal, SDO / PHE In-charge",
    suggestedAction: "Isolate valve grid & dispatch mobile drinking water tanker immediately.",
    slaHours: 6
  },
  {
    id: "GRV-2026-WB-8650",
    language: "Bengali",
    sourceText: "বাড়ি বাড়ি বর্জ্য সংগ্রহের গাড়ি গত ১ সপ্তাহ ধরে আসেনি। আবর্জনার স্তূপ জমে গেছে রাস্তার কোণে।",
    translatedSummary: "Door-to-door SBM collection vehicle absent for 1 week. Uncontrolled garbage pile on street corner.",
    category: "Solid Waste",
    sentiment: "Urgent",
    extractedWard: "Ward 19 (Uluberia)",
    assignedOfficer: "Sri A. Bhattacharya, EO",
    suggestedAction: "Direct waste concessionaire vehicle routing & issue penalty warning.",
    slaHours: 24
  }
];

export function GrievanceAiTriage() {
  const [selectedTicket, setSelectedTicket] = useState<TriageTicket>(SAMPLE_GRIEVANCES[0]);
  const [routed, setRouted] = useState<Record<string, boolean>>({});

  const handleRoute = (id: string) => {
    setRouted((prev) => ({ ...prev, [id]: true }));
    toast.success(`Complaint ${id} auto-dispatched to ${selectedTicket.assignedOfficer} via SMS & WhatsApp`);
  };

  return (
    <SectionCard
      title="Multilingual Citizen Grievance AI Triage & Sentiment Routing"
      description="Natural language understanding (NLU) processing Bengali & English citizen complaints, auto-extracting ward/urgency, and assigning SLA workflows"
      className="mb-5 border-l-4 border-l-gold"
      action={
        <Badge variant="outline" className="gap-1 border-gold/40 text-gold-foreground bg-gold/10">
          <Sparkles className="h-3 w-3 text-gold" /> Indic-LLM Pipeline (Bengali-First)
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Stream of incoming citizen complaints */}
        <div className="space-y-2 lg:col-span-5">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>Incoming Raw Submissions</span>
            <span>Language</span>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {SAMPLE_GRIEVANCES.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  selectedTicket.id === t.id
                    ? "border-gold bg-gold/5 shadow-sm"
                    : "border-border bg-card hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-foreground">{t.id}</span>
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Languages className="h-2.5 w-2.5 text-primary" /> {t.language}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs text-foreground line-clamp-2 italic">
                  "{t.sourceText}"
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <Badge
                    variant={t.sentiment.includes("Critical") ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {t.sentiment}
                  </Badge>
                  <span>{t.extractedWard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Extraction & Instant Dispatch View */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Ticket #{selectedTicket.id}
                </h4>
                <p className="text-xs text-muted-foreground">Category: <strong className="text-foreground">{selectedTicket.category}</strong></p>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                SLA: {selectedTicket.slaHours} Hours
              </Badge>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">
                  Original Citizen Voice / Text ({selectedTicket.language})
                </span>
                <p className="mt-1 text-xs italic text-foreground font-medium">
                  "{selectedTicket.sourceText}"
                </p>
              </div>

              <div className="rounded-md border border-border bg-card p-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-gold" /> AI English Synthesis & Entities
                </span>
                <p className="mt-1 text-xs text-foreground">
                  {selectedTicket.translatedSummary}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded bg-secondary px-2 py-0.5">Ward: <strong>{selectedTicket.extractedWard}</strong></span>
                  <span className="rounded bg-secondary px-2 py-0.5">Sentiment: <strong className="text-destructive">{selectedTicket.sentiment}</strong></span>
                </div>
              </div>

              <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-foreground">
                <span className="text-[10px] uppercase font-bold text-primary flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" /> Auto-Assigned Officer
                </span>
                <p className="mt-1 text-xs font-semibold">{selectedTicket.assignedOfficer}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Action: {selectedTicket.suggestedAction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Direct API integration with WB Centralized Grievance Cell
            </span>
            <Button
              size="sm"
              disabled={routed[selectedTicket.id]}
              onClick={() => handleRoute(selectedTicket.id)}
              className="gap-1.5 bg-primary text-primary-foreground text-xs"
            >
              {routed[selectedTicket.id] ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-success" /> Dispatched & Tracked
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Execute AI Routing
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
