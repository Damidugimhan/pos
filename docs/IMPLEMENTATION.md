# 1) System Architecture Explanation

The application uses a **React + TypeScript strict** frontend with feature modules and a **Supabase backend** for auth, PostgreSQL storage, realtime channels, and RLS. The app applies route guards by role, Zustand for app/session/POS state, React Hook Form + Zod for strongly validated inputs, and service-layer data access with explicit error handling and toast feedback.

High-level flow:
1. User authenticates with Supabase Auth.
2. Frontend loads `public.users` profile/role.
3. Protected routes and role-aware UI render module screens.
4. POS places orders through `place_order_with_inventory_check` RPC.
5. RPC validates stock, inserts order + items, deducts inventory, writes logs, and updates table state.
6. Kitchen Display reads `get_kitchen_orders` and subscribes to realtime order changes.
7. Reports query aggregate RPCs and export CSV.

# 2) Database SQL (complete)
Use `supabase/schema.sql`.

# 3) RLS Policies (complete)
Use `supabase/rls.sql`.

# 4) Folder Structure

```text
src/
  components/
  constants/
  hooks/
  layouts/
  lib/
  pages/
  schemas/
  services/
  store/
  types/
  utils/
```

# 5) Source Code (organized by file)
Core files:
- `src/lib/supabase.ts`: typed Supabase client.
- `src/services/authService.ts`: login/logout/profile fetch.
- `src/services/posService.ts`: order placement and payment recording.
- `src/store/*.ts`: auth, UI, and POS state.
- `src/pages/*.tsx`: module screens (tables, POS, kitchen, inventory, reports, shifts, profile).
- `src/components/ProtectedRoute.tsx` + `ErrorBoundary.tsx`.
- `vite.config.ts`: PWA + offline fallback.

# 6) .env setup guide
Set these in local `.env` and Vercel project settings:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

Get values from Supabase Dashboard → Project Settings → API.
Never commit real keys; only commit `.env.example`.

# 7) Supabase setup guide
1. Create Supabase project (free tier).
2. Run `supabase/schema.sql` in SQL editor.
3. Run `supabase/rls.sql` in SQL editor.
4. Enable Realtime on `orders`, `order_items`, `tables`.
5. Create auth users and corresponding rows in `public.users` with roles.
6. Seed categories/menu items/ingredients/recipes/tables.

# 8) Deployment guide (Vercel free)
1. Push repo to GitHub.
2. Import to Vercel as Vite project.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in environment settings.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy and verify login + realtime + RPC permissions.

# 9) Testing checklist
- Auth login/logout works.
- Role-protected routes reject unauthorized users.
- Table statuses update in realtime.
- POS validates and blocks insufficient stock.
- Kitchen sees new orders live and can update statuses.
- Payments mark orders paid and support refund/void rows.
- Inventory low stock alerts appear.
- Reports render charts and CSV export downloads.
- Shift open/close with cash values.
- PWA installs and shows offline page when disconnected.

# 10) Future scaling suggestions
- Add background worker for heavy analytics snapshots.
- Add optimistic queues for offline order syncing.
- Partition audit and inventory logs by month.
- Add caching layer for report endpoints.
- Introduce i18n and multi-location tenancy.
- Add automated E2E test suite with Playwright in CI.
