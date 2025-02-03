import { Controller, Get } from '@nestjs/common';

import { MitarbeiterInfoService } from './mitarbeiterinfo.service';

@Controller()
export class MitarbeiterInfoController {
  constructor(private readonly mitarbeiterInfoService: MitarbeiterInfoService) {}

  @Get('get_all_user_data')
  getMitarbeiterInfoData() {
    console.log('called new api');
    return this.mitarbeiterInfoService.getMitarbeiterInfoData();
  }
}
