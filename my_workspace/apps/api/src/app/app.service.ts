import { Injectable } from '@nestjs/common';
import { getMonatsplanung } from '@my-workspace/prisma_hains';

@Injectable()
export class AppService {
  async getData() {
    const data = await getMonatsplanung(65);
    return { data };
  }
}
