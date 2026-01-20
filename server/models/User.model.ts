import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// User Model Attribute Definitions
// ----------------------------------------------
// Represents the full shape of a User record
// as it exists in the database.
// ----------------------------------------------
interface UserAttributes {
  id?: number;
  username: string;
  password: string;
  email: string;
  age: number;
  countyId?: number;
  userType: "User" | "ShelterAdmin" | "Admin";
  // ML / Matching traits
  activityLevel: "Low" | "Medium" | "High";
  hasGarden: boolean;
  hasOtherPets: boolean;
  hasKids: boolean;
  petExperienceLevel: "None" | "Beginner" | "Experience";
  maxDogSize: "Small" | "Medium" | "Large";
  preferredEnergyLevel?: "Low" | "Medium" | "High";
  preferredAgeRangeMin?: number;
  preferredAgeRangeMax?: number;
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
interface UserCreationAttributes extends Optional<
  UserAttributes,
  | "id"
  | "userType"
  | "countyId"
  | "preferredEnergyLevel"
  | "preferredAgeRangeMin"
  | "preferredAgeRangeMax"
> {}

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
  public age!: number;
  public userType!: "User" | "ShelterAdmin" | "Admin";

  public activityLevel!: "Low" | "Medium" | "High";
  public hasGarden!: boolean;
  public hasOtherPets!: boolean;
  public hasKids!: boolean;
  public petExperienceLevel!: "None" | "Beginner" | "Experience";
  public maxDogSize!: "Medium" | "Small" | "Large";
  public preferredEnergyLevel?: "Low" | "Medium" | "High";
  public preferredAgeRangeMin?: number;
  public preferredAgeRangeMax?: number;

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
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },

      age: { type: DataTypes.INTEGER, allowNull: false },

      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Counties", key: "id" },
      },

      userType: {
        type: DataTypes.ENUM("User", "ShelterAdmin", "Admin"),
        defaultValue: "User",
      },

      activityLevel: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: false,
      },

      hasGarden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      hasOtherPets: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      hasKids: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      petExperienceLevel: {
        type: DataTypes.ENUM("None", "Beginner", "Experience"),
        allowNull: false,
      },

      maxDogSize: {
        type: DataTypes.ENUM("Small", "Medium", "Large"),
        allowNull: false,
      },

      preferredEnergyLevel: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: true,
      },

      preferredAgeRangeMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      preferredAgeRangeMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "Users",
    },
  );

  return Users;
};
