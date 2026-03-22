// -----------------------------------------------------------------
// ADOPTION REQUEST ENUMS
// -----------------------------------------------------------------
/**
 * This file defines all enumeration types for the Adoption Request model.
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
// STATUS - The status of adoption request's state
// -----------------------------------------------------------------
// Runtime array for Sequelize validation
// as const ensures TypeScript treats these as literal values
// not just generic strings
export const STATUS = ["Pending", "Approved", "Rejected", "Cancelled"] as const;

// TypeScript union type derived form the array
// (typeof Status)[number] means: "Give me the type of any element in STATUS"
// This creates: type Status = "Pending" | "Approved" | "Rejected" | "Cancelled"
export type Status = (typeof STATUS)[number];
