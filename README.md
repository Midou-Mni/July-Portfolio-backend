# Portfolio Backend API

A modern, performant backend API for a personal portfolio website built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication for admin users
- **Projects API**: CRUD operations for portfolio projects
- **Reviews API**: Allow visitors to submit reviews for projects
- **Security**: Helmet, rate limiting, and input validation
- **Performance**: Compression, async handlers, and proper error handling

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Morgan for logging
- Joi for validation
- Express Rate Limiter

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new admin user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get current user profile (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:projectId` - Get project by ID
- `POST /api/projects` - Create a new project (admin only)
- `PUT /api/projects/:projectId` - Update project (admin only)
- `DELETE /api/projects/:projectId` - Delete project (admin only)

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:certificateId` - Get certificate by ID
- `POST /api/certificates` - Create a new certificate (admin only)
- `PUT /api/certificates/:certificateId` - Update certificate (admin only)
- `DELETE /api/certificates/:certificateId` - Delete certificate (admin only)

### Reviews
- `GET /api/reviews?projectId=xyz` - Get reviews for a project
- `POST /api/reviews` - Create a new review (rate limited)
- `DELETE /api/reviews/:reviewId` - Delete review (admin only)

## Testing with Postman

For detailed instructions on testing the API with Postman, please refer to:

- [POSTMAN_TESTING.md](./POSTMAN_TESTING.md) - Step-by-step guide for testing all endpoints
- [API_REFERENCE.md](./API_REFERENCE.md) - Quick reference for all API endpoints

The Postman collection and environment files are available in the `postman` directory:
- `Portfolio_API.postman_collection.json`
- `Portfolio_API.postman_environment.json`

## Security Features

- JWT Authentication for admin routes
- Rate limiting for review submissions
- Input validation with Joi
- Helmet for HTTP security headers
- MongoDB index for preventing duplicate reviews 