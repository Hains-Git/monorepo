import { PrismaClient, Prisma } from '@prisma/client';
import { prismaHains } from '../prisma-hains';

const prisma = prismaHains();

export async function getUserById(id: number, include: Prisma.usersInclude = {}) {
  return await prisma.users.findUnique({
    where: {
      id: id
    },
    include
  });
}
