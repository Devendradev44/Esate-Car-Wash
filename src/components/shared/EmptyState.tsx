"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-hairline bg-surface-card rounded-lg">
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-elevated mb-4">
          <Icon size={24} className="text-muted" />
        </div>
      )}
      <p className="text-sm font-light text-muted mb-1">{title}</p>
      {description && (
        <p className="text-xs font-light text-muted mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}