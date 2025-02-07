import { prismaDb } from '@my-workspace/prisma_hains';

export async function getDienstplanById(id: number) {
  return await prismaDb.dienstplans.findFirst({
    where: { id },
    include: {
      parametersets: {
        include: {
          planparameters: true
        }
      }
    }
  });
}
