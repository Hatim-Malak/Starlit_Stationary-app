# STATE

**Phase:** 01-ui-enhancement
**Position:** Planning
**Status:** 📝 Plans Created

## Decisions
- **D-01**: Use CSS custom properties (Tailwind `theme.extend.colors`) for the new palette: primary (#213448), secondary (#547792), accent (#94B4C1), warm (#EAE0CF)
- **D-02**: Implement debouncing (300ms) for search input rather than throttling — better UX for search-as-you-type
- **D-03**: Use cursor-based or offset-based pagination — offset-based (page + limit) to match the backend API pattern
- **D-04**: Smart loader: 300ms delay before showing loader + minimum 500ms display time to prevent flickering on fast responses
- **D-05**: No new backend changes — all optimizations are frontend-only (pagination query params, debounce on client)

## Blockers
- None

## Pending Todos
- [ ] Create Plan 01: Theme Foundation & Custom Hooks
- [ ] Create Plan 02: Homepage Hero Section & Loader Enhancement
- [ ] Create Plan 03: Product Page Pagination & Search Optimization
- [ ] Create Plan 04: Global UI Consistency Pass
