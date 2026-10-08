import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Gauge,
  Wallet,
  Target,
  Trash2,
  HeartPulse,
  Home,
  Waves,
  MessageSquareWarning,
  HardHat,
  IndianRupee,
  DatabaseZap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const NAV_ITEMS = [
  { title: "Urban Operations Cockpit", short: "Cockpit", url: "/", icon: LayoutDashboard },
  { title: "ULB Performance Scorecard", short: "ULB Scorecard", url: "/ulb-performance", icon: Gauge },
  { title: "Fund Utilisation & UC/SOE", short: "Fund & UC", url: "/fund-utilisation", icon: Wallet },
  { title: "Mission Performance", short: "Missions", url: "/mission-performance", icon: Target },
  { title: "Solid-Waste & Sanitation", short: "Solid Waste", url: "/solid-waste", icon: Trash2 },
  { title: "Urban Health & Vector Surveillance", short: "Urban Health", url: "/urban-health", icon: HeartPulse },
  { title: "Banglar Bari & Housing", short: "Housing", url: "/housing", icon: Home },
  { title: "Drains, Canals & Monsoon Readiness", short: "Drainage", url: "/drainage", icon: Waves },
  { title: "Grievance & Incident", short: "Grievance", url: "/grievance", icon: MessageSquareWarning },
  { title: "Projects & Works", short: "Projects", url: "/projects", icon: HardHat },
  { title: "Municipal Revenue", short: "Revenue", url: "/revenue", icon: IndianRupee },
  { title: "Data Quality & Integration", short: "Data Quality", url: "/data-quality", icon: DatabaseZap },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-sm font-bold text-primary-foreground">
            S
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-semibold">SUDA Command Centre</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[11px] text-sidebar-foreground/70">Director, SUDA · W.B.</p>
                <span className="inline-flex items-center gap-1 rounded bg-gold/20 px-1 py-0.2 text-[9px] font-bold text-gold">
                  AI Active
                </span>
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/60">Dashboards</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link
                        to={item.url}
                        className="flex items-center gap-2 text-sidebar-foreground data-[active=true]:bg-sidebar-accent"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate text-[13px]">{item.short}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
