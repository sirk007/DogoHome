import { DataTypes, Model, Sequelize, Optional } from "sequelize";

// ----------------------------------------------
// Likes Model Attribute Definitions
// ----------------------------------------------
// Represents a like from a user on either a post or a comment
// ----------------------------------------------
interface LikesAttributes {
  id?: number; // Primary key (auto-generated)
  userId?: number; // FK -> Users table (who liked)
  postId?: number | null; // FK -> Posts table (what post was liked)
  commentId?: number | null; // FK -> Comments table (what comment was liked)
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields during creation
// ----------------------------------------------
interface LikesCreationAttributes extends Optional<LikesAttributes, "id"> {}

// ----------------------------------------------
// Likes Model Class
// ----------------------------------------------
class Likes
  extends Model<LikesAttributes, LikesCreationAttributes>
  implements LikesAttributes
{
  public id!: number;
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
  // Each like belongs to:
  // - a user
  // - a post (optional)
  // - a comment (optional)
  static associate(models: any) {
    Likes.belongsTo(models.Users, { foreignKey: "userId" });
    Likes.belongsTo(models.Posts, { foreignKey: "postId" });
    Likes.belongsTo(models.Comments, { foreignKey: "commentId" });
  }
}
// ----------------------------------------------
// Model Initializer
// ----------------------------------------------
export default (sequelize: Sequelize) => {
  Likes.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "cascade",
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Posts", key: "id" },
        onDelete: "cascade",
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Comments", key: "id" },
        onDelete: "cascade",
      },
    },
    {
      sequelize,
      modelName: "Likes", // Internal Sequelize name
      tableName: "Likes", // DB table name
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
    }
  );

  return Likes;
};
