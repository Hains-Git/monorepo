import { einteilungRotationByTag } from '@my-workspace/prisma_cruds';

export async function rotationAm(date = new Date()) {
  const rotationen = await einteilungRotationByTag(date);
  return rotationen;
}
