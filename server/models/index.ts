import fs from 'fs';
import path from 'path';
import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/database';

const basename = path.basename(__filename);
const db: Record<string, typeof Model> = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== basename &&
      file.endsWith('.ts') &&
      !file.endsWith('.test.ts')
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

// Run model associations
Object.keys(db).forEach(modelName => {
  if ((db[modelName] as any).associate) {
    (db[modelName] as any).associate(db);
  }
});

export { sequelize };
export default db;
