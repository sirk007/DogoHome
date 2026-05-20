# Super Admins API

_(Super Admin Auth - Public)_

- [POST] /register
- [POST] /login

_(Super Admin Auth - Super Admin Only)_

- [GET] /authSuperAdmin

_(Super Admin CRUD - Super Admin Only)_

- [GET] /basicinfo/:id
- [PUT] /me

---

**TODO:**

- Remove public 'POST /register
- Super Admin List
- Delete Super Admin

All authentication enpoints. These handle identity, not Admin data.
AUTH endpoints answer 'Who am I' | WHO you are | Proves WHO you are
CRUD Endpoints answer 'What can I do?'

**Note:** Auth endpoints are mounted under _('/api/superAdmins')_ alongside shelter CRUD

**Security Note:** 'POST /register' is currently public for development. In production this would be removed and Super Admins created through seeding script only.

---

## [POST] /api/superAdmins/register

Creates a new super admin account.

**Access:** Public (Development only - Will be removed for production)

**Endpoint:** [POST] http://localhost:3002/api/superAdmins/register

**Request Body:**
raw JSON
{
"username": "owner2",
"email": "owner2@dogohome.com",
"password": "Pass1234"
}

**Response:** 200 OK
{
"message": "Super Admin created successfully!"
}

---

## [POST] /api/superAdmins/login

Authenticates super admin and returns JWT token.

**Access:** Public

**Endpoint:** [POST] http://localhost:3002/api/superAdmins/login

**Request Body:**
raw JSON
{
"email": "owner2@dogohome.com",
"password": "Pass1234"
}

**Response:** 200 OK
{
"id": 2,
"email": "owner2@dogohome.com",
"userType": "SuperAdmin",
"token": "<jwt_token>"
}

---

## [GET] /api/superAdmins/authSuperAdmin

Returns currently authenticated super admin's information from the token.

**Access:** Super Admin token required

**Headers:** superAdminAccessToken: <jwt_token>

**Endpoint:** [GET] http://localhost:3002/api/superAdmins/authSuperAdmin

**Response:** 200 OK
{
"id": 2,
"email": "owner2@dogohome.com",
"userType": "SuperAdmin",
"iat": 1779275423,
"exp": 1779279023
}

---

## [GET] /api/superAdmins/basicinfo/:id

Get super admin by ID

**Access:** Super Admin token required

**Headers:** superAdminAccessToken: "<jwt_token>"

**Endpoint:** [GET] http://localhost:3002/api/superAdmins/basicinfo/2

**Response:** 200 OK
_(All fields except password)_
{
"id": 2,
"username": "owner2",
"email": "owner2@dogohome.com",
"userType": "SuperAdmin",
"createdAt": "2026-05-20T11:07:56.000Z",
"updatedAt": "2026-05-20T11:07:56.000Z"
}

---

## [PUT] /api/superAdmins/me

Update own super admin profile

**Access:** Super Admin token required

**Headers:** superAdminAccessToken: "<jwt_token>"

**Endpoint:** [PUT] http://localhost:3002/api/superAdmins/me

**Request Body:**
raw JSON
{
"username": "newOwnerName",
"email": "newemail@dogohome.com",
"password": "NewSecurePass123"
}

**Response:** 200 OK
{
"message": "Super Admin profile updated successfully"
}
