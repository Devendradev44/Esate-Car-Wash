"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  };
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
  badge,
  className,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {Icon && <span className="text-foreground"><Icon size={20} /></span>}
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {badge && (
          <span className="ml-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.variant === "default"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : badge.variant === "secondary"
                  ? "bg-secondary/10 text-secondary-foreground border-secondary/20"
                  : badge.variant === "destructive"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : badge.variant === "outline"
                  ? "border border-border"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {badge.label}
            </span>
          </span>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
