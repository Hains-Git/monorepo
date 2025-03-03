import { Controller, Get, Param } from '@nestjs/common';

import { ZeitraumkategorienService } from './zeitraumkategorien.service';

@Controller()
export class ZeitraumkategorienController {
  constructor(private readonly zeitraumkategorienService: ZeitraumkategorienService) {}

  @Get('zeitraumkategorien/preview/:year')
  getMitarbeiterInfoData(@Param('year') year: string | number) {
    return this.zeitraumkategorienService.preview(year);
  }
}
