/* eslint-disable @typescript-eslint/no-empty-function */
import { prismaDb } from '@my-workspace/prisma_hains';
import * as Team from './team';

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

describe('teams', () => {
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
        'Kostenstelle nicht gefunden.'
      ].join('\n');

      expect(
        await Team.checkTeamInput(
          {
            name: 'Kein Team',
            default: false,
            verteiler_default: false,
            color: 'red',
            krank_puffer: -1
          },
          -1,
          -1
        )
      ).toEqual(result);
    });

    test('name.length > 50', async () => {
      const result = ['Name darf maximal 50 Zeichen lang sein.'].join('\n');
      expect(
        await Team.checkTeamInput(
          {
            name: 'a'.repeat(51),
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
    });

    test('name.includes("_")', async () => {
      const result = ['Name darf kein "_" enthalten.'].join('\n');
      expect(
        await Team.checkTeamInput(
          {
            name: 'test_test',
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
    });

    test('name = ""', async () => {
      const result = ['Name muss ausgefüllt sein.'].join('\n');
      expect(
        await Team.checkTeamInput(
          {
            name: '',
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
    });

    test('name already exists', async () => {
      const result = ['Name bereits vergeben.'].join('\n');
      expect(
        await Team.checkTeamInput(
          {
            name: 'NameAlreadyExists',
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
    });

    test('name.toLowerCase() != kein team', async () => {
      const result = ['Name nicht zulässig.'].join('\n');
      expect(
        await Team.checkTeamInput(
          {
            name: 'KEIN TEAM',
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
      expect(
        await Team.checkTeamInput(
          {
            name: 'KeiN TeaM',
            default: false,
            verteiler_default: false,
            color: '#fff',
            krank_puffer: 0
          },
          0,
          1
        )
      ).toEqual(result);
    });

    test('all checks pass', async () => {
      expect(
        await Team.checkTeamInput(
          {
            name: 'NameDoesNotAlreadyExists',
            default: false,
            verteiler_default: false,
            color: '#fffddd',
            krank_puffer: 0
          },
          0,
          1
        )
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

  // Mock /Spy is not working currently!!!!!!!!!!!!!!!!!!!

  describe('create or update team', () => {
    let oldDefaultId = 0;
    beforeAll(async () => {
      await createTeam();
      oldDefaultId = (await prismaDb.teams.findFirst({ where: { default: true } }))?.id || 0;
      vi.spyOn(Team, 'checkTeamInput').mockImplementation(async () => '');
      vi.spyOn(Team, 'uncheckOldDefaultTeam').mockImplementation(async () => {});
      vi.spyOn(Team, 'addTeamFunktionen').mockImplementation(async () => {});
      vi.spyOn(Team, 'addTeamKrankpuffer').mockImplementation(async () => {});
      vi.spyOn(Team, 'addTeamVKSoll').mockImplementation(async () => {});
      vi.spyOn(Team, 'addTeamKopfSoll').mockImplementation(async () => {});
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
      vi.restoreAllMocks();
    });

    test('create team', async () => {
      const result = await Team.createOrUpdateTeam({
        id: 0,
        name: 'CreateNewTeam',
        default: true,
        verteiler_default: false,
        color: '#fff',
        krank_puffer: 0,
        kostenstelle_id: 1,
        team_kopf_soll: [],
        team_vk_soll: [],
        funktionen_ids: [],
        team_kw_krankpuffers: []
      });

      expect(result).not.toBeNull();
      expect(typeof result).toBe('object');

      // expect(Team.checkTeamInput).toHaveBeenCalledTimes(1);
      // expect(Team.uncheckOldDefaultTeam).toHaveBeenCalledTimes(1);
      // expect(Team.addTeamFunktionen).toHaveBeenCalledTimes(1);
      // expect(Team.addTeamKrankpuffer).toHaveBeenCalledTimes(1);
      // expect(Team.addTeamVKSoll).toHaveBeenCalledTimes(1);
      // expect(Team.addTeamKopfSoll).toHaveBeenCalledTimes(1);

      if (typeof result !== 'object') return;
      expect(result?.name).toBe('CreateNewTeam');
    });

    test('update team', async () => {
      const nameAlreadyExistsTeamId =
        (await prismaDb.teams.findFirst({ where: { name: 'NameAlreadyExists' } }))?.id || 0;
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

      // expect(Team.checkTeamInput).toHaveBeenCalledTimes(2);
      // expect(Team.uncheckOldDefaultTeam).toHaveBeenCalledTimes(2);
      // expect(Team.addTeamFunktionen).toHaveBeenCalledTimes(2);
      // expect(Team.addTeamKrankpuffer).toHaveBeenCalledTimes(2);
      // expect(Team.addTeamVKSoll).toHaveBeenCalledTimes(2);
      // expect(Team.addTeamKopfSoll).toHaveBeenCalledTimes(2);

      if (typeof result !== 'object') return;
      expect(result?.id).toBe(nameAlreadyExistsTeamId);
      expect(result?.name).toBe('NameAlreadyExists');
      expect(result?.default).toBe(false);
      expect(result?.krank_puffer).toBe(66);
      expect(result?.color).toBe('#ababab');
      expect(result?.verteiler_default).toBe(true);
    });
  });
});
