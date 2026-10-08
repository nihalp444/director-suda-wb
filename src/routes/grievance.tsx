import { createFileRoute } from "@tanstack/react-router";
import {
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
  SectionCard,
  axisProps,
  tooltipStyle,
} from "@/components/suda/ui-kit";
import { useDistrict } from "@/lib/district-context";
import { grievance } from "@/lib/suda-data";
import { GrievanceAiTriage } from "@/components/suda/grievance-ai-triage";

export const Route = createFileRoute("/grievance")({
  head: () => ({
    meta: [
      { title: "Grievance & Incident Dashboard | SUDA Director" },
      {
        name: "description",
        content:
          "Citizen grievance redressal and incident management for West Bengal urban local bodies — category mix, channel mix, SLA compliance and escalations.",
      },
      { property: "og:title", content: "Grievance & Incident Dashboard | SUDA" },
      { property: "og:description", content: "Monitor grievance volumes, resolution time and SLA compliance district-wise." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = grievance(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Grievance & Incident Dashboard"
        subtitle="Citizen complaints and field incidents across all channels, with resolution timelines, SLA compliance and escalation tracking."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Grievances received" value={d.kpis.received.toLocaleString("en-IN")} unit="YTD" />
        <KpiCard label="Resolved" value={d.kpis.resolved.toLocaleString("en-IN")} unit="cases" tone="good" delta={3.2} />
        <KpiCard label="Pending" value={d.kpis.pending.toLocaleString("en-IN")} unit="cases" tone="bad" delta={-5.6} />
        <KpiCard label="Average resolution time" value={d.kpis.avgResolutionDays} unit="days" tone={d.kpis.avgResolutionDays > 10 ? "warn" : "good"} />
        <KpiCard label="SLA compliance" value={d.kpis.slaCompliance} unit="%" progress={d.kpis.slaCompliance} />
        <KpiCard label="Escalated to Director" value={d.kpis.escalated} unit="cases" tone="bad" />
      </div>

      <GrievanceAiTriage />

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Received vs resolved" description="Monthly grievance flow" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={d.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="received" name="Received" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Channel mix" description="Share of grievances by intake channel">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={d.channels} dataKey="value" nameKey="channel" innerRadius={55} outerRadius={105} paddingAngle={2}>
                {d.channels.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Category-wise grievances" description="Service-wise complaint volume" className="mb-5">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={d.categories} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" {...axisProps} />
            <YAxis type="category" dataKey="category" width={130} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" name="Complaints" radius={[0, 4, 4, 0]}>
              {d.categories.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Incident register" description="Open incidents with responsible officer, deadline and decision required">
        <ExceptionTable rows={d.incidents} />
      </SectionCard>
    </div>
  );
}
