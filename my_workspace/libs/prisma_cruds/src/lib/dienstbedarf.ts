import { prismaDb } from '@my-workspace/prisma_hains';
import { FindManyArgsTypes } from './utils/types';

export async function getDienstbedarfCustomQuery(condition: FindManyArgsTypes['dienstbedarves']) {
  return await prismaDb.dienstbedarves.findMany(condition);
}
