import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { ExtractedTokenUser } from 'src/interfaces/auth';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserType[] =
      this.reflect.getAllAndOverride('roles', [context.getHandler()]) || [];
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token: string =
        request?.headers?.authorization?.split('Bearer ')[1];
      if (token) {
        try {
          const payload = (await jwt.verify(
            token,
            process.env.JSON_SECRET_KEY,
          )) as ExtractedTokenUser;
          if (!payload) {
            return false;
          }
          const user = await this.prisma.user.findUnique({
            where: {
              id: payload.id,
            },
            select: {
              userType: true,
            },
          });
          if (!user) {
            return false;
          }
          if (roles.includes(user.userType)) {
            return true;
          }
          return false;
        } catch {
          return false;
        }
      }
    }

    return true;
  }
}
