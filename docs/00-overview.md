# Platform Overview - Dogohome (Working Title)

## Table of contents

1. [Summary](#1-summary)
2. [Core problem being solved](#2-core-problem-being-solved)
3. [Core concept](#3-core-concept)
4. [System roles](#4-system-roles)
   - 4.1 [User (public / pet owners)](#41-user-public--pet-owners)
   - 4.2 [Shelter (organisation system)](#42-shelter-organisation-system)
     - 4.2.1 [Verification process](#421-verification-process)
     - 4.2.2 [Internal roles](#422-internal-roles)
     - 4.2.3 [Core responsibilities](#423-core-responsibilities)
   - 4.3 [Admin system (platform governance layer)](#43-admin-system-platform-governance-layer)
     - 4.3.1 [Admin verification (creation flow)](#431-admin-verification-creation-flow)
     - 4.3.2 [Standard admin](#432-standard-admin)
     - 4.3.3 [Super admin](#433-super-admin)
     - 4.3.4 [Design principle](#434-design-principle)
5. [Core features](#5-core-features)
   - 5.1 [Map-based animal network](#51-map-based-animal-network)
   - 5.2 [Shelter system](#52-shelter-system)
   - 5.3 [Adoption system](#53-adoption-system)
   - 5.4 [Community reporting system](#54-community-reporting-system)
   - 5.5 [Messaging system](#55-messaging-system)
6. [System architecture](#6-system-architecture)
   - 6.1 [Frontend (client)](#61-frontend-client)
     - 6.1.1 [Core stack](#611-core-stack)
     - 6.1.2 [State management](#612-state-management)
     - 6.1.3 [UI structure](#613-ui-structure)
     - 6.1.4 [Core UX concept](#614-core-ux-concept)
   - 6.2 [Backend architecture](#62-backend-architecture)
     - 6.2.1 [Structure pattern](#621-structure-pattern)
     - 6.2.2 [Database layer (Sequelize ORM)](#622-database-layer-sequelize-orm)
7. [Authentication system](#7-authentication-system)
   - 7.1 [Token types](#71-token-types)
   - 7.2 [Security features](#72-security-features)

## 1. Summary

This platform is a muti-role pet welfare system designed to connect users, shelters and administrators in a unified ecosystem for:

- Reporting lost, found and sighting based animal activity
- Users can access shelter profiles and inspect their animals
- Supporting animal adoption workflows between users and shelters
- Improving shelter operations through digital management tools
- Enabling community-driven pet recovery and awareness

The system combines a geolocation-based map network, structured shelter management tools and a user-driven reporting system to improve the speed and success rate of reuniting pets with owners.

--

## 2. Core problem being solved

Current pet recovery and adoption systems are fragmented:

- Lost pet reports are scattered across social media
- Shelters operate on isolated internal systems
- Users have no unified map or real-time visibility
- Adoption progress lack transparency and structure
- Communication between users and shelters is inefficient

This platform solves that by centralizing all interactions into a single structured system.

--

## 3. Core concept

The system is built around a location-first animal intelligence network where:

- Users can report lost, found or sighted animal on a map
- Shelters can respond to reports and manage animals in care
- The platform visually aggregates all activity into a shared geospatial interface
- Matching between reports and shelter animals can later be enchanced using ML feature systems.

--

## 4. System roles

### 4.1 User (public / pet owners)

- Report lost pets
- Report found animals
- Submit sightings
- Comment on reports to co-operate with other users
- Filter shelters based by county
- Browse adoptable animals
- Contact shelters
- Tract adoption requests

### 4.2 Shelter (organisation system)

Shelters are verified organisations responsible for managing animal welfare data on the platform.

Each shelter operates as a multi-user with role-based access control.

#### 4.2.1 Verification process

- Shelters are created in a pending state
- Admin approval is required for activation
- Once approved, shelters gain full platform access

#### 4.2.2 Internal roles

**Shelter owner**

- Primary account holder
- Manages shelter settings and staff
- Full system access within shelter

**Shelter manager**

- Oversees daily operations
- Manages animal intake and adoption workflows
- coordinates staff activities

**Shelter staff**

- Handles day-to-day tasks
- Updates animal records
- Responds to user reports and inqueries
- Limited permissions compared to managers.

#### 4.2.3 Core responsibilities

- Manage animal intake and records
- Post animals for adoption
- Respond to lost/found reports
- Manage adoption pipeline
- Coordinate volunteers and donations _(future expansion)_

### 4.3 Admin system (platform governance layer)

The admin system is responsible for maintaining platform safety, moderation, and operational integrity across users, shelters and content.

The admin hierarchy is designed as a multi-tier permission system with strict seperation of authority between Admins and Super Admins

---

#### 4.3.1 Admin verification (creation flow)

- Admin accounts cannot be self-activated.
- All Admin accounts must be created or validated by a Super Admin
- Admin status remains inactive until explicitly approved
- This ensures controlled access to moderation and platform-wide privileges.

---

#### 4.3.2 Standard admin

Standard Admins are responsible for operational moderation and pltform governance.

**Core responsibilities**

- Moderate user activity across the platform
- Moderate shelter activity and listings
- Review and remove inappropriate:
  - User posts
  - Shelter posts
  - Sightings/ reports
- Enforce platform rules and policies
- Handle user reports and abuse flags

**Permissions**

- Can delete or restrict:
  - User-generated content
  - Shelter-generated content
- Can manage users (e.g warnings, suspensions)
- Can manage shelters at a content/visibility level

**Restrictions**

- Cannot delete other Admin accounts
- Cannot promote or delete Admin roles
- Cannot override Super Admin decisions

---

#### 4.3.3 Super admin

Super Admins represent the highest level of control in the system.

They oversee platform integrity, admin governance, and shelter verification

**Core responsibilities**

- Approve and manage Admin accounts
- Approve and verify Shelter accounts
- Manage and update Shelter profiles
- Remove or deactivate shelters when necessary
- Oversee platform-wide compliance and safety
- Resolve high-level disputes and escalations

**Permissions**

- Full control over:
  - Admin accounts (create, approve, revoke)
  - Shelter accounts (verify, updatem delete, suspend)
  - Platform-wide data moderation
- Can override all Admin-level decisions

**Restrictions**

- No technical restrictions within platform scope (Highest authority level)

#### 4.3.4 Design principle

This system follows strict hierarchical trust seperation:

- Admins enforce rules
- Super Admins govern Admins and organisational entities (Shelters)
- No lateral privilege escalation exists between Admin accounts
- All destructive or high-impact actions are traceable and role-restricted

---

## 5. Core features

### 5.1 Map-based animal network

- Central interactive map displaying:
  - Lost pets
  - Found animals
  - Sightings
- Pins are color-coded by category
- Each pin opens a model with:
  - Image
  - Description
  - Location
  - Contact / action options

---

### 5.2 Shelter system

- Shelter profiles with public visibility
- Animal management system:
  - Add / update / remove animals
  - Track adoption status
  - Store metadata (chip IDs, medical data, etc.)
- Adoption request handling system

---

### 5.3 Adoption system

- Users can request adoption from shelter
- Shelters can approve/reject applications
- Status tracking per request
- _Future: matching recommendations based on user preferences_

---

### 5.4 Community reporting system

- Users can:
  - Report lost pets
  - Report found animals
  - Submit sightings
- All reports are geo-tagged and appear on shared map
- Users can comment on each listing _(still under consideration)_

### 5.5 Messaging system

- Direct communication between:
  - Users and Shelters
- Used for:
  - Adoption coordination
  - Lost pet verification
  - General inquiries

---

## 6. System architecture

The platform is build as a decoupled full-stack application, with a React frontend consuming a RESTful Node.js backend

---

### 6.1 Frontend (client)

The frontend is built using React (Typescript) + Vite, focusing on component driven UI design and context-based state management.

#### 6.1.1 Core stack

- React 19 (TypeScript)
- Vite (build tool + dev server)
- React Router DOM (routing)
- Material UI (UI component system)
- Axios (API requests)
- Leaflet + React-Leaflet (Map system)
- JWT Decode (client-side token validation)

---

#### 6.1.2 State management

- AuthContext
  - Stores JWT + user identity
  - Handles login state across roles
  - Persists session via sessionStorage

- ThemeContext
  - Light/Dark mode system
  - Stored in localStorage

- ModalContext
  -Global control of login/register modals

---

#### 6.1.3 UI structure

- '/api' -> Axios API wrappers
- '/assets' -> Static assets
- '/componenet' -> reusable UI elements
- '/context' -> global state providers
- '/hooks' -> custom logic (auth)
- '/pages' -> route-level screens
- '/theme' -> Theme configuration
- '/types' -> TypeScript type definitions

#### 6.1.4 Core UX concept

The frontend is build around map-first interaction model

- lost pets -> map pins
- found animals -> map pins
- Sightings -> map pins
- Shelters -> discoverable via map + filters

### 6.2 Backend architecture

#### 6.2.1 Structure pattern

The backend follows a domain-based modular structure:

- '/config' -> Database Setup
- '/middleware' -> Auth + role validation
- '/models' -> Sequelize schema definitions
- '/routes' -> REST API endpoints
- '/scripts' -> Seeding / utilities
- '/types' -> TypeScript type definitions

#### 6.2.2 Database layer (Sequelize ORM)

- Centralized model registry ('models/index.ts)
- Strong TypeScript typing for all models
- Associations defined vis 'associate()' pattern
- Relational structure for:
  - Users

  - Shelters
  - Shelter Managers
  - Shelter Staffs

  - Admins
  - Super Admins

  - Counties
  - Animals
  - Adoption Requests
  - Posts
  - Comments
  - Likes
  - Messages

---

## 7. Authentication system

JWT-based authentication with role seperation:

### 7.1 Token types

- User -> accessToken
- Shelter -> accessShelterToken
- Admin -> adminAccessToken

### 7.2 Security features

- bcrypt password hashing
- Token expiration enforcement
- Middleware-protected routes
- Role-based access control (RBAC)
