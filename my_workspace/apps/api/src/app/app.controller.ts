import { Controller, Get, Param, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dienstplanung')
  getData(@Query() query: any) {
    return this.appService.getDienstplanung(query.dienstplan_id);
  }
  @Get('apidata')
  getApiData(@Query() query: any) {
    return this.appService.getApiData(query?.user_id);
  }
}
