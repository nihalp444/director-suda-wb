import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ExceptionTable,
  KpiCard,
  PageHeader,
  RagBadge,
  SectionCard,
  axisProps,
  tooltipStyle,
} from "@/components/suda/ui-kit";
import { Progress } from "@/components/ui/progress";
import { useDistrict } from "@/lib/district-context";
import { exceptions, missionPerformance } from "@/lib/suda-data";

export const Route = createFileRoute("/mission-performance")({
  head: () => ({
    meta: [
      { title: "Mission Performance Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Physical and financial progress of PMAY-U/Banglar Bari, AMRUT 2.0, SBM-U, DAY-NULM, NUHM, UPHC, CBPHC and NVBDCP missions district-wise in West Bengal.",
      },
      { property: "og:title", content: "Mission Performance Dashboard | SUDA" },
      { property: "og:description", content: "Track every SUDA-implemented urban mission against physical and financial targets." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const missions = missionPerformance(district);
  const avgPhysical = +(missions.reduce((s, m) => s + m.physical, 0) / missions.length).toFixed(1);
  const avgFinancial = +(missions.reduce((s, m) => s + m.financial, 0) / missions.length).toFixed(1);
  const lagging = missions.filter((m) => m.status === "red").length;

  const merged = missions[0]!.milestones.map((mo, i) => {
    const row: Record<string, string | number> = { month: mo.month };
    missions.slice(0, 5).forEach((m) => {
      row[m.mission.split(" ")[0]!] = m.milestones[i]!.value;
    });
    return row;
  });

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Mission Performance Dashboard"
        subtitle="Consolidated physical and financial progress of every centrally- and state-sponsored urban mission implemented through SUDA."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Missions tracked" value={missions.length} unit="programmes" />
        <KpiCard label="Average physical progress" value={avgPhysical} unit="%" progress={avgPhysical} tone="good" delta={2.4} />
        <KpiCard label="Average financial progress" value={avgFinancial} unit="%" progress={avgFinancial} delta={1.6} />
        <KpiCard label="Missions lagging" value={lagging} unit="need review" tone={lagging ? "bad" : "good"} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Physical vs financial progress" description="Percentage against annual action plan">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={missions} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} {...axisProps} />
              <YAxis type="category" dataKey="mission" width={150} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="physical" name="Physical %" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="financial" name="Financial %" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly milestone achievement" description="Top five missions by outlay">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {missions.slice(0, 5).map((m, i) => (
                <Line
                  key={m.mission}
                  type="monotone"
                  dataKey={m.mission.split(" ")[0]!}
                  stroke={`var(--color-chart-${i + 1})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((m) => (
          <div key={m.mission} className="card-elevated p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{m.mission}</h3>
              <RagBadge status={m.status} />
            </div>
            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Physical</span>
                  <span>{m.physical}%</span>
                </div>
                <Progress value={m.physical} className="mt-1 h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Financial</span>
                  <span>{m.financial}%</span>
                </div>
                <Progress value={m.financial} className="mt-1 h-1.5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Target {m.targets.toLocaleString("en-IN")} · Achieved {m.achieved.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <SectionCard title="Exception register — mission delivery" description="Red and amber missions with accountable officers">
        <ExceptionTable rows={exceptions(district, "general", 6)} />
      </SectionCard>
    </div>
  );
}
