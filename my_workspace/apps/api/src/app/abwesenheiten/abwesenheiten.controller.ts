import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { AbwesenheitenService } from './abwesenheiten.service';

@Controller()
export class AbwesenheitenController {
  constructor(private readonly abwesenheitenService: AbwesenheitenService) {}

  @Get('abwesenheiten_relation/:year')
  getAbwesenheitenRelation(@Param('year') year: number) {
    return this.abwesenheitenService.getAbwesenheitenRelation(year);
  }

  @Post('get_abwesenheitsdata')
  getAbwesenheitsData(@Body() body: { init: boolean; direction: string; date_view: string; left_side_date: string }) {
    return this.abwesenheitenService.getAbwesenheitsData(body);
  }

  @Post('get_saldi')
  getSaldi(@Body() body: { start: string; ende: string }) {
    return this.abwesenheitenService.getSaldi(body);
  }
}
