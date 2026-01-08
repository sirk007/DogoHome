import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

// Import models explicitly
import Users from './Users';
// import Posts from './Posts';
// import Likes from './Likes';
// import County from './County';
// import Animals from './Animals';
import Shelter from './Shelter';

const db: any = {};

// Initialize models
db.Users = Users(sequelize);
// db.Posts = Posts(sequelize);
// db.Likes = Likes(sequelize);
// db.County = County(sequelize);
// db.Animals = Animals(sequelize);
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
