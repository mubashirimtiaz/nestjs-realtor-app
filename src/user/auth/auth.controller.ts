import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { SignUpDTO, SignInDTO, ProductKeyDTO } from 'src/dtos/auth/index.dto';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getUser(@User() user) {
    return user;
  }

  @Post('signup/:userType')
  async signup(
    @Body() body: SignUpDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException();
      }

      const key = `${body.email}-${userType}-${process.env.PRODUCT_KEY}`;
      const isValidProductKey = await bcrypt.compare(key, body.productKey);

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }

  @Post('signin')
  signin(@Body() body: SignInDTO) {
    return this.authService.signin(body);
  }

  @Post('key')
  generateProductKey(@Body() body: ProductKeyDTO) {
    return this.authService.generateProductKey(body);
  }
}
