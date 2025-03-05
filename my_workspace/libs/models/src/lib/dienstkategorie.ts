import { _dienstkategorie, _thema, _team } from '@my-workspace/prisma_cruds';

async function findThemDetailsByIds(themaIds: number[]) {
  const themas = await _thema.findMany({
    where: {
      id: {
        in: themaIds
      }
    }
  });
  console.log(themaIds, themas);
  return themas;
}

async function findTeamDetailsByIds(teamIds: number[]) {
  return await _team.findMany({
    where: {
      id: {
        in: teamIds
      }
    }
  });
}

export async function getDienstKategorieForMitarbeiterInfo() {
  let dienstkategories = await _dienstkategorie.findMany(
    {},
    {
      dienstkategoriethemas: true,
      dienstkategorie_teams: true
    }
  );
  dienstkategories = await Promise.all(
    dienstkategories.map(async (dk) => {
      const dkThemaIds = dk.dienstkategoriethemas
        .map((dkThema) => dkThema.thema_id)
        .filter(Boolean) as number[];
      const dkTemIds = dk.dienstkategorie_teams
        .map((dkTeam) => dkTeam.team_id)
        .filter(Boolean) as number[];

      const [themaDetails, teamDetails] = await Promise.all([
        findThemDetailsByIds(dkThemaIds),
        findTeamDetailsByIds(dkTemIds)
      ]);

      return {
        ...dk,
        themaDetails,
        teamDetails
      };
    })
  );
  return dienstkategories;
}
