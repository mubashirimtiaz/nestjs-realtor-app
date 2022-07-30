import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  Greet() {
    return { message: 'WELCOME TO REALTOR APP', status: 201 };
  }
}
