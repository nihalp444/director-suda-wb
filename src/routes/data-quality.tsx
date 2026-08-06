import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  CHART_COLORS,
  ExceptionTable,
  KpiCard,
  PageHeader,
  RagBadge,
  SectionCard,
  axisProps,
  tooltipStyle,
} from "@/components/suda/ui-kit";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDistrict } from "@/lib/district-context";
import { dataQuality, ragOf } from "@/lib/suda-data";

export const Route = createFileRoute("/data-quality")({
  head: () => ({
    meta: [
      { title: "Data Quality & Integration Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Reporting compliance, data completeness and system integration health across West Bengal urban local bodies and mission MIS portals.",
      },
      { property: "og:title", content: "Data Quality & Integration Dashboard | SUDA" },
      { property: "og:description", content: "Monitor MIS sync health, reporting timeliness and data completeness district-wise." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = dataQuality(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Data Quality & Integration Dashboard"
        subtitle="Confidence layer for every other dashboard — reporting compliance, record completeness and the health of MIS integrations feeding this cockpit."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Overall data quality score"
          value={d.kpis.score}
          unit="/ 100"
          progress={d.kpis.score}
          tone={ragOf(d.kpis.score, 65, 85) === "green" ? "good" : "warn"}
          delta={2.9}
        />
        <KpiCard label="ULBs reporting on time" value={d.kpis.onTimeUlbs} unit="%" progress={d.kpis.onTimeUlbs} />
        <KpiCard label="Record completeness" value={d.kpis.completeness} unit="%" progress={d.kpis.completeness} />
        <KpiCard label="Records with mismatch" value={d.kpis.mismatches.toLocaleString("en-IN")} unit="records" tone="bad" />
        <KpiCard label="Systems integrated" value={d.kpis.systemsIntegrated} unit="portals" tone="good" />
        <KpiCard label="Stale data feeds" value={d.kpis.staleFeeds} unit="feeds" tone={d.kpis.staleFeeds > 2 ? "bad" : "warn"} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Dimension-wise quality" description="Completeness, timeliness, accuracy, consistency and validation">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={d.dimensions} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} {...axisProps} />
              <YAxis type="category" dataKey="dimension" width={110} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                {d.dimensions.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Module-wise reporting compliance" description="Share of ULBs reporting within the due date">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={d.modules} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="module" angle={-25} textAnchor="end" height={70} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="compliance" name="Compliance %" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Source system health" description="Sync status of integrated MIS portals and state systems" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>System</TableHead>
                <TableHead>Last sync</TableHead>
                <TableHead className="w-[180px]">Records matched</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.systems.map((s) => (
                <TableRow key={s.system}>
                  <TableCell className="font-medium">{s.system}</TableCell>
                  <TableCell className="text-muted-foreground">{s.lastSync}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.matchPct} className="h-1.5 w-24" />
                      <span className="text-xs">{s.matchPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={s.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — data quality" description="Non-reporting ULBs and broken feeds requiring intervention">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
