import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Home, ChevronLeft } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { ExceptionRow, RagStatus } from "@/lib/suda-data";
import { useDistrict } from "@/lib/district-context";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const { district, fy } = useDistrict();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isHome = pathname === "/";

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">{district}</span>
          <span>FY {fy}</span>
          <span>· Last synced 06:00 hrs</span>
        </div>

        {!isHome && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-xs transition-colors hover:border-primary/50 hover:bg-accent hover:text-primary"
          >
            <Home className="h-3.5 w-3.5 text-primary" />
            <span>Back to Cockpit</span>
          </Link>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("card-elevated p-4 md:p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  hint,
  tone = "default",
  progress,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
  progress?: number;
}) {
  const toneRing =
    tone === "good"
      ? "before:bg-success"
      : tone === "warn"
        ? "before:bg-warning"
        : tone === "bad"
          ? "before:bg-destructive"
          : "before:bg-primary";
  return (
    <div
      className={cn(
        "card-elevated relative overflow-hidden p-4 pl-5",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-['']",
        toneRing,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
      </div>
      {typeof delta === "number" && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            delta >= 0 ? "text-success" : "text-destructive",
          )}
        >
          {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta)}% vs last month
        </p>
      )}
      {typeof progress === "number" && <Progress value={progress} className="mt-3 h-1.5" />}
      {hint && <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function RagBadge({ status }: { status: RagStatus | "High" | "Moderate" | "Low" | string }) {
  const map: Record<string, string> = {
    green: "bg-success/12 text-success border-success/30",
    amber: "bg-warning/18 text-warning-foreground border-warning/40",
    red: "bg-destructive/12 text-destructive border-destructive/30",
    High: "bg-destructive/12 text-destructive border-destructive/30",
    Moderate: "bg-warning/18 text-warning-foreground border-warning/40",
    Low: "bg-success/12 text-success border-success/30",
    Critical: "bg-destructive/12 text-destructive border-destructive/30",
    Deficient: "bg-warning/18 text-warning-foreground border-warning/40",
    Adequate: "bg-success/12 text-success border-success/30",
  };
  const label =
    status === "green" ? "On track" : status === "amber" ? "Watch" : status === "red" ? "Action needed" : status;
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] ?? "bg-muted text-muted-foreground")}>
      {label}
    </Badge>
  );
}

export function ExceptionTable({ rows, caption }: { rows: ExceptionRow[]; caption?: string }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[26%]">Issue</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Responsible officer</TableHead>
            <TableHead>Action taken</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Decision required</TableHead>
            <TableHead className="text-right">Flag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium text-foreground">{r.issue}</TableCell>
              <TableCell className="text-muted-foreground">{r.location}</TableCell>
              <TableCell className="text-muted-foreground">{r.officer}</TableCell>
              <TableCell className="text-muted-foreground">{r.action}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{r.deadline}</TableCell>
              <TableCell className="text-muted-foreground">{r.decision}</TableCell>
              <TableCell className="text-right">
                <RagBadge status={r.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {caption && <p className="mt-3 text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

export const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--color-foreground)",
  },
} as const;
