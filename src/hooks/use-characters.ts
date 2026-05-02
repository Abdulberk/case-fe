'use client';

import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useCharactersQuery } from '@/generated/graphql';
import type {
  CharacterStatus,
  CharacterGender,
  CharacterSortField,
  SortDirection,
  CharactersQueryVariables,
} from '@/generated/graphql';

const ITEMS_PER_PAGE = 12;

const searchParams = {
  q: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  gender: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  sort: parseAsString.withDefault(''),
  dir: parseAsString.withDefault(''),
};

export function useCharacters() {
  const [params, setParams] = useQueryStates(searchParams, {
    shallow: false,
  });

  const { q, status, gender, page, sort, dir } = params;

  // Build GraphQL variables — omit empty filters
  const filter: CharactersQueryVariables['filter'] = {};
  if (q) filter.search = q;
  if (status) filter.status = status as CharacterStatus;
  if (gender) filter.gender = gender as CharacterGender;

  const hasFilter = Object.keys(filter).length > 0;

  const variables: CharactersQueryVariables = {
    filter: hasFilter ? filter : undefined,
    pagination: {
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    },
    sort: {
      field: (sort as CharacterSortField) || 'NAME',
      direction: (dir as SortDirection) || 'ASC',
    },
  };

  const query = useCharactersQuery(variables, {
    placeholderData: (prev) => prev,
  });

  const totalCount = query.data?.characters.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Setters that reset page to 1 on filter change
  const setSearch = (value: string) => {
    setParams({ q: value || null, page: 1 });
  };

  const setStatus = (value: string) => {
    setParams({ status: value || null, page: 1 });
  };

  const setGender = (value: string) => {
    setParams({ gender: value || null, page: 1 });
  };

  const setSort = (field: string) => {
    setParams({ sort: field || null, page: 1 });
  };

  const setDirection = (direction: string) => {
    setParams({ dir: direction || null, page: 1 });
  };

  const setPage = (value: number) => {
    setParams({ page: value });
  };

  return {
    characters: query.data?.characters.items ?? [],
    totalCount,
    totalPages,
    hasNextPage: query.data?.characters.pageInfo.hasNextPage ?? false,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    search: q,
    status,
    gender,
    page,
    sort: sort || 'NAME',
    direction: dir || 'ASC',
    setSearch,
    setStatus,
    setGender,
    setSort,
    setDirection,
    setPage,
    refetch: query.refetch,
  };
}
