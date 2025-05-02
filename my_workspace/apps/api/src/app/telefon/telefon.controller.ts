import { Controller, Get } from '@nestjs/common';
import { TelefonService } from './telefon.service';

@Controller('telefon')
export class TelefonController {
  constructor(private readonly teamService: TelefonService) {}

  @Get('liste')
  async list() {
    return this.teamService.list();
  }
}
