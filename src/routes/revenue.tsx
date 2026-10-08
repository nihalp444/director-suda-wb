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
import { ragOf, revenue } from "@/lib/suda-data";
import { RevenueIntelligencePanel } from "@/components/suda/revenue-intelligence";

export const Route = createFileRoute("/revenue")({
  head: () => ({
    meta: [
      { title: "Municipal Revenue Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Own-source revenue performance of West Bengal urban local bodies — property tax, trade licence, water charges, arrears and collection efficiency.",
      },
      { property: "og:title", content: "Municipal Revenue Dashboard | SUDA" },
      { property: "og:description", content: "Track demand, collection, arrears and digital payment adoption district-wise." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = revenue(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Municipal Revenue Dashboard"
        subtitle="Own-source revenue mobilisation across all heads with collection efficiency, arrears ageing and digital payment adoption."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total demand" value={`₹${d.kpis.demandCr}`} unit="crore" />
        <KpiCard label="Collected" value={`₹${d.kpis.collectedCr}`} unit="crore" delta={5.1} />
        <KpiCard
          label="Collection efficiency"
          value={d.kpis.efficiency}
          unit="%"
          progress={d.kpis.efficiency}
          tone={ragOf(d.kpis.efficiency, 60, 80) === "green" ? "good" : "warn"}
        />
        <KpiCard label="Arrears outstanding" value={`₹${d.kpis.arrearsCr}`} unit="crore" tone="bad" />
        <KpiCard label="Digital payment share" value={d.kpis.onlineSharePct} unit="%" progress={d.kpis.onlineSharePct} delta={7.3} />
        <KpiCard label="New assessments" value={d.kpis.newAssessments.toLocaleString("en-IN")} unit="properties" tone="good" />
      </div>

      <RevenueIntelligencePanel />

      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Head-wise demand vs collection" description="₹ crore, current financial year">
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={d.heads} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="head" angle={-25} textAnchor="end" height={70} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="demand" name="Demand" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Collected" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly collection vs target" description="₹ crore">
          <ResponsiveContainer width="100%" height={310}>
            <ComposedChart data={d.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="collection" name="Collection" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Line dataKey="target" name="Target" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="ULB-wise revenue performance" description="Collection efficiency and own-revenue dependence" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ULB</TableHead>
                <TableHead className="text-right">Demand (₹ cr)</TableHead>
                <TableHead className="text-right">Collected (₹ cr)</TableHead>
                <TableHead className="w-[180px]">Efficiency</TableHead>
                <TableHead className="text-right">Own revenue share</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.ulbs.map((u) => (
                <TableRow key={u.ulb}>
                  <TableCell className="font-medium">{u.ulb}</TableCell>
                  <TableCell className="text-right">{u.demand}</TableCell>
                  <TableCell className="text-right">{u.collected}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={u.efficiency} className="h-1.5 w-24" />
                      <span className="text-xs">{u.efficiency}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{u.ownRevenueShare}%</TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={ragOf(u.efficiency, 60, 80)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — revenue" description="Low collection and arrears issues requiring decision">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
