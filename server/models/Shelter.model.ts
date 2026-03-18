import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Shelter Model Attribute Definitions
// ----------------------------------------------
// Represents the full shape of a Shelter record in the DB
// ----------------------------------------------
interface ShelterAttributes {
  id: number; // Primary key (auto-generated)
  username: string; // Login username
  password: string; // Hashed password
  email: string; // Contact email
  shelterName: string; // Public name of the shelter
  countyId: number; // Foreign key -> Counties table
  address: string; // Physical address
  phoneNumber: string; // Contact phone
  userType: "Shelter"; // Role identifier, default: "Shelter"
  status: "Unverified" | "Verified" | "Suspended";
  verifiedByAdminId?: number; // Optional foreign key
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Fields optional when creating a Shelter.
// ID auto-generated, userType defaults to "Shelter"
// ----------------------------------------------
interface ShelterCreationAttributes extends Optional<
  ShelterAttributes,
  "id" | "userType" | "verifiedByAdminId"
> {}

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
  public userType!: "Shelter";
  public status!: "Unverified" | "Verified" | "Suspended";
  public verifiedByAdminId?: number; // Optional foreign key

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
      onDelete: "CASCADE",
    });
    Shelter.hasMany(models.Posts, {
      foreignKey: "shelterId",
      onDelete: "CASCADE",
    });
    Shelter.hasMany(models.Animals, {
      foreignKey: "shelterId",
      onDelete: "CASCADE",
    });
    Shelter.hasMany(models.ShelterStaff, {
      foreignKey: "shelterId",
      onDelete: "SET NULL",
    });
    Shelter.belongsTo(models.County, {
      foreignKey: "countyId",
      onDelete: "CASCADE",
    });
    Shelter.belongsTo(models.Admins, {
      foreignKey: "verifiedByAdminId",
      onDelete: "SET NULL",
    });
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
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      shelterName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "shelter_name",
      },
      countyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Counties", key: "id" },
        field: "county_id",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: "phone_number",
      },
      userType: {
        type: DataTypes.ENUM("Shelter"),
        defaultValue: "Shelter",
        allowNull: false,
        field: "user_type",
      },
      status: {
        type: DataTypes.ENUM("Unverified", "Verified", "Suspended"),
        defaultValue: "Unverified",
        allowNull: false,
      },
      verifiedByAdminId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Admins", key: "id" },
        field: "verified_by_admin_id",
      },
    },
    {
      sequelize,
      modelName: "Shelter", // Sequelize internal model name
      tableName: "shelters", // Actual database table name
    },
  );
  return Shelter;
};
