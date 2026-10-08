import { Bell, Download, RefreshCw, Search, Home, FileSpreadsheet, FileText } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDistrict } from "@/lib/district-context";
import { ALL_DISTRICTS, DISTRICTS, STATE_SCHEME_FUNDS } from "@/lib/suda-data";
import { downloadGovernmentMemo, downloadCsvSpreadsheet } from "@/lib/export-utils";
import { toast } from "sonner";

export function TopBar() {
  const { district, setDistrict, fy, setFy } = useDistrict();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 md:px-5">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm font-semibold text-foreground">State Urban Development Agency</span>
          <span className="text-xs text-muted-foreground">· Director's Dashboard Suite</span>
        </div>

        {!isHome && (
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 border-border bg-background/80 text-xs font-medium hover:border-primary/50 hover:bg-accent hover:text-primary">
            <Link to="/">
              <Home className="h-3.5 w-3.5 text-primary" />
              <span>Back to Home</span>
            </Link>
          </Button>
        )}

        <div className="relative ml-auto hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ULB, scheme, ward…" className="h-9 w-56 pl-8 text-sm" />
        </div>

        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className="h-9 w-[220px] border-primary/30 bg-background text-sm font-medium">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value={ALL_DISTRICTS}>{ALL_DISTRICTS}</SelectItem>
            {DISTRICTS.map((d) => (
              <SelectItem key={d.name} value={d.name}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={fy} onValueChange={setFy}>
          <SelectTrigger className="h-9 w-[120px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["2026-27", "2025-26", "2024-25"].map((f) => (
              <SelectItem key={f} value={f}>
                FY {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold"></span>
          </span>
          AI Engine Active
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Download className="h-3.5 w-3.5" /> Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card">
            <DropdownMenuItem
              className="cursor-pointer gap-2 py-2"
              onClick={() => {
                downloadGovernmentMemo({
                  title: `Consolidated Urban Operations Review (${district})`,
                  scheme: "Dept. of Urban Development & Municipal Affairs",
                  jurisdiction: district,
                  content: `This document contains the verified executive operational telemetry for ${district} for Financial Year ${fy}. All key performance benchmarks across housing, health, sanitation, water supply, and municipal revenue have been recorded in the central ICCC ledger.`,
                  metadata: {
                    "Jurisdiction": district,
                    "Financial Year": `FY ${fy}`,
                    "Command Unit": "SUDA Director Operations Room",
                    "Audit Classification": "Official State Review"
                  }
                });
                toast.success("Generated Printable Government Memorandum (PDF ready)");
              }}
            >
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold">Government Memo (PDF/HTML)</p>
                <p className="text-[10px] text-muted-foreground">Printable official state dispatch</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer gap-2 py-2"
              onClick={() => {
                downloadCsvSpreadsheet({
                  filename: `SUDA-Mission-Ledger-${district}`,
                  headers: ["Mission / Scheme", "Allocation (₹ Lakh)", "Released (₹ Lakh)", "Utilised (₹ Lakh)", "UC Pending (₹ Lakh)"],
                  rows: STATE_SCHEME_FUNDS.map((s) => [
                    s.scheme,
                    s.allocation,
                    s.released,
                    s.utilised,
                    s.ucPending
                  ])
                });
                toast.success("Downloaded Excel / CSV Mission Ledger");
              }}
            >
              <FileSpreadsheet className="h-4 w-4 text-success" />
              <div>
                <p className="text-xs font-semibold">Excel / CSV Spreadsheet</p>
                <p className="text-[10px] text-muted-foreground">Full scheme data & fund position</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
