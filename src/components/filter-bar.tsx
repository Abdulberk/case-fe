'use client';

import { useRef, useCallback } from 'react';

interface FilterBarProps {
  search: string;
  status: string;
  gender: string;
  sort: string;
  direction: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Alive', value: 'ALIVE' },
  { label: 'Dead', value: 'DEAD' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const GENDER_OPTIONS = [
  { label: 'All Genders', value: '' },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const SORT_OPTIONS = [
  { label: 'Sort by Name', value: 'NAME' },
  { label: 'Sort by Status', value: 'STATUS' },
  { label: 'Sort by Gender', value: 'GENDER' },
];

export function FilterBar({
  search,
  status,
  gender,
  sort,
  direction,
  onSearchChange,
  onStatusChange,
  onGenderChange,
  onSortChange,
  onDirectionChange,
}: FilterBarProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearchChange(value), 300);
    },
    [onSearchChange],
  );

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border-primary)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '36px',
  };

  return (
    <div
      className="p-4 sm:p-5"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--color-text-tertiary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            key={search}
            defaultValue={search}
            onChange={handleSearchInput}
            placeholder="Search characters..."
            maxLength={120}
            className="w-full py-2.5 pl-10 pr-4 text-sm transition-colors duration-150 placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
            style={{
              ...inputStyle,
              boxShadow: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-focus)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Status Select */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="py-2.5 pl-3 text-sm transition-colors duration-150 focus:outline-none"
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Gender Select */}
        <select
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          className="py-2.5 pl-3 text-sm transition-colors duration-150 focus:outline-none"
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Separator */}
        <div
          className="hidden h-8 w-px sm:block"
          style={{ backgroundColor: 'var(--color-border-primary)' }}
        />

        {/* Sort Field Select */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="py-2.5 pl-3 text-sm transition-colors duration-150 focus:outline-none"
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort Direction Toggle */}
        <button
          type="button"
          onClick={() => onDirectionChange(direction === 'ASC' ? 'DESC' : 'ASC')}
          title={direction === 'ASC' ? 'Ascending' : 'Descending'}
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center transition-colors duration-150"
          style={{
            ...inputStyle,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--color-text-secondary)',
              transform: direction === 'DESC' ? 'rotate(180deg)' : 'none',
              transition: 'transform 200ms ease',
            }}
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
