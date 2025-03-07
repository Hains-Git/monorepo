import { Fraunhofer } from '@my-workspace/models';
import { FraunhoferTypes } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraunhoferService {
  async getPlanData(start: string, end: string, clientId: string, clientSecret: string, dienstplanId?: number) {
    return Fraunhofer.getFraunhoferPlanData(newDate(start), newDate(end), clientId, clientSecret, dienstplanId);
  }

  async createPlan(plan: FraunhoferTypes.FraunhoferNewPlan) {
    return Fraunhofer.createFraunhoferPlan(plan);
  }

  async getDienstplaene(clientId: string, clientSecret: string) {
    return Fraunhofer.getDienstplaene(clientId, clientSecret);
  }
}
