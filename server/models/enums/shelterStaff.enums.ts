// -----------------------------------------------------------------
// SHELTER STAFF ENUMS
// -----------------------------------------------------------------
/**
 * This file defines all enumeration types for the Shelter Staff model.
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
// Status -
// -----------------------------------------------------------------
// Runtime array for Sequelize validation
// as const ensures TypeScript treats these as literal values
// not just generic strings
//
export const STATUS = ["Invited", "Active", "Disabled"] as const;
// TypeScript union type derived form the array
// (typeof STATUS)[number] means: "Give me the type of any element in STATUS"
// This creates: type STATUS = "Invited" | "Active" | "Disabled"
export type Status = (typeof STATUS)[number];

// -----------------------------------------------------------------
// Role
// -----------------------------------------------------------------
// Used to indicate whether the age value represents months or years
export const ROLE = ["Manager", "Staff"] as const;
export type Role = (typeof ROLE)[number];
