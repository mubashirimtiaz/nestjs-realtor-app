import { Injectable, NotFoundException } from '@nestjs/common';
import { HomeResponseDTO } from 'src/dtos/home/index.dto';
import { ExtractedTokenUser } from 'src/interfaces/auth';
import { CreateHome, Filter, UpdateHome } from 'src/interfaces/home';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filter: Filter): Promise<HomeResponseDTO[]> {
    const homes = await this.prismaService.home.findMany({
      where: filter,
      include: {
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
    });
    if (!homes.toString()) {
      throw new NotFoundException();
    }
    return homes.map((home) => {
      const updatedHome = { ...home, image: home?.images?.[0]?.url };
      delete updatedHome.images;
      return new HomeResponseDTO(updatedHome);
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDTO> {
    const home = await this.prismaService.home.findFirst({
      where: {
        id,
      },
      include: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDTO(home);
  }

  async createHome({ images, ...body }: CreateHome, userId: number) {
    const home = await this.prismaService.home.create({
      data: {
        address: body.address,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        land_size: body.landSize,
        city: body.city,
        realtor_id: userId,
        type_of_property: body.typeOfProperty,
        price: body.price,
      },
    });

    for (const image of images) {
      await this.prismaService.image.create({
        data: {
          url: image.url,
          home_id: home.id,
        },
      });
    }
    return { message: 'Home created successfully!', status: 201 };
  }

  async updateHome(id: number, data: UpdateHome): Promise<HomeResponseDTO> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });
    if (!home) {
      throw new NotFoundException();
    }
    const updatedHome = await this.prismaService.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDTO(updatedHome);
  }

  async deleteHomeById(id: number) {
    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });
    const home = await this.prismaService.home.delete({
      where: {
        id,
      },
    });
    if (!home) {
      throw new NotFoundException();
    }

    return { message: 'Home deleted successfully!', status: 204 };
  }

  async inquire(user: ExtractedTokenUser, home_id: number, inquiry: string) {
    const realtor = await this.getRealtorByHomeId(home_id);
    const message = await this.prismaService.message.create({
      data: {
        home_id,
        message: inquiry,
        buyer_id: user.id,
        realtor_id: realtor.realtor_id,
      },
    });

    return message;
  }

  getMessagesByHomeId(user: ExtractedTokenUser, home_id: number) {
    const messages = this.prismaService.message.findMany({
      where: {
        home_id,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    return messages;
  }

  async getRealtorByHomeId(id: number) {
    const homeRealtor = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor_id: true,
      },
    });
    if (!homeRealtor) {
      throw new NotFoundException();
    }
    return homeRealtor;
  }
}
