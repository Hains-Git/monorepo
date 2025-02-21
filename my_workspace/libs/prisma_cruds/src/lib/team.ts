import { prismaDb } from '@my-workspace/prisma_hains';
import { colorRegEx, newDate } from '@my-workspace/utils';

export const teamsBaseIncludes = {
  kostenstelle: true,
  team_kw_krankpuffers: true,
  team_kopf_soll: true,
  team_vk_soll: true,
  team_funktions: {
    include: {
      funktion: true
    }
  }
};

export async function getAllTeams() {
  return await prismaDb.teams.findMany();
}

export async function getDefaultTeam() {
  return await prismaDb.teams.findFirst({
    where: {
      default: true
    }
  });
}

export async function getAllTeamsWithMainIncludes() {
  return await prismaDb.teams.findMany({
    include: teamsBaseIncludes
  });
}

export async function destroyOneTeam(id: number) {
  const team = await prismaDb.teams.findFirst({
    where: {
      id
    },
    include: {
      po_diensts: true,
      kontingents: true,
      vorlages: true,
      funktions: true,
      dienstkategorie_teams: true
    }
  });

  if (!team) return 'Team not found';
  if (team.default) return 'Cannot delete default team';

  const referenceKeys: (keyof typeof team)[] = [
    'po_diensts',
    'kontingents',
    'vorlages',
    'funktions',
    'dienstkategorie_teams'
  ];

  const checkedReferences = referenceKeys
    .reduce(
      (acc: string[], key) => {
        if (key in team) {
          if (Array.isArray(team[key]) && team[key].length > 0) {
            acc.push(`Team wird referenziert in ${key}.`);
          }
        }
        return acc;
      },
      team.default ? ['Default-Team kann nicht gelöscht werden.'] : []
    )
    .join('\n');

  if (checkedReferences) return checkedReferences;

  const refWhere = {
    where: {
      team_id: id
    }
  };

  await prismaDb.$transaction([
    prismaDb.team_funktions.deleteMany(refWhere),
    prismaDb.team_vk_soll.deleteMany(refWhere),
    prismaDb.team_kopf_soll.deleteMany(refWhere),
    prismaDb.team_kw_krankpuffers.deleteMany(refWhere),
    prismaDb.dienstplaners_teams.deleteMany(refWhere),
    prismaDb.teams.delete({
      where: {
        id
      }
    })
  ]);

  return '';
}

export type TeamInputType = {
  name: string;
  default: boolean;
  verteiler_default: boolean;
  krank_puffer: number;
  color: string;
};

export async function checkTeamInput(input: TeamInputType, id: number, kostenstelle_id: number) {
  console.log('CheckInput', input, id, kostenstelle_id);
  const msg = [];
  const nameVergeben = await prismaDb.teams.findFirst({ where: { name: input.name, id: { notIn: [id] } } });
  const kostenStelle = await prismaDb.kostenstelles.findFirst({ where: { id: kostenstelle_id } });
  if (id < 0) msg.push('ID ist nicht zulässig.');
  if (!input.name) msg.push('Name muss ausgefüllt sein.');
  else {
    if (nameVergeben) msg.push('Name bereits vergeben.');
    else if (input.name.toLowerCase() === 'kein team') msg.push('Name nicht zulässig.');
    else {
      if (input.name.length > 50) msg.push('Name darf maximal 50 Zeichen lang sein.');
      if (input.name.includes('_')) msg.push('Name darf kein "_" enthalten.');
    }
  }
  if (!colorRegEx.test(input.color)) msg.push('Farbe nicht zulässig, nur HEX-Farben erlaubt.');
  if (input.krank_puffer < 0) msg.push('Krankpuffer muss größer oder gleich 0 sein.');
  if (!kostenStelle) msg.push('Kostenstelle nicht gefunden.');
  return msg.join('\n');
}

export type TeamKWKrankPufferInput = { kw: number; puffer: number };

export async function addTeamKrankpuffer(kwpuffer: TeamKWKrankPufferInput[], id: number) {
  await prismaDb.team_kw_krankpuffers.deleteMany({
    where: {
      team_id: id
    }
  });

  if (!kwpuffer.length) return;

  await prismaDb.team_kw_krankpuffers.createMany({
    data: kwpuffer.map((kp) => ({
      ...kp,
      team_id: id,
      created_at: newDate(),
      updated_at: newDate()
    }))
  });
}

export async function addTeamFunktionen(funktionenIds: number[], id: number) {
  await prismaDb.team_funktions.deleteMany({
    where: {
      team_id: id
    }
  });

  if (!funktionenIds.length) return;

  await prismaDb.team_funktions.createMany({
    data: funktionenIds.map((funktion_id) => ({
      team_id: id,
      funktion_id,
      updated_at: newDate(),
      created_at: newDate()
    }))
  });
}

export type TeamVKSollInput = { soll: number; von: Date; bis: Date };

export async function addTeamVKSoll(vkSoll: TeamVKSollInput[], id: number) {
  await prismaDb.team_vk_soll.deleteMany({
    where: {
      team_id: id
    }
  });

  if (!vkSoll.length) return;

  await prismaDb.team_vk_soll.createMany({
    data: vkSoll.map((soll) => ({
      ...soll,
      team_id: id,
      created_at: newDate(),
      updated_at: newDate()
    }))
  });
}

export type TeamKopfSollInput = { soll: number; von: Date; bis: Date };

export async function addTeamKopfSoll(kopfSoll: TeamKopfSollInput[], id: number) {
  await prismaDb.team_kopf_soll.deleteMany({
    where: {
      team_id: id
    }
  });

  if (!kopfSoll.length) return;

  await prismaDb.team_kopf_soll.createMany({
    data: kopfSoll.map((soll) => ({
      ...soll,
      team_id: id,
      created_at: newDate(),
      updated_at: newDate()
    }))
  });
}

export async function uncheckOldDefaultTeam(id: number) {
  await prismaDb.teams.updateMany({
    where: {
      default: true,
      id: { not: id }
    },
    data: {
      default: false,
      updated_at: newDate()
    }
  });
}

export async function createOrUpdateTeam(
  args: TeamInputType & {
    id: number;
    kostenstelle_id: number;
    team_kw_krankpuffers: TeamKWKrankPufferInput[];
    team_vk_soll: TeamVKSollInput[];
    team_kopf_soll: TeamKopfSollInput[];
    funktionen_ids: number[];
  }
) {
  const input = {
    name: args.name.trim(),
    default: args.default,
    verteiler_default: args.verteiler_default,
    color: args.color.toLowerCase(),
    krank_puffer: args.krank_puffer,
    updated_at: newDate(),
    kostenstelle: {
      connect: {
        id: args.kostenstelle_id
      }
    }
  };

  const msg = await checkTeamInput(input, args.id, args.kostenstelle_id);
  if (msg) return msg;

  const record =
    args.id <= 1
      ? await prismaDb.teams.create({
          data: {
            ...input,
            created_at: newDate()
          }
        })
      : await prismaDb.teams.update({
          data: {
            ...input
          },
          where: {
            id: args.id
          }
        });

  if (!record?.id) return 'Team konnte nicht erstellt oder aktualisiert werden.';

  if (record.default) {
    await uncheckOldDefaultTeam(record.id);
  }
  await addTeamKrankpuffer(args.team_kw_krankpuffers, record.id);
  await addTeamFunktionen(args.funktionen_ids, record.id);
  await addTeamVKSoll(args.team_vk_soll, record.id);
  await addTeamKopfSoll(args.team_kopf_soll, record.id);

  return await prismaDb.teams.findFirst({
    where: {
      id: record.id
    },
    include: teamsBaseIncludes
  });
}
