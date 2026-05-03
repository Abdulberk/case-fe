'use client';

import { useRef, useCallback } from 'react';
import { Search, ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  { label: 'All Statuses', value: 'all' },
  { label: 'Alive', value: 'ALIVE' },
  { label: 'Dead', value: 'DEAD' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const GENDER_OPTIONS = [
  { label: 'All Genders', value: 'all' },
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

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            key={search}
            defaultValue={search}
            onChange={handleSearchInput}
            placeholder="Search characters..."
            maxLength={120}
            className="pl-10"
          />
        </div>

        {/* Status Select */}
        <Select
          value={status || 'all'}
          onValueChange={(val) => onStatusChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender Select */}
        <Select
          value={gender || 'all'}
          onValueChange={(val) => onGenderChange(val === 'all' ? '' : val)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            {GENDER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Separator */}
        <Separator orientation="vertical" className="hidden h-8 sm:block" />

        {/* Sort Field Select */}
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sort by Name" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Direction Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDirectionChange(direction === 'ASC' ? 'DESC' : 'ASC')}
          title={direction === 'ASC' ? 'Ascending' : 'Descending'}
          className="h-10 w-10 shrink-0"
        >
          <ArrowDownUp
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              direction === 'DESC' && 'rotate-180',
            )}
          />
        </Button>
      </div>
    </div>
  );
}
