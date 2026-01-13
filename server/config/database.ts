// ---------------------------
// DATABASE CONFIGURATION
// ---------------------------
// Sets up Sequelize connection to MySQL (or other SQL dialects)
// dotenv is used to load environment variables from .env
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// ----------------------------------------------
// -------------  CONFIG/SETUP    ---------------
// ----------------------------------------------
// Load environment variables from .env into process.env
dotenv.config();

// Create a new Sequelize instance
// This represents the connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Database name
  process.env.DB_USER as string, // Database username
  process.env.DB_PASSWORD as string, // Database password
  {
    host: process.env.DB_HOST, // Database host (e.g., localhost)
    port: 3306, // Database port
    dialect: (process.env.DB_DIALECT as any) || "mysql", // SQL dialect (mysql by default)
    logging: false, // Disable SQL query logging (set to true for debugging)
  }
);

// ---------------------------
// TEST DATABASE CONNECTION
// ---------------------------
// Immediately test connection to ensure DB credentials are correct
sequelize
  .authenticate()
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

// ---------------------------
// EXPORT SEQUELIZE INSTANCE
// ---------------------------
// Export Sequelize instance for use in models and routes
export default sequelize;
