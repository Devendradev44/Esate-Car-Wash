"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

export function PageContainer({
  children,
  className,
  maxWidth = "2xl",
  padding = "md",
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-4 md:p-6 lg:p-8",
    lg: "p-6 md:p-8 lg:p-12",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
