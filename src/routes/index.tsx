import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Building2, Users, MapPin } from "lucide-react";
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
import { NAV_ITEMS } from "@/components/suda/app-sidebar";
import { useDistrict } from "@/lib/district-context";
import { cockpit, ragOf, ulbPerformance } from "@/lib/suda-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urban Operations Cockpit | SUDA Director Dashboard" },
      {
        name: "description",
        content:
          "Single-screen urban operations cockpit for the Director, SUDA — district-wise mission progress, fund utilisation, incidents and red/amber exceptions.",
      },
      { property: "og:title", content: "Urban Operations Cockpit | SUDA Director Dashboard" },
      {
        property: "og:description",
        content: "District-wise urban operations cockpit for the Director, State Urban Development Agency, West Bengal.",
      },
    ],
  }),
  component: Cockpit,
});

function Cockpit() {
  const { district } = useDistrict();
  const d = cockpit(district);
  const scorecard = ulbPerformance(district).slice(0, 6);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Urban Operations Cockpit"
        subtitle="Consolidated state-and-district view of every SUDA mission, fund stream, service and incident, with red/amber exceptions surfaced for the Director's decision."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-elevated flex items-center gap-3 p-4">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[11px] uppercase text-muted-foreground">Jurisdiction</p>
            <p className="text-sm font-semibold">{d.profile.name}</p>
          </div>
        </div>
        <div className="card-elevated flex items-center gap-3 p-4">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[11px] uppercase text-muted-foreground">ULBs / Corporations</p>
            <p className="text-sm font-semibold">
              {d.profile.ulbs} / {d.profile.municipalCorporations}
            </p>
          </div>
        </div>
        <div className="card-elevated flex items-center gap-3 p-4">
          <Users className="h-5 w-5 text-primary" />
          <div>
            <p className="text-[11px] uppercase text-muted-foreground">Urban population</p>
            <p className="text-sm font-semibold">{d.profile.urbanPopLakh} lakh</p>
          </div>
        </div>
        <div className="card-elevated flex items-center gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-[11px] uppercase text-muted-foreground">Open red/amber items</p>
            <p className="text-sm font-semibold">{d.alerts.length} requiring decision</p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Fund utilisation"
          value={d.kpis.fundUtilisation}
          unit="%"
          progress={d.kpis.fundUtilisation}
          tone={ragOf(d.kpis.fundUtilisation, 60, 80) === "green" ? "good" : ragOf(d.kpis.fundUtilisation, 60, 80) === "amber" ? "warn" : "bad"}
          delta={4.2}
        />
        <KpiCard
          label="Grievance redressal"
          value={d.kpis.grievanceRedressal}
          unit="%"
          progress={d.kpis.grievanceRedressal}
          tone="good"
          delta={2.1}
        />
        <KpiCard
          label="Source segregation"
          value={d.kpis.swmSegregation}
          unit="%"
          progress={d.kpis.swmSegregation}
          tone={d.kpis.swmSegregation > 75 ? "good" : "warn"}
          delta={-1.4}
        />
        <KpiCard
          label="Housing completion"
          value={d.kpis.housingCompletion}
          unit="%"
          progress={d.kpis.housingCompletion}
          tone={d.kpis.housingCompletion > 70 ? "good" : "warn"}
          delta={3.6}
        />
        <KpiCard label="Revenue collection efficiency" value={d.kpis.revenueCollection} unit="%" progress={d.kpis.revenueCollection} delta={1.8} />
        <KpiCard label="Projects on track" value={d.kpis.projectsOnTrack} unit="%" progress={d.kpis.projectsOnTrack} tone="good" delta={0.9} />
        <KpiCard label="Active incidents" value={d.kpis.activeIncidents} unit="open" tone="bad" delta={-6.3} hint="Water, drainage, sanitation & health" />
        <KpiCard label="Data completeness" value={d.kpis.dataCompleteness} unit="%" progress={d.kpis.dataCompleteness} tone="good" delta={1.2} />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Utilisation & grievance trend" description="Monthly movement across the financial year" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={d.trend}>
              <defs>
                <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="utilisation" name="Fund utilisation %" stroke="var(--color-chart-1)" fill="url(#gU)" strokeWidth={2} />
              <Line type="monotone" dataKey="grievances" name="Grievances received" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Mission-wise progress" description="Physical progress against annual plan">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={d.missionMix.map((m) => ({ ...m, short: m.mission.split(" ")[0] }))}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="short" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Radar dataKey="progress" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.35} />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Scheme-wise expenditure" description="₹ lakh released this financial year">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.missionMix} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" {...axisProps} />
              <YAxis type="category" dataKey="mission" width={130} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="spend" name="₹ lakh" radius={[0, 4, 4, 0]}>
                {d.missionMix.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Revenue momentum" description="Own-source revenue collected (₹ lakh)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={d.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="revenue" name="Collection" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top ULBs by composite score" description="Weighted service, finance, sanitation & digital score">
          <div className="space-y-3">
            {scorecard.map((r) => (
              <div key={r.ulb} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.ulb}</p>
                  <p className="text-[11px] text-muted-foreground">Rank #{r.rank}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{r.score}</span>
                  <RagBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Exception register — items awaiting the Director's decision"
        description="Every red or amber indicator shows the issue, location, responsible officer, action taken, resolution deadline and decision required."
        className="mb-5"
      >
        <ExceptionTable rows={d.alerts} />
      </SectionCard>

      <SectionCard title="Dashboard directory" description="Jump to any thematic dashboard; district selection carries across">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {NAV_ITEMS.filter((n) => n.url !== "/").map((n) => (
            <Link
              key={n.url}
              to={n.url}
              className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <n.icon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{n.title}</span>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
