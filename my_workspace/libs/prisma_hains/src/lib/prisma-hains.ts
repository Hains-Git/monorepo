import { newDate } from '@my-workspace/utils';
import { Prisma, PrismaClient } from '@prisma/client';

const isDev = process.env['NODE_ENV'] === 'development';

const options: Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions> = isDev
  ? { log: ['query', 'info', 'warn', 'error'] }
  : {};

export const prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'> = new PrismaClient(options);

type PrismaModels = Extract<Exclude<keyof PrismaClient, `$${string}`>, string>;

type PrismaModelsVersions =
  | 'diensteinteilungs_versions'
  | 'dienstfreigabe_versions'
  | 'team_kw_krankpuffer_versions'
  | 'user_versions'
  | 'einteilung_versions'
  | 'vertrag_versions';

type VersionsCreateManyArgsTypes = {
  [K in PrismaModelsVersions]: K extends keyof PrismaClient ? Parameters<PrismaClient[K]['createMany']>[0] : never;
};

const versionsMap: Partial<Record<PrismaModels, { table: PrismaModelsVersions; type: string }>> = {
  diensteinteilungs: { table: 'diensteinteilungs_versions', type: 'Diensteinteilung' },
  dienstfreigabes: { table: 'dienstfreigabe_versions', type: 'Dienstfreigabe' },
  team_kw_krankpuffers: { table: 'team_kw_krankpuffer_versions', type: 'TeamKwKrankpuffer' },
  users: { table: 'user_versions', type: 'User' },
  account_infos: { table: 'user_versions', type: 'AccountInfo' },
  einteilung_rotations: { table: 'einteilung_versions', type: 'EinteilungRotation' },
  vertrags: { table: 'vertrag_versions', type: 'Vertrag' },
  vertrags_arbeitszeits: { table: 'vertrag_versions', type: 'VertragArbeitszeit' },
  vertrags_phases: { table: 'vertrag_versions', type: 'VertragPhase' },
  vertragsstuves: { table: 'vertrag_versions', type: 'VertragStufe' },
  vertrags_variantes: { table: 'vertrag_versions', type: 'VertragVariante' },
  vertragstyps: { table: 'vertrag_versions', type: 'VertragTyp' },
  vertragsgruppes: { table: 'vertrag_versions', type: 'VertragGruppe' }
};

async function createVersionsByModelKey<K extends PrismaModelsVersions>(key: K, args: VersionsCreateManyArgsTypes[K]) {
  const data = await (prismaDb[key] as any).createMany(args);
  return data;
}

async function createVersions<K extends PrismaModelsVersions>(
  key: K,
  items: { id: number; object: string }[],
  event: string,
  userId = 0
) {
  if (!versionsMap[key]) return;
  const type = versionsMap[key].type;
  const extras =
    versionsMap[key].table === 'einteilung_versions'
      ? {
          object_changes: '',
          api_version: '',
          api_userinfo: '',
          userinfo: '',
          api_info: ''
        }
      : {};
  await createVersionsByModelKey(key, {
    data: items.map(({ id, object }) => ({
      ...extras,
      item_id: id,
      item_type: type,
      event,
      created_at: newDate(),
      whodunnit: `${userId}`,
      object: object
    }))
  });
}

export const prismaDbExtended = new PrismaClient(options).$extends({
  name: 'versioning',
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!versionsMap[model]) return query(args);
        const now = newDate();
        if (
          'data' in args &&
          args.data &&
          typeof args.data === 'object' &&
          'updated_at' in args.data &&
          args.data.updated_at
        ) {
          args.data.updated_at = now;
        }
        if (operation === 'create' || operation === 'createMany' || operation === 'createManyAndReturn') {
          return async () => {
            const results = await query(args);
            const ids = await (prismaDb[model] as any).findMany({
              select: { id: true },
              where: { updated_at: { gte: now } }
            });
            console.log('Create Versions for', model, operation, args, ids);
            await createVersions(
              model as PrismaModelsVersions,
              ids.map((obj: any) => ({ id: Number(obj.id) || 0, object: JSON.stringify(obj) })),
              operation,
              0
            );
            return results;
          };
        } else if (
          operation === 'update' ||
          operation === 'updateMany' ||
          operation === 'updateManyAndReturn' ||
          operation === 'delete' ||
          operation === 'deleteMany'
        ) {
          return async () => {
            const values = await (prismaDb[model] as any).findMany({
              where: args.where
            });
            console.log('Create Versions for', model, operation, args, values);
            await createVersions(
              model as PrismaModelsVersions,
              values.map((obj: any) => ({ id: Number(obj.id) || 0, object: JSON.stringify(obj) })),
              operation,
              0
            );
            return query(args);
          };
        } else if (operation === 'upsert') {
          return async () => {
            let values = await (prismaDb[model] as any).findMany({
              where: args.where
            });
            const results = await query(args);
            values = values.concat(
              await (prismaDb[model] as any).findMany({
                select: { id: true },
                where: { updated_at: { gte: now }, id: { notIn: values.map((r: any) => r.id) } }
              })
            );
            console.log('Create Versions for', model, operation, args, values);
            await createVersions(
              model as PrismaModelsVersions,
              values.map((obj: any) => ({ id: Number(obj.id) || 0, object: JSON.stringify(obj) })),
              operation,
              0
            );
            return results;
          };
        }
        return query(args);
      }
    }
  }
});

if (isDev) {
  prismaDb.$on('query', (e: any) => {
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

// export function addBigIntToJSON() {
//   (BigInt.prototype as any).toJSON = function () {
//     return Number(this.toString());
//   };
// }

// export function prismaHains(): PrismaClient<Prisma.PrismaClientOptions, 'query'> {
//   addBigIntToJSON();
//   return prismaDb;
// }
