import { DataTypes, Model, Sequelize, Optional } from 'sequelize';

/**
 * Attributes stored in DB
 */
interface UserAttributes {
  id?: number;
  username: string;
  password: string;
  email: string;
  age: string;
  countyId?: number;
  userType: string;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'userType'> {}

/**
 * User Model class
 */
class Users
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
  public age!: string;
  public countyId!: number;
  public userType!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Users.hasMany(models.Posts, { foreignKey: "userId", onDelete: "CASCADE" });
    Users.hasMany(models.Comments, { foreignKey: "userId", onDelete: "CASCADE" });
    Users.hasMany(models.Likes, { foreignKey: "userId", onDelete: "CASCADE" });
    Users.belongsTo(models.County, { foreignKey: 'countyId' });
  }
}

/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
  Users.init(
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
      countyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Counties', key: 'id' },
      },
      userType: {
        type: DataTypes.STRING,
        defaultValue: 'User',
      },
    },
    {
      sequelize,
      modelName: 'Users',
      tableName: 'Users',
    }
  );

  return Users;
};
