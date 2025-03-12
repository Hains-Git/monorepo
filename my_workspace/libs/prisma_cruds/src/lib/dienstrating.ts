import { prismaDb } from '@my-workspace/prisma_hains';

export async function getByMitarbeiterId(mitarbeiterId: number) {
  const ratings = await prismaDb.dienstratings.findMany({
    where: {
      mitarbeiter_id: Number(mitarbeiterId)
    }
  });
  return ratings;
}
