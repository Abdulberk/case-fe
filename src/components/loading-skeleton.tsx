'use client';

import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Centered spinner */}
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <Spinner size={44} />
        <p className="text-sm text-muted-foreground">Loading characters…</p>
      </div>

      {/* Skeleton cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border bg-card">
            <div className="flex items-start gap-4 p-5">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
            <div className="border-t px-5 pb-5 pt-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
