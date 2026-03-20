// ----------------------------------------------
// Status
// ----------------------------------------------
export const STATUS = ["Unverified", "Verified", "Suspended"] as const;
export type Status = (typeof STATUS)[number];
