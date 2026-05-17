# Auth API

All authentication enpoints. These handle identity, not shelter data.
AUTH endpoints answer 'Who am I' | WHO you are | Proves WHO you are
CRUD Endpoints answer 'What can I do?'

**Note:** Auth endpoints are mounted under _('/api/shelters')_ alongside shelter CRUD

---

_(Shelter Auth)_

## POST /api/shelters/register

Creates a new Shelter account (identity + credentials)

**Access:** Public

**Endpoint:** POST http://localhost:3002/api/shelters/register

**Request Body:**
raw JSON
{
"username": "happyPaws",
"password": "password123",
"email": "contact@gmail.com",
"shelterName": "Happy Paws Rescue",
"countyId": 1,
"address": "123 Rescue Lane",
"phoneNumber": "555-123-4567"
}
**Response** 200 OK
{
"message": "Shelter created successfully!"
}

---

## POST /api/shelters/login

Authenticates shelter and returns JWT token. (Who are you?)

**Access:** Public

**Endpoint:** POST http://localhost:3002/api/shelters/login

**Request Body**
Raw JSON
{
"email": "admin@dogohome.com",
"password": "adminpassword"
}

**Response** 200 OK
{
"id": 1,
"email": "contact@gmail.com",
"userType": "Shelter",
"token": "<jwt_token>"
}

---

## GET /api/shelters/auth

Returns currently authenticated shelter's info from token. (Proves WHO you are)

**Access:** Protected (Shelter token required)

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/shelters/authShelter

**Response:** 200 OK
{
"id": 1,
"email": "contact@gmail.com",
"userType": "Shelter",
"iat": 1778867739,
"exp": 1778871339
}

---

_(Shelter CRUD)_

## GET /api/shelters/public/:id

Get public profile by ID (reads profile)

**Access:** Public

**Endpoint:** GET http://localhost:3002/api/shelters/public/1

**Response:** 200 OK
_(All fields except password)_
{
"id": 1,
"shelterName": "Happy Paws Rescue",
"countyId": 1,
"address": "123 Rescue Lane",
"email": "contact@gmail.com",
"phoneNumber": "555-123-4567"
}

---

## PUT
