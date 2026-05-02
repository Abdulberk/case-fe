import type { Character } from '@/generated/graphql';
import { CharacterCard } from './character-card';

interface CharacterGridProps {
  characters: Character[];
  onCardClick?: (id: string) => void;
}

export function CharacterGrid({ characters, onCardClick }: CharacterGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
