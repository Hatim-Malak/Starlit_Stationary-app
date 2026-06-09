# CONTEXT: UI Enhancement Phase

## User Vision
Enhance the e-commerce UI for the best user experience with a professional look using the color palette:
- **#213448** (Dark Navy) — Primary backgrounds, headers, key UI elements
- **#547792** (Muted Blue) — Secondary elements, cards, hover states
- **#94B4C1** (Light Steel Blue) — Accents, borders, decorative elements
- **#EAE0CF** (Warm Cream) — Light backgrounds, card backgrounds, text on dark

## Requirements Summary
1. Apply new color palette globally
2. Redesign hero section professionally
3. Add pagination to product listing
4. Debounce search to reduce API calls
5. Smart loader (delay + minimum duration)
6. Reduce API call frequency overall

## Architecture Decisions
- All changes are frontend-only (no backend modifications)
- Zustand stores get pagination fields
- New custom hooks in `src/Hooks/`
- Tailwind `theme.extend.colors` for palette
- CSS variables for dynamic theme values

## Files to Modify
- tailwind.config.js (colors)
- src/index.css (CSS variables, scrollbar, global styles)
- src/Hooks/ (new files)
- src/Components/Navbar.jsx
- src/Pages/HomePage.jsx (hero + carousel)
- src/Pages/ProductPage.jsx (pagination + search)
- src/Pages/CartPage.jsx
- src/Pages/OrderPage.jsx
- src/Pages/YourOrderPage.jsx
- src/Pages/SignInPage.jsx
- src/Pages/SignUpPage.jsx
- src/Pages/AdminOrders.jsx
- src/Pages/NewProduct.jsx
- src/Pages/UpdateProduct.jsx
- src/Pages/Contact_Us.jsx
- src/Components/Search.jsx
- src/store/useProductStore.js (pagination state)
