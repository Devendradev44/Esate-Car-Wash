"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="h-8 w-8 rounded-full border-2 border-yellow-dark border-t-transparent animate-spin mb-3" />
      <p className="text-sm font-light text-muted">{message}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-surface-elevated ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-hairline bg-surface-card">
      <div className="border-b border-hairline bg-surface-soft p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-hairline">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}