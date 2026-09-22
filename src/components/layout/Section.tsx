"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export function Section({
  children,
  className,
  id,
  ariaLabel,
}: SectionProps) {
  return (
    <section 
      className={cn("mb-8", className)}
      id={id}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}
