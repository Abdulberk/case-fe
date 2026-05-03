import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" strokeWidth={1.5} />
      </div>

      <h3 className="text-base font-semibold text-foreground">Something went wrong</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
        {message || 'An error occurred while fetching characters. Please try again.'}
      </p>

      <Button onClick={onRetry} className="mt-5" size="sm">
        Try again
      </Button>
    </div>
  );
}
