import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Image } from 'src/interfaces/home';

export class HomeResponseDTO {
  id: number;
  address: string;
  image: string;
  images: { url: string }[];

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }
  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  @Exclude()
  number_of_bathrooms: number;

  city: string;

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }
  @Exclude()
  listed_date: Date;
  price: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }
  @Exclude()
  land_size: number;

  @Expose({ name: 'typeOfProperty' })
  typeOfProperty() {
    return this.type_of_property;
  }
  @Exclude()
  type_of_property: PropertyType;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  realtor_id: number;

  // @Exclude()
  // images: { url: string }[];

  constructor(partial: Partial<HomeResponseDTO>) {
    Object.assign(this, partial);
  }
}

export class CreateHomeDTO {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  typeOfProperty: PropertyType;

  // @IsNumber()
  // @IsPositive()
  // realtorId: number;

  @IsArray()
  @ValidateNested({ each: true })
  images: Image[];
}

export class UpdateHomeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  typeOfProperty?: PropertyType;
}

export class InquireHomeDTO {
  @IsString()
  @IsNotEmpty()
  message: string;
}
