import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Post Model Attribute Definitions
// ----------------------------------------------
// Represents a user post in the system (text + optional image)
// ----------------------------------------------
interface PostAttributes {
  id?: number; // Primary key (auto-generated)
  title: string; // Post title
  postText: string; // Main post content
  picture?: string | null; // Optional picture (URL or base64 string)
  userId: number; // Foreign key -> Users table
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields during creation
// ----------------------------------------------
interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "picture"> {}

// ----------------------------------------------
// Posts Model Class
// ----------------------------------------------
class Posts
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public postText!: string;
  public picture!: string | null;
  public userId!: number;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // Each post belongs to a user
  // Each post can have many comments and likes
  // Cascade deletes remove related comments & likes when post is deleted
  static associate(models: any) {
    Posts.belongsTo(models.Users, { foreignKey: "userId" });
    Posts.hasMany(models.Comments, {
      foreignKey: "postId",
      onDelete: "CASCADE",
    });
    Posts.hasMany(models.Likes, { foreignKey: "postId", onDelete: "CASCADE" });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
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
        type: DataTypes.STRING, // could store URL or base64 string
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Posts", // Internal Sequelize name
      tableName: "Posts", // DB table name
    }
  );

  return Posts;
};
