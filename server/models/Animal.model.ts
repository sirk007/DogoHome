import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Animal Model Attribute Definitions
// ----------------------------------------------
// Represents the structure of a pet/animal record
// ----------------------------------------------
interface AnimalAttributes {
  id?: number; // Primary key (auto-generated)
  animal: string; // Species or type, e.g., "Dog", "Cat"
  animalName: string; // Given name of the animal
  animalAge: string; // Age or age description
  animalHealth: string; // Health status, e.g., "Good", "Needs medication"
  animalDescription?: string | null; // Optional detailed description
  picture?: Buffer | null; // Optional image stored as BLOB
  shelterId: number; // Foreign key -> Shelters table
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields when creating a new animal
// ----------------------------------------------
interface AnimalCreationAttributes
  extends Optional<AnimalAttributes, "id" | "animalDescription" | "picture"> {}

// ----------------------------------------------
// Animal Model Class
// ----------------------------------------------
class Animals
  extends Model<AnimalAttributes, AnimalCreationAttributes>
  implements AnimalAttributes
{
  public id!: number;
  public animal!: string;
  public animalName!: string;
  public animalAge!: string;
  public animalHealth!: string;
  public animalDescription!: string | null;
  public picture!: Buffer | null;
  public shelterId!: number;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // Each animal belongs to a single shelter
  // Cascade delete ensures animals are removed if shelter is deleted
  static associate(models: any) {
    Animals.belongsTo(models.Shelter, {
      foreignKey: "shelterId",
      onDelete: "cascade",
    });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Animals.init(
    {
      animal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animalAge: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animalHealth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animalDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      picture: {
        type: DataTypes.BLOB("long"), // Store image as long BLOB
        allowNull: true,
      },
      shelterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Shelters", key: "id" },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Animals", // Sequelize internal model name
      tableName: "Animals", // Actual database table
    }
  );

  return Animals;
};
