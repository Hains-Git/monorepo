import { prismaDb } from '@my-workspace/prisma_hains';
import { TFindManyArgsTypes } from './utils/types';
import { getZeitraumkategorienInterval } from './utils/crud_helper';

export async function getDienstbedarfCustomQuery(condition: TFindManyArgsTypes['dienstbedarves']) {
  return await prismaDb.dienstbedarves.findMany(condition);
}

export async function getDienstbedarfForSaldi(anfang: Date, ende: Date) {
  return prismaDb.dienstbedarves.findMany({
    where: {
      OR: [{ end_date: { gt: anfang } }, { end_date: null }],
      zeitraumkategories: getZeitraumkategorienInterval(anfang, ende)
    },
    include: {
      arbeitszeitverteilungs: true,
      zeitraumkategories: true,
      po_diensts: {
        include: {
          teams: true
        }
      }
    },
    orderBy: {
      zeitraumkategories: {
        prio: 'desc'
      }
    }
  });
}
