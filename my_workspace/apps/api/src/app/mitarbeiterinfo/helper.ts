import { newDate, processData } from '@my-workspace/utils';
import { formatDate, isValid, startOfToday } from 'date-fns';
import { mitarbeiters } from '@prisma/client';

import { _account_info, _mitarbeiter } from '@my-workspace/prisma_cruds';
import { vkAndVgruppeAm } from '@my-workspace/models';

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

function getWeiterbildungsjahr(aSeit: Date, anrechenbareZeit: number) {
  const today = newDate();
  const year = today.getFullYear();
  const month = today.getMonth();

  if (!aSeit) {
    return '';
  }
  const aSeitYear = aSeit.getFullYear();
  const aSeitMonth = aSeit.getMonth();

  let anrechenbareZeitInMonate = anrechenbareZeit;
  if (!anrechenbareZeit) {
    anrechenbareZeitInMonate = 0;
  }
  const diffInMonths = year * 12 + month - (aSeitYear * 12 + aSeitMonth) + anrechenbareZeitInMonate;
  let yearDisplay = '';
  let monthDisplay = '';

  if (diffInMonths >= 0) {
    yearDisplay = String(Math.floor(diffInMonths / 12));
    monthDisplay = String(diffInMonths % 12);
  } else {
    yearDisplay = '0';
    monthDisplay = String(diffInMonths);
  }

  return `${yearDisplay}.Jahr : ${monthDisplay} Monat`;
}

function addWeiterbildungsjahr(accountInfo) {
  const aSeit = accountInfo.mitarbeiter.a_seit;
  const anrechenbareZeit = accountInfo.mitarbeiter.anrechenbare_zeit;
  const weiterbildungsjahr = getWeiterbildungsjahr(aSeit, anrechenbareZeit);
  accountInfo.mitarbeiter.weiterbildungsjahr = weiterbildungsjahr;
  return accountInfo;
}

function addVk(accountInfo) {
  const vertrags = accountInfo.mitarbeiter.vertrags;
  // if (accountInfo.id == 4) {
  // console.log(JSON.stringify(vertrags, null, 2));
  const vkAndVgruppe = vkAndVgruppeAm(startOfToday(), vertrags);
  // }
  accountInfo.mitarbeiter.vk_and_vgruppe_am = vkAndVgruppe;
  return accountInfo;
}

function vertragsVarianteVonBis(vertragsStuve) {
  const result = [];
  if (vertragsStuve.vertrags_variantes.von && isValid(vertragsStuve.vertrags_variantes.von)) {
    result.push(formatDate(vertragsStuve.vertrags_variantes.von, 'dd.MM.yyyy'));
  }

  if (vertragsStuve.vertrags_variantes.bis && isValid(vertragsStuve.vertrags_variantes.bis)) {
    result.push(formatDate(vertragsStuve.vertrags_variantes.bis, 'dd.MM.yyyy'));
  }

  const formattedResult = result.join(' - ');
  return formattedResult;
}

export async function getMitarbeiterInfos() {
  const mitarbeitersWithoutAccountInfo = await _mitarbeiter.getMitarbeitersWithoutAccountInfo();
  const fakeAccountInfos = createFakeAccountInfos(mitarbeitersWithoutAccountInfo);
  const accountInfos = await _account_info.getAccountInfoForMitarbeiterInfo();
  const allAccountInfos = [...accountInfos, ...fakeAccountInfos];
  const mitarbeiterInfos = processData('id', allAccountInfos, [addWeiterbildungsjahr, addVk]);
  return mitarbeiterInfos;
}

export function proceesDataForVertragsTyps(vertragTyps) {
  const result = [];
  vertragTyps.forEach((vertragTyp) => {
    const vertragsStuves = vertragTyp?.vertragsgruppes.reduce((acc, vertragsgruppe) => {
      const vertragsstuves = vertragsgruppe.vertragsstuves.reduce((acc, vertragsstufe) => {
        const vonBis = vertragsVarianteVonBis(vertragsstufe);
        vertragsstufe['von_bis'] = vonBis;
        vertragsstufe['vertragsgruppe'] = vertragsstufe?.vertragsgruppes;
        acc.push(vertragsstufe);
        return acc;
      }, []);
      acc.push(...vertragsstuves);
      return acc;
    }, []);

    const vertragsTypeObj = {
      id: vertragTyp.id,
      name: vertragTyp.name,
      vertragsstuves: vertragsStuves
    };

    result.push(vertragsTypeObj);
  });
  return result;
}
