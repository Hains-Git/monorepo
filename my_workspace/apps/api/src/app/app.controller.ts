import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dienstplanung')
  getData() {
    return this.appService.getDienstplanung();
  }
  @Get('apidata')
  getApiData() {
    return this.appService.getApiData();
  }
}
