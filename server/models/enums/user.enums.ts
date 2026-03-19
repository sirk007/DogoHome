// ----------------------------------------------
// Activity Levels
// ----------------------------------------------
export const ACTIVITY_LEVELS = ["Low", "Medium", "High"] as const;
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

// ----------------------------------------------
// Pet Experience Levels
// ----------------------------------------------
export const PET_EXPERIENCE_LEVELS = [
  "None",
  "Beginner",
  "Experienced",
] as const;
export type PetExperienceLevel = (typeof PET_EXPERIENCE_LEVELS)[number];

// ----------------------------------------------
// Dog Sizes
// ----------------------------------------------
export const DOG_SIZES = ["Small", "Medium", "Large"] as const;
export type DogSize = (typeof DOG_SIZES)[number];
