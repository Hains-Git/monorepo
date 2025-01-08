import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/prisma_hains';
import { getAllApiData } from '@my-workspace/prisma_hains';

@Injectable()
export class AppService {
  async getDienstplanung(dienstplanId: number, loadVorschlaege: boolean) {
    const data = await getDienstplanung(dienstplanId, loadVorschlaege);
    return data;
  }
  async getApiData(userId: number) {
    const data = await getAllApiData(userId);
    return data;
  }
}
