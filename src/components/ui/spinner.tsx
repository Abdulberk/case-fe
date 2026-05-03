'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
  /** CSS color value — supports CSS variables like hsl(var(--primary)) */
  color?: string;
}

/**
 * Pure-CSS clip spinner.
 * Unlike react-spinners' ClipLoader, this works with CSS custom-properties
 * because the color is applied via inline CSS (style attribute), not via JS.
 */
export function Spinner({ size = 36, className, color }: SpinnerProps) {
  const borderWidth = Math.max(2, Math.round(size / 10));

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block rounded-full', className)}
      style={{
        width: size,
        height: size,
        borderWidth,
        borderStyle: 'solid',
        borderColor: color ?? 'hsl(var(--primary))',
        borderBottomColor: 'transparent',
        animation: 'spin 0.75s linear infinite',
      }}
    />
  );
}
