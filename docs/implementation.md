# Implementation Plan
## Cow Fresh — Dairy E-Commerce Platform (Clean Rebuild)

**Companion document to:** `PRD.md`
**Audience:** AI code editor (Cursor / Windsurf) executing this build
**Format:** Each phase has explicit tasks, file/folder targets, acceptance criteria, and a **human escalation checkpoint** — a point where the editor must stop and ask Abdullah before proceeding, rather than guessing.

**Golden rule for every phase:** do not mark a phase complete and move to the next one until its acceptance criteria are all met and verifiable (build passes, page renders, query returns expected shape, etc.). If blocked, stop and surface the blocker rather than working around it silently.

---

## Phase 0 — Clean Slate & Asset Preservation

**Goal:** Safely remove the existing project so the rebuild starts from zero, without losing real assets or live data.

### Tasks
1. Inventory the current project root. List every file/folder.
2. Identify and copy out to a temporary holding folder (e.g. `../cowfresh-preserved-assets/`):
   - All existing product image files (including the almond milk bottle photography).
   - Any `.env` / `.env.local` files with live Supabase URL, anon key, service role key, or payment gateway keys.
   - Any existing Supabase migration SQL files, if present, for reference only.
3. **STOP — Human escalation checkpoint 0.1:** Before deleting anything, confirm with Abdullah:
   - Is the current Supabase project (if one exists) live/production with real orders or customers in it? If yes, do **not** drop tables — only rebuild the frontend against the existing backend, and treat Phase 1's schema step as additive/migration rather than destructive.
   - If there is no live data yet (dev/prototype only), it's safe to drop and recreate the schema from scratch.
4. Delete all project files except the preserved-assets holding folder and `.git` (keep git history unless told otherwise).
5. Re-initialize a fresh Next.js 14+ App Router project (TypeScript, Tailwind, ESLint) in the now-empty root.
6. Move the preserved `.env` values into the new project's `.env.local` (do not commit).
7. Restore the preserved product images into `/public/products/` (temporary location; Phase 6 seeding will decide final home — local public folder vs. Supabase Storage).

### Acceptance Criteria
- [ ] Project root contains only the fresh Next.js scaffold + a `preserved-assets/` (or similarly named) folder holding the original images.
- [ ] `npm run dev` boots a default Next.js page with no errors.
- [ ] Every original product image file is accounted for (count matches pre-deletion inventory) — none lost in the shuffle.
- [ ] Abdullah has explicitly confirmed whether Supabase schema rebuild is destructive or additive.

---

## Phase 1 — Supabase Schema, RLS, and Project Scaffolding

### Tasks
1. Create (or connect to existing, per Phase 0 checkpoint) Supabase project.
2. Run the full schema from `PRD.md` Section 7 (`profiles`, `categories`, `products`, `product_variants`, `addresses`, `cart_items`, `orders`, `order_items`, `discount_codes`, `wishlist_items`).
3. Apply all RLS policies from `PRD.md` Section 7, including the `is_admin()` helper function.
4. Set up Supabase client helpers: `lib/supabase/client.ts` (browser client), `lib/supabase/server.ts` (server client for Server Components/Route Handlers), `middleware.ts` scaffold (auth gate logic filled in during Phase 6).
5. Define design tokens (`tailwind.config.ts` theme extension or `styles/tokens.css`): color palette (cream/off-white base, deep blue or forest green accent, warm gold CTA — placeholder until brand assets confirmed), font families, spacing/radius scale, motion durations (150–250ms micro, 300–400ms transitions).
6. Set up base layout shell: header (logo, nav, cart icon), footer, mobile bottom tab bar component (hidden on desktop).

### Acceptance Criteria
- [ ] All tables exist in Supabase with correct columns/constraints; spot-check via Supabase Studio.
- [ ] RLS is enabled on every table listed; a test query as an anonymous/non-admin user cannot write to `products`.
- [ ] `is_admin()` function exists and returns correct boolean for a manually-flagged admin profile row.
- [ ] App boots locally, Supabase client connects (no console auth/connection errors).
- [ ] Design tokens are referenced (not hardcoded hex values) in at least the base layout.

### Escalation Checkpoint
- **1.1:** If Abdullah has final brand colors/logo from the earlier Cow Fresh PRD work, get them now — placeholder palette should not silently become "final."

---

## Phase 2 — Storefront: Home, Shop Listing, Product Detail (Read-Only)

### Tasks
1. `/` (Home): hero section built around the **Almond Milk hero product** (PRD Section 9.1) using the reused/seeded almond milk imagery — even before full product seeding, this page can be built against a placeholder/mock product record and wired to real data once Phase 6 seeding lands. Category grid, featured carousel, trust strip.
2. `/shop`: full product grid, category/price/in-stock filters, sort control, skeleton loaders.
3. `/shop/[category]`: filtered listing by category slug.
4. `/product/[slug]`: gallery (zoom-on-hover), variant selector, quantity stepper, related products. Add-to-cart button wired in Phase 3 once cart state exists — for now it can be visually complete but non-functional (disabled or console-logged).
5. All image rendering via `next/image` with proper `sizes` for responsive loading.

### Acceptance Criteria
- [ ] Home hero visibly foregrounds the almond milk product with its real photo, not a placeholder graphic.
- [ ] Shop listing paginates/loads correctly against seeded or mock product data.
- [ ] Filters and sort update the grid without full page reload (client-side or server action re-fetch).
- [ ] Product detail page renders variant switching (price/stock update) correctly.
- [ ] Lighthouse performance check: no obvious layout shift from unsized images.

---

## Phase 3 — Cart (Guest + Synced)

### Tasks
1. Cart state via Zustand (or React Context) — `store/cart.ts`.
2. Guest cart persisted to `localStorage`.
3. On login, merge `localStorage` cart into Supabase `cart_items` (dedupe by variant, sum quantities, respecting the unique `(user_id, variant_id)` constraint).
4. Cart drawer (slide-over) component accessible from any page: line items, quantity edit, remove, free-delivery progress bar.
5. Wire the Product Detail "Add to cart" button from Phase 2 to real cart state, including the micro-interaction (button morph, cart icon bump).

### Acceptance Criteria
- [ ] Adding items as a guest persists across a page refresh (localStorage).
- [ ] Logging in merges guest cart into the Supabase-backed cart without duplicate line items or lost quantities.
- [ ] Cart drawer opens/closes smoothly (Framer Motion), reflects live totals.
- [ ] Removing/editing quantity updates optimistically, then confirms against Supabase.

---

## Phase 4 — Checkout, Order Creation, Stock Decrement

### Tasks
1. `/checkout` step flow: Address → Delivery Slot → Payment Method → Review.
2. Guest checkout path (lightweight order tied to phone/email, optional account creation prompt post-purchase).
3. Discount code field validated live against `discount_codes` (type, min order value, expiry, active flag).
4. Write a Postgres RPC function (`place_order`) that, in a single transaction:
   - Creates the `orders` row.
   - Creates `order_items` rows (snapshotting product/variant name and price).
   - Decrements `product_variants.stock_quantity`, failing the whole transaction if any item would oversell.
   - Applies discount amount if a valid code was supplied.
5. Call `place_order` from a Server Action; on success, redirect to `/checkout/success`; on failure (e.g. stock ran out mid-checkout), surface a clear "item no longer available" message rather than a generic error.
6. If card payment is confirmed as in-scope (see PRD open question), integrate Stripe payment intent creation server-side before calling `place_order`; otherwise ship COD-only for v1.

### Acceptance Criteria
- [ ] Placing an order with sufficient stock succeeds end-to-end and decrements stock correctly.
- [ ] Placing an order that would oversell a variant fails cleanly with no partial writes (verify via a concurrent-order test: two near-simultaneous checkouts against low stock should not both succeed if stock is insufficient for both).
- [ ] Discount codes apply correctly and reject expired/inactive/below-minimum codes.
- [ ] Guest checkout produces a valid order without requiring account creation.

### Escalation Checkpoint
- **4.1:** Confirm payment method scope (COD only vs. COD + card) before building payment integration — do not default silently to a specific gateway.
- **4.2:** Confirm delivery model (fixed slots vs. zone-based ETA) before finalizing the delivery-slot UI and `orders.delivery_slot` semantics.

---

## Phase 5 — Account Area

### Tasks
1. `/account`: profile edit, saved addresses (add/edit/delete/set-default).
2. `/account/orders`: order history list with status badges.
3. `/account/orders/[id]`: order detail + visual progress tracker (Pending → Confirmed → Packed → Out for Delivery → Delivered), reading live from `orders.status`.
4. `/wishlist`: add/remove products, reading/writing `wishlist_items`.

### Acceptance Criteria
- [ ] A logged-in customer sees only their own orders/addresses/wishlist (verify RLS actually blocks cross-user access, not just that the UI doesn't show it).
- [ ] Order status tracker reflects whatever `orders.status` currently holds, including future admin-driven updates.

---

## Phase 6 — Admin: Auth Gate, Dashboard, Product Management (incl. Image Seeding)

### Tasks
1. Implement `middleware.ts` logic: check session → check `profiles.role === 'admin'` → redirect non-admins to storefront home with no indication `/admin` exists as a concept; redirect no-session users to `/admin/login`.
2. `/admin/login`: admin-only login screen (not linked from public nav).
3. Provisioning: since there's no public admin sign-up, seed at least one admin profile directly via SQL/Supabase Studio; document the exact command used for Abdullah's reference.
4. `/admin` dashboard: today's order count/revenue, low-stock alerts, recent orders shortcut.
5. `/admin/products` list + `/admin/products/new` + `/admin/products/[id]/edit`: full CRUD, variant management, active/featured toggles.
6. **Image seeding (PRD Section 10.2a):** write `scripts/seed-products.ts` that uploads the preserved product images (from Phase 0's holding folder) to a Supabase Storage bucket (e.g. `product-images`) and links each file explicitly to its corresponding product/variant, with the almond milk bottle images explicitly linked to the Almond Milk product. Any product missing a matching image should be logged/flagged, not silently placeholdered.
7. Product image upload control in the edit form for future new uploads, independent of the one-time seed script.

### Acceptance Criteria
- [ ] A non-admin logged-in user hitting `/admin` is redirected to the storefront, no error revealing the route's purpose.
- [ ] A confirmed admin account can log in and reach the dashboard.
- [ ] Product CRUD works end-to-end and respects RLS (verify a non-admin session cannot write via a direct Supabase call, not just that the UI hides the option).
- [ ] Seed script runs once, uploads all preserved images, and the Almond Milk product's `image_urls` correctly points to the real bottle photography (confirm visually on the home hero and product detail page).
- [ ] Seed script output clearly lists any product left without a matched image.

### Escalation Checkpoint
- **6.1:** Confirm with Abdullah the exact admin email/password (or invite flow) to seed as the first admin account.
- **6.2:** If any product image is missing a confident filename-to-product match, stop and ask rather than guessing the pairing.

---

## Phase 7 — Admin: Order Management + Customer Management

### Tasks
1. `/admin/orders`: queue view, filterable by status.
2. `/admin/orders/[id]`: full order detail, status-update control (writes to `orders.status`, which the customer-facing tracker in Phase 5 reads live), simple printable/exportable invoice.
3. `/admin/customers`: list with order count/lifetime value; drill into per-customer order history.

### Acceptance Criteria
- [ ] Updating an order's status in admin is immediately reflected in the customer's `/account/orders/[id]` view on next load.
- [ ] Invoice export produces a usable PDF or print-friendly view.
- [ ] Customer list and drill-down respect RLS (admin-only read).

---

## Phase 8 — Admin: Discounts, Content Management, Settings

### Tasks
1. `/admin/discounts`: create/edit/deactivate discount codes.
2. `/admin/content`: manage homepage secondary promo banners and which products are `is_featured` — explicitly without touching the Almond Milk hero placement, which stays fixed per PRD Section 9.1 rather than being swappable through this same "featured" mechanism.
3. `/admin/settings`: delivery zones/slots, store contact info.

### Acceptance Criteria
- [ ] Discount codes created here are immediately usable at checkout (Phase 4 validation logic).
- [ ] Content changes reflect on the storefront without a redeploy.
- [ ] Settings changes (delivery slots) propagate to the checkout delivery-slot selector.

---

## Phase 9 — Polish Pass

### Tasks
1. Full animation/motion audit: consistent easing/durations per PRD Section 9.7, respect `prefers-reduced-motion`.
2. Loading states (skeletons) and empty states (empty cart, empty wishlist, no orders yet) across all major views.
3. Accessibility audit: semantic HTML, color contrast, keyboard navigation through cart/checkout, focus states.
4. Mobile pass: confirm bottom tab bar behavior, touch target sizes, hero section legibility on small screens.

### Acceptance Criteria
- [ ] No motion-heavy interaction breaks or feels janky at default and reduced-motion settings.
- [ ] Every list/grid view has a defined empty state (no blank white space).
- [ ] Keyboard-only navigation can complete a full checkout.

---

## Phase 10 — QA, Seed Data, Deployment

### Tasks
1. End-to-end test pass: guest checkout, logged-in checkout, admin order status update reflecting to customer, low-stock alert triggering correctly.
2. Confirm all preserved product images (Phase 0/6) render correctly across home hero, listings, and detail pages — no broken image links.
3. Deploy frontend to Vercel; confirm environment variables set in the hosting dashboard (not just local `.env`).
4. Final Supabase production check: RLS enabled everywhere, no service-role key present in any client-shipped bundle (grep build output to confirm).

### Acceptance Criteria
- [ ] Full user journey (browse → cart → checkout → order confirmation → admin fulfills → customer sees status update) works in the deployed environment, not just locally.
- [ ] No secrets present in client bundle (`next build` output inspection).
- [ ] Almond milk hero renders correctly in production using the real, reused product photography.

---

## Summary of Human Escalation Checkpoints

| Checkpoint | Phase | What to confirm before proceeding |
|---|---|---|
| 0.1 | 0 | Is the current Supabase backend live/production data, or safe to reset? |
| 1.1 | 1 | Final brand color palette/logo, if available, before locking in design tokens |
| 4.1 | 4 | Payment method scope: COD only vs. COD + card, and which gateway |
| 4.2 | 4 | Delivery model: fixed slots vs. zone-based ETA |
| 6.1 | 6 | First admin account credentials/provisioning method |
| 6.2 | 6 | Any ambiguous image-to-product matches during seeding |

These are the points where the build should pause and ask rather than assume — everything else in this plan is intended to be executed directly against the PRD without further check-ins.
