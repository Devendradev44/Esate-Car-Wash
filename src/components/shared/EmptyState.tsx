"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface-card px-6 py-14 text-center ${className}`}>
      {Icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-dark/10 ring-1 ring-yellow-dark/20">
          <Icon size={28} className="text-yellow-dark" />
        </div>
      )}
      <p className="mb-1.5 text-lg font-bold text-ink">{title}</p>
      {description && (
        <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}