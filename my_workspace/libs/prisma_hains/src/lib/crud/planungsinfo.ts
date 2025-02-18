import { prismaDb } from '../prisma-hains';

import { planungsinformations } from '@prisma/client';
import { format } from 'date-fns';
import { newDate } from '@my-workspace/utils';

function convertPlanungsinfoData(data: planungsinformations[]) {
  const result: { [key: string]: any } = {};

  data.forEach((item) => {
    const tag = format(item.tag, 'yyyy-MM-dd');
    const bereich_id = item.bereich_id || 0;
    const po_dienst_id = item.po_dienst_id || 0;
    if (!result[tag]) {
      result[tag] = {};
    }
    if (!result[tag][bereich_id]) {
      result[tag][bereich_id] = {};
    }
    if (!result[tag][bereich_id][po_dienst_id]) {
      result[tag][bereich_id][po_dienst_id] = {};
    }
    result[tag][bereich_id][po_dienst_id] = item;
  });

  return result;
}

export async function getPlanungsinfo(planungsinfoId: number) {
  const planungsinfo = await prismaDb.planungsinformations.findUnique({
    where: {
      id: planungsinfoId
    }
  });
  return planungsinfo;
}

export async function getAllPlanungsinfo(anfang: string, ende: string) {
  const currentDateDayNum = newDate(ende).getDay();
  const endeDate = newDate(ende);
  const anfangDate = newDate(anfang);
  if (currentDateDayNum != 0) {
    endeDate.setDate(endeDate.getDate() + (7 - currentDateDayNum));
  }
  const planungsinfo = await prismaDb.planungsinformations.findMany({
    where: {
      tag: {
        gte: anfangDate,
        lte: endeDate
      }
    },
    orderBy: {
      tag: 'asc'
    }
  });
  const convertedData = convertPlanungsinfoData(planungsinfo);
  return convertedData;
}

type TPlanungsinformationsWithoutId = Omit<planungsinformations, 'id'>;

export async function createOrUpdatePlanungsinfo(data: TPlanungsinformationsWithoutId) {
  const { tag, po_dienst_id, bereich_id } = data;
  const planungsinfo = await prismaDb.planungsinformations.findMany({
    where: {
      tag: tag,
      bereich_id: bereich_id,
      po_dienst_id: po_dienst_id
    }
  });
  if (!planungsinfo || planungsinfo.length === 0) {
    return await prismaDb.planungsinformations.create({
      data: data
    });
  }
  if (planungsinfo.length === 1) {
    return await prismaDb.planungsinformations.update({
      where: {
        id: planungsinfo[0].id
      },
      data: data
    });
  }
  console.log('planungsinfo', planungsinfo, planungsinfo.length);
  throw new Error('There are multiple planungsinfo with the same tag, bereich_id and po_dienst_id');
}
