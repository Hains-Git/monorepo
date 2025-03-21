import { prismaDb } from '@my-workspace/prisma_hains';
import * as Types from './utils/types';

export function prismaCruds(): string {
  return 'prisma_cruds';
}

export async function findManyByModelKey<K extends Types.TPrismaModels>(
  key: K,
  args: Types.TFindManyArgsTypes[K] = {}
) {
  const data = (await (prismaDb[key] as any).findMany(args)) as Types.TFindManyResultTypes[K];
  return data;
}
