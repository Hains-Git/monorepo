import { _einteilung_rotation } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';

export async function rotationAm(date = newDate(), mitarbeiterId: number) {
  const rotationen = await _einteilung_rotation.einteilungRotationByTag(date, mitarbeiterId);
  return rotationen;
}
