import { Prisma } from '@prisma/client';

export type TPrismaModels = Prisma.TypeMap['meta']['modelProps'];

export type TFindManyArgsTypes = {
  [K in TPrismaModels]: Prisma.TypeMap['model'][K]['operations']['findMany']['args'];
};

export type TFindManyResultTypes = {
  [K in TPrismaModels]: Prisma.TypeMap['model'][K]['operations']['findMany']['result'];
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
