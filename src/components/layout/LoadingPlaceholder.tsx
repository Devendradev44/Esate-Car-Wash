"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LoadingPlaceholder({ 
  message = "Loading...",
  className
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
