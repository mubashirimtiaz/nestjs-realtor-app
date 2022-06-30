import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { Filter } from 'src/interfaces/home';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';

const homes = [
  {
    id: 6,
    address: 'C81, Al-Falah near Sea View Park',
    city: 'Gwadar',
    price: 4500000,
    realtor_id: 5,
    images: [
      {
        url: 'src_1',
      },
    ],
    numberOfBedrooms: 5,
    numberOfBathrooms: 5,
    listedDate: '2022-06-25T19:57:15.345Z',
    landSize: 6.9,
    typeOfProperty: PropertyType.COMMERCIAL,
  },
];

describe('Home Service', () => {
  let homeService: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(homes),
            },
          },
        },
      ],
    }).compile();
    homeService = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    const filter: Filter = {
      city: 'Karachi',
      price: {
        gte: 100000,
        lte: 3000000,
      },
      propertyType: PropertyType.COMMERCIAL,
    };

    it('should called prisma, home.findMany with correct params', async () => {
      const mockPrismaFindManyHomesFunc = jest.fn().mockReturnValue(homes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomesFunc);
      await homeService.getHomes(filter);
      expect(mockPrismaFindManyHomesFunc).toBeCalledWith({
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
    });
  });
});
