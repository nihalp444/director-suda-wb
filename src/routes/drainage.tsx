import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
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
import { drains, ragOf } from "@/lib/suda-data";

export const Route = createFileRoute("/drainage")({
  head: () => ({
    meta: [
      { title: "Drains, Canals & Monsoon Readiness | SUDA Director" },
      {
        name: "description",
        content:
          "Monsoon preparedness for West Bengal urban areas — drain desilting, canal encroachment, pump station status, rainfall and waterlogging hotspot recovery times.",
      },
      { property: "og:title", content: "Drains, Canals & Monsoon Readiness | SUDA" },
      { property: "og:description", content: "District-wise drainage and monsoon readiness monitoring for urban local bodies." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = drains(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Drains, Canals & Monsoon Readiness"
        subtitle="Pre-monsoon preparedness and live monsoon performance — desilting, pumping infrastructure, canal encroachments and waterlogging recovery."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Drain network" value={d.kpis.drainKm.toLocaleString("en-IN")} unit="km" />
        <KpiCard
          label="Desilting completed"
          value={d.kpis.desiltedPct}
          unit="%"
          progress={d.kpis.desiltedPct}
          tone={d.kpis.desiltedPct > 80 ? "good" : "warn"}
          delta={6.2}
        />
        <KpiCard label="Pump stations" value={d.kpis.pumpStations} unit="installed" />
        <KpiCard label="Pumps operational" value={d.kpis.pumpsOperational} unit="%" progress={d.kpis.pumpsOperational} tone="good" />
        <KpiCard label="Waterlogging hotspots" value={d.kpis.waterloggingSpots} unit="locations" tone="bad" delta={-11.4} />
        <KpiCard
          label="Monsoon readiness index"
          value={d.kpis.monsoonReadiness}
          unit="%"
          progress={d.kpis.monsoonReadiness}
          tone={d.kpis.monsoonReadiness > 80 ? "good" : "warn"}
        />
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Rainfall vs waterlogging incidents" description="Monthly rainfall (mm) against reported incidents" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={d.rainfall}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis yAxisId="l" {...axisProps} />
              <YAxis yAxisId="r" orientation="right" {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="l" dataKey="rainfallMm" name="Rainfall (mm)" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="r" dataKey="logIncidents" name="Waterlogging incidents" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Readiness checklist" description="Pre-monsoon activity completion">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={d.readiness}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="item" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Radar dataKey="value" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.35} />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="mb-5 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Activity-wise progress" description="Completion against pre-monsoon action plan">
          <div className="space-y-3.5">
            {d.readiness.map((r) => (
              <div key={r.item}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{r.item}</span>
                  <span className="text-muted-foreground">{r.value}%</span>
                </div>
                <Progress value={r.value} className="mt-1.5 h-2" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Waterlogging hotspots" description="Time taken for water to recede after heavy rain">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Recede time</TableHead>
                  <TableHead>Last cleaned</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.hotspots.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{h.location}</TableCell>
                    <TableCell className="text-right">{h.recedeHours} hrs</TableCell>
                    <TableCell className="text-muted-foreground">{h.lastCleaned}</TableCell>
                    <TableCell className="text-right">
                      <RagBadge status={h.drainageCapacity} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Exception register — drainage & monsoon"
        description={`Overall readiness is rated ${ragOf(d.kpis.monsoonReadiness, 60, 80) === "green" ? "satisfactory" : "insufficient"} for the coming monsoon.`}
      >
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
