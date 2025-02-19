import { Fraunhofer } from '@my-workspace/models';
import { FraunhoferTypes } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraunhoferService {
  async getPlanData(start: string, end: string, clientId: string, clientSecret: string) {
    const startDate = newDate(start);
    const endDate = newDate(end);
    return Fraunhofer.getFraunhoferPlanData(startDate, endDate, clientId, clientSecret);
  }

  async createPlan(plan: FraunhoferTypes.FraunhoferNewPlan) {
    return Fraunhofer.createFraunhoferPlan(plan);
  }
}
