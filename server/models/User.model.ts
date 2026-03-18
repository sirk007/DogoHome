import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// User Model Attribute Definitions
// ----------------------------------------------
// Represents the full shape of a User record
// as it exists in the database.
// ----------------------------------------------
interface UserAttributes {
  id: number;
  username: string;
  password: string;
  email: string;
  age: number;
  countyId?: number;
  userType: "User";
  // ML / Matching traits
  activityLevel: "Low" | "Medium" | "High";
  hasGarden: boolean;
  hasOtherPets: boolean;
  hasKids: boolean;
  petExperienceLevel: "None" | "Beginner" | "Experienced";
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
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public age!: number;
  public userType!: "User";

  public activityLevel!: "Low" | "Medium" | "High";
  public hasGarden!: boolean;
  public hasOtherPets!: boolean;
  public hasKids!: boolean;
  public petExperienceLevel!: "None" | "Beginner" | "Experienced";
  public maxDogSize!: "Small" | "Medium" | "Large";
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
    User.hasMany(models.Posts, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Comments, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Likes, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.AdoptionRequests, {
      foreignKey: "userId",
    });
    User.belongsTo(models.County, {
      foreignKey: "countyId",
    });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
// Defines database schema, constraints,
// relationships, and default values.
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },

      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "county_id", // Mapping to DB == Column name
        references: {
          model: "Counties",
          key: "id",
        },
      },

      userType: {
        type: DataTypes.ENUM("User"),
        defaultValue: "User",
        allowNull: false,
        field: "user_type",
      },

      activityLevel: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: false,
        field: "activity_level",
      },

      hasGarden: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "has_garden",
      },

      hasOtherPets: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "has_other_pets",
      },

      hasKids: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "has_kids",
      },

      petExperienceLevel: {
        type: DataTypes.ENUM("None", "Beginner", "Experienced"),
        allowNull: false,
        field: "pet_experience_level",
      },

      maxDogSize: {
        type: DataTypes.ENUM("Small", "Medium", "Large"),
        allowNull: false,
        field: "max_dog_size",
      },

      preferredEnergyLevel: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: true,
        field: "preferred_energy_level",
      },

      preferredAgeRangeMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "preferred_age_range_min",
      },

      preferredAgeRangeMax: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "preferred_age_range_max",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );

  return User;
};
