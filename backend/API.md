# Grownex API Documentation

## Base URL

```
Production: https://grownex-api.onrender.com
Development: http://localhost:5000
```

## Authentication

### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string?",
    "bio": "string?",
    "title": "string?",
    "location": "string?"
  }
}
```

### Login User

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string?",
    "bio": "string?",
    "title": "string?",
    "location": "string?"
  }
}
```

## Posts

### Get All Posts

```http
GET /api/posts
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "string",
    "content": "string",
    "userId": {
      "_id": "string",
      "name": "string",
      "profileImage": "string?"
    },
    "media": {
      "url": "string",
      "type": "string"
    },
    "likes": ["string"],
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### Create Post

```http
POST /api/posts
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```
content: string
media: File (optional)
```

**Response:**

```json
{
  "_id": "string",
  "content": "string",
  "userId": {
    "_id": "string",
    "name": "string",
    "profileImage": "string?"
  },
  "media": {
    "url": "string",
    "type": "string"
  },
  "likes": [],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Like/Unlike Post

```http
POST /api/posts/:postId/like
DELETE /api/posts/:postId/like
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "_id": "string",
  "content": "string",
  "userId": {
    "_id": "string",
    "name": "string",
    "profileImage": "string?"
  },
  "likes": ["string"],
  "createdAt": "string",
  "updatedAt": "string"
}
```

## User Profile

### Get User Profile

```http
GET /api/users/profile
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "profileImage": "string?",
  "bio": "string?",
  "title": "string?",
  "location": "string?"
}
```

### Update Profile

```http
PUT /api/users/profile
```

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "string?",
  "bio": "string?",
  "title": "string?",
  "location": "string?"
}
```

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "profileImage": "string?",
  "bio": "string?",
  "title": "string?",
  "location": "string?"
}
```

### Update Profile Image

```http
PUT /api/users/profile/image
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**

```
image: File
```

**Response:**

```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "profileImage": "string",
  "bio": "string?",
  "title": "string?",
  "location": "string?"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Error description"
}
```

### 401 Unauthorized

```json
{
  "message": "No authentication token, access denied"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Error description"
}
```

## Rate Limiting

- 100 requests per IP per 15 minutes for most endpoints
- 5 requests per IP per minute for authentication endpoints

## File Upload Limits

- Maximum file size: 5MB
- Supported formats:
  - Images: jpg, jpeg, png, gif
  - Videos: mp4, webm
