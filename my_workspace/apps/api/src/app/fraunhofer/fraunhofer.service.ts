import { createFraunhoferPlan, FraunhoferNewPlan, getFraunhoferPlanData } from '@my-workspace/prisma_hains';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraunhoferService {
  async getPlanData(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return getFraunhoferPlanData(startDate, endDate);
  }

  async createPlan(plan: FraunhoferNewPlan) {
    return createFraunhoferPlan(plan);
  }
}
