import { Controller, Get, Param } from '@nestjs/common';

import { ZeitraumkategorienService } from './zeitraumkategorien.service';

@Controller('zeitraumkategorien')
export class ZeitraumkategorienController {
  constructor(private readonly zeitraumkategorienService: ZeitraumkategorienService) {}

  @Get('preview/:year')
  getMitarbeiterInfoData(@Param('year') year: string | number) {
    return this.zeitraumkategorienService.preview(year);
  }
}
