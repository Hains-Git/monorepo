import { prismaDb } from '../prisma-hains';

export async function getAllTeams() {
  return await prismaDb.teams.findMany();
}
