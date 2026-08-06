import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDistrict } from "@/lib/district-context";
import { exceptions, ulbPerformance } from "@/lib/suda-data";

export const Route = createFileRoute("/ulb-performance")({
  head: () => ({
    meta: [
      { title: "ULB Performance Scorecard | SUDA Director Dashboard" },
      {
        name: "description",
        content:
          "Composite ULB performance scorecard across service delivery, finance, grievance redressal, sanitation and digital adoption for every West Bengal district.",
      },
      { property: "og:title", content: "ULB Performance Scorecard | SUDA" },
      { property: "og:description", content: "Rank and compare urban local bodies on a weighted five-pillar score." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  // Charts stay anchored to the state-wide ULB benchmark set so the visual
  // baseline never shifts; only the KPI cards respond to the district filter.
  const rows = ulbPerformance(ALL_DISTRICTS);
  const districtRows = ulbPerformance(district);
  const avg = +(districtRows.reduce((s, r) => s + r.score, 0) / districtRows.length).toFixed(1);
  const green = districtRows.filter((r) => r.status === "green").length;
  const red = districtRows.filter((r) => r.status === "red").length;

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="ULB Performance Scorecard"
        subtitle="Weighted five-pillar ranking of urban local bodies — service delivery, financial management, grievance redressal, sanitation and digital adoption."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="ULBs assessed" value={districtRows.length} unit="bodies" />
        <KpiCard label="Average composite score" value={avg} unit="/100" progress={avg} delta={1.7} />
        <KpiCard label="Performing (green)" value={green} unit="ULBs" tone="good" />
        <KpiCard label="Needing intervention" value={red} unit="ULBs" tone="bad" />
      </div>


      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Composite score by ULB" description="Higher is better; state benchmark is 75">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rows} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="ulb" angle={-35} textAnchor="end" interval={0} height={70} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="score" name="Composite score" radius={[4, 4, 0, 0]}>
                {rows.map((r, i) => (
                  <Cell
                    key={i}
                    fill={
                      r.status === "green"
                        ? "var(--color-success)"
                        : r.status === "amber"
                          ? "var(--color-warning)"
                          : "var(--color-destructive)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Finance vs service delivery" description="Bubble size indicates sanitation score">
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" dataKey="finance" name="Finance" domain={[30, 100]} {...axisProps} />
              <YAxis type="number" dataKey="service" name="Service" domain={[30, 100]} {...axisProps} />
              <ZAxis type="number" dataKey="sanitation" range={[60, 340]} />
              <Tooltip {...tooltipStyle} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={rows} fill="var(--color-chart-1)" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Pillar-wise comparison" description="Five pillars normalised to 100" className="mb-5">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={rows} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="ulb" angle={-35} textAnchor="end" interval={0} height={70} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="service" name="Service" stackId="a" fill="var(--color-chart-1)" />
            <Bar dataKey="finance" name="Finance" stackId="a" fill="var(--color-chart-2)" />
            <Bar dataKey="grievance" name="Grievance" stackId="a" fill="var(--color-chart-3)" />
            <Bar dataKey="sanitation" name="Sanitation" stackId="a" fill="var(--color-chart-4)" />
            <Bar dataKey="digital" name="Digital" stackId="a" fill="var(--color-chart-5)" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Detailed scorecard" description="Sorted by composite rank" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>ULB</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Finance</TableHead>
                <TableHead>Grievance</TableHead>
                <TableHead>Sanitation</TableHead>
                <TableHead>Digital</TableHead>
                <TableHead className="w-[160px]">Composite</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.ulb}>
                  <TableCell className="font-semibold text-primary">#{r.rank}</TableCell>
                  <TableCell className="font-medium">{r.ulb}</TableCell>
                  <TableCell>{r.service}</TableCell>
                  <TableCell>{r.finance}</TableCell>
                  <TableCell>{r.grievance}</TableCell>
                  <TableCell>{r.sanitation}</TableCell>
                  <TableCell>{r.digital}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.score} className="h-1.5 w-24" />
                      <span className="text-xs font-semibold">{r.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard
        title="Exception register"
        description="Every red or amber indicator with issue, location, responsible officer, action taken, deadline and decision required."
      >
        <ExceptionTable rows={exceptions(district, "general", 6)} />
      </SectionCard>
    </div>
  );
}
