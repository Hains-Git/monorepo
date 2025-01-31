import { Controller, Post, Body } from '@nestjs/common';

import { AbwesenheitenService } from './abwesenheiten.service';

@Controller()
export class AbwesenheitenController {
  constructor(private readonly abwesenheitenService: AbwesenheitenService) {}

  @Post('get_abwesenheitsdata')
  getAbwesenheitsData(@Body() body: { init: boolean; direction: string; date_view: string; left_side_date: string }) {
    return this.abwesenheitenService.getAbwesenheitsData(body);
  }
}
