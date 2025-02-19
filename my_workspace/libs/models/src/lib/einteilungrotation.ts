import { einteilungRotationByTag } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';

export async function rotationAm(date = newDate(), mitarbeiterId: number) {
  const rotationen = await einteilungRotationByTag(date, mitarbeiterId);
  return rotationen;
}
