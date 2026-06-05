"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`bg-[--panel] animate-pulse ${className ?? ""}`}
      style={{ animationDuration: "1.6s" }}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-[--surface] border border-[--border]">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-3 sm:p-4 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
