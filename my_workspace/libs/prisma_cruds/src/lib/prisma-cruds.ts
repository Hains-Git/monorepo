import { prismaDb } from '@my-workspace/prisma_hains';
import * as Types from './utils/types';

export function prismaCruds(): string {
  return 'prisma_cruds';
}

export async function findManyByModelKey<K extends Types.PrismaModels>(key: K, args: Types.FindManyArgsTypes[K] = {}) {
  const data = await (prismaDb[key] as any).findMany(args);
  return data;
}

export async function findFirstByModelKey<K extends Types.PrismaModels>(
  key: K,
  args: Types.FindFirstArgsTypes[K] = {}
) {
  const data = await (prismaDb[key] as any).findFirst(args);
  return data;
}

export async function createByModelKey<K extends Types.PrismaModels>(key: K, args: Types.CreateArgsTypes[K]) {
  const data = await (prismaDb[key] as any).create(args);
  return data;
}

export async function updateByModelKey<K extends Types.PrismaModels>(key: K, args: Types.UpdateArgsTypes[K]) {
  const data = await (prismaDb[key] as any).update(args);
  return data;
}

export async function deleteByModelKey<K extends Types.PrismaModels>(key: K, args: Types.DeleteArgsTypes[K]) {
  const data = await (prismaDb[key] as any).delete(args);
  return data;
}

export async function createManyByModelKey<K extends Types.PrismaModels>(key: K, args: Types.CreateManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).createMany(args);
  return data;
}

export async function updateManyByModelKey<K extends Types.PrismaModels>(key: K, args: Types.UpdateManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).updateMany(args);
  return data;
}

export async function deleteManyByModelKey<K extends Types.PrismaModels>(key: K, args: Types.DeleteManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).deleteMany(args);
  return data;
}
