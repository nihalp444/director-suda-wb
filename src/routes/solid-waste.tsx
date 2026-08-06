import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useDistrict } from "@/lib/district-context";
import { ragOf, solidWaste } from "@/lib/suda-data";

export const Route = createFileRoute("/solid-waste")({
  head: () => ({
    meta: [
      { title: "Solid-Waste & Sanitation Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Mission Nirmal Bangla and SBM-U 2.0 monitoring — waste generation, segregation, processing, legacy waste remediation and ODF status across West Bengal ULBs.",
      },
      { property: "og:title", content: "Solid-Waste & Sanitation Dashboard | SUDA" },
      { property: "og:description", content: "District-wise solid waste, segregation, processing and ODF+ tracking." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = solidWaste(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Solid-Waste & Sanitation Dashboard"
        subtitle="Mission Nirmal Bangla and SBM-U 2.0 delivery — collection, segregation, scientific processing, legacy dump remediation and ODF certification."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Waste generated" value={d.kpis.wasteGeneratedTPD.toLocaleString("en-IN")} unit="TPD" />
        <KpiCard
          label="Scientifically processed"
          value={d.kpis.processedPct}
          unit="%"
          progress={d.kpis.processedPct}
          tone={d.kpis.processedPct > 75 ? "good" : "warn"}
          delta={2.8}
        />
        <KpiCard
          label="Source segregation"
          value={d.kpis.segregationPct}
          unit="%"
          progress={d.kpis.segregationPct}
          tone={d.kpis.segregationPct > 75 ? "good" : "bad"}
          delta={-1.1}
        />
        <KpiCard label="Door-to-door collection" value={d.kpis.doorToDoorPct} unit="%" progress={d.kpis.doorToDoorPct} tone="good" />
        <KpiCard label="Sanitation status" value={d.kpis.odfStatus} hint="Swachh Survekshan certification" tone="good" />
        <KpiCard label="Legacy waste remaining" value={d.kpis.legacyWasteRemainingMT.toLocaleString("en-IN")} unit="MT" tone="bad" delta={-8.4} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Waste generated vs processed" description="Tonnes per day, monthly average" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={d.monthly}>
              <defs>
                <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="generated" name="Generated" stroke="var(--color-chart-1)" fill="url(#gG)" strokeWidth={2} />
              <Area type="monotone" dataKey="processed" name="Processed" stroke="var(--color-chart-3)" fill="url(#gP)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Processing mix" description="Share of treated waste by technology">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={d.processing} dataKey="value" nameKey="type" innerRadius={55} outerRadius={105} paddingAngle={2}>
                {d.processing.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="ULB-wise sanitation performance" description="Collection, segregation and processing coverage" className="mb-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={d.ulbs} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="ulb" angle={-30} textAnchor="end" interval={0} height={80} {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="collection" name="Collection %" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="segregation" name="Segregation %" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="processing" name="Processing %" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Swachh Survekshan readiness" description="ULB-wise indicative national rank and coverage" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ULB</TableHead>
                <TableHead className="w-[180px]">Segregation</TableHead>
                <TableHead className="text-right">Collection %</TableHead>
                <TableHead className="text-right">Processing %</TableHead>
                <TableHead className="text-right">Survekshan rank</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.ulbs.map((u) => (
                <TableRow key={u.ulb}>
                  <TableCell className="font-medium">{u.ulb}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={u.segregation} className="h-1.5 w-24" />
                      <span className="text-xs">{u.segregation}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{u.collection}</TableCell>
                  <TableCell className="text-right">{u.processing}</TableCell>
                  <TableCell className="text-right">#{u.swachhRank}</TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={ragOf(u.segregation, 60, 80)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — sanitation" description="Red and amber sanitation indicators awaiting decision">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
