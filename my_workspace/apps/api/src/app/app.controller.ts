import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dienstplanung')
  getData(@Query() query: any) {
    console.log('App;Controller:Dienstplanung');
    return this.appService.getDienstplanung(query.dienstplan_id || 65);
  }
  @Get('apidata')
  getApiData(@Query() query: any) {
    return this.appService.getApiData(query?.user_id || 3);
  }
  @Post('save_planungs_comment')
  getSavePlanungsComment(@Body() body: any) {
    return this.appService.savePlanungsComment(body);
  }
}
