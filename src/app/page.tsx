import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { CharactersPage } from '@/components/characters-page';

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CharactersPage />
    </Suspense>
  );
}
