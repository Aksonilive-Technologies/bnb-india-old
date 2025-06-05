# PineStays Backend API Requirements

This document outlines the API endpoints required by the PineStays frontend application. The backend will be implemented as a separate project.

## Authentication API

- **POST /api/auth/login** - User login
  - Request: `{ email, password }`
  - Response: `{ success, token, user }`

- **POST /api/auth/register** - User registration
  - Request: `{ firstName, lastName, email, password, phoneNumber }`
  - Response: `{ success, token, user }`

- **GET /api/auth/user** - Get current user details
  - Headers: Authorization token
  - Response: `{ success, user }`

- **PUT /api/auth/user** - Update user profile
  - Headers: Authorization token
  - Request: `{ firstName, lastName, email, phoneNumber, profileImage, etc. }`
  - Response: `{ success, user }`

## Listings API

- **GET /api/listings** - Get all listings with filters
  - Query parameters: `adults, children, pets, checkin, checkout, location, category, placeType, priceRange, amenities, bedroomCount, bedCount, bathroomCount, familyOnly, bnbVerified, sort`
  - Response: `{ success, listings, count }`

- **GET /api/listings/:id** - Get listing details
  - Response: `{ success, listing }`

- **POST /api/listings** - Create new listing (host only)
  - Headers: Authorization token
  - Request: Listing details including location, amenities, pricing, etc.
  - Response: `{ success, listing }`

- **PUT /api/listings/:id** - Update listing (host only)
  - Headers: Authorization token
  - Request: Updated listing details
  - Response: `{ success, listing }`

- **DELETE /api/listings/:id** - Delete listing (host only)
  - Headers: Authorization token
  - Response: `{ success, message }`

## Booking API

- **POST /api/bookings** - Create booking
  - Headers: Authorization token
  - Request: `{ propertyId, checkinDate, checkoutDate, adults, children, pets, totalPrice }`
  - Response: `{ success, booking }`

- **GET /api/bookings/user** - Get user bookings
  - Headers: Authorization token
  - Response: `{ success, bookings }`

- **GET /api/bookings/host** - Get host bookings
  - Headers: Authorization token
  - Response: `{ success, bookings }`

- **GET /api/bookings/:id** - Get booking details
  - Headers: Authorization token
  - Response: `{ success, booking }`

## Payment API

- **POST /api/payments/create-order** - Create payment order
  - Headers: Authorization token
  - Request: `{ amount, currency }`
  - Response: `{ success, orderId }`

- **POST /api/payments/verify** - Verify payment
  - Headers: Authorization token
  - Request: `{ orderId, paymentId, signature }`
  - Response: `{ success, transaction }`

- **POST /api/payments/refund** - Process refund
  - Headers: Authorization token
  - Request: `{ paymentId, amount, reason }`
  - Response: `{ success, refund }`

## Reviews API

- **POST /api/reviews/villa** - Add villa review
  - Headers: Authorization token
  - Request: Review details
  - Response: `{ success, review }`

- **GET /api/reviews/villa/:id** - Get villa reviews
  - Response: `{ success, reviews }`

- **POST /api/reviews/host** - Add host review
  - Headers: Authorization token
  - Request: Review details
  - Response: `{ success, review }`

- **GET /api/reviews/host/:id** - Get host reviews
  - Response: `{ success, reviews }`

## Wishlist API

- **POST /api/wishlist** - Add to wishlist
  - Headers: Authorization token
  - Request: `{ villaId }`
  - Response: `{ success, wishlist }`

- **DELETE /api/wishlist/:id** - Remove from wishlist
  - Headers: Authorization token
  - Response: `{ success, message }`

- **GET /api/wishlist** - Get user wishlist
  - Headers: Authorization token
  - Response: `{ success, wishlist }`

## Blog API

- **GET /api/blogs** - Get all blogs
  - Response: `{ success, blogs }`

- **GET /api/blogs/:id** - Get blog details
  - Response: `{ success, blog }`

## Integration Requirements

- All API endpoints should return consistent response formats
- Authentication should use JWT tokens
- All endpoints should handle errors gracefully
- API should implement rate limiting
- Provide comprehensive API documentation
