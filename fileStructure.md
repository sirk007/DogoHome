Client-Side
src/
├─ api/ # API calls (frontend requests to server routes)
│ ├─ users.ts
│ ├─ shelters.ts
│ ├─ admins.ts
│ ├─ animals.ts
│ ├─ posts.ts
│ ├─ comments.ts
│ ├─ likes.ts
│ └─ counties.ts
├─ components/ # Re-usable UI components
├─ pages/ # Route pages (Home, Login, ShelterDashboard, AdminDashboard, etc.)
├─ hooks/ # Custom hooks (useAuth, useFetchPosts, useAnimals, etc.)
├─ context/ # Context providers (AuthContext, ShelterContext, AdminContext)
├─ App.tsx
└─ main.tsx

Server-Side
server/
├─ models/ # Sequelize models (Users, Shelter, Admins, Animals, Posts, Comments, Likes, County)
├─ routes/ # Express routes
│ ├─ users.ts
│ ├─ shelters.ts
│ ├─ admins.ts
│ ├─ animals.ts
│ ├─ posts.ts
│ ├─ comments.ts
│ ├─ likes.ts
│ └─ counties.ts
├─ middleware/ # JWT validation and auth middleware (User, Shelter, Admin)
├─ config/ # Database and server configuration
└─ .env # Environment variables
