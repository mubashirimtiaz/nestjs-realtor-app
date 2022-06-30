import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { ExtractedTokenUser } from 'src/interfaces/auth';

export class UserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const token: string = request?.headers?.authorization?.split('Bearer ')[1];

    if (token) {
      const user = (await jwt.decode(token)) as ExtractedTokenUser;

      if (Date.now() >= user.exp * 1000) {
        throw new UnauthorizedException();
      }
      request.user = user;
    }
    return next.handle();
  }
}
