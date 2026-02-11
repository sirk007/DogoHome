export interface SightingBase {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  type: "Lost" | "Found" | "Sighting"; // could help for filtering tabs
  userId: number;
  countyId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SightingCreationAttributes extends Omit<
  SightingBase,
  "id" | "createdAt" | "updatedAt"
> {}
