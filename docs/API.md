# Cedarlume Marketplace API Documentation

## Overview

The Cedarlume Marketplace API is a RESTful API built with NestJS that provides endpoints for managing users, organizations, listings, applications, attendance, and donations in the nonprofit community marketplace.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://api.cedarlume.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login`
3. **OAuth**: `GET /auth/google` or `GET /auth/apple`

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Users

#### Get User Profile
```http
GET /users/me
Authorization: Bearer <token>
```

#### Update User Profile
```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "bio": "Passionate about community service"
}
```

#### Get User Stats
```http
GET /users/me/stats
Authorization: Bearer <token>
```

#### Get User Badges
```http
GET /users/me/badges
Authorization: Bearer <token>
```

### Organizations

#### List Organizations
```http
GET /organizations?limit=20&offset=0
```

#### Get Organization
```http
GET /organizations/{id}
```

#### Create Organization
```http
POST /organizations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Habitat for Humanity",
  "description": "Building homes and hope",
  "ein": "52-1234567",
  "websiteUrl": "https://www.habitat.org"
}
```

### Listings

#### List Listings
```http
GET /listings?limit=20&offset=0&listingType=volunteer_shift
```

#### Search Listings
```http
GET /listings/search?q=volunteer&latitude=37.7749&longitude=-122.4194&radius=25
```

#### Get Listing
```http
GET /listings/{id}
```

#### Create Listing
```http
POST /listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Community Garden Volunteer Day",
  "description": "Help maintain our community garden",
  "listingType": "volunteer_shift",
  "startDate": "2024-02-15T08:00:00Z",
  "endDate": "2024-02-15T17:00:00Z",
  "maxParticipants": 20
}
```

### Applications

#### List My Applications
```http
GET /applications/my?limit=20&offset=0
Authorization: Bearer <token>
```

#### Apply to Listing
```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "listingId": "listing-uuid",
  "shiftId": "shift-uuid",
  "applicationText": "I'm excited to help with this project!"
}
```

#### Update Application
```http
PATCH /applications/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```

### Attendance

#### Check In
```http
POST /attendance/check-in
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "application-uuid",
  "qrCode": "qr-code-string",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

#### Check Out
```http
POST /attendance/check-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "attendanceId": "attendance-uuid",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

#### Generate QR Code
```http
POST /attendance/qr-code
Authorization: Bearer <token>
Content-Type: application/json

{
  "shiftId": "shift-uuid",
  "expiresIn": 30
}
```

### Donations

#### Create Checkout Session
```http
POST /donations/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "organizationId": "org-uuid",
  "amountCents": 5000,
  "currency": "USD",
  "donationMethod": "stripe",
  "message": "Keep up the great work!"
}
```

#### List My Donations
```http
GET /donations/my?limit=20&offset=0
Authorization: Bearer <token>
```

#### Get Receipts
```http
GET /donations/receipts?limit=20&offset=0
Authorization: Bearer <token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": {
    // Response data
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Paginated Response
```json
{
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed: email is required",
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/auth/register",
  "method": "POST"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **General API**: 100 requests per minute per IP
- **Authentication**: 10 requests per minute per IP
- **File Uploads**: 10 requests per minute per user

## Webhooks

### Stripe Webhooks

The API handles Stripe webhooks for donation processing:

```http
POST /donations/webhook
Content-Type: application/json
Stripe-Signature: <stripe-signature>

{
  // Stripe webhook payload
}
```

## SDK Usage

The API includes a type-safe SDK for easy integration:

```typescript
import { createClient, AuthService, ListingService } from '@cedarlume/sdk';

const client = createClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'your-api-key'
});

const authService = new AuthService(client);
const listingService = new ListingService(client);

// Login
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Set auth token
client.setAuthToken(authResponse.accessToken);

// Get listings
const listings = await listingService.getListings({
  query: 'volunteer',
  location: { latitude: 37.7749, longitude: -122.4194 },
  radius: 25
});
```

## OpenAPI Specification

The complete API specification is available at:
- **Development**: http://localhost:3000/api/docs
- **Production**: https://api.cedarlume.com/api/docs

You can download the OpenAPI spec for code generation:
- **JSON**: http://localhost:3000/api/docs-json
- **YAML**: http://localhost:3000/api/docs-yaml

## Testing

### Postman Collection

Import the Postman collection for easy API testing:
- Collection: `docs/postman/Cedarlume-API.postman_collection.json`
- Environment: `docs/postman/Cedarlume-API.postman_environment.json`

### cURL Examples

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get listings
curl -X GET "http://localhost:3000/listings?limit=10" \
  -H "Authorization: Bearer <your-token>"
```

## Support

For API support:
1. Check the [Runbook](RUNBOOK.md) for common issues
2. Review the OpenAPI documentation
3. Create a GitHub issue with detailed description
