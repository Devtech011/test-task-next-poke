# Pokémon Explorer

A polished React app that explores Pokémon data with great UX, featuring search, filtering, sorting, pagination, and favorites.

## Features

### Must‑Have Requirements
- **Next.js + TypeScript** with App Router and sensible component boundaries
- **List + Detail**: Paginated list and `/pokemon/[id]` detail route
- **Search, Filter, Sort**: Debounced search, type filter, sort by id/name/height/weight/experience
- **Favorites**: Toggle from list and detail; persisted in `localStorage`; favorites-only filter
- **Loading & Errors**: Skeletons/placeholders, clear errors with retry
- **URL as State**: Search/filter/sort/page/favorites reflected in URL and reload-safe
- **Request Cancellation**: Abort in-flight fetches via React Query `signal`

### Nice‑to‑Have
- **Client caching + background refetch** via TanStack Query
- **Optimistic UI** for favorite toggles
- **Theme toggle** (light/dark/system) with persistent preference

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling / UI**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Data**: TanStack Query (React Query)
- **Icons**: lucide-react

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn/pnpm)

### Install & Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

### Production
```bash
npm run build
npm start
```

## Architecture & Design

```
src/
├─ app/                      # Routes and API routes
│  └─ api/pokemon            # Local dataset endpoints: list, detail, types
├─ components/               # UI & feature components
├─ hooks/                    # Data and state hooks
├─ lib/                      # Utilities (API wrapper, helpers)
└─ types/                    # Shared types
```

### State & Data
- **URL source of truth**: `useURLState` syncs `q`, `type`, `sortBy`, `sortOrder`, `page`, `favorites`
- **Queries**: `usePokemonList`, `usePokemon`, `usePokemonTypes` using React Query
- **Cancellation**: Queries receive `AbortSignal` from React Query for abort-on-change
- **Favorites**: `useFavorites` persists a set of IDs to `localStorage`

### API Layer
This project uses local API routes backed by a bundled JSON dataset for reliability and offline‑friendliness:
- `GET /api/pokemon` — server-side pagination, search, type filter, sorting
- `GET /api/pokemon/[id]` — detail record (synthesizes missing ids up to 151)
- `GET /api/pokemon/types` — unique type list

See `src/lib/api.ts` for the client wrapper and `src/app/api/pokemon/*` for handlers.

### UX & Components
- `PokemonList` combines search bar, filters, results grid, and pagination
- `PokemonListItem` renders a compact card with favorite toggle
- `PokemonDetail` shows artwork, types, and key stats with favorite control
- `FilterControls` includes type, sort, order, favorites-only, and reset
- `SearchBar` debounced input (300ms)
- `ErrorDisplay` and skeletons for resilient states
- `ThemeToggle` light/dark/system
- Built with Tailwind CSS and shadcn/ui primitives (`Button`, `Switch`, `Combobox`, `Popover`, `Dialog`, `Command`)

## Trade‑offs & Notes
- **Local dataset over live PokéAPI**: ensures stability, speed, and no rate limits. For realism, endpoints synthesize entries up to 151.
- **Server-side filtering/sorting**: implemented in API routes to keep client light; favorites-only filter remains client-side.
- **Optimistic favorites**: immediate UI response; persistence uses `localStorage` with simple fallback handling.
- **Scroll/Navigation**: URL updates avoid scroll jumps via `{ scroll: false }`.

## What’s Next
- Virtualized grid for 100+ items
- Basic E2E smoke test (Playwright) for one happy path
- Image optimization policy for external artwork
- Code splitting of detail view + skeletons for route transitions
- Notes on detail (small form with validation)

## Submission
- Public repo with clear commits
- This README includes run instructions, architecture, trade‑offs, and next steps
- Optional: Deploy on Vercel

## License
For demonstration and evaluation purposes.

## Testing

### End-to-End (E2E) Tests

This project includes a basic Playwright E2E test to verify the favorites functionality:

- **Favorite Toggle Test**: Ensures that clicking the favorite button on a Pokémon toggles its state between "Add to favorites" and "Remove from favorites" via the `aria-label` attribute.

#### Running Playwright Tests

1. Install Playwright and its browsers:
   ```bash
   npx playwright install
   ```
2. Run the E2E tests:
   ```bash
   npx playwright test
   ```

Test files are located in the `tests/e2e/` directory.
