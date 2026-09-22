"use client";

import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export function PageHeader({
  title,
  description,
  action,
  onBack,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 text-muted hover:text-ink"
          >
            <ArrowLeft size={14} className="mr-1" />
            {backLabel}
          </Button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm font-light text-body">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
