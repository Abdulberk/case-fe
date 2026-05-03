'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCharacterQuery } from '@/generated/graphql';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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

const statusLabels: Record<string, string> = { ALIVE: 'Alive', DEAD: 'Dead', UNKNOWN: 'Unknown' };
const genderLabels: Record<string, string> = { MALE: 'Male', FEMALE: 'Female', UNKNOWN: 'Unknown' };

interface CharacterDetailProps {
  characterId: string;
  onClose: () => void;
}

export function CharacterDetail({ characterId, onClose }: CharacterDetailProps) {
  const { data, isLoading, isError, error } = useCharacterQuery(
    { id: characterId },
    { enabled: !!characterId },
  );

  const character = data?.character;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-lg"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 p-10">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="p-10 text-center">
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : 'Character not found'}
              </p>
              <Button onClick={onClose} className="mt-4" size="sm">
                Close
              </Button>
            </div>
          )}

          {/* Content */}
          {character && (
            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <motion.div
                  className="relative h-24 w-24 overflow-hidden rounded-full ring-3 ring-border"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                >
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  <div
                    className={cn(
                      'absolute bottom-1 right-1 h-4 w-4 rounded-full ring-[2.5px] ring-card',
                      statusDotStyles[character.status] ?? statusDotStyles.UNKNOWN,
                    )}
                  />
                </motion.div>

                {/* Name */}
                <motion.h2
                  className="mt-5 text-xl font-bold text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  {character.name}
                </motion.h2>

                {/* Badges */}
                <motion.div
                  className="mt-3 flex items-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Badge
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
                  <Badge variant="secondary">
                    {genderLabels[character.gender] ?? 'Unknown'}
                  </Badge>
                </motion.div>

                {/* Description */}
                <motion.p
                  className="mt-5 text-sm leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  {character.description}
                </motion.p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
