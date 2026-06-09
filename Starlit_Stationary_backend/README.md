# Starlit Stationary Backend

A robust Node.js and Express-based REST API backend for the Starlit Stationary e-commerce platform. This backend provides comprehensive functionality for managing products, user authentication, shopping carts, orders, and admin operations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: JWT-based authentication with secure password hashing using bcryptjs
- **Product Management**: Full CRUD operations for products with image uploading via Cloudinary
- **Admin Controls**: Dedicated admin endpoints for managing products and viewing orders
- **Shopping Cart**: Complete cart management functionality
- **Order Management**: Order creation, retrieval, and status management
- **Image Hosting**: Cloudinary integration for storing and managing product images
- **API Documentation**: Swagger UI for easy API exploration
- **Security**: CORS protection, cookie parsing, and input validation
- **Profanity Filter**: Content moderation using glin-profanity

## Tech Stack

- **Runtime**: Node.js with ES6 Modules
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose ODM 8.15.2
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.2
- **Image Service**: Cloudinary 2.6.1
- **API Documentation**: Swagger UI Express 5.0.1
- **Development**: Nodemon for auto-restart

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- Cloudinary account for image hosting
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Starlit_Stationary_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Configuration](#configuration) section)

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/starlit_stationary
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/starlit_stationary

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URLs (CORS)
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://starlit-stationary-frontend.vercel.app
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with Nodemon for automatic restart on file changes.

### Production Mode
```bash
npm start
```

### API Documentation
```bash
npm run swagger
```
Access the Swagger UI at `http://localhost:PORT/api-docs`

## Project Structure

```
src/
├── Controllers/
│   ├── admin.product.controller.js    # Admin product management
│   ├── auth.controller.js              # Authentication logic
│   ├── cart.controller.js              # Shopping cart operations
│   ├── order.controller.js             # Order management
│   └── product.controller.js           # Product operations
├── Models/
│   ├── user.model.js                   # User schema
│   ├── product.model.js                # Product schema
│   ├── cart.model.js                   # Cart schema
│   └── order.model.js                  # Order schema
├── Routes/
│   ├── auth.route.js                   # Auth endpoints
│   ├── product.route.js                # Product endpoints
│   ├── admin.product.route.js          # Admin product endpoints
│   ├── cart.route.js                   # Cart endpoints
│   └── order.route.js                  # Order endpoints
├── Middleware/
│   ├── auth.middleware.js              # JWT verification
│   └── admin.middleware.js             # Admin authorization
├── lib/
│   ├── db.js                           # Database connection
│   ├── cloudinary.js                   # Cloudinary configuration
│   ├── map.js                          # Utility mapping functions
│   └── util.js                         # Utility functions
└── index.js                            # Application entry point
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile (protected)
- `POST /refresh` - Refresh JWT token

### Product Routes (`/api/Products`)
- `GET /` - Get all products
- `GET /:id` - Get single product
- `GET /search/:query` - Search products
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### Cart Routes (`/api/cart`)
- `GET /` - Get user cart (protected)
- `POST /add` - Add item to cart (protected)
- `PUT /:productId` - Update cart item (protected)
- `DELETE /:productId` - Remove from cart (protected)

### Order Routes (`/api/orders`)
- `GET /` - Get user orders (protected)
- `POST /` - Create order (protected)
- `GET /:id` - Get order details (protected)
- `PUT /:id` - Update order status (admin only)

### Admin Routes (`/api/admin/products`)
- `GET /` - List all products with stats
- `POST /` - Create product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product
- `GET /orders` - View all orders

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Token Storage**: JWT tokens are stored in HTTP-only cookies
2. **Token Expiration**: Configurable via JWT_EXPIRE in environment variables
3. **Protected Routes**: Middleware validates JWT tokens on protected endpoints
4. **Admin Verification**: Additional middleware checks admin privileges for admin routes

## Database

### Models

**User Model**
- Email (unique)
- Password (hashed)
- Full name
- Role (user/admin)
- Cart reference
- Order history

**Product Model**
- Name
- Description
- Price
- Stock quantity
- Category
- Image URL (Cloudinary)
- Created/Updated timestamps

**Cart Model**
- User reference
- Items array with product references and quantities
- Total price calculation

**Order Model**
- User reference
- Items array
- Total amount
- Status (pending/processing/shipped/delivered)
- Shipping address
- Order date

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| JWT_EXPIRE | Token expiration time | 7d |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | my_cloud |
| CLOUDINARY_API_KEY | Cloudinary API key | xxxxx |
| CLOUDINARY_API_SECRET | Cloudinary API secret | xxxxx |

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development frontend)
- `https://starlit-stationary-frontend.vercel.app` (production frontend)

To add additional origins, update the `allowedOrigins` array in `index.js`.

## Security Features

- HTTP-only cookies for token storage
- CORS protection
- Password hashing with bcryptjs
- JWT token validation
- Input validation
- Profanity filtering
- Admin role-based access control

## Troubleshooting

### Database Connection Issues
- Verify MongoDB is running
- Check MONGODB_URI is correct
- Ensure network access is allowed in MongoDB Atlas

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file format

### CORS Errors
- Check frontend URL is in allowedOrigins
- Verify credentials: true is set for CORS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

**Last Updated**: January 2026
