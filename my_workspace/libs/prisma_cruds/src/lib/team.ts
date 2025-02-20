import { prismaDb } from '@my-workspace/prisma_hains';
import { colorRegEx } from '@my-workspace/utils';

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

// def add_funktionen
//   funktionen = params.has_key?(:funktionen_ids) ? JSON.parse(params[:funktionen_ids]).uniq.select { |el| !el.blank?} : []
//   TeamFunktion.where(team_id: @team.id).delete_all
//   funktionen.each { |id|
//     TeamFunktion.find_or_create_by(team_id: @team.id, funktion_id: id.to_i)
//   }
// end

// def add_team_kw_krankpuffers
//   team_kw_krankpuffers = params.has_key?(:team_kw_krankpuffers) ?  JSON.parse(params[:team_kw_krankpuffers]) : []
//   team_id = @team.id
//   kws = []
//   team_kw_krankpuffers.each do |obj|
//     kw = obj["kw"].to_i
//     puffer = obj["puffer"].to_i
//     if kw > 0 && kw < 54 && puffer >= 0
//       kws << kw
//       team_kw_krankpuffer = TeamKwKrankpuffer.find_or_create_by(team_id: team_id, kw: kw)
//       team_kw_krankpuffer.update(puffer: puffer)
//     end
//   end
//   TeamKwKrankpuffer.where(team_id: team_id).where.not(kw: kws).delete_all
// end

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

async function checkTeamInput(input: TeamInputType, id: number, kostenstelle_id: number) {
  const msg = [];
  const nameVergeben = await prismaDb.teams.findFirst({ where: { name: input.name, id: { notIn: [id] } } });
  const kostenStelle = await prismaDb.kostenstelles.findFirst({ where: { id: kostenstelle_id } });
  if (!input.name) msg.push('Name muss ausgefüllt sein.');
  else if (input.name.length > 50) msg.push('Name darf maximal 50 Zeichen lang sein.');
  else if (nameVergeben) msg.push('Name bereits vergeben.');
  else if (input.name.toLowerCase() === 'kein team') msg.push('Name nicht zulässig.');
  else if (input.name.includes('_')) msg.push('Name darf kein "_" enthalten.');
  if (!input.color) msg.push('Farbe nicht zulässig.');
  if (id < 0) msg.push('ID ist nicht zulässig.');
  if (input.krank_puffer < 0) msg.push('Krankpuffer muss größer oder gleich 0 sein.');
  if (!kostenStelle) msg.push('Kostenstelle nicht gefunden.');
  return msg.join('\n');
}

export async function addTeamKrankpuffer() {
  console.log('addTeamKrankpuffer');
}

export async function addTeamFunktionen() {
  console.log('addTeamFunktionen');
}

export async function createOrUpdateTeam(args: TeamInputType & { id: number; kostenstelle_id: number }) {
  const input = {
    name: args.name.trim(),
    default: args.default,
    verteiler_default: args.verteiler_default,
    color: colorRegEx.test(args.color) ? args.color.toLowerCase() : '',
    krank_puffer: args.krank_puffer,
    updated_at: new Date(),
    kostenstelle: {
      connect: {
        id: args.kostenstelle_id
      }
    }
  };

  const msg = checkTeamInput(input, args.id, args.kostenstelle_id);
  if (msg) return msg;

  const record =
    args.id <= 1
      ? await prismaDb.teams.create({
          data: {
            ...input,
            created_at: new Date()
          },
          include: teamsBaseIncludes
        })
      : await prismaDb.teams.update({
          data: {
            ...input
          },
          where: {
            id: args.id
          },
          include: teamsBaseIncludes
        });
  return record;
}
