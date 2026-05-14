// -----------------------------------------------------------------
// DATABASE MODEL CENTRAL REGISTRY
// -----------------------------------------------------------------
// This file serves as the central hub for all database models.
// 1. Initializes all Sequelize models with the database connection
// 2. Sets up associations/relationships between models
// 3. Exports a single, unified database object
// 4. Provides TypeScript type safety across the entire application
// -----------------------------------------------------------------
import { Sequelize, Model, ModelStatic } from "sequelize";
import sequelize from "../config/database";

// -----------------------------------------------------------------
// MODEL IMPORTS
// -----------------------------------------------------------------
// Importing two things from each model file:
// 1. Initializer function (default export) - this creates the actual model
// 2. The model class/type (named export) - this gives typescript types
//
// This seperation is important!
// 1. The initializer creates the actual Sequelize model.
// 2. The class type lets TypeScript understand the model's shape.
// -----------------------------------------------------------------

// User Model
import initUser, { User } from "./User.model";

// Shelter related models
import initShelter, { Shelter } from "./Shelter.model";
import initShelterStaff, { ShelterStaff } from "./ShelterStaff.model";

// Admin related models
import initAdmin, { Admin } from "./Admin.model";
import initSuperAdmin, { SuperAdmin } from "./SuperAdmin.model";

// Core data models
import initAnimal, { Animal } from "./Animal.model";
import initAdoptionRequest, { AdoptionRequest } from "./AdoptionRequests.model";
import initCounty, { County } from "./County.model";

// Social interaction models
import initPost, { Post } from "./Post.model";
import initSighting, { Sighting } from "./Sighting.model";
import initLike, { Like } from "./Like.model";
import initComment, { Comment } from "./Comment.model";
import initMessage, { Message } from "./Message.model";

// -----------------------------------------------------------------
// INTERFACE DEFINITIONS - The Contract
// -----------------------------------------------------------------
/**
 * This interface defines the exact shape of the database object.
 * The blueprint / Contract states that:
 * Objects must have these protperites, and must have these types
 *
 * Why is this needed?
 * - TypeScript uses this to check if the models are accessed correctly
 * - The IDE uses this for autocomplete suggestions
 * - Other files importing db will know exactly what is available
 */
export interface Models {
  // Each property is a Model Class (Not an instance!)
  // typeof means the class/constructor function, not an actual instance
  User: typeof User;
  Shelter: typeof Shelter;
  ShelterStaff: typeof ShelterStaff;
  Admin: typeof Admin;
  SuperAdmin: typeof SuperAdmin;
  Animal: typeof Animal;
  AdoptionRequest: typeof AdoptionRequest;
  County: typeof County;
  Post: typeof Post;
  Like: typeof Like;
  Comment: typeof Comment;
  Message: typeof Message;
  Sighting: typeof Sighting;
}

/**
 * The complete database interface extends Models (includes all models)
 * + adds the Sequelize instances for advanced operations
 */
export interface DB extends Models {
  // The configured Sequelize instance (for transactions/raw queries/etc...)
  sequelize: Sequelize;
  // The Sequelize library itself (for constants/types/etc...)
  Sequelize: typeof Sequelize;
}

// -----------------------------------------------------------------
// TYPE DEFINITIONS FOR INITIALIZERS
// -----------------------------------------------------------------
/**
 * This type describes the shape of the model initializer functions
 *
 * - ModelInitializer is like a factory that creates models
 * - It takes a Sequelize connection and returns a Model Class
 *
 * Example: initUser is a ModelInitializer because it:
 * - Takes a sequelize instance
 * - Returns the User model class
 */
type ModelInitializer<T extends Model> = (
  sequelize: Sequelize,
) => ModelStatic<T>;

// -----------------------------------------------------------------
// DATABASE PARTIAL OBJECT - BUILDING WITH TYPE SAFETY
// -----------------------------------------------------------------
/**
 * Initiate a Partial database object.
 *
 * Partial<DB> is a TypeScript utility type that makes all properties optional.
 * Since the object is built step by step - during this moment,
 * not all models exist yet. This prevents TypeScript from complaining about
 * missing properties during construction.
 *
 */
const db: Partial<DB> = {};

// -----------------------------------------------------------------
// MODEL INITIALIZATION - Bringing models together
// -----------------------------------------------------------------
// Each model file exports a default function that:
// 1. Takes a Sequelize instance
// 2. Defines the model's schema (Columns, validations, etc..)
// 3. Returns a ready to use model class.
// Call each initializer through sequelize instance and store the result.
// -----------------------------------------------------------------
db.User = initUser(sequelize) as typeof User;
db.Shelter = initShelter(sequelize) as typeof Shelter;
db.ShelterStaff = initShelterStaff(sequelize) as typeof ShelterStaff;
db.Admin = initAdmin(sequelize) as typeof Admin;
db.SuperAdmin = initSuperAdmin(sequelize) as typeof SuperAdmin;

db.Animal = initAnimal(sequelize) as typeof Animal;
db.AdoptionRequest = initAdoptionRequest(sequelize) as typeof AdoptionRequest;
db.County = initCounty(sequelize) as typeof County;

db.Post = initPost(sequelize) as typeof Post;
db.Sighting = initSighting(sequelize) as typeof Sighting;
db.Like = initLike(sequelize) as typeof Like;
db.Comment = initComment(sequelize) as typeof Comment;
db.Message = initMessage(sequelize) as typeof Message;

// -----------------------------------------------------------------
// TYPE GUARD - A helper function for type safety
// -----------------------------------------------------------------
/**
 * This is a type guard - a special function that tells TypeScript:
 * - If this returns true, then the value has an associate method.
 *
 * Why is this needed?
 *
 * As the loop runs through all models, not every model has an associate
 * method. Some models might not have relationships.
 * Typescript doesn't know which models have associations, so it would throw
 * an error when it tried to call model.associate().
 *
 * This function checks at runtime if the method exists, and tells TypeScript
 * at compile time that it's safe to call it.
 */

interface Associateable {
  associate: (models: Models) => void;
}

function hasAssociate(model: any): model is Associateable {
  // Check if:
  // 1. model exists (not null/undefined)
  // 2. model has a property called associate
  // 3. that property is a function
  return model && typeof model.associate === "function";
}

// -----------------------------------------------------------------
// ASSOCIATIONS SETUP - Connecting models together
// -----------------------------------------------------------------
/**
 * 1. Get all values from the db object (models)
 * 2. Cast to any[] temporarily (TypeScript doen't know they're all models yet)
 * 3. For each model, check if it has associations (using the type guard)
 * 4. If it does, call associate() and pass the complete model object
 *
 * The (db as models) cast is safe because by now, all models are initialized
 */
(Object.values(db) as any[]).forEach((model) => {
  // Type guard check - if true, model is Associateable with a proper method
  if (hasAssociate(model)) {
    // Pass the complete models object -all models exist now
    model.associate(db as Models);
  }
});

// -----------------------------------------------------------------
// ADD SEQUELIZE INSTANCES
// -----------------------------------------------------------------
// Add the raw Sequelize instance and library for advanced operations
// Such as: transactions, raw queries or accessing Sequelize operators
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// -----------------------------------------------------------------
// FINAL EXPORT - The fully typed database object
// -----------------------------------------------------------------

/**
 * Cast the final db object to DB type
 *
 * This export is what other files will import:
 * import db from './models' // Gets fully typed database object.
 * import { sequelize } from './models' // Gets just the connection
 */
export default db as DB;
export { sequelize };
