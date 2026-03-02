import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface MessageAttributes {
  id?: number;
  senderId: number; // FK -> Users or Shelter
  receiverId: number; // FK -> Users or Shelter
  animalId?: number; // optional, tie to specific animal if relevant
  content: string;
  readStatus: boolean; // false = unread, true = read
  timestamp?: Date; // optional, can use createdAt instead
}

interface MessageCreationAttributes extends Optional<
  MessageAttributes,
  "id" | "readStatus" | "timestamp"
> {}

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public animalId?: number;
  public content!: string;
  public readStatus!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Message.belongsTo(models.Users, { foreignKey: "senderId" });
    Message.belongsTo(models.Users, { foreignKey: "receiverId" });

    // If animalId exists, link message to Animal
    Message.belongsTo(models.Animals, { foreignKey: "animalId" });
  }
}

export default (sequelize: Sequelize) => {
  Message.init(
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      animalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Animals", key: "id" },
      },
      content: { type: DataTypes.TEXT, allowNull: false },
      readStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "Messages",
    },
  );

  return Message;
};
