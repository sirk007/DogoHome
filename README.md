# DogoHome
DogoHome - A full-stack platform connecting pet owners and shelters for lost, found and adoptable pets.

## Tech Stack

### Client 
- React -v: 19.2.0
- TypeScript -v: 5.9.3
- Vite -v: 7.2.4
- Material UI -v: 7.3.6

### Server
- Node.js -v: 20.19+ (LTS)
- Express -v: 5.2.1
- Sequelize -v: 6.37.7
- MySQL -v: 8.x
- bcrypt -v: 6.0.0
- dotenv -v: 17.2.3
- jsonwebtoken -v: 9.0.3
- multer -v: 2.0.2

## Getting Started

### Requirements
- This setup guide assumes Windows OS (Powershell or CMD).
- Linux or macOS users may need minor adjustments for paths or Node version managers.
- Node.js -v: 20.19+ (Vite requires ≥ 20.19)
- MySQL -v: 8.x
- npm 10.x (comes with node)
- Create an instance of the database dogohome
- Ensure the '.env' file exists in the 'server' folder and matches your database credentials

## Setup

### Database
Before running the server, ensure MySQL is running and create the database:
- Open MySQL Workbench
- Connect to your local MySQL server
- Run the following SQL to create the database: 
SQL - CREATE DATABASE dogohome;
- Once the database's instance is created, Sequelize will automatically create the required tables when the server starts from the models defined within the server folder along with their relationships.

### Client Folder
Navigate to the client folder:
- cd client
Install dependencies:
- npm install
Start the development server:
- npm run dev

### Server Folder
Navigate to the server folder:
- cd server
Install dependencies:
- npm install
Start the development server:
- npm run dev

