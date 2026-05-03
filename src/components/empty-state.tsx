import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>

      <h3 className="text-base font-semibold text-foreground">No characters found</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : 'No characters are available at the moment.'}
      </p>

      {hasFilters && onClearFilters && (
        <Button onClick={onClearFilters} className="mt-5" size="sm">
          Clear all filters
        </Button>
      )}
    </div>
  );
}
