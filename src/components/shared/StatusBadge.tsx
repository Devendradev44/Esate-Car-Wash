"use client";

import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  icon?: LucideIcon;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  DISABLED: { label: "Disabled", className: "bg-muted-bg text-muted-foreground border-border" },
  HIDDEN: { label: "Hidden", className: "bg-muted-bg text-muted-foreground border-border" },
  BOOKED: { label: "Booked", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/15 text-destructive border-destructive/30" },
  PAID: { label: "Paid", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  PENDING: { label: "Pending", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  REFUNDED: { label: "Refunded", className: "bg-muted-bg text-muted-foreground border-border" },
  SUPER_ADMIN: { label: "Super Admin", className: "bg-primary/15 text-primary border-primary/30" },
  STAFF: { label: "Staff", className: "bg-muted-bg text-foreground border-border" },
  ADMIN: { label: "Admin", className: "bg-muted-bg text-foreground border-border" },
  CUSTOMER: { label: "Customer", className: "bg-muted-bg text-foreground border-border" },
};

export function StatusBadge({ status, icon: Icon }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-muted-bg text-foreground border-border" };
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wide border ${config.className}`}>
      {Icon && <Icon size={10} />}
      {config.label}
    </Badge>
  );
}