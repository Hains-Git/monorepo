import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FraunhoferService } from './fraunhofer.service';
import { FraunhoferNewPlan } from '@my-workspace/prisma_hains';

@Controller()
export class FraunhoferController {
  constructor(private readonly fraunhoferService: FraunhoferService) {}
  @Get('fraunhofer/data/:start/:end')
  getData(@Param('start') start: string, @Param('end') end: string) {
    return this.fraunhoferService.getPlanData(start, end);
  }

  @Post('fraunhofer/new_plan')
  createPlan(@Body() body: FraunhoferNewPlan) {
    return this.fraunhoferService.createPlan(body);
  }
}
