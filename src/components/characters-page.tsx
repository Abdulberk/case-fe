'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/components/ui/spinner';
import { useCharacters } from '@/hooks/use-characters';
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
      {/* Filter Bar */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
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
      </motion.div>

      {/* Results count bar */}
      <AnimatePresence mode="wait">
        {!isLoading && !isError && totalCount > 0 && (
          <motion.div
            className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            key={`count-${totalCount}`}
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{totalCount}</span>{' '}
              character{totalCount !== 1 ? 's' : ''} found
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence mode="wait">
        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorState
              message={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      <AnimatePresence mode="wait">
        {!isLoading && !isError && characters.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data state */}
      {!isLoading && !isError && characters.length > 0 && (
        <div className="relative">
          {/* Refetch overlay spinner */}
          <AnimatePresence>
            {isFetching && (
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Spinner size={48} />
              </motion.div>
            )}
          </AnimatePresence>

          <CharacterGrid
            characters={characters}
            onCardClick={setSelectedCharacterId}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Pagination
              page={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              onPageChange={setPage}
            />
          </motion.div>
        </div>
      )}

      {/* Character Detail Modal */}
      <AnimatePresence>
        {selectedCharacterId && (
          <CharacterDetail
            characterId={selectedCharacterId}
            onClose={() => setSelectedCharacterId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
