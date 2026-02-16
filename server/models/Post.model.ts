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

  type: "LOST" | "FOUND" | "SIGHTING"; // Post category
  latitude?: number | null; // Optional geolocation data
  longitude?: number | null;
}

// ----------------------------------------------
// Creation Attributes
// ----------------------------------------------
// Optional fields during creation
// ----------------------------------------------
interface PostCreationAttributes extends Optional<
  PostAttributes,
  "id" | "picture" | "latitude" | "longitude"
> {}

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
  public picture?: string | null;
  public userId!: number;

  public type!: "LOST" | "FOUND" | "SIGHTING";
  public latitude?: number | null;
  public longitude?: number | null;

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
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("LOST", "FOUND", "SIGHTING"),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Posts",
      tableName: "Posts",
    },
  );

  return Posts;
};
