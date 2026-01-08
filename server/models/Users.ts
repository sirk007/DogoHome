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
  public userType!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Users.hasMany(models.Likes, { onDelete: 'cascade' });
    // Users.hasMany(models.Posts, { onDelete: 'cascade' });
    // Users.hasMany(models.County, { onDelete: 'cascade' });
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
