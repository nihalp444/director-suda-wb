import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDistrict } from "@/lib/district-context";
import { projects } from "@/lib/suda-data";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Works Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Sector-wise urban infrastructure works across West Bengal — physical and financial progress, delays, executing agencies and cost overruns.",
      },
      { property: "og:title", content: "Projects & Works Dashboard | SUDA" },
      { property: "og:description", content: "Track urban infrastructure works progress and delays district-wise." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = projects(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Projects & Works Dashboard"
        subtitle="Water supply, sewerage, roads, drainage and civic infrastructure works with physical-financial progress and delay analysis."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total works" value={d.kpis.total.toLocaleString("en-IN")} unit="projects" />
        <KpiCard label="Ongoing" value={d.kpis.ongoing.toLocaleString("en-IN")} unit="projects" />
        <KpiCard label="Completed" value={d.kpis.completed.toLocaleString("en-IN")} unit="projects" tone="good" delta={3.4} />
        <KpiCard label="Delayed" value={d.kpis.delayed.toLocaleString("en-IN")} unit="projects" tone="bad" delta={-2.2} />
        <KpiCard label="Portfolio value" value={`₹${d.kpis.valueCr.toLocaleString("en-IN")}`} unit="crore" />
        <KpiCard label="Average delay" value={d.kpis.avgDelayDays} unit="days" tone={d.kpis.avgDelayDays > 90 ? "bad" : "warn"} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Sector-wise progress" description="Physical vs financial progress by sector" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={310}>
            <ComposedChart data={d.sectors} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="sector" angle={-25} textAnchor="end" height={70} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="physical" name="Physical %" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="financial" name="Financial %" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Line dataKey="count" name="No. of works" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Works started vs completed" description="Monthly movement">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={d.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="started" name="Started" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Major works register" description="Physical progress against financial drawdown" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead className="text-right">Cost (₹ cr)</TableHead>
                <TableHead className="w-[170px]">Physical</TableHead>
                <TableHead className="text-right">Financial %</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.list.map((p, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.sector}</TableCell>
                  <TableCell className="text-muted-foreground">{p.agency}</TableCell>
                  <TableCell className="text-right">{p.costCr}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.physical} className="h-1.5 w-24" />
                      <span className="text-xs">{p.physical}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{p.financial}%</TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={p.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — works" description="Delayed and stalled works requiring decision">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
