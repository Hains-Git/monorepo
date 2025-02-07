import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllTeams() {
  return await prismaDb.teams.findMany();
}
