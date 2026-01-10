import { DataTypes, Model, Sequelize, Optional } from "sequelize";

/**
 * Attributes interface for Likes model
 */
interface LikesAttributes {
    id?: number;
    userId?: number;
    postId?: number | null;
    commentId?: number | null;
}

/**
 * Attributes required at creation time
 * (id is auto-generated)
 */
interface LikesCreationAttributes
    extends Optional<LikesAttributes, "id"> {}

/**
 * Likes Model class
 */
class Likes
    extends Model<LikesAttributes, LikesCreationAttributes>
    implements LikesAttributes
{
    public id!: number;
    public userId!: number;
    public postId!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here if needed
        Likes.belongsTo(models.Users, { foreignKey: "userId" });
        Likes.belongsTo(models.Posts, { foreignKey: "postId" });
        Likes.belongsTo(models.Comments, { foreignKey: "commentId" });
    }
}
/**
 * Model initializer
 */
export default (sequelize: Sequelize) => {
    Likes.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'Users', key: 'id' },
                onDelete: 'cascade',
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Posts', key: 'id' },
                onDelete: 'cascade',
            },
            commentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'Comments', key: 'id' },
                onDelete: 'cascade',
            },
        },
        {
            sequelize,
            modelName: "Likes",
            tableName: "Likes",
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'postId'],
                },
                {
                    unique: true,
                    fields: ['userId', 'commentId'],
                },
            ],
        }
    );

    return Likes;
};