"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function EmptyPlaceholder({ 
  title,
  description,
  icon: Icon,
  action,
  className
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {Icon && (
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
          <Icon size={24} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      {action}
    </div>
  );
}
