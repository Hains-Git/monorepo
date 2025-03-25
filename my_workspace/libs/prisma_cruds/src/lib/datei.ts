import { prismaDb } from '@my-workspace/prisma_hains';
import { Prisma } from '@prisma/client';

export async function getAllDateiTyps() {
  return await prismaDb.datei_typs.findMany();
}

export async function findOne<TInclude extends Prisma.dateisInclude | undefined>(
  condition: Omit<Prisma.dateisFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dateis.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.dateisGetPayload<{ include: Prisma.dateisInclude }> | null;
}

export async function findOneTyp<TInclude extends Prisma.datei_typsInclude | undefined>(
  condition: Omit<Prisma.datei_typsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.datei_typs.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.datei_typsGetPayload<{ include: Prisma.datei_typsInclude }> | null;
}

export async function findMany<TInclude extends Prisma.dateisInclude | undefined>(
  condition?: Omit<Prisma.dateisFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.dateis.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.dateisGetPayload<{ include: Prisma.dateisInclude }>[];
}

export async function findManyTyp<TInclude extends Prisma.datei_typsInclude | undefined>(
  condition?: Omit<Prisma.datei_typsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.datei_typs.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.datei_typsGetPayload<{ include: Prisma.datei_typsInclude }>[];
}

type TDataCreate = {
  name: string;
  beschreibung?: string;
  ersteller_id: number;
  besitzer_id: number;
  datei_typ_id: number;
  created_at: Date;
  updated_at: Date;
};
export async function createOne(data: TDataCreate) {
  return await prismaDb.dateis.create({
    data: data
  });
}

type TDataUpdate = {
  id: number;
  path: string;
  url: string;
};
export async function updateOne(data: TDataUpdate) {
  return await prismaDb.dateis.update({
    where: {
      id: data.id
    },
    data: data
  });
}
