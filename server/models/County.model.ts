import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// County Model Attributes
// ----------------------------------------------
interface CountyAttributes {
  id: number; // Auto-generated primary key
  countyName: string; // Auto-generated primary key
}

// Optional attributes during creation
interface CountyCreationAttributes extends Optional<CountyAttributes, "id"> {}

// ----------------------------------------------
// County Model Class
// ----------------------------------------------
class County
  extends Model<CountyAttributes, CountyCreationAttributes>
  implements CountyAttributes
{
  public id!: number;
  public countyName!: string;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // Counties can have multiple Users and Shelters
  static associate(models: any) {
    // Define associations here if needed
    County.hasMany(models.User, {
      foreignKey: "countyId",
      onDelete: "cascade", // remove users if county is deleted
    });
    County.hasMany(models.Shelter, {
      foreignKey: "countyId",
      onDelete: "cascade", // remove shelters if county is deleted
    });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  County.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      countyName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "county_name",
        unique: true, // ensures no duplicate county names
      },
    },
    {
      sequelize,
      modelName: "County", // internal Sequelize model name
      tableName: "counties", // table name in DB
    },
  );
  return County;
};
