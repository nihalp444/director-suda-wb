import { useMemo, useState } from "react";
import { Sparkles, ChevronRight, Copy, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RagBadge, SectionCard } from "@/components/suda/ui-kit";
import type { ExceptionRow } from "@/lib/suda-data";

const LABEL = "Prototype AI insight — verify against source records.";
const SYNC = "06:00 hrs today";

type Kpis = Record<string, number>;

const RULES: { key: string; name: string; benchmark: number; source: string; explain: (v: number, b: number) => string }[] = [
  { key: "fundUtilisation", name: "Fund utilisation", benchmark: 80, source: "Fund Utilisation & UC/SOE Dashboard", explain: (v, b) => `Only ${v}% of released funds are utilised against the ${b}% benchmark, which risks UC delays and lapse of the next instalment.` },
  { key: "swmSegregation", name: "Source segregation", benchmark: 75, source: "Solid-Waste & Sanitation Dashboard", explain: (v, b) => `Segregation at source is ${v}%, below the ${b}% Mission Nirmal Bangla target, increasing load on dumpsites.` },
  { key: "housingCompletion", name: "Housing completion", benchmark: 70, source: "Banglar Bari & Housing Dashboard", explain: (v, b) => `${v}% of sanctioned houses are completed versus a ${b}% expected pace, suggesting stalled units.` },
  { key: "revenueCollection", name: "Revenue collection efficiency", benchmark: 70, source: "Municipal Revenue Dashboard", explain: (v, b) => `Own-source revenue collection is at ${v}% of demand against a ${b}% benchmark.` },
  { key: "grievanceRedressal", name: "Grievance redressal", benchmark: 85, source: "Grievance & Incident Dashboard", explain: (v, b) => `${v}% of grievances are redressed within SLA, short of the ${b}% standard.` },
  { key: "projectsOnTrack", name: "Projects on track", benchmark: 80, source: "Projects & Works Dashboard", explain: (v, b) => `${v}% of projects are on schedule against an ${b}% target.` },
  { key: "dataCompleteness", name: "Data completeness", benchmark: 90, source: "Data Quality & Integration Dashboard", explain: (v, b) => `MIS data is ${v}% complete; below ${b}% the other indicators become less reliable.` },
];

type Insight = {
  rank: number;
  severity: "red" | "amber";
  kpiName: string;
  value: number;
  benchmark: number;
  gap: number;
  source: string;
  explanation: string;
  alert: ExceptionRow;
};

function buildInsights(kpis: Kpis, alerts: ExceptionRow[]): Insight[] {
  const ranked = RULES.map((r) => {
    const value = kpis[r.key] ?? 0;
    return { r, value, gap: +(r.benchmark - value).toFixed(1) };
  }).sort((a, b) => b.gap - a.gap);
  const sortedAlerts = [...alerts].sort((a, b) => (a.status === b.status ? 0 : a.status === "red" ? -1 : 1));
  return ranked.slice(0, 3).map((x, i) => {
    const alert = sortedAlerts[i % sortedAlerts.length]!;
    const severity: "red" | "amber" = x.gap >= 10 || (x.gap > 0 && alert.status === "red") ? "red" : "amber";
    return {
      rank: i + 1,
      severity,
      kpiName: x.r.name,
      value: x.value,
      benchmark: x.r.benchmark,
      gap: x.gap,
      source: x.r.source,
      explanation:
        x.gap > 0
          ? x.r.explain(x.value, x.r.benchmark)
          : `${x.r.name} is ${x.value}%, at or above the ${x.r.benchmark}% benchmark, but a linked exception remains open.`,
      alert,
    };
  });
}

function buildBrief(i: Insight, district: string, fy: string) {
  const next1 =
    i.alert.status === "red"
      ? `Review a time-bound recovery plan from ${i.alert.officer} for ${i.alert.location} before ${i.alert.deadline}.`
      : `Seek a status note from ${i.alert.officer} on "${i.alert.issue}" ahead of ${i.alert.deadline}.`;
  const next2 = `Consider the pending decision "${i.alert.decision}" after verifying ${i.kpiName.toLowerCase()} figures in the ${i.source}.`;
  return [
    `DRAFT DECISION BRIEF (for review by an authorised officer)`,
    `Jurisdiction: ${district} · FY ${fy} · Data as of ${SYNC}`,
    ``,
    `Issue: ${i.alert.issue} — ${i.alert.location} (${i.alert.id}).`,
    `Evidence: ${i.kpiName} at ${i.value}% vs benchmark ${i.benchmark}% (gap ${i.gap > 0 ? i.gap : 0} pts). Flag status: ${i.alert.status === "red" ? "Action needed" : "Watch"}.`,
    `Action already taken: ${i.alert.action}.`,
    `Deadline: ${i.alert.deadline}.`,
    `Suggested next steps:`,
    `  1. ${next1}`,
    `  2. ${next2}`,
    ``,
    `${LABEL} This is not an official decision and has not been sent or submitted.`,
  ].join("\n");
}

export function AiInsightsPanel({ kpis, alerts, district, fy }: { kpis: Kpis; alerts: ExceptionRow[]; district: string; fy: string }) {
  const insights = useMemo(() => buildInsights(kpis, alerts), [kpis, alerts]);
  const [selected, setSelected] = useState<Insight | null>(null);
  const [brief, setBrief] = useState<string | null>(null);

  const open = (i: Insight) => {
    setSelected(i);
    setBrief(null);
  };
  const close = () => {
    setSelected(null);
    setBrief(null);
  };
  const copy = async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(brief);
      toast.success("Brief copied to clipboard");
    } catch {
      toast.error("Could not copy — please select and copy manually");
    }
  };

  return (
    <SectionCard
      title="AI Insights"
      description="Top three ranked signals from this cockpit's indicators and exception register"
      className="mb-5 border-t-2 border-t-gold"
      action={
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground">
          <Sparkles className="h-3 w-3 text-gold" /> Prototype
        </span>
      }
    >
      <div className="grid gap-3 md:grid-cols-3">
        {insights.map((i) => (
          <button
            key={i.rank}
            type="button"
            onClick={() => open(i)}
            className="group flex flex-col rounded-md border border-border bg-secondary/40 p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">#{i.rank}</span>
              <RagBadge status={i.severity} />
            </div>
            <p className="text-sm font-semibold text-foreground">{i.kpiName}</p>
            <p className="text-[11px] text-muted-foreground">
              {i.alert.location} · FY {fy}, as of {SYNC}
            </p>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-foreground/80">{i.explanation}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
              Why flagged? <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1 text-[11px] italic text-muted-foreground">
        <Info className="h-3 w-3" /> {LABEL}
      </p>

      <Sheet open={!!selected} onOpenChange={(o) => !o && close()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <RagBadge status={selected.severity} />
                  <span className="text-xs text-muted-foreground">Insight #{selected.rank}</span>
                </div>
                <SheetTitle>{selected.kpiName}</SheetTitle>
                <SheetDescription>{selected.explanation}</SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-md border border-gold/40 bg-gold/10 p-2.5 text-[11px] font-medium text-foreground">
                  {LABEL} Indicative only.
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supporting figures</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ["Current value", `${selected.value}%`],
                      ["Benchmark", `${selected.benchmark}%`],
                      ["Gap", `${selected.gap > 0 ? selected.gap : 0} pts`],
                      ["Flag", selected.alert.status === "red" ? "Action needed" : "Watch"],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md bg-secondary/60 p-2">
                        <dt className="text-[11px] text-muted-foreground">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked exception record</h3>
                  <dl className="space-y-1.5 text-sm">
                    {[
                      ["Record", selected.alert.id],
                      ["Issue", selected.alert.issue],
                      ["ULB / ward", selected.alert.location],
                      ["Responsible officer", selected.alert.officer],
                      ["Action taken", selected.alert.action],
                      ["Deadline", selected.alert.deadline],
                      ["Decision required", selected.alert.decision],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-3 border-b border-border/60 pb-1">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Source: {selected.source} · Cockpit exception register</p>
                  <p>Last sync: {SYNC}</p>
                  <p className="mt-1">
                    Ranking logic: largest gap between indicator and benchmark, paired with open exceptions (red first).
                  </p>
                </div>

                {!brief ? (
                  <Button className="w-full" onClick={() => setBrief(buildBrief(selected, district, fy))}>
                    <FileText className="mr-1.5 h-4 w-4" /> Prepare decision brief
                  </Button>
                ) : (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Draft decision brief</h3>
                    <pre className="whitespace-pre-wrap rounded-md border border-border bg-card p-3 font-sans text-xs leading-relaxed text-foreground">
                      {brief}
                    </pre>
                  </div>
                )}

                <div className="flex gap-2">
                  {brief && (
                    <Button variant="outline" className="flex-1" onClick={copy}>
                      <Copy className="mr-1.5 h-4 w-4" /> Copy brief
                    </Button>
                  )}
                  <Button variant="secondary" className="flex-1" onClick={close}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SectionCard>
  );
}
