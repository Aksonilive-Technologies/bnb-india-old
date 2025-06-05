# PineStays - Project Context

## Project Overview

PineStays is a platform for unique accommodations and experiences, similar to Airbnb but focused on the Indian market. The platform connects travelers with hosts offering unique places to stay, from cozy cabins to luxury villas.

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.3 (React 18)
- **Language**: TypeScript
- **Styling**: 
  - TailwindCSS for utility-first CSS
  - Various UI libraries including NextUI, Radix UI, and MUI components
- **State Management**: 
  - Zustand for global state management
  - React Context API for component-level state
- **Form Handling**: 
  - React Hook Form for form state management
  - Zod for schema validation
- **Data Fetching**: Next.js data fetching patterns

### Backend
- **Framework**: Next.js API Routes
- **Database**: 
  - PostgreSQL via Prisma ORM
  - Prisma for database schema management and type-safe queries
- **Authentication**: 
  - Currently using Firebase Authentication + Prisma DB for user data storage
  - Transitioning to API-based authentication with external backend
- **File Storage**: Firebase Storage for images and other media
- **Real-time Features**: Socket.io for real-time communication (chat)

### Maps & Location
- **Map Libraries**: 
  - React Map GL for interactive maps
  - Leaflet for additional map functionality
  - Leaflet GeoSearch for location search

### Payment Processing
- **Payment Gateway**: Razorpay for processing payments

### Rich Text Editing
- **Editors**: 
  - React Quill for rich text editing
  - Draft.js for content editing

## Project Structure

- **`/app`**: Contains the Next.js app router structure with pages and layouts
  - `/(auth)`: Authentication-related pages
  - `/hostpanel`: Host dashboard and management
  - `/profile`: User profile management
  - `/details`: Property details
  - `/blogs`: Blog system
  - `/chat`: Messaging system
  - Various other route-specific directories

- **`/components`**: Reusable UI components organized by functionality
  - UI components, forms, modals, etc.

- **`/actions`**: Server actions for data mutations

- **`/prisma`**: Database schema and migrations
  - Key models include: Listing, Booking, Users, VillaImages, HotelPriceData, etc.

- **`/firebase`**: Firebase configuration and utilities

- **`/lib`**: Utility functions and shared libraries
  - Database utilities, helpers, etc.

- **`/hooks`**: Custom React hooks

- **`/store`**: Zustand store definitions for state management

- **`/styles`**: Global styles and style-related configurations

- **`/utils`**: Utility functions

- **`/public`**: Static assets

## Key Features

1. **Property Listings**: Users can browse and search for accommodations
2. **Booking System**: Complete flow for booking properties with date selection
3. **User Profiles**: User account management
4. **Host Panel**: Dashboard for property owners to manage listings
5. **Reviews & Ratings**: System for users to review properties
6. **Real-time Chat**: Communication between hosts and guests
7. **Blog System**: Content publishing for travel guides and tips
8. **Payment Processing**: Secure payment handling with Razorpay
9. **Interactive Maps**: Location-based property search and visualization
10. **Dynamic Pricing**: Support for date-specific pricing
11. **Wishlist**: Users can save favorite properties
12. **Responsive Design**: Mobile-friendly interface

## Database Structure

The database is structured around several key models:

- **Listing**: Property listings with details, pricing, and availability
- **Booking**: Reservation records linking users and properties
- **Users**: User profiles with personal information
- **VillaImages**: Images associated with properties
- **HotelPriceData**: Dynamic pricing data for specific dates
- **Reviews**: Various review models for properties and users
- **Wishlist**: Saved properties for users
- **Blog**: Content publishing system

## Current Authentication Implementation

The application currently uses a combination of Firebase Authentication and PostgreSQL database:

1. **Firebase Authentication**: Manages the authentication process including:
   - Email/password login
   - Google OAuth integration
   - Token generation and verification
   - Session management

2. **PostgreSQL/Prisma**: Stores user profile data including:
   - Basic user information (name, email, phone)
   - Profile details and preferences
   - Host-related information
   - Connection to other data models

3. **Current Authentication Flow**:
   - User registers/logs in via Firebase Auth
   - Firebase returns authentication tokens
   - User data is stored/retrieved from Prisma database
   - Cookies are used to maintain sessions
   - JWT tokens used for API authorization

## API Integration Requirements

The application needs to transition from Firebase Authentication + Prisma DB to a fully API-based authentication system:

1. **Backend API Endpoint**: https://bnbindiabeta.vercel.app

2. **Authentication API Endpoints**:
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

3. **Authentication Flow Changes**:
   - Replace Firebase Auth with API calls
   - Maintain token-based authentication using JWT
   - Update middleware for route protection
   - Modify user profile management

4. **Token Management**:
   - Store JWT token in cookies
   - Include token in API requests
   - Handle token expiration and refresh

## Development Workflow

- Next.js development server with hot reloading
- Prisma Studio for database management
- TypeScript for type safety
- ESLint and Prettier for code quality
- API-first development approach for backend integration
