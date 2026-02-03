/**
 * ------------------------------------------
 * Animal Types
 * ------------------------------------------
 * Standardized types for animals to use in frontend:
 * - forms
 * - API calls
 * - state management
 */

/**
 * Backend-controlled fields
 */
export type Species = "Dog" | "Cat" | "Rabbit" | "Other";
export type AgeUnit = "Months" | "Years";
export type HealthState = "Good" | "Needs Medication" | "Critical";
export type Size = "Small" | "Medium" | "Large";
export type ActivityLevel = "Low" | "Medium" | "High";

/**
 * Shape of an Animal record returned from backend
 */
export interface Animal {
  id: number;
  species: Species;
  name: string;
  age: number;
  ageUnit: AgeUnit;
  health: HealthState;
  size: Size;
  activityLevel: ActivityLevel;
  goodWithKids: boolean;
  goodWithPets: boolean;
  description?: string | null;
  pictureUrl?: string | null;
  shelterId: number;
  createdAt: string; // timestamps from Sequelize
  updatedAt: string;
}

/**
 * Shape of data needed to CREATE a new animal
 */
export interface AnimalCreationAttributes {
  species: Species;
  name: string;
  age: number;
  ageUnit: AgeUnit;
  health: HealthState;
  size: Size;
  activityLevel: ActivityLevel;
  goodWithKids: boolean;
  goodWithPets: boolean;
  description?: string | null;
  pictureUrl?: string | null;
}

/**
 * Shape of data for updating an animal (partial updates allowed)
 */
export type AnimalUpdateAttributes = Partial<AnimalCreationAttributes>;
