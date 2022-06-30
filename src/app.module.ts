import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: UserInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('home');
  }
}
