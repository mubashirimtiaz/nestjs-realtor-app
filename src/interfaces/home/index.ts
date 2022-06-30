import { PropertyType } from '@prisma/client';

export interface Home {
  id: number;
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  listedDate: Date;
  price: number;
  landSize: number;
  typeOfProperty: PropertyType;
  realtorId: number;
}

export interface Image {
  url: string;
}

export interface CreateHome {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  typeOfProperty: PropertyType;
  images: Image[];
}

export interface UpdateHome {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  typeOfProperty?: PropertyType;
}
export interface Filter {
  city?: string;
  price?: { gte?: number; lte?: number };
  propertyType?: PropertyType;
}
