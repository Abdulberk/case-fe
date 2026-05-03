'use client';

import { motion } from 'framer-motion';
import { useCharacterStatsQuery } from '@/generated/graphql';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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

const containerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.05,
    },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

export function StatsBar() {
  const { data, isLoading } = useCharacterStatsQuery();

  if (isLoading) {
    return (
      <div className="mb-6 flex flex-wrap gap-3 rounded-lg border bg-card p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const { totalCount, byStatus, byGender } = data.characterStats;

  return (
    <motion.div
      className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border bg-card px-5 py-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total */}
      <motion.div variants={chipVariants}>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 px-3 py-1.5 text-sm font-semibold">
          {totalCount} Total
        </Badge>
      </motion.div>

      <Separator orientation="vertical" className="h-4" />

      {/* Status breakdown */}
      {byStatus.map(({ status, count }) => (
        <motion.div key={status} variants={chipVariants}>
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1.5 font-medium">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                statusDotStyles[status],
              )}
            />
            {count} {statusLabels[status]}
          </Badge>
        </motion.div>
      ))}

      <Separator orientation="vertical" className="h-4" />

      {/* Gender breakdown */}
      {byGender.map(({ gender, count }) => (
        <motion.div key={gender} variants={chipVariants}>
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1.5 font-medium">
            {count} {genderLabels[gender] ?? gender}
          </Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}
