import {
  _dienstkategorie,
  _dienstkategorie_team,
  _dienstwunsch,
  _diensteinteilung
} from '@my-workspace/prisma_cruds';
import { processData } from '@my-workspace/utils';

type TVerteilungResponse = Record<
  string,
  {
    sum: number;
    details: Record<
      number,
      Array<{
        count: number;
        id: number;
        label: string;
        team_id: number;
        team_name: string;
      }>
    >;
    tag: string;
    urlaube: number;
  }
>;

export async function verteilung(anfang: Date, ende: Date, addUrlaube = true) {
  // Helper to mimic Ruby's matrix_by_key
  const dkTeams = await _dienstkategorie_team.findMany(
    {},
    {
      teams: { select: { id: true, name: true } }
    }
  );
  const dkTeamsHash = processData('dienstkategorie_id', dkTeams, [], true);
  const wuensche = await _dienstwunsch.getGroupByTagDkIdByRange(anfang, ende);
  const dkIds = [...new Set(wuensche.map((w) => w.dienstkategorie_id).filter(Boolean) as number[])];
  const dienstkategories = await _dienstkategorie.findMany({
    where: {
      id: { in: dkIds },
      selectable: true
    },
    select: {
      id: true,
      name: true,
      order: true
    }
  });
  const dkMap = new Map(dienstkategories.map((dk) => [dk.id, dk]));

  const response: TVerteilungResponse = {};

  if (wuensche.length) {
    wuensche.forEach((wunsch) => {
      const dienstkategorieId = wunsch.dienstkategorie_id;
      if (!wunsch.tag || !dienstkategorieId) return;
      const tag = wunsch.tag.toISOString().split('T')[0];
      const dk = dkMap.get(dienstkategorieId);
      if (!dk) return;

      const toAdd = {
        count: wunsch._count._all,
        id: dienstkategorieId,
        label: dk.name || '',
        team_id: 0,
        team_name: ''
      };

      if (!response[tag]) {
        response[tag] = {
          sum: 0,
          details: {},
          tag: tag,
          urlaube: 0
        };
      }
      response[tag].sum += wunsch._count._all;

      if (dkTeamsHash[dienstkategorieId]) {
        dkTeamsHash[dienstkategorieId].forEach((dkTeam) => {
          const teamId = dkTeam.teams?.id || 0;
          toAdd.team_id = teamId || 0;
          toAdd.team_name = dkTeam.teams?.name || '';
          //
          if (!response[tag].details[teamId]) {
            response[tag].details[teamId] = [];
          }
          response[tag].details[teamId].push({ ...toAdd });
        });
      } else {
        const teamId = 0;
        if (!response[tag].details[teamId]) {
          response[tag].details[teamId] = [];
        }
        response[tag].details[teamId].push({ ...toAdd });
      }
    });
  }
  const urlaube = await _diensteinteilung.countPublicUrlaube(anfang, ende);
  console.log('--U', urlaube);

  if (addUrlaube) {
    const urlaube = await _diensteinteilung.countPublicUrlaube(anfang, ende);

    // if (urlaube.length) {
    //   urlaube.forEach((urlaub: Urlaub) => {
    //     if (!urlaub.tag) return;
    //     const tag = urlaub.tag.toISOString().split('T')[0];
    //     if (!response[tag]) {
    //       response[tag] = {
    //         sum: 0,
    //         details: {},
    //         tag: tag,
    //         urlaube: urlaub._count._all
    //       };
    //     } else {
    //       response[tag].urlaube += urlaub._count._all;
    //     }
    //   });
    // }
  }

  // return response;
}
