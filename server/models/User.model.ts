import { DataTypes, Model, Sequelize, Optional } from "sequelize";
import {
  ACTIVITY_LEVELS,
  PET_EXPERIENCE_LEVELS,
  DOG_SIZES,
} from "./enums/user.enums";
import type {
  ActivityLevel,
  PetExperienceLevel,
  DogSize,
} from "./enums/user.enums";
import type { Models } from "./index";

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
  activityLevel: ActivityLevel;
  hasGarden: boolean;
  hasOtherPets: boolean;
  hasKids: boolean;
  petExperienceLevel: PetExperienceLevel;
  maxDogSize: DogSize;
  preferredEnergyLevel?: ActivityLevel;
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
  public countyId?: number;
  public activityLevel!: ActivityLevel;
  public hasGarden!: boolean;
  public hasOtherPets!: boolean;
  public hasKids!: boolean;
  public petExperienceLevel!: PetExperienceLevel;
  public maxDogSize!: DogSize;
  public preferredEnergyLevel?: ActivityLevel;
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
  static associate(models: Models) {
    User.hasMany(models.Post, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.Like, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    User.hasMany(models.AdoptionRequest, {
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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 30],
        },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Database level check
        validate: {
          isEmail: true, // Sequelize validator
          notEmpty: true,
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },

      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "county_id", // Mapping to DB == Column name
        references: {
          model: "County",
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
        type: DataTypes.ENUM(...ACTIVITY_LEVELS),
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
        type: DataTypes.ENUM(...PET_EXPERIENCE_LEVELS),
        allowNull: false,
        field: "pet_experience_level",
      },

      maxDogSize: {
        type: DataTypes.ENUM(...DOG_SIZES),
        allowNull: false,
        field: "max_dog_size",
      },

      preferredEnergyLevel: {
        type: DataTypes.ENUM(...ACTIVITY_LEVELS),
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

export { User };
