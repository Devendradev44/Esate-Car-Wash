"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BookingData {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  status: "BOOKED" | "COMPLETED" | "CANCELLED";
  amount: number;
}

interface BookingChartProps {
  data: BookingData[];
  className?: string;
}

export function BookingChart({ data, className }: BookingChartProps) {
  const statusCounts = useMemo(() => {
    return data.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
  const statusColors = {
    BOOKED: "bg-blue-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Booking Status Distribution</CardTitle>
        <CardDescription>Current booking status overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                    <span className="font-medium">{status}</span>
                  </div>
                  <span className="text-muted-foreground">{count} bookings</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className={`h-full ${statusColors[status as keyof typeof statusColors]} rounded-full transition-all duration-500 ease-in-out`}
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
