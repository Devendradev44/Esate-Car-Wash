"use client";

import { Clock, CalendarDays, CreditCard, Users, Car } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  type: "booking" | "payment" | "customer" | "service" | "vehicle";
  action: string;
  user: string;
  timestamp: Date;
  details: string;
  status: "success" | "pending" | "completed";
}

const activityIcons: Record<string, LucideIcon> = {
  booking: CalendarDays,
  payment: CreditCard,
  customer: Users,
  service: Car,
  vehicle: Car,
};

function getStatusColor(status: string): string {
  switch (status) {
    case "success": return "text-green-400 bg-green-400/10";
    case "pending": return "text-yellow-400 bg-yellow-400/10";
    case "completed": return "text-blue-400 bg-blue-400/10";
    default: return "text-muted-foreground bg-muted-bg/10";
  }
}

function getActivityBgColor(type: string): string {
  switch (type) {
    case "booking": return "bg-blue-500/10";
    case "payment": return "bg-green-500/10";
    case "customer": return "bg-purple-500/10";
    case "service": return "bg-orange-500/10";
    case "vehicle": return "bg-cyan-500/10";
    default: return "bg-muted-bg/10";
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  return date.toLocaleDateString();
}

export function ActivityItem({ activity }: { activity: ActivityItem }) {
  const Icon = activityIcons[activity.type] ?? Clock;
  
  return (
    <div className="flex items-start gap-4 py-3.5 transition-colors hover:bg-muted-bg/40 border-b last:border-b-0">
      <div className={`p-2 rounded-full ${getActivityBgColor(activity.type)}`}>
        <Icon size={16} className={getStatusColor(activity.status).split(' ')[0]} />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground truncate">
            {activity.action}
          </p>
          <span className="text-xs text-muted-foreground ml-2">
            {formatTimeAgo(activity.timestamp)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-5 w-5 shrink-0">
            <AvatarFallback className="text-[10px]">
              {activity.user.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">by {activity.user}</span> - {activity.details}
          </p>
        </div>
      </div>
      
      <Badge 
        variant="secondary" 
        className={`text-[10px] ${getStatusColor(activity.status)} border-current`}
      >
        {activity.status}
      </Badge>
    </div>
  );
}

export function ActivityTimeline({ 
  activities, 
  className 
}: { 
  activities: ActivityItem[]; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
