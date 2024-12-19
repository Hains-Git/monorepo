import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from 'react';

import { ApiContext } from './ApiProvider';
import { TTeam } from '../../helper/api_data_types';

type TCoord = {
  clientX: number;
  clientY: number;
};

type TContext = {
  receiveEventData: (eventData: any, coord: TCoord) => void;
  showPopup: boolean;
  setPopupRef: any;
  popupData: any;
  eventData: any;
  mitarbeiter_id: number | string;
  createWunsch: (params: any) => void;
  findEventByDate: (dateStr: string, coord: TCoord) => void;
};

const DienstwunschPopupContext = createContext<TContext>({
  receiveEventData: () => {},
  showPopup: false,
  setPopupRef: () => {},
  popupData: {},
  eventData: {},
  mitarbeiter_id: '',
  createWunsch: () => {},
  findEventByDate: () => {}
});

interface Props {
  children: React.ReactNode;
}

const DienstwunschPopupProvider: React.FC<Props> = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupRef, setPopupRef] = useState<any>(null);
  const [eventData, setEventData] = useState<any>();
  const [popupData, setPopupData] = useState<any>();
  const [coord, setCoord] = useState<TCoord>();

  const {
    mitarbeiterData,
    mitarbeiter_id,
    wunschMaster,
    urlaubeSumEvents,
    sortTeamsByRotation
  } = useContext(ApiContext);

  const rePositionPopup = () => {
    if (!popupRef?.current || !coord) return;
    const wWidth = document.body.clientWidth;
    const wHeight = document.body.clientHeight;
    const pWidth = popupRef.current.clientWidth - 20;
    const pHeight = popupRef.current.clientHeight;
    const checkX = coord.clientX + pWidth <= wWidth;
    const checkY = coord.clientY + pHeight <= wHeight;

    const htmlEl = document?.lastChild as HTMLElement;
    const offsetScroll = htmlEl?.scrollTop || 0;
    const scrollHeight = htmlEl?.scrollHeight || wHeight;

    if (checkX) {
      popupRef.current.style.left = `${coord?.clientX}px`;
      popupRef.current.style.right = 'initial';
    } else {
      popupRef.current.style.left = 'initial';
      popupRef.current.style.right = '20px';
    }
    if (checkY) {
      popupRef.current.style.top = `${coord.clientY + offsetScroll}px`;
      popupRef.current.style.bottom = 'initial';
    } else {
      const scrollDiff = scrollHeight - wHeight - offsetScroll;
      popupRef.current.style.top = 'initial';
      popupRef.current.style.bottom = `${scrollDiff + 20}px`;
    }
  };

  useEffect(() => {
    rePositionPopup();
  }, [coord]);

  const bodyClick = (event: any) => {
    const targetClass = event.target.className;
    const clickInPopup = event.target.closest('div.popup_dienstwunsch');
    if (
      !clickInPopup &&
      (!targetClass?.includes?.('fc-') || targetClass?.includes?.('fc-toolbar'))
    ) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', bodyClick);
    return () => {
      document.removeEventListener('click', bodyClick);
    };
  }, []);

  const getTeamsToCurrentDate = () => {
    const teamIds = new Set();
    mitarbeiterData?.dienstkategories.forEach((dk: any) => {
      dk.teamDetails.forEach((t: any) => {
        teamIds.add(t.id);
      });
    });
    const uniqueTeamIds = Array.from(teamIds);

    const teams = mitarbeiterData?.teams || [];
    const curTeams = Object.values(teams).reduce((acc: any, cur) => {
      if (uniqueTeamIds.includes(cur.id)) {
        acc.push(cur);
      }
      return acc;
    }, []);
    return curTeams;
  };

  const getTeamDienstKategories = (teamId: number, empty: boolean = false) => {
    const kats = mitarbeiterData?.dienstkategories.filter((k: any) => {
      const found = k.teamDetails.find((td: TTeam) => td.id === teamId);
      if (found) {
        return k;
      }
      if (k.teamDetails.length === 0 && empty) {
        return k;
      }
      return false;
    });
    return kats.sort((a: any, b: any) => a.name.localeCompare(b.name));
  };

  const addDienstkategoriesToTeamsObj = (teams: TTeam[]) => {
    const ohneTeam = {
      id: 0,
      name: 'Ohne Team'
    };

    const newTeams = [...teams, ohneTeam].map((t: any) => {
      const copy = { ...t };
      const k =
        t.id === 0
          ? getTeamDienstKategories(t.id, true)
          : getTeamDienstKategories(t.id);
      copy.dienstkategories = k;
      return copy;
    });
    return newTeams;
  };

  const receiveEventData = (data: any, _coord: TCoord) => {
    if (!mitarbeiterData) return;
    const mitarbeiter = mitarbeiterData.mitarbeiter;
    const kontingente = mitarbeiterData?.kontingente;
    const rotationen = mitarbeiterData?.alle_rotationen;

    const curTeams = getTeamsToCurrentDate();
    const sortedTeams = sortTeamsByRotation(
      curTeams,
      rotationen,
      kontingente,
      mitarbeiter,
      new Date(data.extendedProps.tag)
    );
    const teams = addDienstkategoriesToTeamsObj(sortedTeams);
    const teamAm = mitarbeiterData?.team_am;
    const dienstkategories = mitarbeiterData?.dienstkategories;
    const myWunsch = data?.extendedProps?.myWunsch;
    const title = data.title;
    const pd = { teams, teamAm, dienstkategories, myWunsch, title };
    const eventD = data?.extendedProps?.popupDetail;
    setEventData(eventD);
    setPopupData(pd);
    setShowPopup(true);
    setCoord(_coord);
  };

  const findEventByDate = (dateStr: string, coord: TCoord) => {
    const found: any = urlaubeSumEvents.find(
      (item: any) => item.start === dateStr && item.end === dateStr
    );
    if (!found) return;
    receiveEventData(found, coord);
  };

  const createWunsch = async (params: any) => {
    const res = await wunschMaster(params);
    if (res.success) {
      setShowPopup(false);
    }
  };

  const providerValue = useMemo(
    () => ({
      showPopup,
      receiveEventData,
      setPopupRef,
      popupData,
      eventData,
      mitarbeiter_id,
      createWunsch,
      findEventByDate
    }),
    [showPopup, eventData]
  );

  return (
    <DienstwunschPopupContext.Provider value={providerValue}>
      {children}
    </DienstwunschPopupContext.Provider>
  );
};

export { DienstwunschPopupContext, DienstwunschPopupProvider };
