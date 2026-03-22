// -----------------------------------------------------------------
// ANIMAL ENUMS
// -----------------------------------------------------------------
/**
 * This file defines all enumeration types for the Animal model.
 * The pattern used here creates both:
 * 1. A runtime array (for Sequelize ENUM validation)
 * 2. A TypeScript union type (for compile-time type checking)
 *
 * The "as const" assertion tells TypeScript to treat the array as
 * a read-only tuple of literal values, not just string[]
 * The (typeof ARRAY)[number] syntax extracts the literal values
 * from the array into union type.
 */
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// SPECIES - Type of animal
// -----------------------------------------------------------------
// Runtime array for Sequelize validation
// as const ensures TypeScript treats these as literal values
// not just generic strings
export const SPECIES = ["Dog", "Cat", "Rabbit", "Other"] as const;

// TypeScript union type derived form the array
// (typeof SPECIES)[number] means: "Give me the type of any element in SPECIES"
// This creates: type Species = "Dog" | "Cat" | "Rabbit" | "Other"
export type Species = (typeof SPECIES)[number];

// -----------------------------------------------------------------
// AGE_UNIT - Type of measurement for animal age
// -----------------------------------------------------------------
// Used to indicate whether the age value represents months or years
export const AGE_UNIT = ["Months", "Years"] as const;
// Creates: type AgeUnit = "Months" | "Years"
export type AgeUnit = (typeof AGE_UNIT)[number];

// -----------------------------------------------------------------
// HEALTH - Health status of the animal
// -----------------------------------------------------------------
export const HEALTH = ["Good", "Needs Medication", "Critical"] as const;
// Creates: type Health = "Good" | "Needs Medication" | "Critical"
export type Health = (typeof HEALTH)[number];

// -----------------------------------------------------------------
// SIZE - Physical size category
// -----------------------------------------------------------------
export const SIZE = ["Small", "Medium", "Large"] as const;
// Creates: type Size = "Small" | "Medium" | "Large"
export type Size = (typeof SIZE)[number];

// -----------------------------------------------------------------
// ACTIVITY_LEVEL - Energy/activity level of the animal
// -----------------------------------------------------------------
export const ACTIVITY_LEVEL = ["Low", "Medium", "High"] as const;
// Creates: type Activity = "Low" | "Medium" | "High"
export type ActivityLevel = (typeof ACTIVITY_LEVEL)[number];
