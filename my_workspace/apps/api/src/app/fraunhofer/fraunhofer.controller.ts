import { Body, Controller, Param, Post } from '@nestjs/common';
import { FraunhoferService } from './fraunhofer.service';
import { FraunhoferTypes } from '@my-workspace/prisma_cruds';

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
  createPlan(@Body() body: FraunhoferTypes.FraunhoferNewPlan) {
    return this.fraunhoferService.createPlan(body);
  }
}
