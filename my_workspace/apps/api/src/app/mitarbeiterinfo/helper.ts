import { processData } from '@my-workspace/utils';
import { mitarbeiters } from '@prisma/client';

import { getMitarbeitersWithoutAccountInfo, getAccountInfoForMitarbeiterInfo } from '@my-workspace/prisma_hains';

function createFakeAccountInfos(mitarbeiters: mitarbeiters[]) {
  const fakeAccountInfos: any[] = [];

  let count = -1;
  mitarbeiters.forEach((mitarbeiter) => {
    const fakeaccountInfo = {
      mitarbeiter,
      mitarbeiter_id: mitarbeiter.id,
      nameKurz: mitarbeiter.planname,
      id: count
    };
    fakeAccountInfos.push(fakeaccountInfo);
    count -= 1;
  });

  return fakeAccountInfos;
}

export async function getMitarbeiterInfos() {
  const mitarbeitersWithoutAccountInfo = await getMitarbeitersWithoutAccountInfo();
  const fakeAccountInfos = createFakeAccountInfos(mitarbeitersWithoutAccountInfo);
  const accountInfos = await getAccountInfoForMitarbeiterInfo();
  const allAccountInfos = [...accountInfos, ...fakeAccountInfos];
  const mitarbeiterInfos = processData('id', allAccountInfos);
  return mitarbeiterInfos;
}
