export const STATUS = ["Invited", "Active", "Disabled"] as const;
export type Status = (typeof STATUS)[number];

export const ROLE = ["Manager", "Staff"] as const;
export type Role = (typeof ROLE)[number];
