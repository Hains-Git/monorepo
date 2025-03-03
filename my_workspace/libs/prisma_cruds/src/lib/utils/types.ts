import { PrismaClient } from '@prisma/client';

type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;
export type FindManyArgsTypes = {
  [K in PrismaModels]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['findMany']>[0] : never;
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
