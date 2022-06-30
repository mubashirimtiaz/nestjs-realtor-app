import { UserType } from '@prisma/client';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  productKey?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ProductKeyData {
  email: string;
  userType: UserType;
}

export interface ExtractedTokenUser {
  name: string;
  id: number;
  iat: number;
  exp: number;
  userType: UserType;
}
