"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  children: ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      {children}
    </div>
  );
}
