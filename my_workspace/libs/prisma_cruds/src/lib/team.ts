import { Prisma } from '@prisma/client';
import { prismaDb } from '@my-workspace/prisma_hains';

export async function findOne<TInclude extends Prisma.teamsInclude | undefined>(
  condition: Omit<Prisma.teamsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.teams.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.teamsGetPayload<{ include: TInclude }> | null;
}

export async function findMany<TInclude extends Prisma.teamsInclude | undefined>(
  condition?: Omit<Prisma.teamsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.teams.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.teamsGetPayload<{ include: TInclude }>[];
}

export async function getAllTeams() {
  return await prismaDb.teams.findMany();
}

export async function getDefaultTeam() {
  return await prismaDb.teams.findFirst({
    where: {
      default: true
    }
  });
}
