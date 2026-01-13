import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Shelter Model Attribute Definitions
// ----------------------------------------------
// Represents the full shape of a Shelter record in the DB
// ----------------------------------------------
interface ShelterAttributes {
  id?: number; // Primary key (auto-generated)
  username: string; // Login username
  password: string; // Hashed password
  email: string; // Contact email
  shelterName: string; // Public name of the shelter
  countyId: number; // Foreign key -> Counties table
  address: string; // Physical address
  phoneNumber: string; // Contact phone
  userType: string; // Role identifier, default: "Shelter"
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Fields optional when creating a Shelter.
// ID auto-generated, userType defaults to "Shelter"
// ----------------------------------------------
interface ShelterCreationAttributes
  extends Optional<ShelterAttributes, "id" | "userType"> {}

// ----------------------------------------------
// Shelter Model Class
// ----------------------------------------------
// Maps to the "Shelters" table, provides typed access
// and ORM functionality
// ----------------------------------------------
class Shelter
  extends Model<ShelterAttributes, ShelterCreationAttributes>
  implements ShelterAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public shelterName!: string;
  public countyId!: number;
  public address!: string;
  public phoneNumber!: string;
  public userType!: string;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // A Shelter:
  // - Can have many Likes (for posts or animals)
  // - Can create many Posts
  // - Can have many Animals
  // - Belongs to one County
  // Cascade delete ensures no orphaned data when a shelter is deleted
  // --------------------------------------------
  static associate(models: any) {
    Shelter.hasMany(models.Likes, {
      foreignKey: "shelterId",
      onDelete: "cascade",
    });
    Shelter.hasMany(models.Posts, {
      foreignKey: "shelterId",
      onDelete: "cascade",
    });
    Shelter.hasMany(models.Animals, {
      foreignKey: "shelterId",
      onDelete: "cascade",
    });
    Shelter.belongsTo(models.County, { foreignKey: "countyId" });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
// Defines database schema, constraints, and default values
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Shelter.init(
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
      shelterName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Counties", key: "id" },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: "Shelter",
      },
    },
    {
      sequelize,
      modelName: "Shelter", // Sequelize internal model name
      tableName: "Shelters", // Actual database table name
    }
  );
  return Shelter;
};
