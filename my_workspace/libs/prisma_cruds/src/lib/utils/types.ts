import { PrismaClient } from '@prisma/client';

type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;
export type FindManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findMany']>[0] : never;
};
