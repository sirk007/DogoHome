import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Animal Model Attribute Definitions
// ----------------------------------------------
// Represents the structure of a pet/animal record
// ----------------------------------------------
interface AnimalAttributes {
  id?: number; // Primary-Key
  species: "Dog" | "Cat" | "Rabbit" | "Other"; // Controlled vocabulary
  name: string; // Name of the animal
  age: number; // Age in units defined below
  ageUnit: "Months" | "Years"; // Age unit
  health: "Good" | "Needs Medication" | "Critical"; // Controlled health status
  size: "Small" | "Medium" | "Large"; // ML Feature
  activityLevel: "Low" | "Medium" | "High"; // ML Feature
  goodWithKids: boolean; // ML Feature
  goodWithPets: boolean; // ML Feature
  description?: string | null; // Optional detailed description
  pictureUrl?: string | null; //Optional detail description
  shelterId: number; // Foreign Key
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields when creating a new animal
// ----------------------------------------------
interface AnimalCreationAttributes extends Optional<
  AnimalAttributes,
  "id" | "description" | "pictureUrl"
> {}

// ----------------------------------------------
// Animal Model Class
// ----------------------------------------------
class Animals
  extends Model<AnimalAttributes, AnimalCreationAttributes>
  implements AnimalAttributes
{
  public id!: number;
  public species!: "Dog" | "Cat" | "Rabbit" | "Other";
  public name!: string;
  public age!: number;
  public ageUnit!: "Months" | "Years";
  public health!: "Good" | "Needs Medication" | "Critical";
  public size!: "Small" | "Medium" | "Large";
  public activityLevel!: "Low" | "Medium" | "High";
  public goodWithKids!: boolean;
  public goodWithPets!: boolean;
  public description!: string | null;
  public pictureUrl!: string | null;
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
      species: {
        type: DataTypes.ENUM("Dog", "Cat", "Rabbit", "Other"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ageUnit: {
        type: DataTypes.ENUM("Months", "Years"),
        defaultValue: "Years",
        allowNull: false,
      },
      health: {
        type: DataTypes.ENUM("Good", "Needs Medication", "Critical"),
        allowNull: false,
      },
      size: {
        type: DataTypes.ENUM("Small", "Medium", "Large"),
        allowNull: false,
      },
      activityLevel: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        allowNull: false,
      },
      goodWithKids: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      goodWithPets: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pictureUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shelterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Shelters", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Animals", // Sequelize internal model name
      tableName: "Animals", // Actual database table
    },
  );

  return Animals;
};
