import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('dienstplanung')
  getData(@Query() query: { dienstplan_id: string; vorschlag: string }) {
    return this.appService.getDienstplanung(Number(query.dienstplan_id), query.vorschlag === 'true');
  }

  @Get('apidata')
  getApiData(@Query() query: { user_id: string }) {
    return this.appService.getApiData(Number(query?.user_id));
  }

  @Post('save_planungs_comment')
  getSavePlanungsComment(@Body() body: any) {
    return this.appService.savePlanungsComment(body);
  }

  @Get('localtest')
  getLocalTest() {
    return this.appService.getLocalTest();
  }
}
