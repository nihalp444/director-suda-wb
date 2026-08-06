import { Bell, Download, RefreshCw, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDistrict } from "@/lib/district-context";
import { ALL_DISTRICTS, DISTRICTS } from "@/lib/suda-data";

export function TopBar() {
  const { district, setDistrict, fy, setFy } = useDistrict();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 md:px-5">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm font-semibold text-foreground">State Urban Development Agency</span>
          <span className="text-xs text-muted-foreground">· Director's Dashboard Suite</span>
        </div>

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

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <Button size="sm" className="h-9 gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>
    </header>
  );
}
