import { prismaDb } from '@my-workspace/prisma_hains';
import * as Team from './team';
import { teams } from '@prisma/client';

const createTeam = async (teamName = 'NameAlreadyExists', defaultTeam = true) =>
  await prismaDb.teams.create({
    data: {
      name: teamName,
      default: defaultTeam,
      verteiler_default: false,
      color: '#fff',
      krank_puffer: 0,
      created_at: new Date(),
      updated_at: new Date(),
      kostenstelle: {
        connect: {
          id: 1
        }
      }
    }
  });

describe('checkTeamInput', () => {
  beforeAll(async () => {
    await prismaDb.teams.deleteMany({
      where: {
        name: 'NameDoesNotAlreadyExists'
      }
    });
    await createTeam();
  });

  afterAll(async () => {
    await prismaDb.teams.deleteMany({
      where: {
        OR: [{ name: 'NameDoesNotAlreadyExists' }, { name: 'NameAlreadyExists' }]
      }
    });
  });

  test('only wrong input', async () => {
    const result = [
      'ID ist nicht zulässig.',
      'Name nicht zulässig.',
      'Farbe nicht zulässig, nur HEX-Farben erlaubt.',
      'Krankpuffer muss größer oder gleich 0 sein.',
      'Kostenstelle nicht gefunden.',
      'Ungültige Funktionen gefunden.',
      'Ungültige Krankpuffer (KW < 1 oder > 53 oder puffer < 0) gefunden.',
      'Ungültige VK-Soll Werte (soll < 0, von/bis kein gültiges Datum) gefunden.',
      'Ungültige Kopf-Soll Werte (soll < 0, von/bis kein gültiges Datum) gefunden.'
    ].join('\n');

    expect(
      await Team.checkTeamInput({
        name: 'Kein Team',
        default: false,
        verteiler_default: false,
        color: 'red',
        krank_puffer: -1,
        id: -1,
        kostenstelle_id: -1,
        team_kw_krankpuffers: [{ kw: 55, puffer: -1 }],
        team_vk_soll: [{ soll: -1, von: new Date(), bis: new Date() }],
        team_kopf_soll: [{ soll: -1, von: new Date(), bis: new Date() }],
        funktionen_ids: [-10, 0]
      })
    ).toEqual(result);
  });

  test('name.length > 50', async () => {
    const result = ['Name darf maximal 50 Zeichen lang sein.'].join('\n');
    expect(
      await Team.checkTeamInput({
        name: 'a'.repeat(51),
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
  });

  test('name.includes("_")', async () => {
    const result = ['Name darf kein "_" enthalten.'].join('\n');
    expect(
      await Team.checkTeamInput({
        name: 'test_test',
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
  });

  test('name = ""', async () => {
    const result = ['Name muss ausgefüllt sein.'].join('\n');
    expect(
      await Team.checkTeamInput({
        name: '',
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
  });

  test('name already exists', async () => {
    const result = ['Name bereits vergeben.'].join('\n');
    expect(
      await Team.checkTeamInput({
        name: 'NameAlreadyExists',
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
  });

  test('name.toLowerCase() != kein team', async () => {
    const result = ['Name nicht zulässig.'].join('\n');
    expect(
      await Team.checkTeamInput({
        name: 'KEIN TEAM',
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
    expect(
      await Team.checkTeamInput({
        name: 'KeiN TeaM',
        default: false,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual(result);
  });

  test('all checks pass', async () => {
    expect(
      await Team.checkTeamInput({
        name: 'NameDoesNotAlreadyExists',
        default: false,
        verteiler_default: false,
        color: '#fffddd',
        krank_puffer: 0,
        id: 0,
        kostenstelle_id: 1,
        team_kw_krankpuffers: [],
        team_vk_soll: [],
        team_kopf_soll: [],
        funktionen_ids: []
      })
    ).toEqual('');
  });
});

describe('Get Teams', () => {
  beforeAll(async () => {
    const record = await createTeam();
    const base = {
      team_id: record.id,
      created_at: new Date(),
      updated_at: new Date()
    };
    const soll = {
      von: new Date('2021-01-01'),
      bis: new Date('2021-12-31'),
      soll: 100
    };
    await prismaDb.team_kw_krankpuffers.create({
      data: {
        ...base,
        kw: 1,
        puffer: 10
      }
    });
    await prismaDb.team_vk_soll.create({
      data: {
        ...base,
        ...soll
      }
    });
    await prismaDb.team_kopf_soll.create({
      data: {
        ...base,
        ...soll
      }
    });
    await prismaDb.team_funktions.create({
      data: {
        ...base,
        funktion_id: 1
      }
    });
  });

  afterAll(async () => {
    const recordId = (await prismaDb.teams.findFirst({ where: { name: 'NameAlreadyExists' } }))?.id;
    if (recordId) {
      await prismaDb.team_kw_krankpuffers.deleteMany({ where: { team_id: recordId } });
      await prismaDb.team_vk_soll.deleteMany({ where: { team_id: recordId } });
      await prismaDb.team_kopf_soll.deleteMany({ where: { team_id: recordId } });
      await prismaDb.team_funktions.deleteMany({ where: { team_id: recordId } });
      await prismaDb.teams.deleteMany({
        where: {
          name: 'NameAlreadyExists'
        }
      });
    } else {
      console.error('recordId not found');
    }
  });

  test('getAllTeams', async () => {
    const teams = await Team.getAllTeams();
    expect(teams.length).toBeGreaterThan(0);
  });

  test('getDefaultTeam', async () => {
    const team = await Team.getDefaultTeam();
    expect(team).not.toBeNull();
  });

  test('getAllTeamsWithMainIncludes', async () => {
    const teams = await Team.getAllTeamsWithMainIncludes();
    expect(teams.length).toBeGreaterThan(0);
    const nameAlreadyExistsTeam = teams.find((team) => team.name === 'NameAlreadyExists');
    expect(nameAlreadyExistsTeam).not.toBeNull();
    expect(nameAlreadyExistsTeam?.team_vk_soll?.length || 0).toBeGreaterThan(0);
    expect(nameAlreadyExistsTeam?.team_kopf_soll?.length || 0).toBeGreaterThan(0);
    expect(nameAlreadyExistsTeam?.team_funktions?.length || 0).toBeGreaterThan(0);
    expect(nameAlreadyExistsTeam?.team_kw_krankpuffers?.length || 0).toBeGreaterThan(0);
    expect(nameAlreadyExistsTeam?.kostenstelle).not.toBeNull();
    expect(nameAlreadyExistsTeam?.team_funktions?.[0]?.funktion).not.toBeNull();
  });
});

describe('Destroy Teams', () => {
  describe('destroyOneTeam', () => {
    let defaultTeamId = -1;
    let notDefaultTeamId = -1;

    const oldValues: {
      po_dienst_team: number;
      kontingent_team: number;
      vorlage_team: number;
      funktion_team: number;
      dienstkategorie_team: number;
    } = {
      po_dienst_team: 0,
      kontingent_team: 0,
      vorlage_team: 0,
      funktion_team: 0,
      dienstkategorie_team: 0
    };

    beforeAll(async () => {
      defaultTeamId = (await createTeam()).id;
      notDefaultTeamId = (await createTeam('NotDefaultTeam', false)).id;
      const update = (id: number) => ({
        where: {
          id: id
        },
        data: {
          team_id: notDefaultTeamId
        }
      });
      const dienste = await prismaDb.po_diensts.findFirst();
      if (dienste) {
        oldValues.po_dienst_team = dienste.team_id || 0;
        await prismaDb.po_diensts.update(update(dienste.id));
      }
      const kontingent = await prismaDb.kontingents.findFirst();
      if (kontingent) {
        oldValues.kontingent_team = kontingent.team_id || 0;
        await prismaDb.kontingents.update(update(kontingent.id));
      }
      const vorlage = await prismaDb.vorlages.findFirst();
      if (vorlage) {
        oldValues.vorlage_team = vorlage.team_id || 0;
        await prismaDb.vorlages.update(update(vorlage.id));
      }
      const funktion = await prismaDb.funktions.findFirst();
      if (funktion) {
        oldValues.funktion_team = funktion.team_id || 0;
        await prismaDb.funktions.update(update(funktion.id));
      }
      const dienstkategorie = await prismaDb.dienstkategorie_teams.findFirst();
      if (dienstkategorie) {
        oldValues.dienstkategorie_team = dienstkategorie.team_id || 0;
        await prismaDb.dienstkategorie_teams.update(update(dienstkategorie.id));
      }
    });

    const removeReferences = async () => {
      const update = {
        where: {
          team_id: notDefaultTeamId
        },
        data: {
          team_id: oldValues.po_dienst_team
        }
      };
      await prismaDb.po_diensts.updateMany(update);
      await prismaDb.kontingents.updateMany(update);
      await prismaDb.vorlages.updateMany(update);
      await prismaDb.funktions.updateMany(update);
      await prismaDb.dienstkategorie_teams.updateMany(update);
    };

    afterAll(async () => {
      await removeReferences();
      await prismaDb.teams.deleteMany({
        where: {
          OR: [
            {
              name: 'NameAlreadyExists'
            },
            {
              name: 'NotDefaultTeam'
            }
          ]
        }
      });
    });

    test('team not found', async () => {
      const result = 'Team not found';
      expect(await Team.destroyOneTeam(-1)).toEqual(result);
    });

    test('cannot delete default team', async () => {
      const result = 'Cannot delete default team';
      expect(await Team.destroyOneTeam(defaultTeamId)).toEqual(result);
    });

    test('team is referenced in all tables', async () => {
      const result = ['po_diensts', 'kontingents', 'vorlages', 'funktions', 'dienstkategorie_teams']
        .map((key) => `Team wird referenziert in ${key}.`)
        .join('\n');
      expect(await Team.destroyOneTeam(notDefaultTeamId)).toEqual(result);
    });

    test('destroy not default team', async () => {
      await removeReferences();
      expect(await Team.destroyOneTeam(notDefaultTeamId)).toEqual('');
      expect(await prismaDb.teams.findFirst({ where: { id: notDefaultTeamId } })).toBeNull();
    });
  });
});

describe('create or update team', () => {
  let oldDefaultId = 0;
  beforeAll(async () => {
    oldDefaultId = (await prismaDb.teams.findFirst({ where: { default: true } }))?.id || 0;
    await createTeam();
  });

  afterAll(async () => {
    if (oldDefaultId > 0) {
      await prismaDb.teams.update({
        where: {
          id: oldDefaultId
        },
        data: {
          default: true
        }
      });
    }

    await prismaDb.teams.deleteMany({
      where: {
        OR: [{ name: 'CreateNewTeam' }, { name: 'NameAlreadyExists' }]
      }
    });
  });

  test('create team', async () => {
    const input = {
      id: 0,
      name: 'CreateNewTeam',
      default: true,
      verteiler_default: false,
      color: '#aaa',
      krank_puffer: 5,
      kostenstelle_id: 1,
      team_kopf_soll: [],
      team_vk_soll: [],
      funktionen_ids: [],
      team_kw_krankpuffers: []
    };
    const resultWrongInput = await Team.createOrUpdateTeam({ ...input, id: -1 });
    expect(typeof resultWrongInput).toBe('string');

    const result = await Team.createOrUpdateTeam(input);

    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');

    if (!Array.isArray(result)) return;
    const team = result.find((t) => t.name === 'CreateNewTeam');
    expect(team?.name).toBe('CreateNewTeam');
    expect(team?.id).toBeGreaterThan(0);
    expect(team?.default).toBe(true);
    expect(team?.krank_puffer).toBe(5);
    expect(team?.color).toBe('#aaa');
    const allDefaultTeams = await prismaDb.teams.findMany({ where: { default: true } });
    expect(allDefaultTeams.length).toBe(1);
    expect(allDefaultTeams[0].id).toBe(team?.id);
  });

  test('update team', async () => {
    const nameAlreadyExistsTeamId = (await prismaDb.teams.findFirst({ where: { name: 'NameAlreadyExists' } }))?.id || 0;
    expect(nameAlreadyExistsTeamId).toBeGreaterThan(0);
    if (nameAlreadyExistsTeamId <= 0) return;

    const result = await Team.createOrUpdateTeam({
      id: nameAlreadyExistsTeamId,
      name: 'NameAlreadyExists',
      default: false,
      verteiler_default: true,
      color: '#ababab',
      krank_puffer: 66,
      kostenstelle_id: 1,
      team_kopf_soll: [],
      team_vk_soll: [],
      funktionen_ids: [],
      team_kw_krankpuffers: []
    });

    expect(result).not.toBeNull();
    expect(typeof result).toBe('object');

    if (!Array.isArray(result)) return;
    const team = result.find((t) => t.id === nameAlreadyExistsTeamId);
    expect(team?.name).toBe('NameAlreadyExists');
    expect(team?.default).toBe(false);
    expect(team?.krank_puffer).toBe(66);
    expect(team?.color).toBe('#ababab');
    expect(team?.verteiler_default).toBe(true);
  });
});

describe('uncheckOldDefaultTeams', () => {
  let oldDefaultId = 0;
  let teamOne: teams | null = null;
  let teamTwo: teams | null = null;
  beforeAll(async () => {
    oldDefaultId = (await prismaDb.teams.findFirst({ where: { default: true } }))?.id || 0;
    teamOne = await createTeam('CreateNewDefaultTeam', true);
    teamTwo = await createTeam('CreateNewNonDefaultTeam', false);
  });

  afterAll(async () => {
    if (oldDefaultId > 0) {
      await prismaDb.teams.update({
        where: {
          id: oldDefaultId
        },
        data: {
          default: true
        }
      });
    }

    await prismaDb.teams.deleteMany({
      where: {
        OR: [{ name: 'CreateNewDefaultTeam' }, { name: 'CreateNewNonDefaultTeam' }]
      }
    });
  });

  test('Uncheck old default team', async () => {
    if (!teamOne || !teamTwo) {
      expect(false).toBe(true);
      console.error('teamOne or teamTwo is null');
      return;
    }
    // Unchecks all default teams except the one with the id of teamOne
    await Team.uncheckOldDefaultTeams(teamOne.id);
    const defaultTeams = await prismaDb.teams.findMany({ where: { default: true } });
    expect(defaultTeams.length).toBe(1);
    expect(defaultTeams[0].id).toBe(teamOne.id);

    // Unchecks all default teams except the one with the id of teamTwo (Non-default team)
    await Team.uncheckOldDefaultTeams(teamTwo.id);
    const defaultTeams2 = await prismaDb.teams.findMany({ where: { default: true } });
    expect(defaultTeams2.length).toBe(0);
  });
});

describe('add properties of relational tables', () => {
  let team: teams | null = null;
  beforeAll(async () => {
    team = await createTeam('CreateNewTeam', true);
  });
  afterAll(async () => {
    if (team?.id) {
      await prismaDb.teams.deleteMany({
        where: {
          id: team.id
        }
      });
    } else {
      console.error('Team not found', team);
    }
  });

  test('addTeamKrankpuffer', async () => {
    if (!team) {
      console.error('Team not found');
      expect(false).toBe(true);
      return;
    }
    await Team.addTeamKrankpuffer(
      [
        {
          kw: 1,
          puffer: 10
        },
        {
          kw: 2,
          puffer: 20
        }
      ],
      team.id
    );
    const findKrankpufferFirst = await prismaDb.team_kw_krankpuffers.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findKrankpufferFirst.length).toBe(2);
    await Team.addTeamKrankpuffer(
      [
        {
          kw: 3,
          puffer: 5
        }
      ],
      team.id
    );
    const findKrankpufferSecond = await prismaDb.team_kw_krankpuffers.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findKrankpufferSecond.length).toBe(1);
    expect(findKrankpufferSecond[0].kw).toBe(3);
    expect(findKrankpufferSecond[0].puffer).toBe(5);
    await prismaDb.team_kw_krankpuffers.deleteMany({
      where: {
        team_id: team.id
      }
    });
  });

  test('addTeamFunktionen', async () => {
    if (!team) {
      console.error('Team not found');
      expect(false).toBe(true);
      return;
    }
    await Team.addTeamFunktionen([1, 2, 3], team.id);
    const findFunktionenFirst = await prismaDb.team_funktions.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findFunktionenFirst.length).toBe(3);
    await Team.addTeamFunktionen([4], team.id);
    const findFunktionenSecond = await prismaDb.team_funktions.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findFunktionenSecond.length).toBe(1);
    expect(findFunktionenSecond[0].funktion_id).toBe(4);
    await prismaDb.team_funktions.deleteMany({
      where: {
        team_id: team.id
      }
    });
  });

  test('addTeamVKSoll', async () => {
    if (!team) {
      console.error('Team not found');
      expect(false).toBe(true);
      return;
    }
    await Team.addTeamVKSoll(
      [
        {
          soll: 35,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        },
        {
          soll: 55,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        }
      ],
      team.id
    );
    const findVKSollFirst = await prismaDb.team_vk_soll.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findVKSollFirst.length).toBe(2);
    await Team.addTeamVKSoll(
      [
        {
          soll: 40,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        }
      ],
      team.id
    );
    const findVKSollSecond = await prismaDb.team_vk_soll.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findVKSollSecond.length).toBe(1);
    expect(findVKSollSecond[0].soll).toBe(40);
    await prismaDb.team_vk_soll.deleteMany({
      where: {
        team_id: team.id
      }
    });
  });

  test('addTeamKopfSoll', async () => {
    if (!team) {
      console.error('Team not found');
      expect(false).toBe(true);
      return;
    }
    await Team.addTeamKopfSoll(
      [
        {
          soll: 35,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        },
        {
          soll: 59,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        }
      ],
      team.id
    );
    const findKopfSollFirst = await prismaDb.team_kopf_soll.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findKopfSollFirst.length).toBe(2);
    await Team.addTeamKopfSoll(
      [
        {
          soll: 21,
          von: new Date('2021-01-01'),
          bis: new Date('2021-12-31')
        }
      ],
      team.id
    );
    const findKopfSollSecond = await prismaDb.team_kopf_soll.findMany({
      where: {
        team_id: team.id
      }
    });
    expect(findKopfSollSecond.length).toBe(1);
    expect(findKopfSollSecond[0].soll).toBe(21);
    await prismaDb.team_kopf_soll.deleteMany({
      where: {
        team_id: team.id
      }
    });
  });
});
