# Starlit Stationary Frontend

A modern, responsive React-based frontend for the Starlit Stationary e-commerce platform. Built with Vite, Tailwind CSS, and featuring smooth animations with Framer Motion.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages Overview](#pages-overview)
- [Components](#components)
- [State Management](#state-management)
- [Styling](#styling)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign up and login functionality with JWT tokens
- **Product Browsing**: Browse and search for stationary products
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Create orders and track order history
- **Admin Dashboard**: Manage products, create/update items
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Page transitions and interactive animations with Framer Motion
- **Toast Notifications**: User-friendly feedback with React Hot Toast
- **Search Functionality**: Search products by name and category
- **Image Carousel**: Product showcase with Embla Carousel

## Tech Stack

- **React**: 19.1.0 - UI library
- **Vite**: 6.2.0 - Build tool and dev server
- **Tailwind CSS**: 3.4.17 - Utility-first CSS framework
- **Framer Motion**: 12.23.0 - Animation library
- **React Router**: 7.6.2 - Client-side routing
- **Zustand**: 5.0.5 - State management
- **Axios**: 1.10.0 - HTTP client
- **React Hot Toast**: 2.5.2 - Toast notifications
- **Lucide React**: 0.518.0 - Icon library
- **Embla Carousel**: 8.6.0 - Carousel component

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Git
- Backend API running (see backend README)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Starlit_Stationary_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Configuration](#configuration) section)

## Configuration

Create a `.env` file or `.env.local` in the root directory:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000

# Environment
VITE_ENV=development
```

For production, create a `.env.production` file:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_BACKEND_URL=https://your-backend-api.com
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the Vite dev server, usually at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Locally preview the production build

### Linting
```bash
npm run lint
```
Check code quality with ESLint

## Project Structure

```
src/
├── Components/
│   ├── Navbar.jsx                  # Navigation bar component
│   ├── PageTransition.jsx          # Page animation wrapper
│   └── Search.jsx                  # Search bar component
├── Contexts/
│   └── CartContext.js              # Cart context (legacy)
├── Pages/
│   ├── HomePage.jsx                # Landing page
│   ├── ProductPage.jsx             # Product listing page
│   ├── CartPage.jsx                # Shopping cart page
│   ├── OrderPage.jsx               # Order creation page
│   ├── YourOrderPage.jsx           # Order history page
│   ├── SignUpPage.jsx              # User registration
│   ├── SignInPage.jsx              # User login
│   ├── Contact_Us.jsx              # Contact page
│   ├── AdminOrders.jsx             # Admin order management
│   ├── NewProduct.jsx              # Create new product (admin)
│   └── UpdateProduct.jsx           # Edit product (admin)
├── store/
│   ├── useAuthStore.js             # Authentication state
│   ├── useCartStore.js             # Shopping cart state
│   ├── useProductStore.js          # Products state
│   ├── useOrderStore.js            # Orders state
│   └── useIsAdminStore.js          # Admin status state
├── lib/
│   └── axios.js                    # Axios instance configuration
├── assets/                         # Static assets
├── App.jsx                         # Main app component
├── index.css                       # Global styles
├── main.jsx                        # Entry point
└── postcss.config.js               # PostCSS configuration
```

## Pages Overview

### Public Pages
- **HomePage**: Landing page with featured products and hero section
- **ProductPage**: Browse all products with filtering and search
- **ProductDetails**: View product information and add to cart
- **CartPage**: View cart items, update quantities, proceed to checkout
- **OrderPage**: Create and place orders
- **YourOrderPage**: View user's order history
- **SignUpPage**: User registration
- **SignInPage**: User login
- **Contact_Us**: Contact information and form

### Admin Pages
- **NewProduct**: Create new product with image upload
- **UpdateProduct**: Edit existing product details
- **AdminOrders**: View and manage all orders

## Components

### Navbar
Main navigation component with:
- Logo and branding
- Search functionality
- Navigation links
- User authentication menu
- Admin panel access
- Cart icon with item count

### PageTransition
Wrapper component providing smooth page animations using Framer Motion

### Search
Advanced search component with:
- Real-time product search
- Category filtering
- Search results highlighting

## State Management

The application uses **Zustand** for state management with the following stores:

### useAuthStore
- User authentication state
- Login/logout functionality
- User profile information
- Token management

### useCartStore
- Shopping cart items
- Add/remove items
- Update quantities
- Cart total calculation

### useProductStore
- Products list
- Product filters
- Fetch and update products
- Search functionality

### useOrderStore
- User orders
- Order history
- Order details
- Order creation

### useIsAdminStore
- Admin status flag
- Permission checks

## Styling

### Tailwind CSS
Utility-first CSS framework for rapid UI development with:
- Responsive design utilities
- Custom color schemes
- Component classes in `tailwind.config.js`

### Framer Motion
For smooth animations:
- Page transitions
- Component entrance/exit animations
- Interactive hover effects
- Gesture animations

### CSS Modules
Custom styles in `index.css` for:
- Global styles
- Typography
- Custom utilities

## Building for Production

### Build Command
```bash
npm run build
```

This creates:
- Minified JavaScript bundle
- Optimized CSS
- Static assets in `dist/` folder

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── public/
```

## Deployment

### Vercel (Recommended)
The project includes `vercel.json` for deployment:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

**Netlify**:
- Build command: `npm run build`
- Publish directory: `dist`

**GitHub Pages**:
- Build command: `npm run build`
- Deploy the `dist` folder

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:5000/api |
| VITE_BACKEND_URL | Backend URL (non-API) | http://localhost:5000 |
| VITE_ENV | Environment type | development/production |

## Performance Optimization

- **Code Splitting**: Automatic route-based code splitting with React Router
- **Image Optimization**: Lazy loading for product images
- **Bundle Analysis**: Use `npm run build` to check bundle size
- **Caching**: Axios configured with cache strategies

## Error Handling

- **HTTP Errors**: Automatic error handling with toast notifications
- **Network Errors**: Graceful fallbacks for offline scenarios
- **Form Validation**: Client-side validation before submission
- **Auth Errors**: Automatic redirect to login for unauthorized access

## Troubleshooting

### Port Already in Use
```bash
# Change the port
npm run dev -- --port 3000
```

### Build Fails
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
- Verify backend is running
- Check `VITE_API_URL` in environment variables
- Ensure backend CORS allows frontend origin

### Node Version Issues
```bash
# Use Node version manager
nvm use 18
npm install
npm run dev
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Quality

### ESLint
```bash
npm run lint
```

To automatically fix issues:
```bash
npx eslint . --fix
```

### Formatting
Code should follow React and ES6+ best practices:
- Use functional components
- Use hooks for state management
- Follow naming conventions
- Add JSDoc comments for complex functions

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Last Updated**: January 2026
