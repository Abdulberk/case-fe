# Characters Explorer — Frontend

A modern, enterprise-grade character browsing application built with **Next.js 16 App Router**, **TypeScript**, and **shadcn/ui**. Connects to a GraphQL backend for full CRUD operations with JWT authentication.

## ✨ Features

- **Character Browsing** — Search, filter by status/gender, sort by name/created date, paginated grid view
- **Character Detail** — Modal with full character information
- **Admin Dashboard** — Full CRUD (Create, Read, Update, Delete) for characters (admin role only)
- **Authentication** — JWT-based login/register with role-based access control (USER / ADMIN)
- **Dark/Light Mode** — Theme toggle with system preference detection and localStorage persistence
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Smooth Animations** — Framer Motion transitions throughout

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Animations | Framer Motion |
| Data Fetching | @tanstack/react-query v5 |
| API | GraphQL (manual types + query hooks) |
| URL State | nuqs (URL query parameter sync) |
| Auth | JWT (localStorage) |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header, footer, providers)
│   ├── page.tsx            # Homepage — character browser
│   ├── login/page.tsx      # Login page with demo credentials
│   ├── register/page.tsx   # Registration page
│   ├── admin/page.tsx      # Admin dashboard (CRUD)
│   ├── globals.css         # Design system CSS variables
│   └── providers.tsx       # QueryClient + NuqsAdapter + Toast
├── components/
│   ├── ui/                 # Atomic UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── separator.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── card.tsx
│   │   ├── spinner.tsx
│   │   └── toast.tsx
│   ├── admin/              # Admin-specific components
│   │   ├── character-form.tsx
│   │   ├── character-table.tsx
│   │   └── delete-dialog.tsx
│   ├── characters-page.tsx # Main character browser orchestrator
│   ├── character-grid.tsx  # Character cards grid
│   ├── character-card.tsx  # Individual character card
│   ├── character-detail.tsx# Character detail modal
│   ├── filter-bar.tsx      # Search + filters + sort
│   ├── pagination.tsx      # Pagination controls
│   ├── stats-bar.tsx       # Character statistics (admin only)
│   ├── loading-skeleton.tsx# Loading state with skeleton cards
│   ├── empty-state.tsx     # No results state
│   ├── error-state.tsx     # Error state with retry
│   ├── auth-buttons.tsx    # Header auth buttons (login/logout)
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   └── footer.tsx          # Footer
├── hooks/
│   ├── use-characters.ts   # Character fetching with URL state
│   └── use-auth.ts         # Auth state management
├── lib/
│   ├── graphql-fetcher.ts  # GraphQL fetch utility with JWT
│   ├── auth-store.ts       # Token/user localStorage management
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
├── generated/
│   └── graphql.ts          # GraphQL types, documents, query hooks
└── graphql/                # .graphql query/mutation files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (GraphQL on port 4000)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd case-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### Environment Variables

```env
# Local development
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Production (Vercel) — set in Vercel dashboard
NEXT_PUBLIC_GRAPHQL_URL=/api/graphql
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## 🔐 Demo Accounts

Available on the login page:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123 |
| User | user@example.com | user1234 |

## 🌐 Deployment (Vercel)

The app is configured for Vercel deployment with a rewrite proxy to the backend API.

### Setup

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_GRAPHQL_URL` = `/api/graphql`
4. Deploy

### How the API Proxy Works

`vercel.json` rewrites `/api/*` requests to the backend server. This solves:
- **Mixed content** (HTTPS frontend → HTTP backend)
- **CORS issues** (same-origin requests)
- **No domain needed** for the backend

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://<backend-ip>:4000/:path*"
    }
  ]
}
```

## 🎨 Design System

The app uses a custom design system with CSS custom properties (HSL format), fully compatible with shadcn/ui. Supports light and dark themes via `data-theme` attribute.

Key design tokens are defined in `src/app/globals.css` including:
- Color palette (background, foreground, primary, secondary, muted, accent, destructive)
- Status colors (alive/dead/unknown) with text, background, and dot variants
- Shadows, border radius, and typography scales

## 📜 License

MIT
