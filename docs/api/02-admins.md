# Admins API

_(Admin Auth - Super Admin Only)_

- POST /register

_(Admin Auth - Public)_

- POST /login

_(Admin Auth - Admin Only)_

- GET /authAdmin

_(Admin CRUD - Protected)_

- GET /basicinfo/:id
- PUT /me

---

All authentication enpoints. These handle identity, not Admin data.
AUTH endpoints answer 'Who am I' | WHO you are | Proves WHO you are
CRUD Endpoints answer 'What can I do?'

**Note:** Auth endpoints are mounted under _('/api/admins')_ alongside shelter CRUD

---

_(Admin Auth - Super Admin Only)_

## POST /api/admins/register

Creates a new admin account. (identity + credentials)

**Access:** Super Admin Token Required

**Headers:** superAdminAccessToken: "<jwt_token>"

**Endpoint:** POST http://localhost:3002/api/admins/register

**Request Body:**
raw JSON
{
"username": "admino",
"password": "Pass1234",
"email": "admin21@dogohome.com"
}

**Response:** 200 OK
{
"message": "Admin created successfully!"
}

---

_(Admin Auth - Public)_

## POST /api/admins/login

Authenticates shelter and returns JWT token. (Who are you?)

**Access:** Public

**Endpoint:** POST http://localhost:3002/api/admins/login

**Request Body**
Raw JSON
{
"email": "admin@dogohome.com",
"password": "adminpassword"
}

**Response** 200 OK
{
"id": 1,
"username": "adminoo",
"email": "admin@dogohome.com",
"userType": "Admin",
"token": "<jwt_token>"
}

---

_(Admin Auth - Admin Only)_

## GET /api/admins/authAdmin

Returns currently authenticated Admin's info from token. (Proves WHO you are)

**Access:** Protected (Admins token required)

**Headers:** accessAdminToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/admins/authAdmin

**Response:** 200 OK
{
"id": 1,
"email": "admin@dogohome.com",
"userType": "Admin",
"iat": 1779190550,
"exp": 1779194150
}

---

_(Admin CRUD - Protected)_

## GET /api/admins/basicinfo/:id

Get Admin public profile by ID -> (reads profile)

**Access:** Protected (Admins token required)

**Headers:** adminAccessToken: "<jwt_token>"

**Endpoint:** GET http://localhost:3002/api/admins/basicinfo/2

**Response:** 200 OK
{
_(All fields except password)_
"id": 2,
"username": "admino",
"email": "admin21@dogohome.com",
"userType": "Admin",
"createdBySuperAdminId": 1,
"createdAt": "2026-05-18T17:21:23.000Z",
"updatedAt": "2026-05-18T17:21:23.000Z"
}

---

## PUT /api/admins/me

Update your own profile

**Access:** Protected (Admin token required)

**Headers:** adminAccessToken: "<jwt_token>

**Endpoint:** PUT http://localhost:3002/api/admins/me

**Request Body:**
raw JSON
{
"username": "adminoUpdated",
"email": "admin21Updated@dogohome.com"
}

**Response** 200 OK
{
"message": "Admin profile updated successfully"
}
