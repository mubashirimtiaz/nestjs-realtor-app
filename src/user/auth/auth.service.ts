import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { ProductKeyData, SignInData, SignUpData } from 'src/interfaces/auth';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(
    { email, password, name, phone }: SignUpData,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        userType: userType,
      },
    });
    const token = this.generateJWT(user.name, user.id, user.userType);
    return { token };
  }

  async signin({ email, password }: SignInData) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const token = await this.generateJWT(user.name, user.id, user.userType);
    return { token };
  }

  private generateJWT(name: string, id: number, userType: UserType) {
    return jwt.sign({ name, id, userType }, process.env.JSON_SECRET_KEY, {
      expiresIn: '1d',
    });
  }

  async generateProductKey({ email, userType }: ProductKeyData) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY}`;
    const key = await bcrypt.hash(string, 10);
    return key;
  }
}
