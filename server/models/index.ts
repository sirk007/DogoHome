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

const db: any = {};

// Initialize models
db.Users = Users(sequelize);
db.Posts = Posts(sequelize);
db.Likes = Likes(sequelize);
db.County = County(sequelize);
db.Comments = Comments(sequelize);
db.Animals = Animals(sequelize);
db.Admin = Admin(sequelize);
db.Shelter = Shelter(sequelize);

// Run associations
Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
export { sequelize };
