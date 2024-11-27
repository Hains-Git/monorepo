import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/prisma_hains';
import { getAllApiData } from '@my-workspace/prisma_hains';

@Injectable()
export class AppService {
  async getDienstplanung(dienstplanId) {
    const data = await getDienstplanung(dienstplanId);
    return data;
  }
  async getApiData(userId) {
    const data = await getAllApiData(Number(userId));
    return data;
  }
}
