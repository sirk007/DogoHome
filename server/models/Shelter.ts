import { DataTypes, Model, Sequelize, Optional } from 'sequelize';


// Define the attributes for the User model
interface ShelterAttributes {
    id?: number;
    username: string;
    password: string;
    email: string;
    shelterName: string;
    county: string;
    address: string;
    phoneNumber: string;
    userType: string;
}

/**
 * Attributes for creating a new User instance
 */
interface ShelterCreationAttributes
    extends Optional<ShelterAttributes, 'id' | 'userType'> {}

/**
 * User Model class
 * Represents a shelter in the system
 */
class Shelter
    extends Model<ShelterAttributes, ShelterCreationAttributes>
    implements ShelterAttributes
{
    public id!: number;
    public username!: string;
    public password!: string;
    public email!: string;
    public shelterName!: string;
    public county!: string;
    public address!: string;
    public phoneNumber!: string;
    public userType!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        // Disabled for now
        // Shelters.hasMany(models.Likes, { onDelete: 'cascade' });
        // Shelters.hasMany(models.Posts, { onDelete: 'cascade' });
        // Shelters.hasMany(models.Animals, { onDelete: 'cascade' });
        // Shelters.hasMany(models.County, { onDelete: 'cascade' });
    }
}
/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
    Shelter.init(
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
            shelterName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            county: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userType: {
                type: DataTypes.STRING,
                defaultValue: 'Shelter',
            },
        },
        {
            sequelize,
            modelName: 'Shelter',
            tableName: 'Shelters',
        }
    );
    return Shelter;
};