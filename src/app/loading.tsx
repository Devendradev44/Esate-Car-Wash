"use client";
import { ListSkeleton, DashboardCardSkeleton } from "@/components/animations/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg w-10 h-10 animate-pulse" />
            <div className="space-y-1">
              <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-yellow-400 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Dashboard cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>

        {/* Content list skeleton */}
        <ListSkeleton items={5} />
      </div>
    </div>
  );
}