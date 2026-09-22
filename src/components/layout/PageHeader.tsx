"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  backAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

function BackButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon?: LucideIcon }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
      {Icon && <Icon size={14} className="mr-1" />}
      {label}
    </Button>
  );
}

export function PageHeader({ title, description, action, backAction, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
      <div>
        {backAction && <BackButton {...backAction} />}
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-normal text-foreground">{title}</h1>
        {description && <p className="mt-2 text-sm font-light text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
