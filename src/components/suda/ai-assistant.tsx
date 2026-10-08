import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Send,
  X,
  FileCheck2,
  AlertTriangle,
  FileText,
  Copy,
  ChevronRight,
  TrendingDown,
  Building,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  RotateCcw,
  UtensilsCrossed,
  MapPin,
  Waves,
  IndianRupee,
  Activity,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useDistrict } from "@/lib/district-context";
import { downloadGovernmentMemo, downloadCsvSpreadsheet } from "@/lib/export-utils";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  category?: string;
  pills?: string[];
  actionCard?: {
    type: "letter" | "alert" | "forecast" | "inspection";
    title: string;
    details: string;
    schemeBadge?: string;
    actionLabel: string;
    metadata?: Record<string, string>;
  };
}

const INITIAL_WELCOME: Message = {
  id: "welcome",
  sender: "ai",
  text: `নমস্কার! I am the SUDA Command Centre AI Copilot (ILGUS & UD&MA Telemetry Engine). 
I monitor live feeds across all 128 Urban Local Bodies, Banglar Bari GIS geo-tagging, Maa Aahar (Maa Canteens), Swachha sanitation telemetry, AMRUT water pipelines, and West Bengal Treasury fund releases.

Select a verified departmental audit query below or ask anything about ULB operations:`,
  timestamp: "Just now",
  pills: [
    "Maa Aahar / Canteen: 500 Canteens Daily Meal Telemetry",
    "Howrah তে ডেঙ্গু প্রাদুর্ভাব ও ভেক্টর ঝুঁকি (NVBDCP)",
    "Banglar Bari: Flagged duplicate geo-tag & plinth anomalies",
    "Swachh Bharat: SBM-U 2.0 UC pending & Legacy Bio-mining",
    "AMRUT 2.0 Water Supply: Pumping stations & flow pressure",
    "Under-assessed Commercial Properties & Revenue Leakage"
  ]
};

export function SudaAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const { district, fy } = useDistrict();

  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }, 60);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isThinking, isOpen]);

  const appendWelcomeMessage = () => {
    const welcomeAgain: Message = {
      id: `welcome-${Date.now()}`,
      sender: "ai",
      text: `Operational Review Menu — State Urban Development Agency (SUDA):
Select from key ongoing monitoring schemes or type your specific ULB / Ward query:`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      pills: [
        "Maa Aahar / Canteen: 500 Canteens Daily Meal Telemetry",
        "Howrah তে ডেঙ্গু প্রাদুর্ভাব ও ভেক্টর ঝুঁকি (NVBDCP)",
        "Banglar Bari: Flagged duplicate geo-tag & plinth anomalies",
        "Swachh Bharat: SBM-U 2.0 UC pending & Legacy Bio-mining",
        "AMRUT 2.0 Water Supply: Pumping stations & flow pressure",
        "Under-assessed Commercial Properties & Revenue Leakage"
      ]
    };
    setMessages((prev) => [...prev, welcomeAgain]);
    setQuery("");
    setIsThinking(false);
    scrollToBottom("smooth");
  };

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery("");
    setIsThinking(true);
    scrollToBottom("smooth");

    setTimeout(() => {
      let aiReply: Message;
      const lower = prompt.toLowerCase();

      if (lower.includes("maa") || lower.includes("canteen") || lower.includes("aahar") || lower.includes("খাবার")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "Welfare & Maa Canteens",
          text: `[SUDA Maa Aahar / Maa Canteen Live Telemetry Feed]
Across West Bengal, 482 out of 500 subsidized community kitchens are actively serving meals today at ₹5/thali.

Real-Time Audit Observations for ${district}:
• Beneficiary Footfall: 38,420 subsidized meals served today (as of 13:00 hrs).
• Biometric / QR Token Compliance: 94.2% across hospital and municipal junction kitchens.
• Ration Supply Alert: 2 canteens in Ward 08 & Ward 19 running low on rice / egg stock buffers (< 48 hrs reserve).`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "alert",
            schemeBadge: "Maa Aahar Scheme (Dept. of UD&MA)",
            title: "Emergency Food Grain Replenishment Order",
            details: "Auto-generated indent for Essential Commodities Supply Corp (ECSC) for 4.2 MT fortified rice & pulse allocation.",
            metadata: {
              "State Canteens Active": "482 / 500",
              "Subsidized Meal Rate": "₹5 per plate",
              "Target Group": "Hospital attendants, daily wage earners"
            },
            actionLabel: "Export ECSC Indent Directive"
          }
        };
      } else if (lower.includes("howrah") || lower.includes("dengue") || lower.includes("ডেঙ্গু") || lower.includes("health") || lower.includes("nvbdcp")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "Urban Health & Vector Control",
          text: `[Health & Vector Intelligence Model — NVBDCP & NUHM Stream]
Cross-referencing door-to-door SBM uncollected waste coordinates with open canal stagnant pools in Howrah Municipal Corporation:

• High Vulnerability Zone: Ward 14 & Ward 22 (House Index: 7.8, Breteau Index: 28.4 — well above WHO outbreak threshold of 5.0).
• Correlation: 41% missed RFID household waste scans correlate directly with blocked roadside masonry drains along Foreshore Road.
• 14-Day Forecast: Projected 38% rise in localized dengue positivity unless larval suppression starts within 36 hours.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "alert",
            schemeBadge: "NVBDCP / SUDA Health Mission",
            title: "Urgent Vector Protocol: Howrah MC Wards 14 & 22",
            details: "Mandatory show-cause & action order to Conservancy Officer and Chief Medical Officer of Health (CMOH).",
            metadata: {
              "House Index": "7.8 (Critical)",
              "Required Teams": "6 Anti-larval chemical spray squads",
              "Deadline": "Immediate (within 24 hrs)"
            },
            actionLabel: "Dispatch Emergency Vector Order"
          }
        };
      } else if (lower.includes("banglar bari") || lower.includes("disbursement") || lower.includes("housing") || lower.includes("anomaly") || lower.includes("geo-tag")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "Banglar Bari & PMAY-U",
          text: `[Housing Construction Intelligence — Computer Vision Stage Audit]
Inspected 2,840 geo-tagged milestone uploads for Phase 1 & 2 Banglar Bari beneficiaries in ${district}:

• High-Risk Anomaly Flagged: 3 beneficiary claims for 2nd instalment release (₹60,000 each) flagged as fraudulent stage claims.
• CV Finding: Computer Vision detects brickwork paused at Plinth / Foundation, while uploaded engineer tags claim 'Roof Slab Casting Completed' (Confidence: 96.4%).
• Cadastral Mismatch: Beneficiary BB-WB-2026-90412 uploaded image coordinates match adjacent parcel BB-WB-2024-1102 (duplicate geo-tagging).`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "inspection",
            schemeBadge: "Banglar Bari (Urban) Milestone Tracker",
            title: "Payment Release Withhold & Physical Re-verification Order",
            details: "Withhold DBT disbursement of ₹1,80,000 across 3 flagged accounts pending spot re-inspection by SDO / Executive Engineer.",
            metadata: {
              "Flagged IDs": "BB-WB-2026-90412, BB-WB-2026-77319, BB-WB-2026-44012",
              "Status": "Direct Benefit Transfer (DBT) Frozen",
              "Action": "Sub-Divisional Officer site summons"
            },
            actionLabel: "Generate DBT Hold Memo"
          }
        };
      } else if (lower.includes("swachh") || lower.includes("sbm") || lower.includes("bio-mining") || lower.includes("uc") || lower.includes("dump")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "Swachh Bharat & Mission Nirmal Bangla",
          text: `[Swachh Bharat Mission-Urban 2.0 Compliance Engine]
Monitoring SBM-U 2.0 solid waste processing & legacy dump remediation:

• Legacy Dump Remediation: 3.4 Lakh MT bio-mined across 4 ULBs under SWM Rules 2016. Pramod Nagar / Howrah dumpsite processing at 82% of target pace.
• Financial Compliance: 4 ULBs have pending Utilization Certificates (UC) > 180 days totaling ₹14.82 Cr unadjusted advances.
• Swachha App Telemetry: 84 citizen sanitation complaints logged in the last 24h; 68 resolved within 12h municipal SLA.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "letter",
            schemeBadge: "Mission Nirmal Bangla (SBM-U 2.0)",
            title: "Formal Notice: Pending UC Submission & Treasury Block",
            details: "Targeted Show-Cause to Executive Officers under Rule 42(a) WB Urban Finance Manual prior to next tranche sanction.",
            metadata: {
              "Defaulting Amount": "₹14.82 Crore",
              "Compliance Window": "7 Working Days",
              "Authority": "Director, SUDA"
            },
            actionLabel: "Copy Show-Cause Order"
          }
        };
      } else if (lower.includes("amrut") || lower.includes("water") || lower.includes("drainage") || lower.includes("monsoon") || lower.includes("flood")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "AMRUT 2.0 & Urban Infrastructure",
          text: `[AMRUT 2.0 & Monsoon Drainage Telemetry]
Real-time sensor logs from Water Treatment Plants (WTP) and high-capacity storm water pumping stations:

• Potable Water Delivery: 135 LPCD benchmark achieved in 8 out of 11 piped network wards.
• Pressure Telemetry: Pressure drop detected in North distribution main (0.6 bar vs 1.5 bar standard) indicating underground main rupture.
• Monsoon Pump Readiness: 18 out of 21 heavy dewatering diesel pumps certified functional; 3 mobile pumps on standby for waterlogging hotspots.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "forecast",
            schemeBadge: "AMRUT 2.0 Mission Directorate",
            title: "PHE Rapid Valve Isolation Directive",
            details: "Isolate distribution grid sector 4B to prevent drinking water contamination from parallel masonry drain.",
            metadata: {
              "Affected Households": "~1,400",
              "Backup": "3 Mobile 5,000L water tankers routed",
              "Repair SLA": "8 Hours"
            },
            actionLabel: "Dispatch Pipeline Repair Protocol"
          }
        };
      } else if (lower.includes("revenue") || lower.includes("property") || lower.includes("trade") || lower.includes("tax") || lower.includes("leakage")) {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "Municipal Revenue Intelligence",
          text: `[Own-Source Revenue Intelligence Engine]
Cross-referencing satellite 3D LiDAR built-up footprints with Municipal Property Tax Rolls and WB GSTN portal:

• Under-Assessment Detection: 142 commercial establishments found operating as 'Residential' in property assessment rolls.
• Estimated Own-Source Recovery: ₹4.86 Crore annual recurring revenue leakage.
• Expired Trade Licences: 310 commercial units operating without renewal for FY ${fy}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actionCard: {
            type: "letter",
            schemeBadge: "WB Municipal Act Sec 132",
            title: "Bulk Supplementary Assessment Orders",
            details: "Auto-batch generated demand notices with QR payment integration for online municipal treasury settlement.",
            metadata: {
              "Identified Gap": "₹4.86 Crore / year",
              "Recovery Window": "30 Days Statutory Notice",
              "Source": "GIS Footprint vs Municipal Ledger"
            },
            actionLabel: "Export Re-Assessment Ledger"
          }
        };
      } else {
        aiReply = {
          id: String(Date.now() + 1),
          sender: "ai",
          category: "SUDA Cross-Mission Telemetry",
          text: `[SUDA Multi-Modal Command Center Telemetry]
Analyzed operations for ${district} (FY ${fy}):
• 128 ULBs live monitoring active via centralized API exchange.
• Banglar Bari: 74.2% completion rate, 2,840 CV audits completed this week.
• Maa Canteens: 482 active kitchen centers serving daily meals.
• Grievance Redressal: 88.4% SLA adherence across citizen channels.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          pills: [
            "Maa Aahar / Canteen: 500 Canteens Daily Meal Telemetry",
            "Howrah তে ডেঙ্গু প্রাদুর্ভাব ও ভেক্টর ঝুঁকি (NVBDCP)",
            "Banglar Bari: Flagged duplicate geo-tag & plinth anomalies",
            "Swachh Bharat: SBM-U 2.0 UC pending & Legacy Bio-mining"
          ]
        };
      }

      setMessages((prev) => [...prev, aiReply]);
      setIsThinking(false);
      scrollToBottom("smooth");
    }, 850);
  };

  const copyAction = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Official notice copied to clipboard for departmental record");
  };

  return (
    <>
      {/* Floating Trigger Button - Responsive & Elegant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-2.5 rounded-full bg-primary px-3.5 py-2.5 sm:px-4 sm:py-3 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/30 focus:outline-none"
        aria-label="Open SUDA AI Copilot"
      >
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-gold"></span>
        </span>
        <Sparkles className="h-4 w-4 text-gold" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">SUDA AI Copilot</span>
        <Badge variant="outline" className="hidden sm:inline-flex border-primary-foreground/30 text-[10px] text-primary-foreground">
          Live
        </Badge>
      </button>

      {/* Modal / Slide-out Assistant - Fully Responsive */}
      {isOpen && (
        <div
          className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-card shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isExpanded ? "sm:max-w-2xl md:max-w-3xl" : "sm:max-w-md md:max-w-lg"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-3.5 py-3 sm:px-4 sm:py-3.5">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="brand-gradient flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground shadow-sm">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h3 className="truncate text-xs sm:text-sm font-bold text-foreground">
                    Municipal AI Assistant
                  </h3>
                  <Badge className="bg-primary/10 text-[9px] sm:text-[10px] text-primary shrink-0">
                    SUDA Live Telemetry
                  </Badge>
                </div>
                <p className="truncate text-[10px] sm:text-[11px] text-muted-foreground">
                  Dept. of Urban Development & Municipal Affairs, Govt. of West Bengal
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2 text-[10px] sm:text-[11px] font-semibold text-primary border-primary/30 bg-primary/5 hover:bg-primary/10"
                onClick={appendWelcomeMessage}
                title="Show operational query menu again"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden xs:inline">Menu</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Restore width" : "Expand width"}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* District & Context banner */}
          <div className="flex items-center justify-between bg-accent/40 px-3.5 py-1.5 sm:px-4 text-[10px] sm:text-[11px] text-muted-foreground border-b border-border/50">
            <span className="truncate">
              Jurisdiction: <strong className="text-foreground">{district}</strong>
            </span>
            <span className="shrink-0 font-medium">FY {fy} · Gov Net Active</span>
          </div>

          {/* Messages list */}
          <ScrollArea className="flex-1 p-3 sm:p-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[90%] rounded-xl px-3.5 py-3 text-xs leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-foreground"
                    }`}
                  >
                    {m.category && (
                      <div className="mb-2 inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Activity className="h-2.5 w-2.5" /> {m.category}
                      </div>
                    )}

                    <p className="whitespace-pre-line text-[11px] sm:text-xs leading-relaxed">{m.text}</p>

                    {/* Action Card inside AI message */}
                    {m.actionCard && (
                      <div className="mt-3 rounded-lg border border-border bg-secondary/40 p-3 text-card-foreground">
                        {m.actionCard.schemeBadge && (
                          <span className="mb-1.5 inline-block text-[10px] font-bold uppercase tracking-wider text-primary">
                            {m.actionCard.schemeBadge}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{m.actionCard.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground leading-normal">
                          {m.actionCard.details}
                        </p>

                        {/* Metadata table if present */}
                        {m.actionCard.metadata && (
                          <div className="mt-2.5 space-y-1 rounded bg-background/80 p-2 text-[10px] border border-border/60">
                            {Object.entries(m.actionCard.metadata).map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-2">
                                <span className="text-muted-foreground">{k}:</span>
                                <span className="font-semibold text-foreground text-right">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 flex-1 min-w-[130px] text-[11px] font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                              downloadGovernmentMemo({
                                title: m.actionCard?.title || "SUDA Official Memorandum",
                                scheme: m.actionCard?.schemeBadge || "Urban Operations",
                                jurisdiction: district,
                                content: `${m.text}\n\nOperative Directive:\n${m.actionCard?.details || ""}`,
                                metadata: m.actionCard?.metadata
                              });
                              toast.success("Downloaded official Government Memo (Printable PDF ready)");
                            }}
                          >
                            <Download className="h-3 w-3" /> Download Memo (PDF/HTML)
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 px-2.5 text-[11px] font-medium gap-1 border border-border"
                            onClick={() =>
                              copyAction(
                                `${m.actionCard?.title}\nScheme: ${m.actionCard?.schemeBadge || "SUDA"}\n\n${m.actionCard?.details}`
                              )
                            }
                          >
                            <Copy className="h-3 w-3" /> Copy Text
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="mt-1 px-1 text-[9px] sm:text-[10px] text-muted-foreground">{m.timestamp}</span>

                  {/* Suggestion Pills */}
                  {m.pills && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-full">
                      {m.pills.map((pill, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(pill)}
                          className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors text-left"
                        >
                          <ChevronRight className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate max-w-[280px] sm:max-w-none">{pill}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Back to Home / Welcome prompt button if this is a response */}
                  {m.sender === "ai" && m.id !== "welcome" && (
                    <button
                      onClick={appendWelcomeMessage}
                      className="mt-2 inline-flex items-center gap-1 rounded-md border border-dashed border-border bg-card/60 px-2 py-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="h-2.5 w-2.5 text-primary" />
                      <span>Back to Welcome Options (Show Prompts Again)</span>
                    </button>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                  <span>Synthesizing cross-department telemetry & generating decision brief...</span>
                </div>
              )}

              {/* Anchor for automatic scroll to bottom */}
              <div ref={chatEndRef} className="h-1 w-full" />
            </div>
          </ScrollArea>

          {/* Real SUDA Portal Reference & Compliance */}
          <div className="border-t border-border bg-muted/30 px-3 py-2 text-[10px] text-muted-foreground flex justify-between items-center">
            <span className="flex items-center gap-1 truncate">
              <CheckCircle2 className="h-3 w-3 text-success shrink-0" /> Bengali & English multi-lingual NLU
            </span>
            <span className="font-semibold text-foreground shrink-0 text-right">
              Integrated Command & Control Platform
            </span>
          </div>

          {/* Input Box */}
          <div className="border-t border-border bg-card p-2.5 sm:p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask about Maa Canteen, Dengue risk, Banglar Bari, SBM..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 text-xs"
              />
              <Button type="submit" size="sm" className="h-9 px-3 gap-1 shrink-0" disabled={isThinking || !query.trim()}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
