import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for Shelter model
 */
interface PostAttributes {
  id?: number;
  title: string;
  postText: string;
  picture?: string | null;
  userId: number;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "picture"> {}

/**
 * Posts Model class
 */
class Posts
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public postText!: string;
  public picture!: string | null;
  public userId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here if needed
    Posts.belongsTo(models.Users, { foreignKey: "userId" });
    Posts.hasMany(models.Comments, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
    Posts.hasMany(models.Likes, { foreignKey: "postId", onDelete: "CASCADE" });
  }
}

/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
  Posts.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Posts",
      tableName: "Posts",
    }
  );

  return Posts;
};
