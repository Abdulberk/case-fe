'use client';

import { useState } from 'react';
import { useCharacters } from '@/hooks/use-characters';
import { StatsBar } from './stats-bar';
import { FilterBar } from './filter-bar';
import { CharacterGrid } from './character-grid';
import { Pagination } from './pagination';
import { LoadingSkeleton } from './loading-skeleton';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { CharacterDetail } from './character-detail';

export function CharactersPage() {
  const {
    characters,
    totalCount,
    totalPages,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
    search,
    status,
    gender,
    sort,
    direction,
    page,
    setSearch,
    setStatus,
    setGender,
    setSort,
    setDirection,
    setPage,
    refetch,
  } = useCharacters();

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const hasFilters = !!(search || status || gender);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setGender('');
  };

  return (
    <>
      {/* Stats Dashboard */}
      <StatsBar />

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          search={search}
          status={status}
          gender={gender}
          sort={sort}
          direction={direction}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onGenderChange={setGender}
          onSortChange={setSort}
          onDirectionChange={setDirection}
        />
      </div>

      {/* Results count bar */}
      {!isLoading && !isError && totalCount > 0 && (
        <div className="mb-5 flex items-center gap-3">
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
              {totalCount}
            </span>{' '}
            character{totalCount !== 1 ? 's' : ''} found
          </p>

          {/* Fetching indicator */}
          {isFetching && (
            <div
              className="h-4 w-4 animate-spin rounded-full border-2"
              style={{
                borderColor: 'var(--color-border-secondary)',
                borderTopColor: 'var(--color-accent)',
              }}
            />
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Error state */}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      )}

      {/* Empty state */}
      {!isLoading && !isError && characters.length === 0 && (
        <EmptyState
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Data state */}
      {!isLoading && !isError && characters.length > 0 && (
        <>
          <CharacterGrid
            characters={characters}
            onCardClick={setSelectedCharacterId}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Character Detail Modal */}
      {selectedCharacterId && (
        <CharacterDetail
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}
    </>
  );
}
