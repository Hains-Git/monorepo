import { Controller, Get, Post, Body } from '@nestjs/common';

import { MitarbeiterInfoService } from './mitarbeiterinfo.service';

@Controller()
export class MitarbeiterInfoController {
  constructor(private readonly mitarbeiterInfoService: MitarbeiterInfoService) {}

  @Get('get_all_user_data')
  getMitarbeiterInfoData() {
    return this.mitarbeiterInfoService.getMitarbeiterInfoData();
  }
  @Post('einteilungen_in_time')
  getEinteilungenInTime(@Body() body: { start: string; end: string; id: number }) {
    console.log('body', body);
    return this.mitarbeiterInfoService.getEinteilungenInTime(body);
  }
}
