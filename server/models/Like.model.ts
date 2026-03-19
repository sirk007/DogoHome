import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Likes Model Attribute Definitions
// ----------------------------------------------
// Represents a like from a user on either a post or a comment
// ----------------------------------------------
interface LikeAttributes {
  id: number; // Primary key (auto-generated)
  userId: number; // FK -> Users table (who liked)
  postId?: number | null; // FK -> Posts table (what post was liked)
  commentId?: number | null; // FK -> Comments table (what comment was liked)
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields during creation
// ----------------------------------------------
interface LikesCreationAttributes extends Optional<
  LikeAttributes,
  "id" | "postId" | "commentId"
> {}

// ----------------------------------------------
// Likes Model Class
// ----------------------------------------------
class Like
  extends Model<LikeAttributes, LikesCreationAttributes>
  implements LikeAttributes
{
  public id!: number;
  public userId!: number;
  public postId!: number | null;
  public commentId?: number | null;

  // --------------------------------------------
  // Timestamps (automatically managed)
  // --------------------------------------------
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // --------------------------------------------
  // Model Associations
  // --------------------------------------------
  // Each like belongs to:
  // - a user
  // - a post (optional)
  // - a comment (optional)
  static associate(models: any) {
    Like.belongsTo(models.User, { foreignKey: "userId" });
    Like.belongsTo(models.Post, { foreignKey: "postId" });
    Like.belongsTo(models.Comment, { foreignKey: "commentId" });
  }
}
// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Like.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
        onDelete: "cascade",
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Post", key: "id" },
        onDelete: "cascade",
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Comment", key: "id" },
        onDelete: "cascade",
      },
    },
    {
      sequelize,
      modelName: "Like", // Internal Sequelize name
      tableName: "likes", // DB table name
      indexes: [
        {
          unique: true,
          fields: ["userId", "postId"], // prevent multiple likes by same user on same post
        },
        {
          unique: true,
          fields: ["userId", "commentId"], // prevent multiple likes by same user on same comment
        },
      ],
    },
  );

  return Like;
};
