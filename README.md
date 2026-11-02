# Kaelo storefront (React + Vite + Tailwind) — Phase 1

Storefront only: Home, Shop, Product, Cart, Checkout (3 steps), Track order.
Uses the SAME Supabase project and Edge Functions (`create-order`, `track-guest-order`) as the current site.
Not included yet: admin dashboard, accounts/login, wishlist, reviews, AI chat widget UI, push notifications.

## Run locally
    cp .env.example .env      # add your sb_publishable key
    npm install
    npm run dev

## Deploy (Netlify from GitHub)
1. Push this folder to a new GitHub repo.
2. Netlify -> Add new site -> Import from Git -> pick the repo (build settings come from netlify.toml).
3. Site settings -> Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
   plus the existing GEMINI_API_KEY, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY for the chat function.
4. Test on the deploy preview link BEFORE pointing your live domain at it.
