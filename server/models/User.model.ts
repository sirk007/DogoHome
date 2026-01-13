import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// User Model Attribute Definitions
// ----------------------------------------------
// Represents the full shape of a User record
// as it exists in the database.
// ----------------------------------------------
interface UserAttributes {
  id?: number; // Primary key (auto-generated)
  username: string; // Public usernam
  password: string; // Hashed password
  email: string; // User email address
  age: string; // Age stored as string
  countyId?: number; // FK -> Counties table (optional)
  userType: string; // Role identifier ("User")
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Defines which attributes are OPTIONAL when
// creating a new User record.
//
// - id is auto-generated
// - userType has a default value
// ----------------------------------------------
interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "userType"> {}

// ----------------------------------------------
// User Model Class
// ----------------------------------------------
// This class:
// - Maps to the "Users" database table
// - Provides strongly-typed access to user data
// - Enables Sequelize ORM functionality
// ----------------------------------------------
class Users
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public age!: string;
  public countyId!: number;
  public userType!: string;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // Defines relationships between Users and
  // other entities in the system.
  //
  // - A User can create many Posts
  // - A User can write many Comments
  // - A User can like many Posts
  // - A User belongs to one County
  //
  // Cascade delete ensures cleanup when a
  // User is removed.
  // --------------------------------------------
  static associate(models: any) {
    Users.hasMany(models.Posts, { foreignKey: "userId", onDelete: "CASCADE" });
    Users.hasMany(models.Comments, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Users.hasMany(models.Likes, { foreignKey: "userId", onDelete: "CASCADE" });
    Users.belongsTo(models.County, { foreignKey: "countyId" });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
// Defines database schema, constraints,
// relationships, and default values.
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Users.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Counties", key: "id" },
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: "User",
      },
    },
    {
      sequelize,
      modelName: "Users", // Sequelize model name
      tableName: "Users", // Actual DB table
    }
  );

  return Users;
};
