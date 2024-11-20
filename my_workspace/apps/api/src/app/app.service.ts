import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/prisma_hains';
import { getAllApiData } from '@my-workspace/prisma_hains';

@Injectable()
export class AppService {
  async getDienstplanung() {
    const data = await getDienstplanung(65);
    return { data };
  }
  async getApiData() {
    const data = await getAllApiData();
    return data;
  }
}
