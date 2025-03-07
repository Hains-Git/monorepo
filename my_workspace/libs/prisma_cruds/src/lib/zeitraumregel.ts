import { prismaDb } from '@my-workspace/prisma_hains';

export async function getAllZeitraumregeln() {
  return await prismaDb.zeitraumregels.findMany();
}
