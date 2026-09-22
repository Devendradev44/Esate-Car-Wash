"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  children: ReactNode;
  className?: string;
  position?: "left" | "right" | "center";
}

export function ActionBar({ 
  children, 
  className,
  position = "right"
}: ActionBarProps) {
  const positionClasses = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
  };

  return (
    <div className={cn("flex gap-2", positionClasses[position], className)}>
      {children}
    </div>
  );
}
