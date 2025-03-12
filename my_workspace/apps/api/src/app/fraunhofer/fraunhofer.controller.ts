import { Body, Controller, Param, Post } from '@nestjs/common';
import { FraunhoferService } from './fraunhofer.service';
import { FraunhoferTypes } from '@my-workspace/prisma_cruds';

@Controller('fraunhofer')
export class FraunhoferController {
  constructor(private readonly fraunhoferService: FraunhoferService) {}
  @Post('data/:start/:end')
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

  @Post('data/:start/:end/:id')
  getDataWithDienstplan(
    @Param('start') start: string,
    @Param('end') end: string,
    @Param('id') id: string,
    @Body()
    body: {
      client_id: string;
      client_secret: string;
    }
  ) {
    return this.fraunhoferService.getPlanData(
      start,
      end,
      body?.client_id || '',
      body?.client_secret || '',
      parseInt(id, 10)
    );
  }

  @Post('dienstplaene')
  getDienstplaene(@Body() body: { client_id: string; client_secret: string }) {
    return this.fraunhoferService.getDienstplaene(body?.client_id || '', body?.client_secret || '');
  }

  @Post('new_plan')
  createPlan(@Body() body: FraunhoferTypes.TFraunhoferNewPlan) {
    return this.fraunhoferService.createPlan(body);
  }
}
