// Express.js A web framework for Node.js allows for the creation of server-side applications, routing & handling HTTP requests and responses. 
import express from 'express';
// CORS (Cross-Origin-Resource-Sharing) Middleware for allowing cross-origin requests
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models';

//Load .env in
dotenv.config();

// Initialize an instance of express
const app = express();
const PORT = process.env.PORT || 3002;

// express.json is used to parse incoming JSON data in HTTP requests
app.use(express.json());
// Middleware to enable CORS for all routes
app.use(cors());

//Routes for different endpoints 

// Sequalize an ORM library for Node.js it enables database interactions using JS objects
// Sync the models with the database
// A promise .then is waiting for a callback

// Connect to DB and start server
(async () => {
  try {
    await sequelize.sync();
    console.log('Database Connected Successfully');

    app.listen(PORT, () =>
      console.log(`Server active on port ${PORT}`)
    );
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
})();