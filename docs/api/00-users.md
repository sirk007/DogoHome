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
"token": "<jwt_token>"
}

---

## GET /api/users/auth

Returns currently authenticated user's info from token. (Proves WHO you are)

**Access:** Protected (User token required)

**Headers:** accessToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/users/auth

**Response:** 200 OK
{
"id": 3,
"email": "pepe1@gmail.com",
"userType": "User"
}

---

_(User CRUD)_

## GET /api/users/basicinfo/:id

Get public profile by ID -> (reads profile)

**Access:** Public

**Endpoint:** GET http://localhost:3002/api/users/basicinfo/3

**Response:** 200 OK
_(All fields except password)_
{
"id": 3,
"username": "pepe1",
"email": "pepe1@gmail.com",
"age": 23,
"countyId": 4,
"userType": "User",
"activityLevel": "Low",
"hasGarden": true,
"hasOtherPets": true,
"hasKids": false,
"petExperienceLevel": "Beginner",
"maxDogSize": "Medium",
"preferredEnergyLevel": "Medium",
"preferredAgeRangeMin": null,
"preferredAgeRangeMax": null,
"createdAt": "2026-05-14T20:47:45.000Z",
"updatedAt": "2026-05-14T20:47:45.000Z"
}

---

## PUT /api/users/me

Update your own profile.

**Access:** Protected (User token required)

**Headers:** accessToken: "<jwt_token>"

**Endpoint:** PUT http://localhost:3002/api/users/me

**Request Body:**
raw JSON
{
"email": "pepe1@gmail.com",
"age": 26
}
**Response** 200 OK
{
"message": "Profile updated successfully"
}

---

## GET /api/users/

Fetch all users (Admin only)

**Access:** Protected (Admin token required)

**Headers:** adminAccessToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/users/

**Response** 200 OK
[
{
"id": 2,
"username": "pepe",
"email": "pepe@gmail.com",
"age": 23,
"countyId": 4,
"userType": "User",
"activityLevel": "Low",
"hasGarden": true,
"hasOtherPets": true,
"hasKids": false,
"petExperienceLevel": "Beginner",
"maxDogSize": "Medium",
"preferredEnergyLevel": "Medium",
"preferredAgeRangeMin": null,
"preferredAgeRangeMax": null,
"createdAt": "2026-05-14T20:41:30.000Z",
"updatedAt": "2026-05-14T20:41:30.000Z"
},
{
"id": 4,
"username": "pepe5",
"email": "pepe5@gmail.com",
"age": 27,
"countyId": 8,
"userType": "User",
"activityLevel": "Low",
"hasGarden": true,
"hasOtherPets": true,
"hasKids": false,
"petExperienceLevel": "Beginner",
"maxDogSize": "Medium",
"preferredEnergyLevel": "Medium",
"preferredAgeRangeMin": null,
"preferredAgeRangeMax": null,
"createdAt": "2026-05-15T15:56:20.000Z",
"updatedAt": "2026-05-15T15:56:20.000Z"
}
]

---

## DELETE /api/users/:id

Delete user by ID (Admin only)

**Access:** Protected (Admin token required)

**Headers:** adminAccessToken: "<jwt_token>"

**Endpoint:** DELETE http://localhost:3002/api/users/3

**Response** 200 OK
{
"message": "User deleted successfully"
}

---
