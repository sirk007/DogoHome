import { Sequelize } from "sequelize";
import sequelize from "../config/database";

// Import models explicitly
import Users from "./User.model";
import Posts from "./Post.model";
import Likes from "./Likes.model";
import County from "./County.model";
import Comments from "./Comment.model";
import Animals from "./Animal.model";
import Admin from "./Admin.model";
import Shelter from "./Shelter.model";
import Message from "./Messages.model";
import SuperAdmin from "./Super.Admin.model";

const db: any = {};

// ----------------------------------------------
// Initialize models
// ----------------------------------------------
db.Users = Users(sequelize);
db.Posts = Posts(sequelize);
db.Likes = Likes(sequelize);
db.County = County(sequelize);
db.Comments = Comments(sequelize);
db.Animals = Animals(sequelize);
db.Admin = Admin(sequelize);
db.Shelter = Shelter(sequelize);
db.Message = Message(sequelize);
db.SuperAdmin = SuperAdmin(sequelize);

// ----------------------------------------------
// Set up associations
// ----------------------------------------------
Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

// ----------------------------------------------
// Export db object
// ----------------------------------------------
db.sequelize = sequelize; // raw Sequelize instance
db.Sequelize = Sequelize; // Sequelize library

export default db;
export { sequelize };
