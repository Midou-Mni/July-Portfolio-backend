# Portfolio Backend API

A modern, performant backend API for a personal portfolio website built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication for admin users
- **Projects API**: CRUD operations for portfolio projects
- **Reviews API**: Allow visitors to submit reviews for projects
- **Image Upload**: File upload functionality for projects and certificates
- **Multiple Images**: Support for multiple images per project with gallery view
- **Admin Controls**: Admins can delete reviews and manage project images
- **Security**: Helmet, rate limiting, and input validation
- **Performance**: Compression, async handlers, and proper error handling

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
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
   PORT=4000
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
- `POST /api/projects` - Create a new project with optional image upload (admin only)
- `PUT /api/projects/:projectId` - Update project with optional image upload (admin only)
- `DELETE /api/projects/:projectId` - Delete project (admin only)
- `POST /api/projects/:projectId/images` - Add additional images to a project (admin only)
- `DELETE /api/projects/:projectId/images/:imageIndex` - Remove an image from a project (admin only)

### Certificates
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/:certificateId` - Get certificate by ID
- `POST /api/certificates` - Create a new certificate with optional image upload (admin only)
- `PUT /api/certificates/:certificateId` - Update certificate with optional image upload (admin only)
- `DELETE /api/certificates/:certificateId` - Delete certificate (admin only)

### Reviews
- `GET /api/reviews?projectId=xyz` - Get reviews for a project
- `POST /api/reviews` - Create a new review (rate limited)
- `DELETE /api/reviews/:reviewId` - Delete review (admin only)

## Image Upload Functionality

The API supports image uploads for projects and certificates:

- **Supported formats**: PNG, JPG, GIF
- **Maximum file size**: 10MB
- **Storage**: Images are stored in the `uploads` directory
- **Access**: Images are served as static files at `/uploads/{filename}`
- **Implementation**: Uses Multer middleware for handling multipart/form-data

### Multiple Project Images

Projects can now have multiple images:

- **Main Image**: The primary image shown on project cards
- **Additional Images**: Up to 10 extra images that can be added to each project
- **API Endpoints**: Dedicated endpoints for adding and removing images
- **Automatic Cleanup**: Old images are automatically deleted when replaced

Example request with image upload using FormData:
```javascript
const formData = new FormData();
formData.append('title', 'Project Title');
formData.append('description', 'Project Description');
formData.append('image', mainImageFile); // Main image
formData.append('additionalImages', imageFile1); // Additional image 1
formData.append('additionalImages', imageFile2); // Additional image 2

// Send with proper headers
axios.post('/api/projects', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});
```

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
- File type validation for uploads
- Automatic cleanup of old image files when updating 