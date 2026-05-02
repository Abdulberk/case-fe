'use client';

import Image from 'next/image';
import { useCharacterQuery } from '@/generated/graphql';

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  ALIVE: { dot: 'var(--color-status-alive)', bg: 'var(--color-status-alive-bg)', text: 'var(--color-status-alive-text)', label: 'Alive' },
  DEAD: { dot: 'var(--color-status-dead)', bg: 'var(--color-status-dead-bg)', text: 'var(--color-status-dead-text)', label: 'Dead' },
  UNKNOWN: { dot: 'var(--color-status-unknown)', bg: 'var(--color-status-unknown-bg)', text: 'var(--color-status-unknown-text)', label: 'Unknown' },
};

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
  const status = character ? (statusConfig[character.status] ?? statusConfig.UNKNOWN) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'var(--color-bg-overlay)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative w-full max-w-lg overflow-hidden"
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--shadow-lg)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 p-10">
              <div className="skeleton h-24 w-24" style={{ borderRadius: 'var(--radius-full)' }} />
              <div className="skeleton h-5 w-40" />
              <div className="skeleton h-4 w-60" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="p-10 text-center">
              <p className="text-sm" style={{ color: 'var(--color-status-dead-text)' }}>
                {error instanceof Error ? error.message : 'Character not found'}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-accent-text)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Content */}
          {character && status && (
            <div className="p-8">
              <div className="flex flex-col items-center text-center">
                <div
                  className="relative h-24 w-24 overflow-hidden"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 0 0 3px var(--color-border-primary)',
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
                    className="absolute bottom-1 right-1 h-4 w-4"
                    style={{
                      backgroundColor: status.dot,
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 0 0 2.5px var(--color-bg-secondary)',
                    }}
                  />
                </div>

                <h2
                  className="mt-5 text-xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {character.name}
                </h2>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: status.bg,
                      color: status.text,
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5"
                      style={{ backgroundColor: status.dot, borderRadius: 'var(--radius-full)' }}
                    />
                    {status.label}
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {genderLabels[character.gender] ?? 'Unknown'}
                  </span>
                </div>

                <p
                  className="mt-5 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {character.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
