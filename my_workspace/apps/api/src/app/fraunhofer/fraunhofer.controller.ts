import { Body, Controller, Param, Post } from '@nestjs/common';
import { FraunhoferService } from './fraunhofer.service';
import { FraunhoferNewPlan } from '@my-workspace/prisma_hains';

@Controller()
export class FraunhoferController {
  constructor(private readonly fraunhoferService: FraunhoferService) {}
  @Post('fraunhofer/data/:start/:end')
  getData(
    @Param('start') start: string,
    @Param('end') end: string,
    @Body()
    body: {
      client_id: string;
      client_secret: string;
    }
  ) {
    return this.fraunhoferService.getPlanData(start, end, body?.client_id || '', body?.client_secret || '');
  }

  @Post('fraunhofer/new_plan')
  createPlan(@Body() body: FraunhoferNewPlan) {
    return this.fraunhoferService.createPlan(body);
  }
}
