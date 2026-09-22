"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 0);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">${item.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
