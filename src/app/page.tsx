import { Suspense } from 'react';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { CharactersPage } from '@/components/characters-page';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <CharactersPage />
      </Suspense>
    </main>
  );
}
