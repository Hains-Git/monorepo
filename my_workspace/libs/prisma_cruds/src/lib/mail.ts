import { prismaDb } from '@my-workspace/prisma_hains';
import { Prisma } from '@prisma/client';

export async function findOneContext<TInclude extends Prisma.mailer_contextsInclude | undefined>(
  condition: Omit<Prisma.mailer_contextsFindUniqueArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.mailer_contexts.findUnique({
    ...condition,
    include: include
  });
  return result as Prisma.mailer_contextsGetPayload<{ include: TInclude }> | null;
}

export async function findManyContext<TInclude extends Prisma.mailer_contextsInclude | undefined>(
  condition?: Omit<Prisma.mailer_contextsFindManyArgs, 'include'>,
  include?: TInclude
) {
  const result = await prismaDb.mailer_contexts.findMany({
    ...condition,
    include: include
  });
  return result as Prisma.mailer_contextsGetPayload<{ include: TInclude }>[];
}
