import { Prisma, PrismaClient } from '@prisma/client';

const isDev = process.env['NODE_ENV'] === 'development';
const options: Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions> = isDev
  ? { log: ['query', 'info', 'warn', 'error'] }
  : {};
export const prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'> = new PrismaClient(options);

if (isDev) {
  prismaDb.$on('query', (e: any) => {
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

export function addBigIntToJSON() {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
  };
}

export function prismaHains(): PrismaClient<Prisma.PrismaClientOptions, 'query'> {
  addBigIntToJSON();
  return prismaDb;
}
