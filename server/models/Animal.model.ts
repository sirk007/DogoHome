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
    animalDescription?: string | null;
    picture?: Buffer | null;
    shelterId: number;
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
    public animalDescription!: string | null;
    public picture!: Buffer | null;
    public shelterId!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        Animals.belongsTo(models.Shelter, {foreignKey: 'shelterId', onDelete: "cascade" });
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
            shelterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Shelters', key: 'id' },
                onDelete: 'CASCADE',
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