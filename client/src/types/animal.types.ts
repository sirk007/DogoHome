/**
 * ------------------------------------------
 * Animal Types
 * ------------------------------------------
 * Defines all TypeScript types related to animals in the system.
 *
 * Used by:
 * - Shelter dashboard (CRUD)
 * - Public animal listings
 * - Future ML matching models
 */

/**
 * Controlled vocabularies
 */
export type AnimalSpecies = "Dog" | "Cat" | "Rabbit" | "Other";
export type AnimalAgeUnit = "Months" | "Years";
export type AnimalHealth = "Good" | "Needs Medication" | "Critical";
export type AnimalSize = "Small" | "Medium" | "Large";
export type AnimalActivityLevel = "Low" | "Medium" | "High";

/**
 * Base Animal type
 * Matches DB record + API responses
 */
export interface Animal {
  id: number;
  species: AnimalSpecies;
  name: string;
  age: number;
  ageUnit: AnimalAgeUnit;
  health: AnimalHealth;
  size: AnimalSize;
  activityLevel: AnimalActivityLevel;
  goodWithKids: boolean;
  goodWithPets: boolean;
  description?: string | null;
  pictureUrl?: string | null;
  shelterId: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new animal
 * (Shelter only)
 */
export interface AnimalCreationAttributes extends Omit<
  Animal,
  "id" | "createdAt" | "updatedAt"
> {}

/**
 * Payload for updating an animal
 * Partial updates supported
 */
export type AnimalUpdateAttributes = Partial<
  Omit<Animal, "id" | "shelterId" | "createdAt" | "updatedAt">
>;
