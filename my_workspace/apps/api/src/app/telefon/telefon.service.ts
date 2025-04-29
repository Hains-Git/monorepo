import { prismaDb } from '@my-workspace/prisma_hains';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelefonService {
  async list() {
    return await prismaDb.telefonliste_joomla.findMany({
      include: {
        telefonliste_label: true
      },
      orderBy: [{ telefonliste_label: { position: 'asc' } }, { position: 'asc' }, { name: 'asc' }]
    });
  }
}
