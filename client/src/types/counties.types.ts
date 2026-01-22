/**
 * ------------------------------------------
 * Irish Counties
 * ------------------------------------------
 * Provides a constant list of Irish counties and a corresponding TypeScript type.
 *
 * Usage:
 * - Can be used for dropdowns, selects, or forms where county selection is required.
 * - Type-safe usage with `IrishCounty` ensures only valid county names are accepted.
 */

// ------------------------------------------
// List of Irish counties
// ------------------------------------------
export const IrishCounties = [
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Donegal",
  "Dublin",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
] as const;

// ------------------------------------------
// IrishCounty type
// ------------------------------------------
/**
 * Type representing any valid Irish county.
 * Derived directly from `IrishCounties` array for type safety.
 */
export type IrishCounty = (typeof IrishCounties)[number];
