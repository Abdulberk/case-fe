import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
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

// ─── Auth Types ──────────────────────────────────────────

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

// ─── Auth Mutation Documents ─────────────────────────────

export const RegisterDocument = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const LoginDocument = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export const MeDocument = `
  query Me {
    me {
      id
      email
      name
      role
      createdAt
      updatedAt
    }
  }
`;

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

// ─── Admin Mutation Input Types ──────────────────────────

export type CreateCharacterInput = {
  name: string;
  image: string;
  status?: InputMaybe<CharacterStatus>;
  gender?: InputMaybe<CharacterGender>;
  description: string;
};

export type UpdateCharacterInput = {
  name?: InputMaybe<string>;
  image?: InputMaybe<string>;
  status?: InputMaybe<CharacterStatus>;
  gender?: InputMaybe<CharacterGender>;
  description?: InputMaybe<string>;
};

export type DeleteResult = {
  id: string;
  success: boolean;
};

// ─── Create Character Mutation ───────────────────────────

export type CreateCharacterMutationVariables = Exact<{
  input: CreateCharacterInput;
}>;

export type CreateCharacterMutation = {
  createCharacter: Character;
};

export const CreateCharacterDocument = `
  mutation CreateCharacter($input: CreateCharacterInput!) {
    createCharacter(input: $input) {
      id
      image
      name
      status
      gender
      description
    }
  }
`;

export const useCreateCharacterMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CreateCharacterMutation,
    TError,
    CreateCharacterMutationVariables,
    TContext
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    CreateCharacterMutation,
    TError,
    CreateCharacterMutationVariables,
    TContext
  >({
    mutationFn: (variables) =>
      fetcher<CreateCharacterMutation, CreateCharacterMutationVariables>(
        CreateCharacterDocument,
        variables,
      )(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Characters'] });
      queryClient.invalidateQueries({ queryKey: ['CharacterStats'] });
    },
    ...options,
  });
};

// ─── Update Character Mutation ───────────────────────────

export type UpdateCharacterMutationVariables = Exact<{
  id: string;
  input: UpdateCharacterInput;
}>;

export type UpdateCharacterMutation = {
  updateCharacter: Character;
};

export const UpdateCharacterDocument = `
  mutation UpdateCharacter($id: ID!, $input: UpdateCharacterInput!) {
    updateCharacter(id: $id, input: $input) {
      id
      image
      name
      status
      gender
      description
    }
  }
`;

export const useUpdateCharacterMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    UpdateCharacterMutation,
    TError,
    UpdateCharacterMutationVariables,
    TContext
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateCharacterMutation,
    TError,
    UpdateCharacterMutationVariables,
    TContext
  >({
    mutationFn: (variables) =>
      fetcher<UpdateCharacterMutation, UpdateCharacterMutationVariables>(
        UpdateCharacterDocument,
        variables,
      )(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Characters'] });
      queryClient.invalidateQueries({ queryKey: ['CharacterStats'] });
      queryClient.invalidateQueries({ queryKey: ['Character'] });
    },
    ...options,
  });
};

// ─── Delete Character Mutation ───────────────────────────

export type DeleteCharacterMutationVariables = Exact<{
  id: string;
}>;

export type DeleteCharacterMutation = {
  deleteCharacter: DeleteResult;
};

export const DeleteCharacterDocument = `
  mutation DeleteCharacter($id: ID!) {
    deleteCharacter(id: $id) {
      id
      success
    }
  }
`;

export const useDeleteCharacterMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteCharacterMutation,
    TError,
    DeleteCharacterMutationVariables,
    TContext
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    DeleteCharacterMutation,
    TError,
    DeleteCharacterMutationVariables,
    TContext
  >({
    mutationFn: (variables) =>
      fetcher<DeleteCharacterMutation, DeleteCharacterMutationVariables>(
        DeleteCharacterDocument,
        variables,
      )(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Characters'] });
      queryClient.invalidateQueries({ queryKey: ['CharacterStats'] });
    },
    ...options,
  });
};
