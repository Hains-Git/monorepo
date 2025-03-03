import { PrismaClient } from '@prisma/client';

export type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;

export type FindFirstArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findFirst']>[0] : never;
};

export type FindManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findMany']>[0] : never;
};

export type CreateArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['create']>[0] : never;
};

export type UpdateArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['update']>[0] : never;
};

export type DeleteArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['delete']>[0] : never;
};

export type CreateManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['createMany']>[0] : never;
};

export type UpdateManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['updateMany']>[0] : never;
};

export type DeleteManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['deleteMany']>[0] : never;
};
