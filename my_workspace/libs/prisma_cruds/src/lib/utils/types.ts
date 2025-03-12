import { PrismaClient } from '@prisma/client';

export type TPrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;

export type TFindFirstArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findFirst']>[0] : never;
};

export type TFindManyArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findMany']>[0] : never;
};

export type TResultEinteilungenInKontingente = {
  id: number;
  von: Date;
  bis: Date;
  prioritaet: number;
  mitarbeiter_id: number;
  kontingent_id: number;
  team_id: number;
  kontingent_name: string;
  po_dienst_name: string;
  po_dienst_id: number;
  einteilung_id: number;
  tag: Date;
  mitarbeiter_name: string;
  dienst_name: string;
  factor: number;
  in_rot: boolean;
};

export type TCreateArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['create']>[0] : never;
};

export type TUpdateArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['update']>[0] : never;
};

export type TDeleteArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['delete']>[0] : never;
};

export type TCreateManyArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['createMany']>[0] : never;
};

export type TUpdateManyArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['updateMany']>[0] : never;
};

export type TDeleteManyArgsTypes = {
  [K in TPrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['deleteMany']>[0] : never;
};
