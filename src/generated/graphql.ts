import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from '../lib/graphql-fetcher';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

// ─── Enums ───────────────────────────────────────────────

export enum CharacterStatus {
  Alive = 'ALIVE',
  Dead = 'DEAD',
  Unknown = 'UNKNOWN',
}

export enum CharacterGender {
  Female = 'FEMALE',
  Male = 'MALE',
  Unknown = 'UNKNOWN',
}

export enum CharacterSortField {
  Name = 'NAME',
  Status = 'STATUS',
  Gender = 'GENDER',
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

// ─── Input Types ─────────────────────────────────────────

export type CharactersFilterInput = {
  gender?: InputMaybe<CharacterGender>;
  search?: InputMaybe<string>;
  status?: InputMaybe<CharacterStatus>;
};

export type PaginationInput = {
  skip?: number;
  take?: number;
};

export type CharacterSortInput = {
  field?: InputMaybe<CharacterSortField>;
  direction?: InputMaybe<SortDirection>;
};

// ─── Response Types ──────────────────────────────────────

export type Character = {
  id: string;
  image: string;
  name: string;
  status: CharacterStatus;
  gender: CharacterGender;
  description: string;
};

// ─── Characters Query ────────────────────────────────────

export type CharactersQueryVariables = Exact<{
  filter?: InputMaybe<CharactersFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<CharacterSortInput>;
}>;

export type CharactersQuery = {
  characters: {
    totalCount: number;
    items: Array<Character>;
    pageInfo: {
      skip: number;
      take: number;
      hasNextPage: boolean;
    };
  };
};

export const CharactersDocument = `
  query Characters($filter: CharactersFilterInput, $pagination: PaginationInput, $sort: CharacterSortInput) {
    characters(filter: $filter, pagination: $pagination, sort: $sort) {
      items {
        id
        image
        name
        status
        gender
        description
      }
      totalCount
      pageInfo {
        skip
        take
        hasNextPage
      }
    }
  }
`;

export const useCharactersQuery = <
  TData = CharactersQuery,
  TError = unknown,
>(
  variables?: CharactersQueryVariables,
  options?: Omit<
    UseQueryOptions<CharactersQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<CharactersQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<CharactersQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['Characters']
        : ['Characters', variables],
    queryFn: fetcher<CharactersQuery, CharactersQueryVariables>(
      CharactersDocument,
      variables,
    ),
    ...options,
  });
};

useCharactersQuery.getKey = (variables?: CharactersQueryVariables) =>
  variables === undefined ? ['Characters'] : ['Characters', variables];

// ─── Character (Single) Query ────────────────────────────

export type CharacterQueryVariables = Exact<{
  id: string;
}>;

export type CharacterQuery = {
  character: Character;
};

export const CharacterDocument = `
  query Character($id: ID!) {
    character(id: $id) {
      id
      image
      name
      status
      gender
      description
    }
  }
`;

export const useCharacterQuery = <
  TData = CharacterQuery,
  TError = unknown,
>(
  variables: CharacterQueryVariables,
  options?: Omit<
    UseQueryOptions<CharacterQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<CharacterQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<CharacterQuery, TError, TData>({
    queryKey: ['Character', variables],
    queryFn: fetcher<CharacterQuery, CharacterQueryVariables>(
      CharacterDocument,
      variables,
    ),
    ...options,
  });
};

useCharacterQuery.getKey = (variables: CharacterQueryVariables) => [
  'Character',
  variables,
];

// ─── Character Stats Query ───────────────────────────────

export type CharacterStatsQuery = {
  characterStats: {
    totalCount: number;
    byStatus: Array<{
      status: CharacterStatus;
      count: number;
    }>;
    byGender: Array<{
      gender: CharacterGender;
      count: number;
    }>;
  };
};

export const CharacterStatsDocument = `
  query CharacterStats {
    characterStats {
      totalCount
      byStatus {
        status
        count
      }
      byGender {
        gender
        count
      }
    }
  }
`;

export const useCharacterStatsQuery = <
  TData = CharacterStatsQuery,
  TError = unknown,
>(
  options?: Omit<
    UseQueryOptions<CharacterStatsQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<CharacterStatsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<CharacterStatsQuery, TError, TData>({
    queryKey: ['CharacterStats'],
    queryFn: fetcher<CharacterStatsQuery, Record<string, never>>(
      CharacterStatsDocument,
    ),
    ...options,
  });
};

useCharacterStatsQuery.getKey = () => ['CharacterStats'];
