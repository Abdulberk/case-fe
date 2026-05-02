interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-full)',
        }}
      >
        <svg
          className="h-7 w-7"
          style={{ color: 'var(--color-text-tertiary)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <h3
        className="text-base font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        No characters found
      </h3>
      <p
        className="mt-1.5 max-w-sm text-sm leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'No characters are available at the moment.'}
      </p>

      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-5 px-5 py-2.5 text-sm font-medium transition-all duration-150"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
