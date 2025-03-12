import { prismaDb } from '@my-workspace/prisma_hains';
import * as Types from './utils/types';

export function prismaCruds(): string {
  return 'prisma_cruds';
}

export async function findManyByModelKey<K extends Types.TPrismaModels>(
  key: K,
  args: Types.TFindManyArgsTypes[K] = {}
) {
  const data = await (prismaDb[key] as any).findMany(args);
  return data;
}

export async function findFirstByModelKey<K extends Types.TPrismaModels>(
  key: K,
  args: Types.TFindFirstArgsTypes[K] = {}
) {
  const data = await (prismaDb[key] as any).findFirst(args);
  return data;
}

export async function createByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TCreateArgsTypes[K]) {
  const data = await (prismaDb[key] as any).create(args);
  return data;
}

export async function updateByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TUpdateArgsTypes[K]) {
  const data = await (prismaDb[key] as any).update(args);
  return data;
}

export async function deleteByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TDeleteArgsTypes[K]) {
  const data = await (prismaDb[key] as any).delete(args);
  return data;
}

export async function createManyByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TCreateManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).createMany(args);
  return data;
}

export async function updateManyByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TUpdateManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).updateMany(args);
  return data;
}

export async function deleteManyByModelKey<K extends Types.TPrismaModels>(key: K, args: Types.TDeleteManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).deleteMany(args);
  return data;
}
