import { Controller, Post, Body } from '@nestjs/common';
import { RotationService } from './rotation.service';

@Controller()
export class RotationController {
  constructor(private readonly rotationService: RotationService) {}

  @Post('rotations_interval')
  getRotationInterval(@Body() body: { anfang: string; ende: string; init: boolean; user_id: string }) {
    return this.rotationService.getRotationInterval(body);
  }
}
