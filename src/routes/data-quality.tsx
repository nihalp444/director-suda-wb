import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  const score = +((d.kpis.completeness + d.kpis.timeliness + d.kpis.accuracy) / 3).toFixed(1);
  const dimensions = [
    { dimension: "Completeness", score: d.kpis.completeness },
    { dimension: "Timeliness", score: d.kpis.timeliness },
    { dimension: "Accuracy", score: d.kpis.accuracy },
    { dimension: "API uptime", score: d.kpis.apiUptime },
  ];

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Data Quality & Integration Dashboard"
        subtitle="Confidence layer for every other dashboard — reporting compliance, record completeness and the health of MIS integrations feeding this cockpit."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Overall data quality score"
          value={score}
          unit="/ 100"
          progress={score}
          tone={ragOf(score, 65, 85) === "green" ? "good" : "warn"}
          delta={2.9}
        />
        <KpiCard label="Record completeness" value={d.kpis.completeness} unit="%" progress={d.kpis.completeness} />
        <KpiCard
          label="Reporting timeliness"
          value={d.kpis.timeliness}
          unit="%"
          progress={d.kpis.timeliness}
          tone={d.kpis.timeliness < 70 ? "bad" : "warn"}
        />
        <KpiCard label="Data accuracy" value={d.kpis.accuracy} unit="%" progress={d.kpis.accuracy} tone="good" />
        <KpiCard label="Systems integrated" value={d.kpis.integratedSystems} unit="portals" tone="good" />
        <KpiCard label="Duplicate records" value={d.kpis.duplicateRecords.toLocaleString("en-IN")} unit="records" tone="bad" />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Dimension-wise quality" description="Completeness, timeliness, accuracy and platform uptime">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={dimensions} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} {...axisProps} />
              <YAxis
                type="category"
                dataKey="dimension"
                width={110}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="score" name="Score" radius={[0, 4, 4, 0]}>
                {dimensions.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Quality trend" description="Completeness and timeliness over the year">
          <ResponsiveContainer width="100%" height={310}>
            <LineChart data={d.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="completeness" name="Completeness %" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              <Line dataKey="timeliness" name="Timeliness %" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
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
                <TableHead className="w-[180px]">Completeness</TableHead>
                <TableHead className="text-right">Timeliness</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.sources.map((s) => (
                <TableRow key={s.source}>
                  <TableCell className="font-medium">{s.source}</TableCell>
                  <TableCell className="text-muted-foreground">{s.lastSync}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.completeness} className="h-1.5 w-24" />
                      <span className="text-xs">{s.completeness}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{s.timeliness}%</TableCell>
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
