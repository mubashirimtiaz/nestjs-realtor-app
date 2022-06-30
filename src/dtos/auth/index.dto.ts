import { UserType } from '@prisma/client';
import {
  IsPhoneNumber,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(18)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey: string;
}

export class SignInDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ProductKeyDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;
}
