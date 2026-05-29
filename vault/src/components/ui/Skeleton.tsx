"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-[--panel] rounded-xl ${className ?? ""}`}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-[--surface] border border-[--border] rounded-xl overflow-hidden">
      <Skeleton className="w-full aspect-[3/4] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
