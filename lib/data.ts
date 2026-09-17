import rentalsData from "@/data/rentals.json";
import type {
  Building,
  Community,
  PriceFilter,
  Rental,
  RentalFilters,
  RentalsData,
} from "@/lib/types";

const data = rentalsData as RentalsData;

export function getCommunity(): Community {
  return data.community;
}

export function getBuildings(): Building[] {
  return data.buildings;
}

export function getCommunityStats() {
  const buildings = getBuildings();
  return {
    buildingCount: buildings.length,
    maxFloors: Math.max(...buildings.map((building) => building.floors)),
  };
}

export function getBuildingById(id: string): Building | undefined {
  return data.buildings.find((building) => building.id === id);
}

export function getAllRentals(): Rental[] {
  return data.rentals;
}

export function getRentals(): Rental[] {
  return data.rentals.filter((rental) => rental.status === "renting");
}

export function getRentalById(id: string): Rental | undefined {
  return getRentals().find((rental) => rental.id === id);
}

export function getRentalsByBuilding(buildingId: string): Rental[] {
  return getRentals().filter((rental) => rental.buildingId === buildingId);
}

export function getBuildingRentalCount(buildingId: string): number {
  return getRentalsByBuilding(buildingId).length;
}

export function getRentingCount(): number {
  return getRentals().length;
}

function matchesPrice(price: number, filter?: string): boolean {
  if (!filter) return true;
  switch (filter as PriceFilter) {
    case "lt3000":
      return price < 3000;
    case "3000-4000":
      return price >= 3000 && price < 4000;
    case "gte4000":
      return price >= 4000;
    default:
      return true;
  }
}

export function filterRentals(filters: RentalFilters = {}): Rental[] {
  return getRentals().filter((rental) => {
    if (filters.building && rental.buildingId !== filters.building) {
      return false;
    }
    if (filters.layout && String(rental.bedrooms) !== filters.layout) {
      return false;
    }
    if (!matchesPrice(rental.price, filters.price)) {
      return false;
    }
    return true;
  });
}

export type FloorRental = {
  floor: number;
  rentals: Rental[];
};

export function getFloorStack(buildingId: string): FloorRental[] {
  const building = getBuildingById(buildingId);
  if (!building) return [];

  const byFloor = new Map<number, Rental[]>();
  for (const rental of getRentalsByBuilding(buildingId)) {
    const list = byFloor.get(rental.floor) ?? [];
    list.push(rental);
    byFloor.set(rental.floor, list);
  }

  const floors: FloorRental[] = [];
  for (let floor = building.floors; floor >= 1; floor -= 1) {
    floors.push({
      floor,
      rentals: byFloor.get(floor) ?? [],
    });
  }
  return floors;
}

export function getBuildingName(buildingId: string): string {
  return getBuildingById(buildingId)?.name ?? "未知楼栋";
}

export function formatLayout(rental: Rental): string {
  if (rental.livingRooms > 0) {
    return `${rental.bedrooms}室${rental.livingRooms}厅`;
  }
  return `${rental.bedrooms}室`;
}
