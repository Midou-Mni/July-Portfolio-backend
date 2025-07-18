# Postman Testing Guide

This guide provides step-by-step instructions for testing the Portfolio API using Postman.

## Setup

1. Import the Postman collection from the `postman` directory:
   - `Portfolio_API.postman_collection.json`

2. Import the environment file:
   - `Portfolio_API.postman_environment.json`

3. Set up your environment variables:
   - `base_url`: Your API base URL (default: `http://localhost:4000/api`)
   - `token`: Will be automatically set after login

## Testing Workflow

### 1. Admin Authentication

#### Register Admin User

1. Open the `Auth > Register Admin` request
2. Set the request body:
   ```json
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "password123"
   }
   ```
3. Send the request
4. Verify you receive a 201 Created response with user details and token

#### Login as Admin

1. Open the `Auth > Login` request
2. Set the request body:
   ```json
   {
     "email": "admin@example.com",
     "password": "password123"
   }
   ```
3. Send the request
4. Verify you receive a 200 OK response with user details and token
5. The token will be automatically set in your environment variables

#### Get Admin Profile

1. Open the `Auth > Get Profile` request
2. Ensure the Authorization header is set with the token
3. Send the request
4. Verify you receive a 200 OK response with your user details

### 2. Projects API

#### Create Project with JSON

1. Open the `Projects > Create Project` request
2. Set the request body:
   ```json
   {
     "title": "Portfolio Website",
     "description": "My personal portfolio website built with React and Node.js",
     "technologies": ["React", "Node.js", "Express", "MongoDB"],
     "imageUrl": "https://example.com/portfolio.jpg",
     "liveUrl": "https://myportfolio.com",
     "githubUrl": "https://github.com/username/portfolio",
     "featured": true
   }
   ```
3. Send the request
4. Verify you receive a 201 Created response with the project details
5. Save the project ID for later use

#### Create Project with Image Upload

1. Open the `Projects > Create Project with Image` request
2. Set the request body type to `form-data`
3. Add the following key-value pairs:
   - `title`: Portfolio Website with Image
   - `description`: My personal portfolio website built with React and Node.js
   - `technologies[0]`: React
   - `technologies[1]`: Node.js
   - `technologies[2]`: Express
   - `technologies[3]`: MongoDB
   - `liveUrl`: https://myportfolio.com
   - `githubUrl`: https://github.com/username/portfolio
   - `featured`: true
   - `image`: [Select an image file from your computer]
4. For the `image` field, make sure to select "File" type in Postman
5. Send the request
6. Verify you receive a 201 Created response with the project details
7. Note the `imageUrl` in the response, which should point to the uploaded file
8. Save the project ID for later use

#### Add Additional Images to Project

1. Open the `Projects > Add Project Images` request
2. Replace `:projectId` in the URL with the ID of the project you created
3. Set the request body type to `form-data`
4. Add the following key-value pairs:
   - `additionalImages`: [Select an image file from your computer]
   - `additionalImages`: [Select another image file from your computer]
5. For the `additionalImages` fields, make sure to select "File" type in Postman
6. Send the request
7. Verify you receive a 200 OK response with the project details
8. Note the `additionalImages` array in the response, which should contain the URLs of the uploaded files

#### Remove Project Image

1. Open the `Projects > Remove Project Image` request
2. Replace `:projectId` in the URL with the ID of the project you created
3. Replace `:imageIndex` in the URL with the index of the image you want to remove (e.g., `0` for the first additional image)
4. Send the request
5. Verify you receive a 200 OK response with the project details
6. Note that the specified image has been removed from the `additionalImages` array

#### Get All Projects

1. Open the `Projects > Get All Projects` request
2. Send the request
3. Verify you receive a 200 OK response with an array of projects

#### Get Project by ID

1. Open the `Projects > Get Project by ID` request
2. Replace `:projectId` in the URL with the ID of the project you created
3. Send the request
4. Verify you receive a 200 OK response with the project details
5. Note that the response includes an `allImages` array containing all project images (main image + additional images)

#### Update Project with Image Upload

1. Open the `Projects > Update Project with Image` request
2. Replace `:projectId` in the URL with the ID of the project you created
3. Set the request body type to `form-data`
4. Add the following key-value pairs:
   - `title`: Updated Portfolio Website
   - `featured`: false
   - `image`: [Select a different image file from your computer]
   - `additionalImages`: [Select an image file from your computer]
   - `replaceAllImages`: true (optional, set to replace all existing additional images)
5. For the image fields, make sure to select "File" type in Postman
6. Send the request
7. Verify you receive a 200 OK response with the updated project details
8. Note that the `imageUrl` should now point to the newly uploaded image

### 3. Certificates API

#### Create Certificate (JSON)

1. Open the `Certificates > Create Certificate` request
2. Set the request body:
   ```json
   {
     "title": "AWS Certified Solutions Architect",
     "issuer": "Amazon Web Services",
     "issueDate": "2023-01-15",
     "expiryDate": "2026-01-15",
     "credentialId": "ABC123456",
     "credentialUrl": "https://aws.amazon.com/verification/123456",
     "imageUrl": "https://example.com/certificate.jpg",
     "description": "Professional level certification for AWS architecture",
     "featured": true,
     "order": 1
   }
   ```
3. Send the request
4. Verify you receive a 201 Created response with the certificate details
5. Save the certificate ID for later use

#### Create Certificate with Image Upload

1. Open the `Certificates > Create Certificate with Image` request
2. Set the request body type to `form-data`
3. Add the following key-value pairs:
   - `title`: React Developer Certificate
   - `issuer`: Meta
   - `issueDate`: 2023-01-15
   - `expiryDate`: 2026-01-15
   - `credentialId`: ABC123456
   - `credentialUrl`: https://example.com/verify/ABC123456
   - `description`: Professional certification for React development
   - `featured`: true
   - `image`: [Select an image file from your computer]
4. For the `image` field, make sure to select "File" type in Postman
5. Send the request
6. Verify you receive a 201 Created response with the certificate details
7. Note the `imageUrl` in the response, which should point to the uploaded file
8. Save the certificate ID for later use

#### Get All Certificates

1. Open the `Certificates > Get All Certificates` request
2. Send the request
3. Verify you receive a 200 OK response with an array of certificates

#### Get Certificate by ID

1. Open the `Certificates > Get Certificate by ID` request
2. Replace `:certificateId` in the URL with the ID of the certificate you created
3. Send the request
4. Verify you receive a 200 OK response with the certificate details

#### Update Certificate with Image Upload

1. Open the `Certificates > Update Certificate with Image` request
2. Replace `:certificateId` in the URL with the ID of the certificate you created
3. Set the request body type to `form-data`
4. Add the following key-value pairs:
   - `title`: Updated Certificate Title
   - `featured`: false
   - `image`: [Select a different image file from your computer]
5. For the `image` field, make sure to select "File" type in Postman
6. Send the request
7. Verify you receive a 200 OK response with the updated certificate details
8. Note that the `imageUrl` should now point to the newly uploaded image

#### Delete Certificate

1. Open the `Certificates > Delete Certificate` request
2. Replace `:certificateId` in the URL with the ID of the certificate you created
3. Send the request
4. Verify you receive a 200 OK response confirming the certificate was deleted

### 4. Reviews API

#### Create Review

1. Open the `Reviews > Create Review` request
2. Set the request body:
   ```json
   {
     "project": "project_id_here",
     "name": "John Doe",
     "rating": 5,
     "comment": "Amazing project! I love the design and functionality."
   }
   ```
3. Replace `project_id_here` with the ID of the project you created
4. Send the request
5. Verify you receive a 201 Created response with the review details
6. Save the review ID for later use

#### Get Reviews by Project

1. Open the `Reviews > Get Reviews by Project` request
2. Set the query parameter `projectId` to the ID of the project you created
3. Send the request
4. Verify you receive a 200 OK response with an array of reviews for that project

#### Delete Review (Admin Only)

1. Open the `Reviews > Delete Review` request
2. Replace `:reviewId` in the URL with the ID of the review you created
3. Ensure the Authorization header is set with the admin token
4. Send the request
5. Verify you receive a 200 OK response confirming the review was deleted
6. Verify the review is no longer returned when getting reviews by project

### 5. Testing Error Handling

#### Authentication Errors

1. Try to access an admin-only endpoint without a token
2. Verify you receive a 401 Unauthorized response

#### Validation Errors

1. Try to create a project with missing required fields
2. Verify you receive a 400 Bad Request response with validation error details

#### Not Found Errors

1. Try to get a project with a non-existent ID
2. Verify you receive a 404 Not Found response

#### Permission Errors

1. Try to delete a review with a non-admin user token
2. Verify you receive a 403 Forbidden response 