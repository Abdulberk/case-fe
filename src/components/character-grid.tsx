'use client';

import { motion } from 'framer-motion';
import type { Character } from '@/generated/graphql';
import { CharacterCard } from './character-card';

interface CharacterGridProps {
  characters: Character[];
  onCardClick?: (id: string) => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

export function CharacterGrid({ characters, onCardClick }: CharacterGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={characters.map((c) => c.id).join(',')}
    >
      {characters.map((character) => (
        <motion.div key={character.id} variants={cardVariants} layout>
          <CharacterCard character={character} onClick={onCardClick} />
        </motion.div>
      ))}
    </motion.div>
  );
}
