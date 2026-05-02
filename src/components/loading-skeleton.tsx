export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div className="flex items-start gap-4 p-5">
            {/* Avatar skeleton */}
            <div className="skeleton h-14 w-14 shrink-0" style={{ borderRadius: 'var(--radius-full)' }} />
            <div className="flex-1 space-y-3 pt-1">
              {/* Name skeleton */}
              <div className="skeleton h-4 w-3/4" />
              {/* Badges skeleton */}
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16" style={{ borderRadius: 'var(--radius-full)' }} />
                <div className="skeleton h-6 w-14" style={{ borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border-primary)' }} className="px-5 pb-5 pt-3">
            <div className="space-y-2">
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
