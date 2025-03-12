import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';

import { MitarbeiterInfoService } from './mitarbeiterinfo.service';
import { newDate } from '@my-workspace/utils';

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
    const mitarbeiterId = Number(query.id);
    const userId = Number(query.user_id);
    return this.mitarbeiterInfoService.getMitarbeiterDetails(mitarbeiterId, userId);
  }

  @Post('einteilungen_in_time')
  getEinteilungenInTime(@Body() body: { start: string; end: string; id: number }) {
    return this.mitarbeiterInfoService.getEinteilungenInTime(body);
  }

  @Get('vk_overview/:anfang/:ende')
  getVKOverview(@Param('anfang') anfang: string, @Param('ende') ende: string) {
    return this.mitarbeiterInfoService.vkOverview(newDate(anfang), newDate(ende));
  }

  @Get('team_vk_overview/:anfang/:ende')
  getTeamVkOverview(@Param('anfang') anfang: string, @Param('ende') ende: string) {
    return this.mitarbeiterInfoService.teamVkOverview(newDate(anfang), newDate(ende));
  }

  @Get('team_vks/:tag')
  getTeamVKs(@Param('tag') tag: string) {
    return this.mitarbeiterInfoService.teamVKs(newDate(tag));
  }
}
