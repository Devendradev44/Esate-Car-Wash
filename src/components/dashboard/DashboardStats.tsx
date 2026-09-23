"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function DashboardStat({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}: DashboardStatProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md hover:border-border/80", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className={cn(
              trend.isPositive === false ? "text-destructive" : "text-emerald-400",
              trend.isPositive === undefined ? "text-muted-foreground" : ""
            )}>
              {trend.isPositive === false ? "-" : trend.isPositive === true ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
