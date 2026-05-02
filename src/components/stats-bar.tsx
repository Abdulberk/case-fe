'use client';

import { useCharacterStatsQuery } from '@/generated/graphql';

const statusConfig: Record<string, { label: string; dot: string }> = {
  ALIVE: { label: 'Alive', dot: 'var(--color-status-alive)' },
  DEAD: { label: 'Dead', dot: 'var(--color-status-dead)' },
  UNKNOWN: { label: 'Unknown', dot: 'var(--color-status-unknown)' },
};

const genderLabels: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  UNKNOWN: 'Unknown',
};

export function StatsBar() {
  const { data, isLoading } = useCharacterStatsQuery();

  if (isLoading) {
    return (
      <div
        className="mb-6 flex flex-wrap gap-3 p-4"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-24" style={{ borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { totalCount, byStatus, byGender } = data.characterStats;

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-3 px-5 py-4"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Total */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold"
        style={{
          backgroundColor: 'var(--color-accent-light)',
          color: 'var(--color-accent)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {totalCount} Total
      </div>

      <div className="h-4 w-px" style={{ backgroundColor: 'var(--color-border-primary)' }} />

      {/* Status breakdown */}
      {byStatus.map(({ status, count }) => {
        const cfg = statusConfig[status];
        return (
          <div
            key={status}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span
              className="h-2 w-2"
              style={{
                backgroundColor: cfg?.dot,
                borderRadius: 'var(--radius-full)',
              }}
            />
            {count} {cfg?.label}
          </div>
        );
      })}

      <div className="h-4 w-px" style={{ backgroundColor: 'var(--color-border-primary)' }} />

      {/* Gender breakdown */}
      {byGender.map(({ gender, count }) => (
        <div
          key={gender}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {count} {genderLabels[gender] ?? gender}
        </div>
      ))}
    </div>
  );
}
