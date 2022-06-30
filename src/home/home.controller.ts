import {
  Body,
  Controller,
  Delete,
  Get,
  // HttpException,
  UseGuards,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Role } from 'src/decorators/role.decorator';
import {
  CreateHomeDTO,
  HomeResponseDTO,
  InquireHomeDTO,
  UpdateHomeDTO,
} from 'src/dtos/home/index.dto';
import { ExtractedTokenUser } from 'src/interfaces/auth';
import { Filter } from 'src/interfaces/home';
import { User } from 'src/user/decorator/user.decorator';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Role(UserType.REALTOR, UserType.ADMIN, UserType.BUYER)
  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('properTyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDTO[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filter: Filter = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filter);
  }

  @Role(UserType.REALTOR, UserType.ADMIN, UserType.BUYER)
  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDTO> {
    return this.homeService.getHomeById(id);
  }

  @Role(UserType.REALTOR, UserType.ADMIN)
  @Post()
  createHome(
    @Body() body: CreateHomeDTO,
    @User()
    user: ExtractedTokenUser,
  ) {
    return this.homeService.createHome(body, user.id);
  }

  @Role(UserType.REALTOR, UserType.ADMIN)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDTO,
    @User() user: ExtractedTokenUser,
  ): Promise<HomeResponseDTO> {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.realtor_id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.updateHome(id, body);
  }

  @Role(UserType.REALTOR, UserType.ADMIN)
  @Delete(':id')
  async deleteHomeById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: ExtractedTokenUser,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.realtor_id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }

  @Role(UserType.BUYER)
  @Post(':id/inquire')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: ExtractedTokenUser,
    @Body() { message }: InquireHomeDTO,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Get(':id/messages')
  async getMessagesByHomeId(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: ExtractedTokenUser,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);
    if (realtor.realtor_id !== user.id) {
      throw new UnauthorizedException();
    }
    return await this.homeService.getMessagesByHomeId(user, homeId);
  }
}
