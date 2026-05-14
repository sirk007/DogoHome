import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Sighting Model Attributes
// ----------------------------------------------
interface SightingAttributes {
  id?: number;
  title: string;
  description?: string;
  type: "Lost" | "Found" | "Reported";
  status: "Pending" | "Resolved";
  lat: number;
  lng: number;
  location?: string; // human-readable
  userId: number; // FK to Users
  countyId?: number; // FK to County for filtering
}

// Optional attributes during creation
interface SightingCreationAttributes extends Optional<
  SightingAttributes,
  "id" | "description" | "status" | "location" | "countyId"
> {}

// ----------------------------------------------
// Sighting Model Class
// ----------------------------------------------
class Sighting
  extends Model<SightingAttributes, SightingCreationAttributes>
  implements SightingAttributes
{
  public id!: number;
  public title!: string;
  public description?: string;
  public type!: "Lost" | "Found" | "Reported";
  public status!: "Pending" | "Resolved";
  public lat!: number;
  public lng!: number;
  public location?: string;
  public userId!: number;
  public countyId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  static associate(models: any) {
    // A sighting belongs to a user
    Sighting.belongsTo(models.User, { foreignKey: "userId" });

    // Optional: link to county for filtering
    Sighting.belongsTo(models.County, { foreignKey: "countyId" });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Sighting.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      type: {
        type: DataTypes.ENUM("Lost", "Found", "Reported"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Resolved"),
        allowNull: false,
        defaultValue: "Pending",
      },
      lat: { type: DataTypes.DOUBLE, allowNull: false },
      lng: { type: DataTypes.DOUBLE, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "counties", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Sighting",
      tableName: "sightings",
    },
  );

  return Sighting;
};

export { Sighting };
