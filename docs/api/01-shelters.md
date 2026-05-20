# Shelter API

_(Shelter Auth)_

- POST /register
- POST /login
- GET /authShelter

_(Shelter CRUD - Public)_

- GET /public
- GET /public/:id

_(Shelter CRUD - Protected)_

- GET /profile
- PUT /me

_(Shelter CRUD - Admin Only)_

- DELETE /:id

---

**TODO:**

- Shelter verification flow [/api/shelters/:id/verify] (Admin Only)
- Staff management

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

## GET /api/shelters/authShelter

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

_(Shelter CRUD - Public)_

## GET /api/shelters/public

Get list of all shelters for public discovery

**Access:** Public

**Query Parameters (Optional):**

- 'countyId' - Filter shelters by county

**Endpoint:** GET http://localhost:3002/api/shelters/public

**Response** 200 OK
[
{
"id": 2,
"shelterName": "Happy Paws Rescue",
"countyId": 1,
"address": "123 Rescue Lane",
"email": "contact@gmail.com",
"phoneNumber": "555-123-4567"
},
{
"id": 3,
"shelterName": "Happy Paws Rescue",
"countyId": 2,
"address": "123 Rescue Lane",
"email": "contact222@gmail.com",
"phoneNumber": "555-123-4567"
}
]

**Endpoint (with filter):** GET http://localhost:3002/api/shelters/public?countyId=2

**Response** 200 OK
[
{
"id": 3,
"shelterName": "Happy Paws Rescue",
"countyId": 2,
"address": "123 Rescue Lane",
"email": "contact222@gmail.com",
"phoneNumber": "555-123-4567"
}
]

---

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

_(Shelter CRUD - Protected)_

## GET /api/shelters/profile

Get authenticated shelter's full profile.

**Access:** Protected (Shelter token required)

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/shelters/profile

**Response:** 200 OK
_(All fields except password)_
{
"id": 2,
"username": "happyPaws",
"email": "contact@gmail.com",
"shelterName": "Happy Paws Rescue",
"countyId": 1,
"address": "123 Rescue Lane",
"phoneNumber": "555-123-4567",
"userType": "Shelter",
"status": "Unverified",
"verifiedByAdminId": null,
"createdAt": "2026-05-18T14:10:29.000Z",
"updatedAt": "2026-05-18T14:10:29.000Z"
}

---

## PUT /api/shelters/me

Update shelter profile.

**Access:** Protected (Shelter token required)

**Headers:** accessShelterToken: "<jwt_token>"

**Endpoint:** PUT http://localhost:3002/api/shelters/me

**Request Body:**
raw JSON
{
"shelterName": "Rescue Paws Happy",
"address": "Lane Rescue 123",
"email": "RescuePawsHappy@gmail.com",
"phoneNumber": "123-456-789"
}
**Response** 200 OK
{
"message": "Shelter profile updated successfully"
}

---

_(Shelter CRUD - Admin Only)_

## DELETE /api/shelters/:id

Delete shelter by ID (Admin Only)

**Access:** Protected (Admin token required)

**Headers:** adminAccessToken: "<jwt_token>"

**Endpoint:** DELETE http://localhost:3002/api/shelters/1

**Response** 200 OK
{
"message": "Shelter deleted successfully"
}
