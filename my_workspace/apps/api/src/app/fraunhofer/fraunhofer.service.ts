import { Fraunhofer, FraunhoferTypes } from '@my-workspace/prisma_hains';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraunhoferService {
  async getPlanData(start: string, end: string, clientId: string, clientSecret: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Fraunhofer.getFraunhoferPlanData(startDate, endDate, clientId, clientSecret);
  }

  async createPlan(plan: FraunhoferTypes.FraunhoferNewPlan) {
    return Fraunhofer.createFraunhoferPlan(plan);
  }
}
