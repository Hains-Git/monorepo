import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { MitarbeiterInfoService } from './mitarbeiterinfo.service';

@Controller()
export class MitarbeiterInfoController {
  constructor(private readonly mitarbeiterInfoService: MitarbeiterInfoService) {}

  @Get('get_all_user_data')
  getMitarbeiterInfoData() {
    return this.mitarbeiterInfoService.getMitarbeiterInfoData();
  }
  @Get('mitarbeiter_details')
  getMitarbeiterDetails(@Query() query: { id: number; user_id: number }) {
    console.log('getMitarbeiterDetails', query);
    const mitarbeiterId = query.id;
    const userId = query.user_id;
    return this.mitarbeiterInfoService.getMitarbeiterDetails(mitarbeiterId, userId);
  }

  @Post('einteilungen_in_time')
  getEinteilungenInTime(@Body() body: { start: string; end: string; id: number }) {
    return this.mitarbeiterInfoService.getEinteilungenInTime(body);
  }
}
