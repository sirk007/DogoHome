# 1. DogoHome

DogoHome - A full-stack platform connecting pet owners and shelters for lost, found and adoptable pets.

## 1.1 Table of Contents

- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Setup](#setup)
    - [Database](#database)
    - [Client Folder](#client-folder)
    - [Server Folder](#server-folder)
- [API Routes Overview](#api-routes-overview)
  - [Users](#users)
  - [Shelter](#shelter)
  - [Admin](#admin)
  - [Animals](#animals)
  - [Comments](#comments)
  - [Posts](#posts)
  - [Likes](#likes)
  - [County](#county)
- [Database Models & Relationships](#database-models--relationships)
- [Middleware](#middleware)
- [Notes](#notes)

## 2. Tech Stack

### 2.1 Client

- React -v: 19.2.0
- TypeScript -v: 5.9.3
- Vite -v: 7.2.4
- Material UI -v: 7.3.6

### 2.2 Server

- Node.js -v: 20.19+ (LTS)
- Express -v: 5.2.1
- Sequelize -v: 6.37.7
- MySQL -v: 8.x
- bcrypt -v: 6.0.0
- dotenv -v: 17.2.3
- jsonwebtoken -v: 9.0.3
- multer -v: 2.0.2

## 3. Environment Variables

Create a `.env` file in the `server` folder with the following:

.env == (
DB_NAME=dogohome
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=mysql
USER_JWT_SECRET=yourUserSecret
SHELTER_JWT_SECRET=yourShelterSecret
ADMIN_JWT_SECRET=yourAdminSecret
)

## 4. Getting Started

### 4.1 Requirements

- This setup guide assumes Windows OS (Powershell or CMD).
- Linux or macOS users may need minor adjustments for paths or Node version managers.
- Node.js -v: 20.19+ (Vite requires ≥ 20.19)
- MySQL -v: 8.x
- npm 10.x (comes with node)
- Create an instance of the database dogohome
- Ensure the '.env' file exists in the 'server' folder and matches your database credentials

### 4.2 Setup

#### 4.2.1 Database

Before running the server, ensure MySQL is running and create the database:

- Open MySQL Workbench
- Connect to your local MySQL server
- Run the following SQL to create the database:
  SQL - CREATE DATABASE dogohome;
- Once the database's instance is created, Sequelize will automatically create the required tables when the server starts from the models defined within the server folder along with their relationships.

#### 4.2.2 Client Folder

Navigate to the client folder:

- cd client
  Install dependencies:
- npm install
  Start the development server:
- npm run dev

#### 4.2.3 Server Folder

Navigate to the server folder:

- cd server
  Install dependencies:
- npm install
  Start the development server:
- npm run dev

## 5. API Routes Overview

### 5.1 Users

- POST /users -> Create a new User Account (Public)
- POST /users/login -> Authenticate User and return JWT (Public)
- GET /users/auth -> Get authenticated User info (Protected)
- GET /users/basicinfo/:id -> Get basic info for User by ID (Public)
- GET /users/ -> Get all User (Admin only)
- DELETE /users/:id -> Delete a User by ID (Admin only)

<!-- TODO: Update user info, search users, password reset, get user’s posts/comments/likes -->

### 5.2 Shelter

- POST / -> Create a new Shelter (Public)
- POST /login -> Authenticate Shelter and return JWT (Public)
- GET /authShelter -> Get Authenticated Shelter info (Protected)
- GET /basicinfo/:id -> Get basic info for Shelter by ID (Public)
- DELETE /:id -> Delete Shelter by ID (Admin Only)

<!-- TODO: Update shelter info, reset password, search shelters, manage shelter animals/posts. -->

### 5.3 Admin

- POST / -> Create a new Admin Account (Public)
- POST /login -> Authenticate Admin and return JWT (Public)
- GET /authAdmin -> Get authenticated admin info (Protected)
- GET /basicinfo/:id -> Get basic info for a specific admin (Protected)

<!-- TODO: Update admin info, reset password, search admins. -->

### 5.4 Animal

- POST / -> Create a new Animal Resource (Protected, Shelter-Only)
- GET /mine -> Get all animals of the authenticated Shelter (Protected)
- GET /byShelterId/:shelterId -> Get all animals of a specific shelter (Public)
- GET /byId/:id -> Get a single animal by ID (Public)
- DELETE /:id -> Delete an animal (Protected, Shelter only)

<!-- TODO: Update animal, search/filter, upload picture, update health status. -->

### 5.5 Comment

- POST / -> Create a new comment (Protected, User-Only)
- GET /post/:postId -> Get all comments for a specific post (Public)
- DELETE /:id -> Delete a comment (Protected, User-Only)

<!-- TODO: Update comment, get user comments, replies, search comments -->

### 5.6 Posts

- POST / -> Create a new post (Protected, User-Only)
- GET / -> Get all posts (Protected, User-Only)
- GET /ById/:id -> Get post ID (Public)
- GET /byUserId/:id -> Get posts by user ID (Public)
- PUT /:id -> Update a post (Protected, User-Only)
- DELETE /:id -> Delete a post (Protected, User-Only)

<!-- TODO: Search posts, trending, upload pictures, get posts liked by user, date filters. -->

### 5.7 Likes

- POST / -> Toggle like/unlike a post (Protected, User-Only)

<!-- TODO: Get likes by post, get likes by user, like counts, trending posts. -->

### 5.8 County

- GET / -> Get all counties (Public)

<!-- TODO: get county by ID, create/update/delete county (Admin only) -->

## 6. Database Models & Relationships

- Users -> Posts (1:N)
- Users -> Comments (1:N)
- Posts -> Comments (1:N)
- Posts -> Likes (1:N)
- County -> N/A (lookup table)

## 7. Middleware

validateUserToken

- Protect routes accessible only to authenticated users
  validateShelterToken
- Protect shelter-specific routes
  ValidateAdminToken
- Protect admin-only routes

## 8. Notes

JWTs are required for protected routes: include the token in the header:

- User: accessToken
- Shelter: accessShelterToken
- Admins: adminAccessToken
