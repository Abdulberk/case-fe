import Image from 'next/image';
import type { Character } from '@/generated/graphql';

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  ALIVE: {
    dot: 'var(--color-status-alive)',
    bg: 'var(--color-status-alive-bg)',
    text: 'var(--color-status-alive-text)',
    label: 'Alive',
  },
  DEAD: {
    dot: 'var(--color-status-dead)',
    bg: 'var(--color-status-dead-bg)',
    text: 'var(--color-status-dead-text)',
    label: 'Dead',
  },
  UNKNOWN: {
    dot: 'var(--color-status-unknown)',
    bg: 'var(--color-status-unknown-bg)',
    text: 'var(--color-status-unknown-text)',
    label: 'Unknown',
  },
};

const genderLabels: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  UNKNOWN: 'Unknown',
};

interface CharacterCardProps {
  character: Character;
  onClick?: (id: string) => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const status = statusConfig[character.status] ?? statusConfig.UNKNOWN;

  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={() => onClick?.(character.id)}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(character.id);
        }
      }}
      className="group relative flex flex-col overflow-hidden transition-all duration-200"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'var(--color-border-secondary)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Card Header with Avatar */}
      <div className="flex items-start gap-4 p-5">
        <div
          className="relative h-14 w-14 shrink-0 overflow-hidden"
          style={{
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 0 0 2px var(--color-border-primary)',
          }}
        >
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="56px"
          />
          {/* Status indicator dot */}
          <div
            className="absolute bottom-0 right-0 h-3.5 w-3.5"
            style={{
              backgroundColor: status.dot,
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 0 2px var(--color-bg-secondary)',
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-[0.9375rem] font-semibold leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {character.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Status badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: status.bg,
                color: status.text,
                borderRadius: 'var(--radius-full)',
              }}
            >
              <span
                className="h-1.5 w-1.5"
                style={{
                  backgroundColor: status.dot,
                  borderRadius: 'var(--radius-full)',
                }}
              />
              {status.label}
            </span>

            {/* Gender badge */}
            <span
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {genderLabels[character.gender] ?? 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className="flex-1 px-5 pb-5"
        style={{ borderTop: '1px solid var(--color-border-primary)' }}
      >
        <p
          className="mt-3 line-clamp-2 text-[0.8125rem] leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {character.description}
        </p>
      </div>
    </article>
  );
}
