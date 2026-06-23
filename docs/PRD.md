# Product Requirements Document — Cow Fresh E-Commerce Store

**Version:** 1.0
**Owner:** Abdullah
**Last updated:** June 19, 2026
**Stack:** Next.js (React) + Supabase · Mobile-first

---

## 1. Overview

Cow Fresh is a direct-to-consumer dairy e-commerce store selling five core products: almond milk bottles, lassi, milk packets, yogurt packets, and desi ghee. The flagship UX feature is a **3D-style scroll-driven hero animation**: on load, all five products appear together on screen; as the user scrolls, the main "hero" bottle (almond milk) animates forward/rotates while the other four products drift out of frame, leaving the hero product as the focal point for the rest of the scroll-into-story sequence.

This is achieved **without a real 3D model** — using high-quality product photography (or AI-generated photo-real renders) animated with CSS 3D transforms and a scroll-linked animation library. This keeps load times low and works smoothly on mobile, which is the primary target device.

---

## 2. Goals & Non-Goals

### Goals
- A fast, mobile-first storefront that feels premium and modern, not like a generic Shopify template.
- A memorable, scroll-driven hero section that visually demonstrates the product range and then focuses attention on the flagship product.
- Easy-to-manage product catalog via Supabase, so adding/editing products doesn't require a redeploy.
- Brand identity (color, type, tone) pulled directly from the Cow Fresh logo.
- Core e-commerce flows: browse → product detail → cart → checkout → order confirmation.

### Non-Goals (v1)
- No real-time 3D model viewer (e.g., `<model-viewer>`/glTF) — explicitly out of scope per decision to use photography + CSS transforms instead.
- No multi-vendor or marketplace features.
- No subscription/recurring delivery model in v1 (flag as a v2 idea — common for dairy/milk delivery businesses).
- No native mobile app — mobile-first **responsive web** only.

---

## 3. Target Users & Context

- Primary device: **mobile** (assume 70-80% of traffic is mobile, typical for FMCG/grocery in Pakistan/South Asia region).
- Users are likely ordering for household/weekly grocery needs — repeat purchase behavior matters (favorites, reorder, simple cart).
- Connection speeds may be inconsistent (3G/4G) — performance budget matters more than visual flourish. The hero animation must degrade gracefully on low-end devices.

---

## 4. Brand & Visual Identity

Derived directly from the uploaded Cow Fresh logo (`CF-logo.png`). Exact hex values pulled via pixel sampling:

| Token | Hex | Usage |
|---|---|---|
| **Cow Fresh Green** (primary brand) | `#45C517` | Primary buttons, brand banner, active states, badges ("Fresh", "New") |
| **Cow Fresh Navy** (secondary/dark) | `#001A57` | Header/footer background, headings, dark UI sections, text on light bg |
| **Cow Fresh Sky** (accent/light) | `#92CCFC` | Borders, secondary accents, hover states, soft backgrounds, icons |
| **Off-white** | `#FAFAF8` | Page background (avoid pure `#FFFFFF` for a softer, "dairy" warmth) |
| **Charcoal** (body text) | `#1C1C1E` | Body copy on light backgrounds |
| **White** | `#FFFFFF` | Text on green/navy, card backgrounds |

**Usage notes:**
- Green (`#45C517`) = primary CTA color (Add to Cart, Buy Now, nav highlights).
- Navy (`#001A57`) = "premium/trust" anchor — use for header, footer, and pricing/typography to keep the site from feeling like a cartoonish kids' brand despite the bright green.
- Sky blue (`#92CCFC`) = the "fresh/dairy" accent — great for subtle gradients behind product photography, tags like "100% Natural," and the scroll-section backgrounds (evokes milk/cream visually when used as a soft radial gradient).
- Maintain at least one full-bleed section using the navy + sky-blue gradient combo from the logo's center oval — it's the most distinctive part of the mark and underused if you only pull the green.

**Typography (recommendation):**
- Headings: a rounded, confident sans-serif (e.g., **Poppins** or **Sora**) to match the logo's bold rounded wordmark.
- Body: a clean, highly legible sans-serif (e.g., **Inter**) for product descriptions, prices, nutrition info.
- Both are free via Google Fonts / `next/font`.

**Logo usage:**
- Use the ribbon/banner logo as-is for the favicon and footer.
- For the header/nav, consider a simplified horizontal lockup (cow icon + "Cow Fresh" wordmark side by side) for better mobile header height — the full vertical ribbon logo is tall and will eat mobile header space. This can be generated as a derivative asset (see Section 8, image generation).

---

## 5. Information Architecture

```
/                       → Home (hero animation, featured products, brand story strip)
/products               → All products grid (filter by category: Milk / Lassi / Yogurt / Ghee)
/products/[slug]        → Product detail page (images, variants, price, nutrition, add to cart)
/cart                    → Cart drawer (slide-over, accessible from anywhere) + dedicated /cart page
/checkout               → Address, delivery slot, payment method, order review
/order-confirmation/[id] → Order success + summary
/account                → Order history, saved addresses (Supabase Auth)
/about                  → Brand story, farm sourcing, sustainability
/contact                → Contact form / WhatsApp/social links
```

---

## 6. Product Catalog (Initial 5 Products)

This is the seed catalog. Structure it so each product can have **multiple variants** (size/pack count), since dairy products commonly do.

| # | Product | Category | Suggested Variants | Notes |
|---|---|---|---|---|
| 1 | Almond Milk | Milk (Bottle) | 500ml, 1L | **Hero product** for the scroll animation |
| 2 | Lassi | Lassi | 250ml cup, 500ml bottle, 1L jug | Consider flavor variants (Sweet, Salted, Mango) |
| 3 | Milk (Packets) | Milk (Packet) | 250ml, 500ml, 1L pouch | Standard pasteurized/UHT milk |
| 4 | Yogurt (Packets) | Yogurt | 200g, 500g, 1kg | Plain/Greek-style if applicable |
| 5 | Desi Ghee | Ghee | 250g jar, 500g jar, 1kg jar | Premium positioning — your highest price point, photograph in glass jar against navy/sky gradient background |

### How to provide/structure product data

You have two practical options — recommend a hybrid:

**Option A — Supabase as source of truth (recommended for this stack).**
Since you're already using Supabase, model products there from day one rather than hardcoding JSON in the repo. Suggested schema:

```sql
-- products table
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('milk_bottle','lassi','milk_packet','yogurt','ghee')),
  description text,
  short_tagline text,
  is_hero_product boolean default false,   -- flags the product used in the hero scroll animation
  nutrition_info jsonb,                    -- {calories, fat, protein, ...}
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- product_variants table
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  label text not null,        -- e.g. "500ml", "1kg Jar"
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),  -- for showing discounts
  sku text unique,
  stock_quantity int default 0,
  is_default boolean default false
);

-- product_images table
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,         -- Supabase Storage public URL
  alt_text text,
  is_primary boolean default false,
  sort_order int default 0,
  image_type text default 'gallery' check (image_type in ('gallery','hero_scroll','thumbnail'))
);
```

- Store actual image files in **Supabase Storage** (a `product-images` bucket), reference via public URL in `product_images`.
- This lets you (or a future non-technical teammate) add/edit products and swap photos from the Supabase dashboard or a simple internal admin page — no code deploy needed.
- Use Supabase's auto-generated REST/JS client in Next.js (`@supabase/supabase-js`) with **server components / route handlers** for product fetches, and **Row Level Security (RLS)** policies so public reads are allowed but writes require an authenticated admin role.

**Option B — Static JSON/TS for v1 launch speed, migrate later.**
If you want to launch fast and Supabase auth/admin tooling isn't ready yet, define products in a typed `products.ts` file and swap to Supabase queries later behind the same TypeScript interface (`getAllProducts()`, `getProductBySlug()`), so the swap is a one-file change, not a rewrite.

```ts
// types/product.ts
export interface ProductVariant {
  id: string;
  label: string;       // "500ml"
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'milk_bottle' | 'lassi' | 'milk_packet' | 'yogurt' | 'ghee';
  tagline: string;
  description: string;
  isHeroProduct: boolean;
  images: { url: string; alt: string; type: 'gallery' | 'hero_scroll' | 'thumbnail' }[];
  variants: ProductVariant[];
  nutrition?: Record<string, string>;
}
```

**Recommendation:** Go straight to Supabase (Option A) since it's already your backend — avoids a migration step and lets you use Supabase Auth for the `/account` order-history page too.

### Image requirements per product
For the hero scroll animation specifically, each "hero-eligible" product needs a **clean cutout shot** (transparent or solid-color background) in addition to normal lifestyle/catalog photography:
- 1× front-facing cutout, transparent PNG, min. 2000px tall, consistent lighting angle across all 5 products (critical — mismatched lighting/shadows between products will break the illusion that they're "in the same scene").
- 1–2× lifestyle/context shots per product for the product detail page gallery.
- 1× close-up detail shot (label, texture, pour shot) for product detail page.

---

## 7. Hero Section — Scroll Animation Spec

### 7.1 Concept
1. **Initial state (on load):** All 5 products are visible, arranged in a loose cluster/grid around or behind the hero product (Almond Milk bottle), like products "presented" on a shelf or floating arrangement. Headline + CTA overlay on top.
2. **On scroll (0–100% of hero scroll distance):**
   - The 4 secondary products (Lassi, Milk Packet, Yogurt, Ghee) animate outward and fade out — moving toward the edges of the viewport and/or scaling down, simulating depth (z-axis push-back).
   - The hero bottle (Almond Milk) simultaneously scales up slightly and/or rotates (e.g., 15–25° Y-axis tilt change) to feel "alive," staying centered and in focus.
   - Background may shift (color/gradient transition) to reinforce the transition from "all products" to "hero product" section.
3. **End state:** Hero bottle settles into a pinned/centered position as the next content section (e.g., "Why Cow Fresh" or product highlights) scrolls in beneath/around it.

### 7.2 Technique (no real 3D model required)
This is achieved with **2D images animated through 3D CSS space** — a well-established technique (used heavily by Apple product pages, e.g. AirPods/iPhone reveal pages) that reads as "3D" without actual 3D geometry:

- Each product photo sits in its own layer (`<div>`/`<Image>`).
- Apply `transform: translate3d() / scale() / rotateY() / rotateX()` driven by scroll progress.
- Use `perspective` on the parent container to give the rotation/translation real depth.
- Interpolate transform values based on scroll progress (0 → 1) using a scroll-linked animation library (see 7.3).

### 7.3 Recommended Libraries

| Library | Purpose | Why |
|---|---|---|
| **Framer Motion** (`framer-motion`) | Primary animation engine — `useScroll` + `useTransform` hooks map scroll progress to transform values per element | Native React/Next.js integration, declarative, handles spring physics for the "settle into place" feel, well-documented, large community |
| **GSAP + ScrollTrigger** (`gsap`, `gsap/ScrollTrigger`) | Alternative/optional — more powerful timeline sequencing if the animation gets complex (e.g., staggered exits, pinning sections) | Industry standard for scroll storytelling (used on many premium product sites); slightly steeper learning curve than Framer Motion but more precise timeline control and built-in scroll "pinning" |
| **Lenis** (`@studio-freight/lenis` or `lenis`) | Smooth scroll wrapper | Makes scroll-linked animation feel buttery instead of janky/stepped, especially important since native scroll-jank is the #1 complaint with scroll animations on mobile |
| **next/image** | Image optimization/serving | Required regardless — handles responsive sizing, lazy loading, WebP/AVIF conversion for the product photography |
| **Tailwind CSS** | Styling | Pairs cleanly with the above; utility classes keep the transform-heavy components manageable |

**Suggested combo for this project:** **Framer Motion + Lenis**. GSAP/ScrollTrigger is excellent but is overkill unless the storytelling gets much more elaborate (multi-stage pinned sections, complex stagger choreography across many breakpoints). Framer Motion's `useScroll`/`useTransform` will comfortably handle the "5 products → 1 hero product" sequence described above and has a gentler learning curve in a React/Next.js codebase.

> If, after prototyping, Framer Motion feels limited for very precise pinning/timeline sync, GSAP ScrollTrigger is the documented escape hatch — they can also coexist (GSAP just for the hero, Framer Motion for the rest of the site).

### 7.4 Mobile-first considerations (critical)
- **Reduce motion complexity on small viewports.** On mobile, simplify to: fade + scale only (skip heavy rotateY/rotateX depth effects) — full 3D-feeling depth often reads as visually busy on small screens and costs more on lower-end GPUs.
- **Respect `prefers-reduced-motion`** — provide a static fallback (simple fade/slide) for users with that OS setting enabled; this is both an accessibility requirement and good practice.
- **Pre-decode/pre-load** all 5 hero images before the animation is interactive — show a lightweight skeleton/blur-up placeholder otherwise; nothing kills the "premium" feel like images popping in mid-scroll.
- **Cap to transform/opacity only** (never animate `top/left/width/height` directly) — these are GPU-accelerated and won't trigger layout reflow, which matters a lot on mid-range Android devices.
- **Test on throttled CPU + 4G network** (Chrome DevTools) before considering the hero "done" — this is the #1 way these animations end up feeling broken in the real world despite looking great in a fast dev environment.
- Pin the hero section height carefully on mobile — overly long scroll-jacked sections feel tedious on a small screen. Recommend hero scroll distance ≈ 1.2–1.5× viewport height on mobile vs. 2–2.5× on desktop.

---

## 8. Image Generation & Asset Pipeline (Nano Banana)

Since you're generating imagery with **Nano Banana** (Google's image generation model), here's how to use it effectively for this project:

### What to generate vs. what to photograph
- **Best for Nano Banana:** background scenes, lifestyle context shots (e.g., a glass of lassi on a rustic wooden table with mint leaves, a farm-field backdrop echoing the logo's pastoral scene), marketing banner art, Instagram/social assets, the "About" page farm imagery, abstract gradient backgrounds for section dividers.
- **Use real product photography (or very carefully prompted/consistent AI renders) for:** the 5 hero-product cutouts used in the scroll animation. These need pixel-consistent lighting, angle, and scale across all 5 products since they'll appear together on screen — small inconsistencies here are visually obvious. If using Nano Banana for these too, generate all 5 in the same session/prompt style (same lighting direction, same camera angle, same background-removal approach) and do a manual consistency pass (color-match, shadow-match) afterward — don't generate them across separate disconnected sessions.

### Suggested asset list to generate
1. Hero cutouts (transparent bg) — Almond Milk bottle, Lassi bottle/cup, Milk packet, Yogurt packet, Ghee jar (5 images, consistent style).
2. Lifestyle/context shots per product (2-3 each) — for product detail pages.
3. Background textures/gradients evoking the logo's navy-oval farm scene (rolling green fields, sunrise, water reflection) — for section backgrounds, reinforcing brand storytelling without being literal photos every time.
4. Simplified horizontal logo lockup for the mobile nav bar (cow icon + wordmark side-by-side) derived from the existing vertical ribbon logo.
5. Icon set for trust badges ("100% Natural," "Farm Fresh," "No Preservatives") in the brand's line-art style matching the cow illustration's linework.

### Practical tips for Nano Banana specifically
- Prompt with explicit consistent parameters across all 5 product generations: lighting angle, camera height, background color/value, lens/perspective — reuse the same descriptive prompt skeleton and only swap the product noun.
- Generate at the highest resolution available, then upscale/clean in a tool like Photoshop or an online background remover (e.g., remove.bg) if transparency isn't clean directly out of the model.
- Keep raw generated assets in a dedicated `/design/raw-generated/` folder separate from the final `/public/images/` (or Supabase Storage) assets you actually ship — you'll iterate, and you don't want to lose track of "what's final."

---

## 9. Tech Stack Summary

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/SSG for product pages = better SEO and faster first paint than a pure client SPA |
| UI library | **React** | — |
| Styling | **Tailwind CSS** | Fast iteration, easy to encode the brand tokens from Section 4 as Tailwind theme colors |
| Animation | **Framer Motion** (+ optional GSAP ScrollTrigger for hero edge cases) | See Section 7 |
| Smooth scroll | **Lenis** | See Section 7 |
| Backend / DB | **Supabase (Postgres)** | Products, variants, images, orders, users |
| Auth | **Supabase Auth** | Customer accounts, order history |
| File storage | **Supabase Storage** | Product images |
| Payments | **Stripe** (or local equivalent — e.g., JazzCash/Easypaisa if targeting Pakistan market directly) | Decide based on actual target market; flag as open decision |
| Hosting | **Vercel** | Native Next.js support, fast edge delivery, simple CI/CD |
| Coding environment | **Antigravity** | Per your existing setup |
| Image generation | **Nano Banana** | Per your existing setup — see Section 8 |

**Open decision to confirm before build starts:** payment gateway — this depends on which market you're launching in (affects checkout flow design significantly), so a separate ask/answer.

---

## 10. Mobile-First Design Requirements

- Design and build **mobile breakpoint first**, then enhance up to tablet/desktop — not the reverse.
- Sticky, thumb-friendly **bottom cart bar** on product pages (common, high-converting pattern for mobile commerce) rather than relying solely on a top-nav cart icon.
- Minimum tappable target size 44×44px for all buttons/icons.
- Product grid: 2 columns on mobile, scaling to 3-4 on tablet/desktop.
- Checkout: single-column, progressive form (address → delivery → payment) rather than a long all-at-once form — reduces mobile cart abandonment.
- Sticky/condensed header on scroll (logo + cart icon only) to preserve vertical space on small screens.
- Performance budget target: **Lighthouse mobile score ≥ 85**, Largest Contentful Paint (LCP) **< 2.5s** on simulated 4G.

---

## 11. Core E-commerce Functional Requirements

- Product browsing with category filter (Milk / Lassi / Yogurt / Ghee).
- Product detail page: image gallery, variant selector (size/pack), price, nutrition info, "Add to Cart," related products.
- Cart: add/remove/update quantity, persists across sessions (Supabase if logged in, else local storage merged on login).
- Checkout: guest checkout allowed; delivery address (with support for delivery-area/slot selection, relevant for perishable dairy); order summary; payment.
- Order confirmation page + email/notification (Supabase Edge Function or a transactional email provider like Resend).
- Customer account: order history, saved addresses, reorder button (high-value for repeat dairy purchases).
- Admin-side: simple internal dashboard or direct Supabase Studio use for managing products/orders in v1 (a dedicated admin UI can be a v2 item).

---

## 12. Success Metrics

- Mobile Lighthouse performance score ≥ 85.
- Hero section scroll completion rate (% of users who scroll past the hero) — track via analytics event.
- Add-to-cart rate from product detail pages.
- Checkout completion rate (cart → order placed).
- Repeat purchase rate within 30 days (dairy is a recurring-purchase category — this is a key health metric).

---

## 13. Open Questions / Decisions Needed Before Build

1. Target market/region → determines payment gateway and delivery-area logic (Stripe vs. local wallets).
2. Delivery model — on-demand checkout only, or scheduled delivery slots/subscription (common for dairy, worth at least flagging for v2)?
3. Will product photography be fully AI-generated (Nano Banana) or a mix with real photography? Affects the consistency plan in Section 8.
4. Do you need a non-technical admin UI for managing products, or is direct Supabase Studio access sufficient for now?

---

## 14. Suggested Build Order

1. Set up Next.js + Tailwind + Supabase project skeleton; define brand theme tokens (Section 4) in `tailwind.config`.
2. Build Supabase schema (Section 6) and seed the 5 products + variants.
3. Build static pages first (Product grid, Product detail, Cart, Checkout) with placeholder images — get the full purchase flow working end-to-end before investing in hero polish.
4. Generate/source the 5 hero product cutouts (Section 8) with consistent lighting/style.
5. Build the hero scroll animation in isolation (Framer Motion + Lenis) on its own route/sandbox page, test thoroughly on real mobile devices, then integrate into the homepage.
6. Performance pass: image optimization, Lighthouse audit, `prefers-reduced-motion` fallback, low-end device testing.
7. Payments integration + order confirmation flow.
8. QA across breakpoints, then launch.
