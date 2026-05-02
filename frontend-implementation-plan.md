# Frontend Implementation Plan

This backend exposes a single GraphQL endpoint. The frontend should be a
**separate Next.js App Router** application. All filtering, searching, and
pagination **must** be handled server-side via the GraphQL API — no client-side
filtering.

---

## Backend API

- **GraphQL endpoint:** `http://localhost:4000/graphql`
- **Method:** `POST`
- **Health check:** `GET http://localhost:4000/health`
- **Rate limit:** 100 requests per minute per client

---

## GraphQL Schema

### Queries

The backend exposes **3 queries:**

```graphql
type Query {
  character(id: ID!): Character!
  characters(filter: CharactersFilterInput, pagination: PaginationInput, sort: CharacterSortInput): CharacterConnection!
  characterStats: CharacterStats!
}
```

### Input Types

```graphql
input CharactersFilterInput {
  status: CharacterStatus    # optional
  gender: CharacterGender    # optional
  search: String             # optional, max 120 chars, case-insensitive match on name + description
}

input PaginationInput {
  skip: Int = 0    # min 0
  take: Int = 20   # min 1, max 50 (capped server-side)
}

input CharacterSortInput {
  field: CharacterSortField = NAME
  direction: SortDirection = ASC
}
```

### Enums

```graphql
enum CharacterStatus {
  ALIVE
  DEAD
  UNKNOWN
}

enum CharacterGender {
  MALE
  FEMALE
  UNKNOWN
}

enum CharacterSortField {
  NAME
  STATUS
  GENDER
}

enum SortDirection {
  ASC
  DESC
}
```

### Response Types

```graphql
type CharacterConnection {
  items: [Character!]!
  totalCount: Int!
  pageInfo: PageInfo!
}

type Character {
  id: ID!
  image: String!        # Avatar URL (https://i.pravatar.cc/512?u=...)
  name: String!
  status: CharacterStatus!
  gender: CharacterGender!
  description: String!
}

type PageInfo {
  skip: Int!
  take: Int!
  hasNextPage: Boolean!
}

type CharacterStats {
  totalCount: Int!
  byStatus: [StatusCount!]!
  byGender: [GenderCount!]!
}

type StatusCount {
  status: CharacterStatus!
  count: Int!
}

type GenderCount {
  gender: CharacterGender!
  count: Int!
}
```

---

## Required Tech Stack

| Tool | Purpose |
|---|---|
| **Next.js** (App Router) | Framework, routing |
| **GraphQL** | API communication |
| **GraphQL Code Generator** | Generate typed queries, hooks, and TypeScript types from the schema |
| **@tanstack/react-query** | Data fetching, caching, loading/error states |
| **nuqs** | Sync filter/search/page state with URL query parameters |

---

## GraphQL Code Generator Setup

Create `codegen.ts` at the project root:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.graphql', 'src/**/*.ts'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-query',
      ],
      config: {
        reactQueryVersion: 5,
        fetcher: {
          func: '../lib/graphql-fetcher#fetcher',
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
      },
    },
  },
};

export default config;
```

Required dev dependencies:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-query
```

Add script to `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

### GraphQL Fetcher (`src/lib/graphql-fetcher.ts`)

```typescript
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables,
): () => Promise<TData> {
  return async () => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
    }

    return json.data;
  };
}
```

### Query Documents (`src/graphql/`)

**`characters.graphql`** — Character list with filters, pagination, and sorting:

```graphql
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
```

**`character.graphql`** — Single character detail by ID:

```graphql
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
```

**`character-stats.graphql`** — Aggregate statistics for dashboard:

```graphql
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
```

---

## URL State Contract (nuqs)

| URL Param | Maps to | Type | Notes |
|---|---|---|---|
| `q` | `filter.search` | `string` | Free text, debounced ~300ms |
| `status` | `filter.status` | `CharacterStatus` | `ALIVE`, `DEAD`, or `UNKNOWN` |
| `gender` | `filter.gender` | `CharacterGender` | `MALE`, `FEMALE`, or `UNKNOWN` |
| `page` | pagination calculation | `number` | 1-based page number, default `1` |
| `sort` | `sort.field` | `CharacterSortField` | `NAME`, `STATUS`, or `GENDER` |
| `dir` | `sort.direction` | `SortDirection` | `ASC` or `DESC` |

### Pagination Logic

- Use `take = 12` (cards per page).
- Compute `skip = (page - 1) * 12`.
- Compute total pages: `Math.ceil(totalCount / 12)`.
- **Reset `page` to `1`** whenever `q`, `status`, or `gender` changes.

### Building GraphQL Variables from URL

```typescript
// Omit undefined/null values from filter — don't send empty filters
const variables = {
  filter: {
    ...(q ? { search: q } : {}),
    ...(status ? { status } : {}),
    ...(gender ? { gender } : {}),
  },
  pagination: {
    skip: (page - 1) * 12,
    take: 12,
  },
  sort: {
    field: sort || 'NAME',
    direction: dir || 'ASC',
  },
};

// If filter object is empty, omit it entirely or pass undefined
```

---

## UI Requirements

### Layout

- Clean, modern, responsive design.
- Use a **card grid** layout (e.g., CSS Grid or Tailwind grid).
- Suggested: 1 column mobile, 2 columns tablet, 3-4 columns desktop.

### Stats Dashboard (top of page, optional but impressive)

Use `characterStats` query to show a summary bar above filters:
- Total characters count
- Status breakdown (e.g., "10 Alive · 8 Dead · 6 Unknown")
- Gender breakdown
- Can be simple badges, small bar chart, or number cards.

### Character Card

Each card must display:

| Field | Display |
|---|---|
| `image` | Avatar image (square, rounded) |
| `name` | Character name (bold/prominent) |
| `status` | Badge/chip: `Alive` (green), `Dead` (red), `Unknown` (gray) |
| `gender` | Badge/chip or text label |
| `description` | Short text, truncated if needed |

Cards should be **clickable** — navigate to a detail view (or show a modal) using
the `character(id)` query.

### Character Detail View

When a card is clicked, show full character details using:

```graphql
query Character($id: ID!) {
  character(id: $id) { ... }
}
```

Options:
- **Option A:** A modal/dialog overlay (simpler, stays on same page)
- **Option B:** A separate page `/characters/[id]` using Next.js dynamic routes

Handle the **not found** case — the backend returns a GraphQL error with
`"Character with id "..." not found"` if the ID doesn't exist.

### Filter Bar (above the grid)

- **Search input:** Text input for `q`, with debounce (~300ms). Placeholder: "Search characters..."
- **Status dropdown:** Options: `All` (clears filter), `Alive`, `Dead`, `Unknown`
- **Gender dropdown:** Options: `All` (clears filter), `Male`, `Female`, `Unknown`
- **Sort dropdown:** Options: `Name`, `Status`, `Gender` — maps to `CharacterSortField`
- **Sort direction toggle:** ASC/DESC button or icon toggle
- All filter/sort changes update URL via nuqs and trigger React Query refetch.

### Pagination (below the grid)

- Show current page and total pages.
- Previous / Next buttons.
- Disable Previous on page 1, disable Next when `hasNextPage` is false.

### States

| State | UI |
|---|---|
| **Loading** | Skeleton cards or spinner |
| **Empty** | "No characters found" message with suggestion to clear filters |
| **Error** | Error message with retry button |
| **Data** | Card grid with pagination |

---

## Suggested Project Structure

```
case-fe/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with QueryClientProvider
│   │   ├── page.tsx                # Main page (characters list + stats)
│   │   ├── providers.tsx           # React Query provider (client component)
│   │   └── characters/
│   │       └── [id]/
│   │           └── page.tsx        # Character detail page (optional)
│   ├── components/
│   │   ├── character-card.tsx      # Single character card (clickable)
│   │   ├── character-grid.tsx      # Grid of character cards
│   │   ├── character-detail.tsx    # Detail view / modal content
│   │   ├── stats-bar.tsx           # Stats dashboard summary
│   │   ├── filter-bar.tsx          # Search + status/gender dropdowns + sort
│   │   ├── sort-controls.tsx       # Sort field + direction controls
│   │   ├── pagination.tsx          # Page navigation
│   │   ├── empty-state.tsx         # No results message
│   │   ├── error-state.tsx         # Error with retry
│   │   └── loading-skeleton.tsx    # Loading skeleton cards
│   ├── generated/
│   │   └── graphql.ts              # Auto-generated by codegen
│   ├── graphql/
│   │   ├── characters.graphql      # List query
│   │   ├── character.graphql       # Detail query
│   │   └── character-stats.graphql # Stats query
│   ├── hooks/
│   │   ├── use-characters.ts       # Custom hook: list + nuqs
│   │   ├── use-character.ts        # Custom hook: single character by id
│   │   └── use-character-stats.ts  # Custom hook: stats
│   └── lib/
│       └── graphql-fetcher.ts      # Fetch function for codegen
├── codegen.ts
├── .env.local
├── package.json
└── tsconfig.json
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

---

## Data Flow Summary

```
URL params (nuqs) → React Query variables → GraphQL POST → Backend filters/sorts/paginates → Response → UI
     ↑                                                                                                    |
     └──────────────── User interacts with search/filters/sort/pagination ────────────────────────────────┘
```

1. User types in search or selects a filter/sort → nuqs updates URL query params.
2. Component reads params via nuqs hooks → builds GraphQL variables.
3. React Query fetches with those variables (auto-refetch on variable change).
4. Backend applies filters, search, sorting, and pagination server-side.
5. Response renders cards in grid with pagination controls.

---

## Key Rules

1. **No client-side filtering.** All filtering/searching/sorting is done by the backend.
2. **URL is the source of truth** for filter and sort state (nuqs).
3. **Omit empty filters** — don't send `{ status: null }`, just omit the key.
4. **Reset page to 1** when any filter or sort changes.
5. **Debounce search** input to avoid excessive API calls.
6. **Handle all states:** loading, error, empty, and data.
7. **Use `character(id)` query** for detail views — handle 404/not-found errors.
8. **Use `characterStats` query** to show aggregate data (dashboard).
