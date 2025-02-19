import { einteilungRotationByTag } from '@my-workspace/prisma_cruds';

export async function rotationAm(date = new Date(), mitarbeiterId: number) {
  const rotationen = await einteilungRotationByTag(date, mitarbeiterId);
  return rotationen;
}
