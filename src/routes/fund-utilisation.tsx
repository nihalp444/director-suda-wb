import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Pie,
  PieChart,
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
import { fundUtilisation, ragOf } from "@/lib/suda-data";

export const Route = createFileRoute("/fund-utilisation")({
  head: () => ({
    meta: [
      { title: "Fund Utilisation & UC/SOE Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Scheme-wise allocation, release, utilisation, pending Utilisation Certificates and Statement of Expenditure tracking across West Bengal urban local bodies.",
      },
      { property: "og:title", content: "Fund Utilisation & UC/SOE Dashboard | SUDA" },
      { property: "og:description", content: "Track allocation, release, utilisation and pending UC/SOE by scheme and district." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = fundUtilisation(district);
  const util = +((d.totals.utilised / Math.max(1, d.totals.released)) * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Fund Utilisation & UC/SOE Dashboard"
        subtitle="Scheme-wise allocation, release and utilisation with ageing of pending Utilisation Certificates and Statements of Expenditure."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total allocation" value={`₹${d.totals.allocation.toLocaleString("en-IN")}`} unit="lakh" />
        <KpiCard label="Released" value={`₹${d.totals.released.toLocaleString("en-IN")}`} unit="lakh" delta={5.4} />
        <KpiCard
          label="Utilisation rate"
          value={util}
          unit="%"
          progress={util}
          tone={ragOf(util, 60, 80) === "green" ? "good" : ragOf(util, 60, 80) === "amber" ? "warn" : "bad"}
        />
        <KpiCard label="UC pending" value={`₹${d.totals.ucPending.toLocaleString("en-IN")}`} unit="lakh" tone="bad" delta={-3.1} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Release vs utilisation by scheme" description="₹ lakh, current financial year" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={330}>
            <ComposedChart data={d.schemes} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="scheme" angle={-30} textAnchor="end" interval={0} height={90} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="released" name="Released" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilised" name="Utilised" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Line dataKey="utilisationPct" name="Utilisation %" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="UC ageing" description="Pending Utilisation Certificates by age (₹ lakh)">
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie data={d.ageing} dataKey="value" nameKey="bucket" innerRadius={60} outerRadius={110} paddingAngle={2}>
                {d.ageing.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Monthly release and utilisation flow" description="₹ lakh" className="mb-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={d.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="released" name="Released" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="utilised" name="Utilised" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Scheme-wise financial statement" description="Allocation, release, utilisation and UC status" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme / mission</TableHead>
                <TableHead className="text-right">Allocation (₹ lakh)</TableHead>
                <TableHead className="text-right">Released</TableHead>
                <TableHead className="text-right">Utilised</TableHead>
                <TableHead className="text-right">UC pending</TableHead>
                <TableHead className="w-[170px]">Utilisation</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.schemes.map((s) => (
                <TableRow key={s.scheme}>
                  <TableCell className="font-medium">{s.scheme}</TableCell>
                  <TableCell className="text-right">{s.allocation.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">{s.released.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">{s.utilised.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right text-destructive">{s.ucPending.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.utilisationPct} className="h-1.5 w-24" />
                      <span className="text-xs font-semibold">{s.utilisationPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={ragOf(s.utilisationPct, 60, 80)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — financial" description="Items requiring the Director's decision">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
