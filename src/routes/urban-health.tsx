import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDistrict } from "@/lib/district-context";
import { urbanHealth } from "@/lib/suda-data";
import { VectorOutbreakPredictor } from "@/components/suda/vector-outbreak-predictor";

export const Route = createFileRoute("/urban-health")({
  head: () => ({
    meta: [
      { title: "Urban Health & Vector Surveillance | SUDA Director" },
      {
        name: "description",
        content:
          "NUHM, UPHC, CBPHC and NVBDCP monitoring — OPD footfall, dengue and malaria surveillance, larval indices and ward-level hotspots across West Bengal urban areas.",
      },
      { property: "og:title", content: "Urban Health & Vector Surveillance | SUDA" },
      { property: "og:description", content: "Urban health programme coverage and vector-borne disease surveillance by district." },
    ],
  }),
  component: Page,
});

function Page() {
  const { district } = useDistrict();
  const d = urbanHealth(district);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Urban Health & Vector Surveillance"
        subtitle="NUHM, UPHC strengthening, CBPHC and NVBDCP delivery with vector-borne disease surveillance and ward-level hotspot tracking."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Functional UPHCs" value={d.kpis.uphcs} unit="centres" tone="good" />
        <KpiCard label="Monthly OPD footfall" value={d.kpis.opdFootfall.toLocaleString("en-IN")} unit="visits" delta={3.9} />
        <KpiCard label="Dengue cases (YTD)" value={d.kpis.dengueCases.toLocaleString("en-IN")} unit="confirmed" tone="bad" delta={12.5} />
        <KpiCard label="Malaria cases (YTD)" value={d.kpis.malariaCases.toLocaleString("en-IN")} unit="confirmed" tone="warn" delta={-4.2} />
        <KpiCard label="Larval survey coverage" value={d.kpis.larvalSurveyPct} unit="%" progress={d.kpis.larvalSurveyPct} />
        <KpiCard label="Immunisation coverage" value={d.kpis.immunisationPct} unit="%" progress={d.kpis.immunisationPct} tone="good" />
      </div>

      <VectorOutbreakPredictor />

      <div className="mb-5 grid gap-4 xl:grid-cols-3">
        <SectionCard title="Vector-borne disease trend" description="Monthly confirmed cases" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={d.vector}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="dengue" name="Dengue" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="malaria" name="Malaria" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="chikungunya" name="Chikungunya" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Programme coverage" description="NUHM, NVBDCP, CBPHC and UPHC services">
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart data={d.programmes} innerRadius="30%" outerRadius="100%" startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="coverage" background cornerRadius={6} fill="var(--color-chart-1)" />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
            </RadialBarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Ward-level dengue hotspots" description="House index above 5 indicates high transmission risk" className="mb-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={d.hotspots} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="ward" angle={-25} textAnchor="end" height={60} {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="cases" name="Cases" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ward</TableHead>
                  <TableHead>ULB</TableHead>
                  <TableHead className="text-right">Cases</TableHead>
                  <TableHead className="text-right">House index</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {d.hotspots.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{h.ward}</TableCell>
                    <TableCell className="text-muted-foreground">{h.ulb}</TableCell>
                    <TableCell className="text-right">{h.cases}</TableCell>
                    <TableCell className="text-right">{h.houseIndex}</TableCell>
                    <TableCell className="text-right">
                      <RagBadge status={h.risk} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Exception register — urban health" description="Red and amber health indicators with accountable officers">
        <ExceptionTable rows={d.exceptions} />
      </SectionCard>
    </div>
  );
}
