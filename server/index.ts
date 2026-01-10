// ----------------------------------------------
// Server Entry Point - IMPORT LIBRARIES
//-----------------------------------------------

// Express.js A web framework for Node.js allows for the creation of server-side applications, routing & handling HTTP requests and responses. 
import express, {Application, Request, Response} from 'express';
// CORS (Cross-Origin-Resource-Sharing) Middleware for allowing cross-origin requests
import cors from 'cors';
// dotenv Loads environment variables from a .env file into process.env
import dotenv from 'dotenv';
// Sequelize ORM for Node.js instance
import sequelize from './config/database';
// Import all models to initialize them and set up associations
import './models';

//-----------------------------------------------
// SERVER SETUP - IMPORT ROUTES
//-----------------------------------------------

import userRoutes from './routes/users.routes';
import shelterRoutes from './routes/shelters.routes';
import adminRoutes from './routes/admin.routes';
import postRoutes from './routes/posts.route';

//-----------------------------------------------
// CONFIGURATION
//-----------------------------------------------

//Load .env in
dotenv.config();

// Initialize an instance of express
const app: Application = express();
// Define the port from .env or use 3002 as default
const PORT = process.env.PORT || 3002;

//-----------------------------------------------
// MIDDLEWARE
//-----------------------------------------------
// Parse incoming JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

//-----------------------------------------------
// ROUTES
//-----------------------------------------------
app.use('/api/users', userRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/posts', postRoutes);

//Routes for different endpoints 

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("DogoHome Server is running!");
});

// Sequalize an ORM library for Node.js it enables database interactions using JS objects
// Sync the models with the database
// A promise .then is waiting for a callback

// Connect to DB and start server

// -----------------------------------------------
// DATABASE & SERVER START
//-----------------------------------------------

(async () => {
  try {
    // Sync models with database
    await sequelize.sync();
    console.log('Database Connected Successfully');

    // Start the server
    app.listen(PORT, () =>
      console.log(`Server active on port ${PORT}`)
    );
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
})();