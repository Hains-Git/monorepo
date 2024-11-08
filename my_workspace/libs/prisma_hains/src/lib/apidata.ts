import { Prisma, PrismaClient } from '@prisma/client';
import { prismaHains } from './prisma-hains';

let prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'>;

function getDataByHash(data: any, key = 'id') {
  return data.reduce((hash, value) => {
    hash[value[key]] = value;
    return hash;
  }, {});
}

// Define a type that represents all the models in your Prisma schema
type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;

async function getApiDataByKey(key: PrismaModels) {
  const data = await (prismaDb[key] as any).findMany();
  return getDataByHash(data);
}

async function fetchAllApiData(apiDataKeys: PrismaModels[]) {
  const result: Partial<Record<PrismaModels, any>> = {};

  for (const apiKey of apiDataKeys) {
    result[apiKey] = await getApiDataByKey(apiKey);
  }

  return result;
}

async function getAllApiData() {
  prismaDb = prismaHains();
  const apiDataKeys: PrismaModels[] = [
    'arbeitsplatzs',
    'bereiches',
    'standorts',
    'dienstgruppes',
    'dienstverteilungstyps',
    'kostenstelles',
    'funktions',
    'themas',
    'teams',
    'freigabetyps',
    'freigabestatuses',
    'einteilungsstatuses',
    'einteilungskontexts',
    'vertrags_phases',
    'arbeitszeit_absprachens',
    'arbeitszeittyps',
    'arbeitszeitverteilungs',
    'po_diensts',
    'dienstkategories',
    'freigabetyps',
    'kontingents',
    'mitarbeiters',
    'zeitraumkategories',
  ];
  const result = await fetchAllApiData(apiDataKeys);
  return result;
}

export { getAllApiData };
