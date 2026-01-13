import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// Define the attributes for the Admin model
interface AdminAttributes {
  id?: number;
  username: string;
  password: string;
  email: string;
  age: string;
  userType: string;
}

/**
 * Attributes for creating a new Admin instance
 */
interface AdminCreationAttributes
  extends Optional<AdminAttributes, "id" | "userType"> {}

/**
 * Admin Model class
 * Represents an admin user in the system
 */

class Admins
  extends Model<AdminAttributes, AdminCreationAttributes>
  implements AdminAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public age!: string;
  public userType!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Admins.hasMany(models.Posts, { onDelete: "cascade" });
    Admins.hasMany(models.County, { onDelete: "cascade" });
  }
}

/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
  Admins.init(
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
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "admin",
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
    }
  );
  return Admins;
};
