"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 border border-dashed border-m-red/30 bg-m-red/5 rounded-lg ${className}`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-m-red/10 mb-4">
        <AlertTriangle size={24} className="text-m-red" />
      </div>
      <p className="text-sm font-bold text-ink mb-1">{title}</p>
      {message && (
        <p className="text-xs font-light text-muted mb-4 text-center max-w-sm">
          {message}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}