# Auth API

All authentication enpoints. These handle identity, not user data.
AUTH endpoints answer 'Who am I' | WHO you are | Proves WHO you are
CRUD Endpoints answer 'What can I do?'

**Note:** Auth endpoints are mounted under '/api/users' alongside user CRUD

---

_(User Auth)_

## POST /api/users/register

Creates a new user account (identity + credentials).

**Access:** Public

**Endpoint:** POST http://localhost:3002/api/users/register

**Request Body:**
raw JSON
{
"username": "pepe1",
"email": "pepe1@gmail.com",
"password": "pepe123",
"age": 23,
"countyId": 4,
"activityLevel": "Low",
"hasGarden": true,
"hasOtherPets": true,
"hasKids": false,
"petExperienceLevel": "Beginner",
"maxDogSize": "Medium",
"preferredEnergyLevel": "Medium"
}
**Response** 200 OK
{
"message": "User created successfully!"
}

---

## POST /api/users/login

Authenticates user and returns JWT token. (Who are you?)

**Access:** Public

**Endpoint:** POST http://localhost:3002/api/users/login

**Request Body:**
raw JSON
{
"email": "pepe1@gmail.com",
"password": "pepe123"
}
**Response** 200 OK
{
"id": 3,
"email": "pepe1@gmail.com",
"userType": "User",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwZXBlMUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6IlVzZXIiLCJpYXQiOjE3Nzg3OTMwMzYsImV4cCI6MTc3ODc5NjYzNn0.ScYPQGGjT90yez3odtMDTlHlOzZAUQ-NhJjfbPW_PLw"
}

---

## GET /api/users/auth

Returns currently authnticated user's info from token.

**Access:** Protected (User token required)

**Headers:** accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwZXBlMUBnbWFpbC5jb20iLCJ1c2VyVHlwZSI6IlVzZXIiLCJpYXQiOjE3Nzg3OTMwMzYsImV4cCI6MTc3ODc5NjYzNn0.ScYPQGGjT90yez3odtMDTlHlOzZAUQ-NhJjfbPW_PLw

**Endpoint:** GET http://localhost:3002/api/users/auth

**Response:** 200 OK

GET /auth (returns identity from token) -> tells you WHO you are

Endpoints answer 'What can I do?'
_(User CRUD)_
GET /basicinfo/:id (public profile) -> reads profile
GET / (admin list users) -> lists profiles (admin)
PUT /me (update profile) -> updates profile
DELETE /:id (admin delete user) -> deletes profile (admin)
