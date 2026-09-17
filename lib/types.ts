export type RentalStatus = "renting" | "rented";

export type Community = {
  name: string;
  address: string;
  cover: string;
};

export type Building = {
  id: string;
  name: string;
  floors: number;
};

export type RentalContact = {
  name: string;
  phone: string;
};

export type Rental = {
  id: string;
  buildingId: string;
  unit: string;
  floor: number;
  room: string;
  title: string;
  price: number;
  area: number;
  bedrooms: number;
  livingRooms: number;
  bathrooms: number;
  orientation: string;
  decoration: string;
  images: string[];
  features: string[];
  description: string;
  contact: RentalContact;
  status: RentalStatus;
};

export type RentalsData = {
  community: Community;
  buildings: Building[];
  rentals: Rental[];
};

export type PriceFilter = "lt3000" | "3000-4000" | "gte4000";

export type RentalFilters = {
  building?: string;
  layout?: string;
  price?: string;
};
