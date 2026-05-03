import Image from 'next/image';
import type { Character } from '@/generated/graphql';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  onClick?: (id: string) => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const statusStyles: Record<string, string> = {
    ALIVE: 'bg-[hsl(var(--status-alive-bg))] text-[hsl(var(--status-alive-text))]',
    DEAD: 'bg-[hsl(var(--status-dead-bg))] text-[hsl(var(--status-dead-text))]',
    UNKNOWN: 'bg-[hsl(var(--status-unknown-bg))] text-[hsl(var(--status-unknown-text))]',
  };

  const statusDotStyles: Record<string, string> = {
    ALIVE: 'bg-[hsl(var(--status-alive))]',
    DEAD: 'bg-[hsl(var(--status-dead))]',
    UNKNOWN: 'bg-[hsl(var(--status-unknown))]',
  };

  const statusLabels: Record<string, string> = {
    ALIVE: 'Alive',
    DEAD: 'Dead',
    UNKNOWN: 'Unknown',
  };

  const genderLabels: Record<string, string> = {
    MALE: 'Male',
    FEMALE: 'Female',
    UNKNOWN: 'Unknown',
  };

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
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-200',
        'hover:shadow-sm hover:border-border/80 hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
      )}
    >
      {/* Card Header with Avatar */}
      <div className="flex items-start gap-4 p-5">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="56px"
          />
          {/* Status indicator dot */}
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-card',
              statusDotStyles[character.status] ?? statusDotStyles.UNKNOWN,
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[0.9375rem] font-semibold leading-tight text-foreground">
            {character.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Status badge */}
            <Badge
              variant="alive"
              className={cn(
                'gap-1.5',
                statusStyles[character.status] ?? statusStyles.UNKNOWN,
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  statusDotStyles[character.status] ?? statusDotStyles.UNKNOWN,
                )}
              />
              {statusLabels[character.status] ?? 'Unknown'}
            </Badge>

            {/* Gender badge */}
            <Badge variant="secondary">
              {genderLabels[character.gender] ?? 'Unknown'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 border-t px-5 pb-5">
        <p className="mt-3 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {character.description}
        </p>
      </div>
    </article>
  );
}
