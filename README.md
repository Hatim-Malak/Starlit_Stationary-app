# ✨ Starlit Stationary — New Features & Enhancements

> This document covers all **new features, enhancements, and architectural improvements** added to the Starlit Stationary e-commerce platform that are **not documented** in the individual [Frontend README](./Starlit_Stationary_frontend/README.md) or [Backend README](./Starlit_Stationary_backend/README.md).

---

## Table of Contents

- [Overview](#overview)
- [New Backend Features](#new-backend-features)
  - [Redis Caching Layer (Upstash)](#1--redis-caching-layer-upstash)
  - [API Rate Limiting](#2--api-rate-limiting)
  - [Geolocation-Based Delivery Validation](#3--geolocation-based-delivery-validation)
  - [Delivery OTP Verification System](#4--delivery-otp-verification-system)
  - [Order Cancellation with Reason Tracking](#5--order-cancellation-with-reason-tracking)
  - [Customer-Specific Order Lookup](#6--customer-specific-order-lookup)
  - [Order Filtering by Status](#7--order-filtering-by-status)
  - [Featured Product System](#8--featured-product-system)
  - [Category-Based Product Browsing](#9--category-based-product-browsing)
  - [Real-Time Stock Management](#10--real-time-stock-management)
- [New Frontend Features](#new-frontend-features)
  - [Custom React Hooks](#11--custom-react-hooks)
  - [Client-Side Pagination](#12--client-side-pagination)
  - [Persistent Cart Total Price (Zustand Persist)](#13--persistent-cart-total-price-zustand-persist)
  - [Skeleton Loading States](#14--skeleton-loading-states)
  - [Optimistic State Updates](#15--optimistic-state-updates)
  - [OTP Input UI with Auto-Focus](#16--otp-input-ui-with-auto-focus)
  - [Order Cancellation UI with Reason Form](#17--order-cancellation-ui-with-reason-form)
  - [Admin Order Management Dashboard](#18--admin-order-management-dashboard)
  - [Minimum Loading Duration (Anti-Flicker)](#19--minimum-loading-duration-anti-flicker)
- [New Environment Variables](#new-environment-variables)
- [New Dependencies](#new-dependencies)
- [Architecture Diagram](#architecture-diagram)
- [Getting Started](#getting-started)

---

## Overview

The Starlit Stationary platform has undergone significant enhancements focused on **performance**, **security**, **delivery logistics**, and **user experience**. The highlights include:

| Area | Enhancement |
|------|-------------|
| 🚀 Performance | Redis caching on all read-heavy endpoints |
| 🛡️ Security | Granular rate limiting per endpoint category |
| 📍 Logistics | Geocoded delivery radius validation (15 km) |
| 🔐 Verification | 6-digit OTP delivery confirmation system |
| ❌ Orders | Full order cancellation flow with reason tracking |
| 🎯 UX | Skeleton loaders, debounced search, pagination hooks |
| 💾 State | Persistent cart pricing via Zustand middleware |

---

## New Backend Features

### 1. 🗄️ Redis Caching Layer (Upstash)

**File:** [`cache.js`](./Starlit_Stationary_backend/src/lib/cache.js)

A full Redis caching layer has been introduced using **Upstash Redis** (serverless Redis) to dramatically reduce MongoDB query load on read-heavy endpoints.

#### Cache Utilities

| Function | Description |
|----------|-------------|
| `getCache(key)` | Retrieves a cached value by key. Handles both JSON and plain string values. |
| `setCache(key, value, ttl)` | Stores a value with a configurable TTL (default: 60 seconds). Auto-serializes objects to JSON. |
| `delCache(...keys)` | Invalidates one or more cache keys. Used on all write operations. |
| `cacheResponse(key, ttl, callback)` | **Cache-aside pattern** — returns cached data if available, otherwise executes the callback, caches the result, and returns it. |

#### Cached Endpoints

| Endpoint | Cache Key Pattern | TTL |
|----------|-------------------|-----|
| All Products | `products:all` | 60s |
| Featured Products | `products:featured` | 60s |
| Product Search | `products:search:{query}` | 30s |
| Category Products | `products:category:{slug}` | 60s |
| User Cart | `cart:{userId}` | 30s |
| User Orders | `order:my:{userId}` | 30s |
| Customer Orders | `order:customer:{slug}` | 30s |
| All Orders (filtered) | `orders:all:{status}` | 30s |
| User Profile | `user:{userId}` | 60s |

#### Cache Invalidation Strategy

Cache is invalidated intelligently on every write operation:

- **Product create/update/delete** → Invalidates `products:all`, `products:featured`, and relevant `products:category:{category}`
- **Cart operations (add/update/remove/delete)** → Invalidates `cart:{userId}`
- **Order placement** → Invalidates `order:my:{userId}` and all `orders:all:*` variants
- **OTP verification** → Invalidates order caches for user, admin, and customer views
- **Order cancellation** → Same comprehensive invalidation as OTP verification

---

### 2. 🛡️ API Rate Limiting

**File:** [`rateLimiting.js`](./Starlit_Stationary_backend/src/lib/rateLimiting.js)

A comprehensive rate limiting system built on **Upstash Ratelimit** with a **sliding window** algorithm. Each endpoint category has its own limiter to prevent abuse while allowing legitimate traffic.

#### Rate Limit Configuration

| Limiter | Limit | Window | Applied To |
|---------|-------|--------|------------|
| `authLimiter` | 20 requests | 15 minutes | Signup, auth check |
| `loginLimiter` | 5 requests | 15 minutes | Login endpoint |
| `logoutLimiter` | 10 requests | 15 minutes | Logout endpoint |
| `productLimiter` | 80 requests | 1 minute | All products listing |
| `searchLimiter` | 30 requests | 1 minute | Product search |
| `categoryLimiter` | 40 requests | 1 minute | Category browsing |
| `featuredLimiter` | 40 requests | 1 minute | Featured products |
| `cartLimiter` | 50 requests | 1 minute | Cart reads |
| `cartWriteLimiter` | 30 requests | 1 minute | Cart add/update/remove |
| `orderLimiter` | 30 requests | 1 minute | Order reads |
| `orderWriteLimiter` | 10 requests | 1 minute | Order placement/cancel |
| `otpLimiter` | 5 requests | 1 minute | OTP verification |
| `adminLimiter` | 20 requests | 1 minute | Admin operations |

#### Implementation

Rate limiting is applied via the `withRateLimit(limiter)` Express middleware factory:

```javascript
// Example: applied to product routes
router.get("/all", withRateLimit(productLimiter), allProducts)
router.get("/search", withRateLimit(searchLimiter), searchProduct)
```

- Rate limits are tracked by client IP address
- Returns **HTTP 429** (Too Many Requests) when limit exceeded
- **Fail-open design**: If the rate limiter itself errors, the request proceeds normally to avoid blocking legitimate users

---

### 3. 📍 Geolocation-Based Delivery Validation

**File:** [`map.js`](./Starlit_Stationary_backend/src/lib/map.js)

A middleware-based delivery area validation system that ensures orders can only be placed within a **15 km radius** of the store location using the **OpenCage Geocoding API**.

#### How It Works

1. **Address Geocoding**: The customer's shipping address is geocoded to latitude/longitude coordinates via the OpenCage API
2. **Address Validation**: The system checks geocoding confidence and result type:
   - Confidence score must be ≥ 5 (filters out vague/fake addresses)
   - Result type must not be just `city` or `state` (ensures specific street-level address)
3. **Distance Calculation**: Uses the **Haversine formula** to calculate the great-circle distance between the store's fixed coordinates and the customer's address
4. **Range Check**: Orders outside a 15 km radius are rejected with a clear error message

#### Validation Responses

| Scenario | HTTP Status | Message |
|----------|-------------|---------|
| Address not found | 400 | "Invalid Address" |
| Vague/incomplete address | 400 | "Invalid or incomplete address. Please provide a valid street or landmark name." |
| Out of delivery range | 400 | "Delivery area is out of 15km range" |

#### Middleware Integration

The `validateDistance` middleware is applied to the order placement route:

```javascript
router.post("/", protectRoute, withRateLimit(orderWriteLimiter), validateDistance, placeOrder)
```

---

### 4. 🔐 Delivery OTP Verification System

**Files:** [`order.controller.js`](./Starlit_Stationary_backend/src/Controllers/order.controller.js), [`order.model.js`](./Starlit_Stationary_backend/src/Models/order.model.js)

A secure delivery confirmation system using **6-digit one-time passwords (OTP)**.

#### Flow

```
Order Placed → OTP Generated → Customer Sees OTP → Delivery Person Arrives
    → Admin Enters OTP → OTP Verified → Order Marked as Delivered + Paid
```

#### Technical Details

- **OTP Generation**: Random 6-digit code generated via `Math.floor(100000 + Math.random() * 900000)`
- **Expiration**: OTP expires after **7 days** from order placement
- **Storage**: Stored in the order document under `deliveryOTP` subdocument:
  ```javascript
  deliveryOTP: {
    code: String,       // 6-digit OTP
    expiredAt: Date,    // Expiry timestamp
    verified: Boolean   // Verification status
  }
  ```
- **Verification**: Admin-only endpoint that checks code match and expiration
- **On Success**: Order is marked as `isDelivered: true`, `isPaid: true`, and timestamps are recorded

#### API Endpoint

```
POST /api/order/customer/:id/otp/verify
Body: { "deliveryOTP": "123456" }
Auth: Protected + Admin Only
Rate Limit: 5 requests/minute (otpLimiter)
```

---

### 5. ❌ Order Cancellation with Reason Tracking

**Files:** [`order.controller.js`](./Starlit_Stationary_backend/src/Controllers/order.controller.js), [`order.model.js`](./Starlit_Stationary_backend/src/Models/order.model.js)

A full order cancellation system with mandatory reason tracking.

#### Schema Enhancement

```javascript
isOrderCanceled: {
  isTrue: { type: Boolean, default: false },
  why: { type: String, default: "" }
}
```

#### Business Rules

- ✅ Orders can be cancelled if they are **not yet delivered** and **not yet paid**
- ❌ Cannot cancel already delivered or paid orders
- ❌ Cancellation reason is mandatory — empty reasons are rejected

#### API Endpoint

```
DELETE /api/order/:id/delete
Body: { "why": "Changed my mind about the order" }
Auth: Protected
Rate Limit: 10 requests/minute (orderWriteLimiter)
```

---

### 6. 🔍 Customer-Specific Order Lookup

**File:** [`order.controller.js`](./Starlit_Stationary_backend/src/Controllers/order.controller.js)

Allows searching orders by **customer name** (shipping address full name). Useful for admins to look up specific customer orders.

```
GET /api/order/customer/:slug
Auth: Protected
Rate Limit: 30 requests/minute
```

Returns all orders matching the customer name, with populated user and product details.

---

### 7. 📊 Order Filtering by Status

**File:** [`order.controller.js`](./Starlit_Stationary_backend/src/Controllers/order.controller.js)

Admin order listing now supports filtering by delivery status:

| Query Parameter | Filter |
|-----------------|--------|
| `?query=all` | All orders |
| `?query=pending` | Only undelivered orders |
| `?query=delivered` | Only delivered orders |

```
GET /api/order?query=pending
Auth: Protected
Rate Limit: 30 requests/minute
```

---

### 8. ⭐ Featured Product System

**Files:** [`product.model.js`](./Starlit_Stationary_backend/src/Models/product.model.js), [`product.controller.js`](./Starlit_Stationary_backend/src/Controllers/product.controller.js)

Products can now be marked as **featured** via an enum field:

```javascript
featured: {
  type: String,
  enum: ["Yes", "No"],
  default: "No"
}
```

A dedicated endpoint serves featured products for hero sections and carousels:

```
GET /api/Products/Feature
Rate Limit: 40 requests/minute
Cache: 60 seconds
```

---

### 9. 🏷️ Category-Based Product Browsing

**File:** [`product.controller.js`](./Starlit_Stationary_backend/src/Controllers/product.controller.js)

Products can be filtered by category with a dedicated cached endpoint:

```
GET /api/Products/category/:slug
Rate Limit: 40 requests/minute
Cache: 60 seconds
```

---

### 10. 📦 Real-Time Stock Management

**File:** [`cart.controller.js`](./Starlit_Stationary_backend/src/Controllers/cart.controller.js)

Stock is now decremented in real-time when items are added to cart:

- **Add to cart**: Checks stock availability, decrements stock immediately
- **Stock validation**: Returns `400 Not enough stock` if quantity exceeds available stock
- Applied during both add-to-cart and update-cart operations

---

## New Frontend Features

### 11. 🪝 Custom React Hooks

Three reusable custom hooks have been introduced in the `src/Hooks/` directory:

#### `useDebounce(value, delay)`

**File:** [`useDebounce.js`](./Starlit_Stationary_frontend/src/Hooks/useDebounce.js)

Debounces rapidly changing values (e.g., search input) to reduce unnecessary API calls.

```javascript
const debouncedSearch = useDebounce(searchQuery, 300);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | any | — | The value to debounce |
| `delay` | number | 300ms | Debounce delay in milliseconds |

---

#### `usePagination({ initialPage, initialLimit })`

**File:** [`usePagination.js`](./Starlit_Stationary_frontend/src/Hooks/usePagination.js)

Full-featured pagination state management hook.

```javascript
const { page, totalPages, nextPage, prevPage, hasNext, hasPrev } = usePagination({ initialPage: 1, initialLimit: 12 });
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `page` | number | Current page number |
| `limit` | number | Items per page |
| `totalPages` | number | Calculated total pages |
| `totalItems` | number | Total item count |
| `hasNext` | boolean | Whether a next page exists |
| `hasPrev` | boolean | Whether a previous page exists |
| `nextPage()` | function | Navigate to next page |
| `prevPage()` | function | Navigate to previous page |
| `setPage(n)` | function | Jump to specific page |
| `setTotal(count)` | function | Update total item count |
| `reset()` | function | Reset pagination to initial state |

---

#### `useSmartLoader({ delay, minDisplay })`

**File:** [`useSmartLoader.js`](./Starlit_Stationary_frontend/src/Hooks/useSmartLoader.js)

An anti-flicker loading hook that prevents loading spinners from appearing for brief requests and ensures they display for a minimum duration when shown.

```javascript
const { showLoader, isLoading, handleLoadingChange } = useSmartLoader({ delay: 300, minDisplay: 500 });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `delay` | number | 300ms | Wait before showing loader (prevents flash for fast requests) |
| `minDisplay` | number | 500ms | Minimum time to display the loader once shown |

**Behavior:**
- If a request completes in under 300ms → no loader shown at all
- If a request takes longer → loader appears and stays for at least 500ms, preventing jank

---

### 12. 📄 Client-Side Pagination

**File:** [`useProductStore.js`](./Starlit_Stationary_frontend/src/store/useProductStore.js)

The product store now implements client-side pagination with support for both array-based and paginated API responses:

```javascript
// Store state includes pagination metadata
totalProducts: 0,
totalPages: 0,
currentPage: 1,
limit: 12,

// Pagination controls
setPage: (page) => set({ currentPage: page }),
resetPagination: () => set({ currentPage: 1 }),
```

Pagination is applied to all product-fetching methods:
- `getProduct(page, limit)` — all products
- `searchProduct(query, page, limit)` — search results
- `getCategoryProduct(slug, page, limit)` — category products

---

### 13. 💾 Persistent Cart Total Price (Zustand Persist)

**File:** [`useCartStore.js`](./Starlit_Stationary_frontend/src/store/useCartStore.js)

The cart total price now **persists across page refreshes** and navigation using Zustand's `persist` middleware with `localStorage`:

```javascript
export const useTotalPriceStore = create(
  persist(
    (set) => ({
      totalPrice: 0,
      setTotalPrice: (price) => set({ totalPrice: price }),
      clearTotalPrice: () => set({ totalPrice: 0 })
    }),
    {
      name: "total-price-storage",
      partialize: (state) => ({ totalPrice: state.totalPrice })
    }
  )
);
```

This ensures the total price survives navigation from the cart page to the checkout/order page without requiring a re-fetch.

---

### 14. 💀 Skeleton Loading States

**Files:** [`AdminOrders.jsx`](./Starlit_Stationary_frontend/src/Pages/AdminOrders.jsx), [`YourOrderPage.jsx`](./Starlit_Stationary_frontend/src/Pages/YourOrderPage.jsx)

Instead of simple spinners, the application now uses **content-aware skeleton loaders** (shimmer placeholders) that mirror the actual layout of the data being loaded:

- **Order cards**: Skeleton includes placeholders for header, shipping info grid, products table, OTP section, and action buttons
- **Uses Tailwind's `animate-pulse`** for the shimmer effect
- **3 skeleton cards** are shown during loading to suggest content density

This significantly improves perceived performance and reduces layout shift (CLS).

---

### 15. ⚡ Optimistic State Updates

**File:** [`useOrderStore.js`](./Starlit_Stationary_frontend/src/store/useOrderStore.js)

The order store implements **optimistic state updates** for immediate UI feedback:

#### OTP Verification
After successful OTP verification, the store immediately updates `orders`, `allOrders`, and `specificOrders` arrays in-memory without waiting for a refetch:

```javascript
set((state) => ({
  orders: state.orders.map(order => 
    order._id === id ? { ...order, isDelivered: true, isPaid: true, ... } : order
  ),
  // Same for allOrders and specificOrders
}))
```

#### Order Cancellation
Similarly, cancellation updates are applied optimistically across all three order arrays.

---

### 16. 🔢 OTP Input UI with Auto-Focus

**File:** [`AdminOrders.jsx`](./Starlit_Stationary_frontend/src/Pages/AdminOrders.jsx)

A polished 6-digit OTP input component with:

- **Individual digit inputs**: Each digit gets its own input field
- **Auto-advance**: Focus automatically moves to the next input after entering a digit
- **Backspace navigation**: Pressing backspace on an empty input moves focus to the previous input
- **Auto-submit**: The OTP is automatically verified when all 6 digits are entered
- **Per-order OTP state**: Each order card manages its own OTP input state independently using a `ref` map
- **Error recovery**: On failed verification, the inputs clear and focus resets to the first digit

---

### 17. 📝 Order Cancellation UI with Reason Form

**Files:** [`AdminOrders.jsx`](./Starlit_Stationary_frontend/src/Pages/AdminOrders.jsx), [`YourOrderPage.jsx`](./Starlit_Stationary_frontend/src/Pages/YourOrderPage.jsx)

A two-step cancellation flow is implemented on both admin and customer order views:

1. **Step 1**: Click "Cancel Order" button — reveals the cancellation form
2. **Step 2**: Enter a cancellation reason in the textarea, then "Confirm Cancellation"
3. **Back button**: Users can dismiss the form without cancelling
4. **Loading state**: Button shows a spinner with "Cancelling..." text while processing
5. **Validation**: Empty reasons are rejected with a toast notification
6. **Visual feedback**: Cancelled orders display a prominent red banner with the cancellation reason

---

### 18. 📋 Admin Order Management Dashboard

**File:** [`AdminOrders.jsx`](./Starlit_Stationary_frontend/src/Pages/AdminOrders.jsx)

A comprehensive admin order management interface with:

- **Dual view modes**:
  - **Status view**: Filter orders by All / Pending / Delivered via dropdown
  - **Search view**: Search orders by customer name
- **Rich order cards** displaying:
  - Shipping information (name, phone, address, postal code)
  - Product table with name, price, quantity, and line totals
  - Grand total
  - OTP verification input (for pending orders)
  - Payment and delivery status badges
  - Cancel order functionality
- **Empty state**: Custom illustration with helpful message when no orders match
- **Responsive design**: Adapts from mobile to desktop layouts

---

### 19. ⏱️ Minimum Loading Duration (Anti-Flicker)

**File:** [`useCartStore.js`](./Starlit_Stationary_frontend/src/store/useCartStore.js)

Cart operations (add, update, remove) enforce a **minimum 2-second loading state** to prevent jarring UI flickers from near-instant API responses:

```javascript
const start = Date.now();
try {
  await axiosInstance.post("Cart/add", data);
} finally {
  const elapsed = Date.now() - start;
  if (elapsed < 2000) await new Promise(r => setTimeout(r, 2000 - elapsed));
  set({ addingProductId: null });
}
```

This ensures smooth loading animations complete naturally, even when the API responds in milliseconds.

---

## New Environment Variables

The following environment variables are **new** and not documented in the existing READMEs:

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST API URL for caching and rate limiting | ✅ Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis authentication token | ✅ Yes |
| `OPENCAGE_API_KEY` | OpenCage Geocoding API key for address validation | ✅ Yes |
| `FIXED_LAT` | Store's fixed latitude coordinate (delivery origin) | ✅ Yes |
| `FIXED_LON` | Store's fixed longitude coordinate (delivery origin) | ✅ Yes |

### Example `.env` additions

```env
# Upstash Redis (Caching & Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# OpenCage Geocoding (Delivery Validation)
OPENCAGE_API_KEY=your_opencage_api_key

# Store Fixed Coordinates (Delivery Origin)
FIXED_LAT=22.6995977
FIXED_LON=75.8542953
```

---

## New Dependencies

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `@upstash/redis` | ^1.38.0 | Serverless Redis client for caching |
| `@upstash/ratelimit` | ^2.0.8 | Rate limiting with sliding window algorithm |
| `axios` | ^1.11.0 | HTTP client for OpenCage Geocoding API calls |

### Frontend

No new runtime dependencies were added. All new features are built using existing packages (React, Zustand, Lucide React, React Hot Toast).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│                                                                  │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────────┐  │
│  │useDebounce│ │usePaginate│ │useSmartLdr│ │ Zustand Stores   │  │
│  └──────────┘ └───────────┘ └───────────┘ │ (persist:price)  │  │
│                                            └──────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pages: AdminOrders | YourOrder | Order | Cart | Product    │  │
│  │ Features: Skeleton Loaders | OTP Input | Cancel Flow       │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js + Node)                    │
│                                                                  │
│  ┌──────────────┐   ┌─────────────────┐   ┌────────────────┐   │
│  │  Rate Limiter │──▶│   Auth + Admin   │──▶│  Controllers   │   │
│  │  (Upstash)    │   │   Middleware     │   │                │   │
│  └──────────────┘   └─────────────────┘   └───────┬────────┘   │
│                                                     │            │
│  ┌──────────────┐   ┌─────────────────┐            │            │
│  │ Geo Validator │   │  Redis Cache    │◀───────────┘            │
│  │ (OpenCage)    │   │  (Upstash)      │                        │
│  └──────────────┘   └────────┬────────┘                        │
│                               │                                  │
│                               ▼                                  │
│                    ┌─────────────────┐                           │
│                    │    MongoDB      │                           │
│                    │  (Mongoose)     │                           │
│                    └─────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites (New)

In addition to the prerequisites listed in the individual READMEs, you now need:

1. **Upstash Redis account** — Sign up at [upstash.com](https://upstash.com) and create a Redis database
2. **OpenCage API key** — Register at [opencagedata.com](https://opencagedata.com) for geocoding

### Quick Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd E-commerce

# 2. Setup Backend
cd Starlit_Stationary_backend
npm install
# Add UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, OPENCAGE_API_KEY,
# FIXED_LAT, and FIXED_LON to your .env file
npm run dev

# 3. Setup Frontend (in a new terminal)
cd Starlit_Stationary_frontend
npm install
npm run dev
```

### Verifying New Features

| Feature | How to Test |
|---------|-------------|
| Redis Caching | Hit the same product endpoint twice — second response should be faster (check server logs) |
| Rate Limiting | Rapidly hit an endpoint beyond its limit — should receive 429 status |
| Geo Validation | Place an order with an address >15km from the store — should be rejected |
| OTP Verification | Place an order → note the OTP on "Your Orders" page → enter it in Admin Orders |
| Order Cancellation | Go to "Your Orders" → click Cancel → provide a reason → confirm |
| Skeleton Loaders | Navigate to "Your Orders" or "Admin Orders" with slow network — observe skeleton UI |

---

## Related Documentation

- [Frontend README](./Starlit_Stationary_frontend/README.md) — Core frontend setup, pages, components, and deployment
- [Backend README](./Starlit_Stationary_backend/README.md) — Core backend setup, API endpoints, models, and authentication

---

**Last Updated**: June 2026
