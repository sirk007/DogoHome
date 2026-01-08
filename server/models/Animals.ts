import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for Animals model
 */
interface AnimalAttributes {
    id?: number;
    animal: string;
    animalName: string;
    animalAge: string;
    animalHealth: string;
    animalDescription?: string | boolean;
    picture?: Buffer | null;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface AnimalCreationAttributes
    extends Optional<AnimalAttributes, "id" | "animalDescription" | "picture"> {}

/**
 * Animals Model class
 */
class Animals
    extends Model<AnimalAttributes, AnimalCreationAttributes>
    implements AnimalAttributes
{
    public id!: number;
    public animal!: string;
    public animalName!: string;
    public animalAge!: string;
    public animalHealth!: string;
    public animalDescription!: string | boolean;
    public picture!: Buffer | null;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        Animals.belongsTo(models.Shelter, { onDelete: "cascade" });
    }
}

/**
 * Model initializer
 */
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
                type: DataTypes.BLOB('long'),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Animals",
            tableName: "Animals",
        }
    );

    return Animals;
}