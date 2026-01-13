// config/database.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: (process.env.DB_DIALECT as any) || "mysql",
    logging: false, // set true if you want SQL query logs
  }
);

// Optional: immediately test the connection
sequelize
  .authenticate()
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.error("Unable to connect to database:", err));

export default sequelize;
