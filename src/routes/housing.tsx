import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
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
import { housing, ragOf } from "@/lib/suda-data";
import { HousingAiAuditStudio } from "@/components/suda/housing-ai-audit";

export const Route = createFileRoute("/housing")({
  head: () => ({
    meta: [
      { title: "Banglar Bari & Housing Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "PMAY-U and Banglar Bari monitoring — sanctioned, grounded and completed units, instalment releases, geo-tagging and occupancy across West Bengal ULBs.",
      },
      { property: "og:title", content: "Banglar Bari & Housing Dashboard | SUDA" },
      { property: "og:description", content: "Track urban housing sanction-to-occupancy pipeline district-wise." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = housing(district);
  const completionPct = +((d.kpis.completed / Math.max(1, d.kpis.sanctioned)) * 100).toFixed(1);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Banglar Bari & Housing Dashboard"
        subtitle="Sanction-to-occupancy pipeline for PMAY-U and Banglar Bari, with instalment flow, geo-tagging compliance and stalled-unit tracking."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Units sanctioned" value={d.kpis.sanctioned.toLocaleString("en-IN")} unit="houses" />
        <KpiCard
          label="Units grounded"
          value={d.kpis.grounded.toLocaleString("en-IN")}
          unit="houses"
          progress={d.kpis.groundingRate}
          hint={`Grounding rate ${d.kpis.groundingRate}%`}
          delta={2.7}
        />
        <KpiCard
          label="Units completed"
          value={d.kpis.completed.toLocaleString("en-IN")}
          unit="houses"
          progress={completionPct}
          tone={completionPct > 70 ? "good" : "warn"}
          hint={`Completion rate ${d.kpis.completionRate}% of sanctioned`}
        />
        <KpiCard
          label="Units occupied"
          value={d.kpis.occupied.toLocaleString("en-IN")}
          unit="houses"
          tone="good"
          hint={`Occupancy rate ${d.kpis.occupancyRate}%`}
        />
        <KpiCard
          label="Central assistance approved"
          value={`₹${d.kpis.centralApprovedCr.toLocaleString("en-IN")}`}
          unit="crore"
        />
        <KpiCard
          label="Central assistance released"
          value={`₹${d.kpis.centralReleasedCr.toLocaleString("en-IN")}`}
          unit="crore"
          delta={4.1}
          hint={`${((d.kpis.centralReleasedCr / Math.max(1, d.kpis.centralApprovedCr)) * 100).toFixed(1)}% of approved`}
        />
      </div>

      <HousingAiAuditStudio />

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Construction pipeline" description="Units at each stage of construction">
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip {...tooltipStyle} />
              <Funnel dataKey="value" data={d.stages} isAnimationActive>
                {d.stages.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
                <LabelList position="right" dataKey="stage" fill="var(--color-foreground)" fontSize={11} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Vertical-wise sanction" description="BLC, AHP, ISSR and CLSS split">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={d.verticals} dataKey="value" nameKey="name" innerRadius={55} outerRadius={105} paddingAngle={2}>
                {d.verticals.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly completion & instalments" description="Units completed vs instalments disbursed">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={d.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" name="Completed" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Line dataKey="instalments" name="Instalments" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="ULB-wise housing delivery" description="Sanction, completion and geo-tagging compliance" className="mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ULB</TableHead>
                <TableHead className="text-right">Sanctioned</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="w-[180px]">Geo-tagging</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {d.ulbs.map((u) => (
                <TableRow key={u.ulb}>
                  <TableCell className="font-medium">{u.ulb}</TableCell>
                  <TableCell className="text-right">{u.sanctioned.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">{u.completed.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={u.geoTagPct} className="h-1.5 w-24" />
                      <span className="text-xs">{u.geoTagPct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <RagBadge status={ragOf(u.geoTagPct, 70, 90)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — housing" description="Stalled units, delayed instalments and land issues">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
