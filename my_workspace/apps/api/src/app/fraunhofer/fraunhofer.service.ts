import { Fraunhofer, FraunhoferTypes } from '@my-workspace/prisma_hains';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraunhoferService {
  async getPlanData(start: string, end: string, clientId: string, clientSecret: string) {
    const startDate = new Date(`${start}T12:00:00.000Z`);
    const endDate = new Date(`${end}T12:00:00.000Z`);
    return Fraunhofer.getFraunhoferPlanData(startDate, endDate, clientId, clientSecret);
  }

  async createPlan(plan: FraunhoferTypes.FraunhoferNewPlan) {
    return Fraunhofer.createFraunhoferPlan(plan);
  }
}
