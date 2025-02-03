import { prismaDb } from '../prisma-hains';

export async function getAllPoDiensts() {
  return await prismaDb.po_diensts.findMany();
}
