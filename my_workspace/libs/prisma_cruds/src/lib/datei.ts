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
