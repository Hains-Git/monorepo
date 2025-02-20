import { prismaDb } from '@my-workspace/prisma_hains';
import { po_diensts, Prisma } from '@prisma/client';

export async function getAllPoDiensts() {
  return await prismaDb.po_diensts.findMany();
}

export async function getByFreigabenTypenIds(freigabenTypenIds: number[], preset = false) {
  const dienste = preset
    ? await prismaDb.$queryRawUnsafe(`
  SELECT * FROM po_diensts
  WHERE freigabetypen_ids <@ ARRAY[${freigabenTypenIds.join(',')}]
  ORDER BY name ASC
`)
    : await prismaDb.$queryRawUnsafe(`
  SELECT * FROM po_diensts
  WHERE preset = false
  AND freigabetypen_ids <@ ARRAY[${freigabenTypenIds.join(',')}]
  ORDER BY name ASC
`);
  return dienste as po_diensts[];
}
