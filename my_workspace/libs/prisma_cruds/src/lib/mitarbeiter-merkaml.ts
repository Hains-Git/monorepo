import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAll<TInclude extends Prisma.mitarbeitermerkmalsInclude>(include?: TInclude) {
  const merkmals = ((await prismaDb.mitarbeitermerkmals.findMany({
    include
  })) || []) as Prisma.mitarbeitermerkmalsGetPayload<{ include: TInclude }>[];
  return merkmals;
}
export async function getByMitarbeiterId<TInclude extends Prisma.mitarbeitermerkmalsInclude>(
  mitarbeiterId: number,
  include?: TInclude
) {
  const merkmals = ((await prismaDb.mitarbeitermerkmals.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    },
    include
  })) || []) as Prisma.mitarbeitermerkmalsGetPayload<{ include: TInclude }>[];
  return merkmals;
}
