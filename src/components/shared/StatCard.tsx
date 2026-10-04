"use client";

import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-foreground",
  trend,
  className = "",
}: StatCardProps) {
  const isUp = trend && trend.value > 0;
  const isDown = trend && trend.value < 0;

  return (
    <Card className={`h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/25 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        {Icon && <Icon size={16} className={iconColor} />}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="break-words text-2xl font-bold tracking-tight tabular-nums text-foreground">{value}</div>
        <p className="mt-1 flex min-h-[1rem] items-center gap-1 text-xs text-muted-foreground">
          {trend ? (
            <>
              {isUp && <TrendingUp size={12} className="shrink-0 text-emerald-400" />}
              {isDown && <TrendingDown size={12} className="shrink-0 text-destructive" />}
              <span className={isUp ? "text-emerald-400" : isDown ? "text-destructive" : "text-muted-foreground"}>
                {isUp ? "+" : ""}{trend.value}%
              </span>
              <span className="truncate text-muted-foreground">{trend.label}</span>
            </>
          ) : null}
        </p>
      </CardContent>
    </Card>
  );
}