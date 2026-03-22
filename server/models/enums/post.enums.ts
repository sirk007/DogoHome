// -----------------------------------------------------------------
// POST ENUMS
// -----------------------------------------------------------------
/**
 * This file defines all enumeration types for the Post model.
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
// TYPE - Type of post
// -----------------------------------------------------------------
// Runtime array for Sequelize validation
// as const ensures TypeScript treats these as literal values
// not just generic strings
export const TYPE = ["LOST", "FOUND", "SIGHTING"] as const;

// TypeScript union type derived form the array
// (typeof TYPE)[number] means: "Give me the type of any element in Type"
// This creates: type Type = "LOST" | "FOUND" | "SIGHTING"
export type Type = (typeof TYPE)[number];
