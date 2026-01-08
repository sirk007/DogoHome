import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for County model
 */
interface CountyAttributes {
    id?: number;
    countyName: string;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface CountyCreationAttributes
    extends Optional<CountyAttributes, "id"> {}

/**
 * County Model class
 */
class County
    extends Model<CountyAttributes, CountyCreationAttributes>
    implements CountyAttributes
{
    public id!: number;
    public countyName!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        County.hasMany(models.Users, { foreignKey: 'CountyId', onDelete: 'cascade' });
        County.hasMany(models.Shelter, { foreignKey: 'CountyId', onDelete: 'cascade' });
        
    }
}

/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
    County.init(
        {
            countyName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "County",
            tableName: "Counties",
        }
    );
    return County;
}