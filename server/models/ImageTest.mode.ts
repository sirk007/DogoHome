import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for ImageTest model
 */
interface ImageTestAttributes {
    id?: number;
    picture: Buffer | null;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface ImageTestCreationAttributes
    extends Optional<ImageTestAttributes, "id"> {}

/**
 * ImageTest Model class
 */
class ImageTest
    extends Model<ImageTestAttributes, ImageTestCreationAttributes>
    implements ImageTestAttributes
{
    public id!: number;
    public picture!: Buffer | null;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
    }
}

/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
    ImageTest.init(
        {
            picture: {
                type: DataTypes.BLOB,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ImageTest",
            tableName: "ImageTests",
        }
    );
    return ImageTest;
}