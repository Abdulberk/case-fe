interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
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
          backgroundColor: 'var(--color-status-dead-bg)',
          borderRadius: 'var(--radius-full)',
        }}
      >
        <svg
          className="h-7 w-7"
          style={{ color: 'var(--color-status-dead)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <h3
        className="text-base font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Something went wrong
      </h3>
      <p
        className="mt-1.5 max-w-md text-sm leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {message || 'An error occurred while fetching characters. Please try again.'}
      </p>

      <button
        onClick={onRetry}
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
        Try again
      </button>
    </div>
  );
}
