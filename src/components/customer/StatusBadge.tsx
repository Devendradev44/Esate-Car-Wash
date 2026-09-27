"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function statusColor(status: string): string {
  const s = (status || "").toUpperCase();
  if (s === "BOOKED" || s === "COMPLETED" || s === "PAID") return "bg-success/20 text-success";
  if (s === "CANCELLED" || s === "REFUNDED") return "bg-m-red/20 text-m-red";
  return "bg-surface-elevated text-muted";
}

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  return (
    <Badge className={cn("h-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", statusColor(status), className)}>
      {status}
    </Badge>
  );
}