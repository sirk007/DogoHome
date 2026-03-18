import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Comment Model Attribute Definitions
// ----------------------------------------------
// Represents a comment made by a user on a post
// ----------------------------------------------
interface CommentAttributes {
  id?: number; // Primary key (auto-generated)
  commentBody: string; // Text content of the comment
  userId: number; // Foreign key -> Users table
  postId: number; // Foreign key -> Posts table
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields during creation
// ----------------------------------------------
interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

// ----------------------------------------------
// Comments Model Class
// ----------------------------------------------
class Comments
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public commentBody!: string;
  public userId!: number;
  public postId!: number;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // - Each comment belongs to a user
  // - Each comment belongs to a post
  // - Each comment can have many likes
  // - Cascade deletion ensures likes are removed if a comment is deleted
  static associate(models: any) {
    Comments.belongsTo(models.User, { foreignKey: "userId" });
    Comments.belongsTo(models.Post, { foreignKey: "postId" });
    Comments.hasMany(models.Likes, {
      foreignKey: "commentId",
      onDelete: "CASCADE",
    });
  }
}

// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Comments.init(
    {
      commentBody: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Posts", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Comments", // Internal Sequelize name
      tableName: "Comments", // DB table name
    },
  );

  return Comments;
};
