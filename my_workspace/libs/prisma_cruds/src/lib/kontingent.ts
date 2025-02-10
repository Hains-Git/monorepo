import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllKontingents<TInclude extends Prisma.kontingentsInclude>(
  include?: TInclude
): Promise<Prisma.kontingentsGetPayload<{ include: TInclude }>[] | null> {
  return (await prismaDb.kontingents.findMany({ include })) as
    | Prisma.kontingentsGetPayload<{ include: TInclude }>[]
    | null;
}

export async function getDefaultKontingents() {
  return await prismaDb.kontingents.findFirst({
    where: {
      default: true
    },
    include: {
      teams: true
    }
  });
}
