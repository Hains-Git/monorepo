import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

import { OAuthContext } from '../OAuthProvider';
import { PopupProvider } from './PopupProvider';

import {
  TKontingent,
  TMitarbeiter,
  TAccountInfo,
  TRotation,
  TStatuseObjects,
  TFreigabe,
  TTeam,
  TRole,
  TEinteilung,
  TDienstfrei,
  TGeraetepass,
  TAutoEinteilung,
  TNichtEinteilenAbsprache,
  TArbeitszeitAbsprache,
  AbspracheType,
  TAbsprache
} from '../../helper/api_data_types';

import { today, startOfMonth, endOfMonth, addMonths, convertDateToEnFormat } from '../../helper/dates';

import styles from '../../mitarbeiterinfo/app.module.css';
import { getFontColorByWhite } from '../../helper/util';

const einteilungenPerMonth: { [key: string]: any } = {};

export type TInitialData = {
  mitarbeiter: TMitarbeiter;
  team_am: TTeam;
  teams: TTeam[];
  dienstkategories: any;
  accountInfo: TAccountInfo;
  kontingente: TKontingent[];
  alle_rotationen: TRotation[];
  rotationen: object | undefined;
  freigaben: TFreigabe[];
  statuse: TStatuseObjects;
  rollen: TRole[];
  dateien: [];
  vertragsphase: [];
  automatische_einteilungen: [];
  nicht_einteilen_absprachen: [];
  arbeitszeit_absprachen: [];
};

type TDienst = {
  id: number;
  name: string;
  planname: string;
};

type TRating = {
  id: number;
  name: string;
  rating: number;
};

type TEventDienstfrei = {
  start: string;
  end: string | Date;
  title: string;
  backgroundColor: string;
  allDay: boolean;
  id: string;
  textColor: string;
  borderColor: string;
  extendedProps: {
    type: string;
    label: string;
  };
};

type TApiContext = {
  user: any;
  initialDate: string;
  setInitialDate: React.SetStateAction<object>;
  kontingente: TKontingent[] | undefined;
  geraetepaesse: TGeraetepass[];
  rotationen: TRotation[] | undefined;
  dienstfrei: TDienstfrei[];
  dienstfreiEvents: TEventDienstfrei[];
  freigabenRotationen: object | undefined;
  rotationData: object | undefined;
  mitarbeiterData: TInitialData | undefined;
  setRotationData: React.SetStateAction<object>;
  freigaben: TFreigabe[] | undefined;
  statuse: TStatuseObjects | undefined;
  onChangeFreigaben: (statusId: number, freigabe: TFreigabe) => void;
  ratings: TRating[];
  onUpdateRating?: (name: string, po_dienst_id: number, rating: number) => void;
  einteilungenEvents: TEinteilung[];
  wunschEvents: any[];
  einteilungenPerMonth: typeof einteilungenPerMonth;
  getNewEinteilungen: (params: object) => void;
  mitarbeiter_id: number | string;
  urlaubeSumEvents: [];
  wunschMaster: (params: any) => Promise<{ error: string; success: boolean }>;
  fakeDotEvents: [];
  sortTeamsByRotation: (
    teams: TTeam[],
    alle_rotationen: any,
    kontingenteP: TKontingent[],
    mitarbeiter: TMitarbeiter,
    date: Date
  ) => TTeam[];
  createEinteilungenEvents: (Einteilungen: TEinteilung[]) => void;
  automatische_einteilungen: TAutoEinteilung[];
  deleteAbsprache: (id: number, type: AbspracheType) => void;
  addAbsprache: (absprache: TAbsprache, type: AbspracheType) => void;
  nicht_einteilen_absprachen: TNichtEinteilenAbsprache[];
  arbeitszeit_absprachen: TArbeitszeitAbsprache[];
};

const ApiContext = createContext<TApiContext>({
  user: {},
  initialDate: '',
  setInitialDate: () => {},
  kontingente: [],
  geraetepaesse: [],
  rotationen: [],
  freigabenRotationen: {},
  rotationData: {},
  mitarbeiterData: undefined,
  setRotationData: () => {},
  freigaben: [],
  dienstfrei: [],
  statuse: {},
  onChangeFreigaben: () => {},
  ratings: [],
  onUpdateRating: () => {},
  einteilungenEvents: [],
  wunschEvents: [],
  dienstfreiEvents: [],
  einteilungenPerMonth: {},
  getNewEinteilungen: () => {},
  mitarbeiter_id: '',
  urlaubeSumEvents: [],
  wunschMaster: () => Promise.resolve({ error: '', success: true }),
  fakeDotEvents: [],
  sortTeamsByRotation: (): Array<TTeam> => [],
  createEinteilungenEvents: () => {},
  automatische_einteilungen: [],
  deleteAbsprache: () => {},
  addAbsprache: () => {},
  nicht_einteilen_absprachen: [],
  arbeitszeit_absprachen: []
});

interface Props {
  children: React.ReactNode;
  mitarbeiter_id: number;
}

const ApiProvider: React.FC<Props> = ({ children, mitarbeiter_id }) => {
  const { hainsOAuth, returnError, user } = useContext(OAuthContext);
  const [initialDate, setInitialDate] = useState(convertDateToEnFormat(new Date()));

  const [rotationData, setRotationData] = useState();
  const [mitarbeiterData, setMitarbeiterData] = useState<TInitialData | undefined>();
  const [kontingente, setKontingente] = useState<TKontingent[]>();
  const [geraetepaesse, setGeraetepaesse] = useState<TGeraetepass[]>([]);
  const [rotationen, setRotationen] = useState();
  const [freigabenRotationen, setFreigabenRotationen] = useState();
  const [freigaben, setFreigaben] = useState<TFreigabe[]>([]);
  const [statuse, setStatuse] = useState();
  const [ratings, setRatings] = useState<TRating[]>([]);
  const [dienstfrei, setDienstfrei] = useState<TDienstfrei[]>([]);
  const [einteilungenEvents, setEinteilungenEvents] = useState<TEinteilung[]>([]);
  const [wunschEvents, setWunschEvents] = useState([]);
  const [dienstfreiEvents, setDienstfreiEvents] = useState<TEventDienstfrei[]>([]);
  const [urlaubeSumEvents, setUrlaubeSumEvents] = useState<any>([]);
  const [fakeDotEvents, setFakeDotEvents] = useState<any>([]);
  const [automatische_einteilungen, setAutomatischeEinteilungen] = useState<TAutoEinteilung[]>([]);
  const [nicht_einteilen_absprachen, setNichtEinteilenAbsprachen] = useState<TNichtEinteilenAbsprache[]>([]);
  const [arbeitszeit_absprachen, setArbeitszeitAbsprachen] = useState<TArbeitszeitAbsprache[]>([]);

  const onUpdateFreigaben = async (freigabetyp_id: number, freigabestatus_id: number) => {
    const params = {
      mitarbeiter_id,
      freigabestatus_id,
      freigabetyp_id
    };
    let res;
    try {
      res = await hainsOAuth.api('freigabenupdate', 'post', params);
    } catch (err) {
      returnError(err);
    }
    return res?.freigabetyp_id === freigabetyp_id && res?.freigabestatus_id === freigabestatus_id;
  };

  const onChangeFreigaben = (statusId: number, freigabe: TFreigabe) => {
    const isUpdated = onUpdateFreigaben(freigabe.id, statusId);
    if (!isUpdated) return;

    setFreigaben((cur: TFreigabe[]) => {
      const filtered = cur.filter((curItem: TFreigabe) => curItem.id !== freigabe.id);
      const changed = {
        ...freigabe,
        freigabestatus_id: statusId
      };
      return [...filtered, changed];
    });
  };

  const onUpdateRating = async (name: string, po_dienst_id: number, rating: number) => {
    if (user.id !== mitarbeiter_id) {
      return;
    }
    const params = { po_dienst_id, rating };
    const res = await hainsOAuth.api('updaterating', 'post', params);
    if (res.status === 'updated') {
      setRatings((cur: TRating[]) => {
        const filtered = cur.filter((curItem: TRating) => curItem.id !== po_dienst_id);
        const changed = {
          name,
          id: po_dienst_id,
          rating
        };
        return [...filtered, changed];
      });
    }
  };

  const createRatings = (dienste: TDienst[], dienstRating: any) => {
    const arr: TRating[] = [];
    dienste.forEach(({ id, name }: { id: number; name: string }) => {
      const tmpRating = {
        id,
        name,
        rating: dienstRating?.[id]?.rating || 3
      };
      arr.push(tmpRating);
    });
    setRatings(arr);
  };

  const getDateRange = (back: number, forward: number) => {
    const todayStr = today();
    const startDate = addMonths(todayStr, back);
    const endDate = addMonths(todayStr, forward);

    if (!startDate || !endDate) {
      return;
    }

    const startOfMonthStr = startOfMonth(startDate);
    const endOfMonthStr = endOfMonth(endDate);

    const start = convertDateToEnFormat(startOfMonthStr);
    const end = convertDateToEnFormat(endOfMonthStr);

    return { start, end };
  };

  const markDates = (start: string, end: string) => {
    let i = 0;
    for (let d = new Date(start); d <= new Date(end); d.setMonth(d.getMonth() + 1)) {
      const dateKey: string = convertDateToEnFormat(d);
      if (!einteilungenPerMonth[dateKey]) {
        einteilungenPerMonth[dateKey] = true;
      }
      i++;
      if (i > 10) {
        console.error('Invinite loop');
        break;
      }
    }
  };

  const createEventID = (einteilung: TEinteilung) => {
    return `${einteilung.tag}_${einteilung.po_dienst_id}_${einteilung.mitarbeiter_id}`;
  };

  const getEinteilungEvent = (einteilung: TEinteilung) => {
    const bgColor = einteilung.po_dienst.color;
    const { color } = getFontColorByWhite(bgColor);
    const saal = einteilung?.arbeitsplatz?.id > 1 ? einteilung?.arbeitsplatz?.name : null;
    const title = saal ? `${einteilung.po_dienst.planname} (${saal})` : einteilung.po_dienst.planname;

    const label = saal ? `${einteilung.po_dienst.name} (${saal})` : einteilung.po_dienst.name;

    const status = einteilung.einteilungsstatus;
    const event = {
      start: einteilung.tag,
      end: einteilung.tag,
      title,
      backgroundColor: bgColor,
      borderColor: 'transparent',
      textColor: color,
      allDay: true,
      editable: false,
      id: createEventID(einteilung),
      extendedProps: {
        type: 'einteilung',
        status: status.name,
        von: einteilung.tag,
        bis: einteilung.tag,
        isWaehlbar: status.waehlbar,
        label
      }
    };
    return event;
  };

  function flattenArrays(arr1: any, arr2: any) {
    const newArr = [...arr1, ...arr2];
    return newArr.reduce((acc, obj) => {
      if (!acc.find((item: any) => item.id === obj.id)) {
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  function flattenArraysByTag(arr1: any, arr2: any) {
    const newArr = [...arr1, ...arr2];
    return newArr.reduce((acc, obj) => {
      const index = acc.findIndex((item: any) => item.start === obj.start && item.end === obj.end);
      if (index !== -1) {
        acc[index] = obj;
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  const createEinteilungenEvents = (einteilungen: TEinteilung[]) => {
    const events: any = [];
    einteilungen.forEach((einteilung: TEinteilung) => {
      const event = getEinteilungEvent(einteilung);
      events.push(event);
    });
    setEinteilungenEvents((curEvents) => {
      return flattenArrays(curEvents, events);
    });
  };

  const getEinteilungenFromApi = async (params: any) => {
    try {
      const result = await hainsOAuth.api('dienstplaner/mitarbeiter/einteilungen_in_time.json', 'post', params);
      markDates(params.start, params.end);
      createEinteilungenEvents(result);
    } catch (err) {
      returnError(err);
    }
  };

  const getNewEinteilungen = (params: any) => {
    getEinteilungenFromApi(params);
  };

  const createFakeDotEvent = (data: any) => {
    const event = {
      title: 'Z',
      start: data.tag,
      end: data.tag,
      color: data.color,
      textColor: data.color,
      allDay: true,
      editable: false,
      extendedProps: {
        type: 'wunsch',
        myWunsch: false,
        popupDetail: data.details,
        label: data.label
      },
      classNames: [styles.wunsch_dot, 'wunsch_dot']
    };
    return event;
  };

  const getMarkDienstkategories = (dienstkategories: any) => {
    return dienstkategories.filter((dk: any) => dk.mark);
  };

  const getTeamsToCurrentDate = (dienstkategories: any, teamsP: any) => {
    const teamIds = new Set();
    dienstkategories.forEach((dk: any) => {
      dk.teamDetails.forEach((t: any) => {
        teamIds.add(t.id);
      });
    });
    const uniqueTeamIds = Array.from(teamIds);

    const teams = teamsP || [];
    const curTeams = Object.values(teams).reduce((acc: any, cur: any) => {
      if (uniqueTeamIds.includes(cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, []);
    return curTeams;
  };

  const sortTeamsByRotation = (
    teams: TTeam[],
    alle_rotationen: any,
    kontingenteP: any,
    mitarbeiter: TMitarbeiter,
    date: Date = new Date()
  ) => {
    const todayTime = date.getTime();
    const mRotationen = alle_rotationen || [];
    const _kontingente: { [key: string]: any } = kontingenteP || {};

    const curRotationen = mRotationen
      .filter((cur: any) => {
        const vonTime = new Date(cur.von).getTime();
        const bisTime = new Date(cur.bis).getTime();
        return todayTime >= vonTime && todayTime <= bisTime;
      })
      .sort((a: TRotation, b: TRotation) => a.prioritaet - b.prioritaet);

    const teamIds = new Map<number, number>();
    curRotationen.forEach((kon: any) => {
      const teamId = _kontingente[kon.kontingent_id].team_id;
      if (teamId) {
        teamIds.set(teamId, teamIds.size + 1);
      }
    });
    if (curRotationen.length === 0) {
      const _teamId = mitarbeiter.funktion.team_id;
      teamIds.set(_teamId, teamIds.size + 1);
    }

    const sortedTeams = Object.values(teams).sort((a, b) => {
      const orderA = teamIds.get(a.id) || Infinity;
      const orderB = teamIds.get(b.id) || Infinity;
      return orderA - orderB || a.name.localeCompare(b.name);
    });

    return sortedTeams;
  };

  const createUrlaubeSumEvents = (data: any) => {
    const verteilungen = Object.values(data?.dienstwunsch_verteilung);
    const markDk = getMarkDienstkategories(data.dienstkategories);
    const curTeams: any = getTeamsToCurrentDate(data.dienstkategories, data.teams);

    const events: any = [];
    const fakeEvents: any = [];
    const mitarbeiter = data?.mitarbeiter;

    verteilungen.forEach((v: any) => {
      const txt = v.sum > 0 ? `U: ${v.urlaube} Wünsche` : `U: ${v.urlaube}`;
      const title = v.urlaube > 0 ? txt : 'Wünsche';
      const event = {
        title,
        start: v.tag,
        end: v.tag,
        backgroundColor: '#eee',
        borderColor: 'transparent',
        color: 'rgb(138,138,138)',
        textColor: 'rgb(138,138,138)',
        allDay: true,
        editable: false,
        extendedProps: {
          type: 'wunsch',
          tag: v.tag,
          myWunsch: false,
          popupDetail: v
        },
        classNames: ['wunsch']
      };

      const sortedTeams = sortTeamsByRotation(
        curTeams,
        data.alle_rotationen,
        data.kontingente,
        mitarbeiter,
        new Date(v.tag)
      );

      const teamId = sortedTeams?.[0]?.id;
      const details = v.details[teamId];

      if (details) {
        details.forEach((d: any) => {
          const found = markDk.find((dk: any) => d.id === dk.id && d.count > 0);
          if (found) {
            const _data = {
              tag: v.tag,
              details: v.details,
              color: found.color,
              label: `${d.label} : ${d.count}`
            };
            const fakeEvent = createFakeDotEvent(_data);
            fakeEvents.push(fakeEvent);
          }
        });
      }
      events.push(event);
    });

    setUrlaubeSumEvents(events);
    setFakeDotEvents(fakeEvents);
  };

  const getWunschEvent = (data: any) => {
    const bgColor = data.color;
    const { color } = getFontColorByWhite(bgColor);
    const event = {
      start: data.tag,
      end: data.tag,
      title: `${data.name}`,
      backgroundColor: bgColor,
      borderColor: 'transparent',
      color,
      textColor: color,
      allDay: true,
      editable: false,
      id: data.eventId,
      extendedProps: {
        type: 'wunsch',
        myWunsch: true,
        title: data.name,
        popupDetail: data.v
      },
      classNames: ['wunsch']
    };
    return event;
  };

  const setDienstwunsche = (dienstwunsche: any, dienstkategories: any, dienstwunsch_verteilung: any) => {
    const events: any = [];
    for (const dw of dienstwunsche) {
      const kategorie = dienstkategories.find((dk: any) => dk.id === dw.dienstkategorie_id);
      if (!kategorie) {
        continue;
      }
      const eventId = `wunsch-${dw.mitarbeiter_id}-${dw.dienstkategorie_id}-${dw.tag}`;
      const color = kategorie.color;
      const name = kategorie.name;
      const tag = dw.tag;
      const v = dienstwunsch_verteilung[tag];
      const data = { eventId, color, name, tag, v };
      const event = getWunschEvent(data);
      events.push(event);
    }
    setWunschEvents((curEvents) => {
      return flattenArrays(curEvents, events);
    });
  };

  const addMyWunsch = (data: any) => {
    const dienstkategorie = mitarbeiterData?.dienstkategories.find((dk: any) => dk.id === data.dienstkategorie_id);
    if (!dienstkategorie) return;
    if (data?.remove_wunsch) {
      setWunschEvents((curEvents) => {
        const tag = data.tag;
        return curEvents.filter((ev: any) => {
          const exProp = ev?.extendedProps;
          return exProp?.type === 'wunsch' && exProp?.myWunsch && ev?.start === tag && ev?.ende === tag;
        });
      });
    } else {
      const name = dienstkategorie.name;
      const color = dienstkategorie.color;
      const tag = data.tag;
      const v = data.verteilung;
      const eventId = `wunsch-${data.mitarbeiter_id}-${data.dienstkategorie_id}-${data.tag}`;
      const myWunsch = { eventId, color, name, tag, v };
      const wunschEvent = [getWunschEvent(myWunsch)];

      setWunschEvents((curEvents) => {
        return flattenArraysByTag(curEvents, wunschEvent);
      });
    }
  };

  const wunschMaster = async (params: any) => {
    const res = { error: '', success: true };
    try {
      const result = await hainsOAuth.api('dienstplaner/wunsch_master.json', 'post', params);
      addMyWunsch(result);
    } catch (err: any) {
      res.error = err;
      res.success = false;
      returnError(err);
    }
    return res;
  };

  const getDienstfreiEvent = (item: TDienstfrei) => {
    const { color } = getFontColorByWhite(item.color);
    const bisDate = new Date(item.tag);
    // Becaus fullcalendar uses the end date as an axclusive date not inclusive
    bisDate.setDate(bisDate.getDate() + 1);

    const event: TEventDienstfrei = {
      id: item.id,
      title: item.label,
      start: item.tag,
      end: bisDate,
      allDay: true,
      backgroundColor: item.color,
      borderColor: 'transparent',
      textColor: color,
      extendedProps: {
        label: item.description,
        type: 'dienstfrei'
      }
    };
    return event;
  };

  const resetEverything = () => {
    setRotationData(undefined);
    setMitarbeiterData(undefined);
    setKontingente(undefined);
    setRotationen(undefined);
    setDienstfrei([]);
    setDienstfreiEvents([]);
    setFreigabenRotationen(undefined);
    setFreigaben([]);
    setStatuse(undefined);
    setRatings([]);
    setEinteilungenEvents([]);
    setGeraetepaesse([]);
  };

  const deleteAbsprache = (id: number, type: AbspracheType) => {
    hainsOAuth.api('db_delete', 'post', { routeBase: type, id }).then(
      (data: any) => {
        if (data.destroyed) {
          const set = (curr: any[]) => curr.filter((_item) => _item.id !== id);
          switch (type) {
            case 'nichteinteilenabsprachen':
              setNichtEinteilenAbsprachen(set);
              break;
            case 'arbeitszeitabsprachen':
              setArbeitszeitAbsprachen(set);
              break;
            case 'automatischeeinteilungen':
              setAutomatischeEinteilungen(set);
              break;
          }
        }
      },
      (err: any) => {
        returnError(err);
      }
    );
  };

  const addAbsprache = (absprache: TAbsprache, type: AbspracheType) => {
    const set = (curVal: any[]) => {
      const filtered = curVal.filter((item) => item.id !== absprache.id);
      return [...filtered, absprache];
    };
    switch (type) {
      case 'nichteinteilenabsprachen':
        setNichtEinteilenAbsprachen(set);
        break;
      case 'arbeitszeitabsprachen':
        setArbeitszeitAbsprachen(set);
        break;
      case 'automatischeeinteilungen':
        setAutomatischeEinteilungen(set);
        break;
    }
  };

  useEffect(() => {
    resetEverything();
  }, [mitarbeiter_id]);

  useEffect(() => {
    hainsOAuth.api('get_mitarbeiter_details', 'get', { mitarbeiter_id }).then(
      (data: any) => {
        // console.log('ApiProvider: Data', data);
        setMitarbeiterData(data);
        setRotationen(data.alle_rotationen);
        setDienstfrei(data.dienstfrei);
        setDienstfreiEvents(() => data.dienstfrei?.map?.((item: TDienstfrei) => getDienstfreiEvent(item)) || []);
        setFreigabenRotationen(data.rotationen);
        const _kontingente = Object.values(data?.kontingente as TKontingent[]);
        setKontingente(_kontingente);
        setFreigaben(data.freigaben);
        setStatuse(data.statuse);
        setGeraetepaesse(data.geraetepaesse);
        createRatings(data?.dienste, data?.ratings);
        createUrlaubeSumEvents(data);
        setDienstwunsche(data?.dienstwunsche, data?.dienstkategories, data?.dienstwunsch_verteilung);
        setAutomatischeEinteilungen(data.automatische_einteilungen as TAutoEinteilung[]);
        setNichtEinteilenAbsprachen(data.nicht_einteilen_absprachen as TNichtEinteilenAbsprache[]);
        setArbeitszeitAbsprachen(data.arbeitszeit_absprachen as TArbeitszeitAbsprache[]);
      },
      (err: any) => {
        returnError(err);
      }
    );
  }, [mitarbeiter_id]);

  useEffect(() => {
    const range = getDateRange(-1, 4);
    if (!range) return;
    const { start, end } = range;

    const params = {
      start,
      end,
      id: mitarbeiter_id
    };

    getEinteilungenFromApi(params);
  }, [mitarbeiter_id]);

  const providerValue = useMemo<TApiContext>(
    () => ({
      user,
      initialDate,
      setInitialDate,
      kontingente,
      geraetepaesse,
      rotationData,
      setRotationData,
      mitarbeiterData,
      rotationen,
      freigabenRotationen,
      freigaben,
      dienstfrei,
      statuse,
      onChangeFreigaben,
      ratings,
      onUpdateRating,
      einteilungenEvents,
      einteilungenPerMonth,
      getNewEinteilungen,
      mitarbeiter_id,
      urlaubeSumEvents,
      dienstfreiEvents,
      wunschMaster,
      wunschEvents,
      fakeDotEvents,
      sortTeamsByRotation,
      createEinteilungenEvents,
      automatische_einteilungen,
      deleteAbsprache,
      addAbsprache,
      nicht_einteilen_absprachen,
      arbeitszeit_absprachen
    }),
    [
      user,
      initialDate,
      kontingente,
      geraetepaesse,
      rotationData,
      setRotationData,
      mitarbeiterData,
      rotationen,
      freigabenRotationen,
      freigaben,
      dienstfrei,
      dienstfreiEvents,
      statuse,
      onChangeFreigaben,
      ratings,
      onUpdateRating,
      einteilungenEvents,
      einteilungenPerMonth,
      getNewEinteilungen,
      mitarbeiter_id,
      urlaubeSumEvents,
      wunschEvents,
      fakeDotEvents,
      automatische_einteilungen,
      nicht_einteilen_absprachen,
      arbeitszeit_absprachen
    ]
  );

  if (!mitarbeiterData) {
    return null;
  }

  return (
    <ApiContext.Provider value={providerValue}>
      <PopupProvider
        hainsOAuth={hainsOAuth}
        returnError={returnError}
        setRotationData={setRotationData}
        setRotationen={setRotationen}
      >
        {children}
      </PopupProvider>
    </ApiContext.Provider>
  );
};

export { ApiProvider, ApiContext };
