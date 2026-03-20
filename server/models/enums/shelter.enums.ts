// -----------------------------------------------------------------
// SHELTER ENUMS
// -----------------------------------------------------------------
/**
 * This file defines all enumeration types for the Shelter model.
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
// Status - Determine users status of verification
// -----------------------------------------------------------------
// Runtime array for Sequelize validation
// as const ensures TypeScript treats these as literal values
// not just generic strings
export const STATUS = ["Unverified", "Verified", "Suspended"] as const;
// TypeScript union type derived form the array
// (typeof STATUS)[number] means: "Give me the type of any element in STATUS"
// This creates: type STATUS = "Unverified" | "Verified" | "Suspended"
export type Status = (typeof STATUS)[number];
