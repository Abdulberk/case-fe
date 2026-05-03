'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Character } from '@/generated/graphql';

interface CharacterTableProps {
  characters: Character[];
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

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

export function CharacterTable({ characters, onEdit, onDelete }: CharacterTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[auto_1fr_auto_auto_1fr_auto] items-center gap-4 border-b px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Avatar</span>
          <span>Name</span>
          <span>Status</span>
          <span>Gender</span>
          <span>Description</span>
          <span className="text-right">Actions</span>
        </div>

        {characters.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={cn(
              'grid grid-cols-[auto_1fr_auto_auto_1fr_auto] items-center gap-4 px-5 py-3.5',
              index < characters.length - 1 && 'border-b',
              'hover:bg-muted/50 transition-colors',
            )}
          >
            {/* Avatar */}
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src={char.image}
                alt={char.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>

            {/* Name */}
            <span className="truncate text-sm font-medium text-foreground">
              {char.name}
            </span>

            {/* Status */}
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5',
                statusStyles[char.status] ?? statusStyles.UNKNOWN,
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  statusDotStyles[char.status] ?? statusDotStyles.UNKNOWN,
                )}
              />
              {statusLabels[char.status] ?? 'Unknown'}
            </Badge>

            {/* Gender */}
            <Badge variant="secondary">
              {genderLabels[char.gender] ?? 'Unknown'}
            </Badge>

            {/* Description */}
            <p className="truncate text-xs text-muted-foreground">
              {char.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(char)}
                className="h-8 w-8"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(char)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="space-y-0 md:hidden">
        {characters.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={cn(
              'flex items-start gap-3 p-4',
              index < characters.length - 1 && 'border-b',
            )}
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
              <Image
                src={char.image}
                alt={char.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-medium text-foreground">
                  {char.name}
                </h4>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(char)}
                    className="h-7 w-7"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(char)}
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={cn(
                    'gap-1 text-[0.6875rem]',
                    statusStyles[char.status] ?? statusStyles.UNKNOWN,
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      statusDotStyles[char.status] ?? statusDotStyles.UNKNOWN,
                    )}
                  />
                  {statusLabels[char.status] ?? 'Unknown'}
                </Badge>
                <Badge variant="secondary" className="text-[0.6875rem]">
                  {genderLabels[char.gender] ?? 'Unknown'}
                </Badge>
              </div>

              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                {char.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No characters found. Create one to get started.
        </div>
      )}
    </div>
  );
}
