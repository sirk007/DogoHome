import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for Shelter model
 */
interface CommentAttributes {
    id?: number;
    commentBody: string;
    userId: number;
    postId: number;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface CommentCreationAttributes
    extends Optional<CommentAttributes, "id"> {}

/**
 * Comments Model class
 */
class Comments
    extends Model<CommentAttributes, CommentCreationAttributes>
    implements CommentAttributes
{
    public id!: number;
    public commentBody!: string;
    public userId!: number;
    public postId!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        Comments.belongsTo(models.Users, { foreignKey: "userId" });
        Comments.belongsTo(models.Posts, { foreignKey: "postId" });
        Comments.hasMany(models.Likes, { foreignKey: "commentId", onDelete: "CASCADE" });
    }
}

/**
 * Model initializer
 */
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
                references: { model: 'Users', key: 'id' },
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Posts', key: 'id' },
            },
        },
        {
            sequelize,
            modelName: "Comments",
            tableName: "Comments",
        }
    );

    return Comments;
}