import React, { createContext, useMemo, useContext, useState, useEffect } from 'react';

import { OAuthContext } from '../OAuthProvider';
import { DataContext } from './DataProvider';

import {
  TDienst,
  TZeitraumkategorie,
  TVertragsPhase,
  TVertrag,
  TVertragsTyp,
  TVertragsArbeitszeit
} from '../../helper/api_data_types';
import { UseMounted } from '../../hooks/use-mounted';
import { ApiContext } from './ApiProvider';
import { deepClone } from '../../helper/util';
import { getPrevVonAndNextBis, sortVertragsPhasenOrArbeitszeitenByVonBisId } from '../../helper/vertrags_zeitraum';
import { getGermandate, today } from '../../helper/dates';

export type TFormConfig = {
  form: 'vertrag' | 'phase' | 'arbeitszeit';
  vertrag: TVertrag;
  phase: TVertragsPhase;
  arbeitszeit: TVertragsArbeitszeit;
  title: string;
  renten_eintritt?: string;
  originPhase?: TVertragsPhase;
  originArbeitszeit?: TVertragsArbeitszeit;
};

export type TShow = {
  title: string;
  form: 'vertrag' | 'phase' | 'arbeitszeit';
  vertrag?: TVertrag;
  phase?: TVertragsPhase;
  arbeitszeit?: TVertragsArbeitszeit;
  originPhase?: TVertragsPhase;
  originArbeitszeit?: TVertragsArbeitszeit;
};

type Context = {
  rentenEintrittDe: string;
  vertrags: TVertrag[];
  dienste: TDienst[];
  zeitraumkategorie: TZeitraumkategorie[];
  mitarbeiter_id: number;
  show: (obj: TShow) => void;
  hide: () => void;
  showPopup: boolean;
  formConfig: TFormConfig | undefined;
  vertragsTyp: TVertragsTyp[];
  updateVertrag: (formData: FormData) => void;
  updatePhase: (formData: FormData) => void;
  updateArbeitszeit: (formData: FormData) => void;
  deleteArbeitszeit: (id: number, vertrag_id: number) => void;
  deletePhase: (id: number, vertrag_id: number) => void;
  deleteVertrag: (id: number) => void;
};

const VertragContext = createContext<Context>({
  rentenEintrittDe: '',
  vertrags: [],
  dienste: [],
  zeitraumkategorie: [],
  show: () => {},
  hide: () => {},
  showPopup: false,
  formConfig: undefined,
  vertragsTyp: [],
  updateVertrag: () => {},
  updatePhase: () => {},
  updateArbeitszeit: () => {},
  deleteArbeitszeit: () => {},
  deletePhase: () => {},
  deleteVertrag: () => {},
  mitarbeiter_id: 0
});

type TProps = {
  children: React.ReactNode;
  mitarbeiter_id: number;
};

const defaultVertrag: TVertrag = {
  id: 0,
  anfang: '',
  ende: '',
  vertragstyp_id: 0,
  mitarbeiter_id: 0,
  unbefristet: false,
  kommentar: '',
  vertrags_arbeitszeits: [],
  vertrags_phases: [],
  vertragstyp: {
    id: 0,
    name: ''
  }
};

const defaultPhase: TVertragsPhase = {
  id: 0,
  von: '',
  bis: '',
  vertrag_id: 0,
  vertragsstufe_id: 0
};

const defaultArbeitszeit: TVertragsArbeitszeit = {
  id: 0,
  von: '',
  bis: '',
  vertrag_id: 0,
  vk: 1,
  tage_woche: 5
};

function VertragProvider({ children, mitarbeiter_id }: TProps) {
  const [vertrags, setVertrags] = useState<TVertrag[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formConfig, setFormConfig] = useState<TFormConfig | undefined>();
  const { mitarbeiterData } = useContext(ApiContext);
  const mounted = UseMounted();

  const { hainsOAuth, returnError } = useContext(OAuthContext);
  const { data, setMessageFromApi } = useContext(DataContext);
  const dienste = data.dienste;
  const zeitraumkategorie = data.zeitraumkategorie;
  const vertragsTyp = data.vertrags_typ;
  const rentenEintritt = mitarbeiterData?.accountInfo?.renten_eintritt;
  const rentenEintrittDe = rentenEintritt ? getGermandate(rentenEintritt) : '';

  const show = (obj: TShow) => {
    const newFormConfig: TFormConfig = deepClone({
      ...obj,
      vertrag: obj.vertrag || defaultVertrag,
      phase: obj.phase || defaultPhase,
      arbeitszeit: obj.arbeitszeit || defaultArbeitszeit,
      renten_eintritt: rentenEintritt
    });
    if (!newFormConfig.vertrag.anfang) {
      newFormConfig.vertrag.anfang = today();
    }
    if (!newFormConfig.vertrag.ende && rentenEintritt) {
      newFormConfig.vertrag.ende = rentenEintritt;
    }
    if (['arbeitszeit', 'phase'].includes(newFormConfig.form)) {
      const key = newFormConfig.form === 'arbeitszeit' ? 'vertrags_arbeitszeits' : 'vertrags_phases';
      const arr = newFormConfig.vertrag?.[key] || [];
      const sortedArr = [...arr].sort(sortVertragsPhasenOrArbeitszeitenByVonBisId);
      const origin = newFormConfig.form === 'arbeitszeit' ? newFormConfig.originArbeitszeit : newFormConfig.originPhase;
      if (origin) {
        const [newAnfang, newEnde] = getPrevVonAndNextBis(
          sortedArr,
          origin?.id || 0,
          newFormConfig.vertrag.anfang || '',
          newFormConfig.vertrag.ende || ''
        );
        if (newAnfang) newFormConfig.vertrag.anfang = newAnfang;
        if (newEnde) newFormConfig.vertrag.ende = newEnde;
      }
    }

    setFormConfig(newFormConfig);
    setShowPopup(true);
  };

  const hide = () => {
    setShowPopup(false);
    setFormConfig(undefined);
  };

  const changePhasenInVertrag = (phasen: TVertragsPhase[], vertrag_id: number, fixed: TVertragsPhase[] = []) => {
    if (!mounted) return;
    const msg: string[] = [];
    if (fixed.length > 0) {
      fixed.forEach((phase) => {
        msg.push(`Vertragsarbeitszeit ${phase?.id} angepasst zu ${phase?.von} - ${phase?.bis}`);
      });
    } else {
      const first = phasen?.[0];
      [first?.updatedBeforePhase, first?.updatedAfterPhase].forEach((phase) => {
        if (phase) {
          msg.push(`Vertragsarbeitszeit ${phase?.id} angepasst zu ${phase?.von} - ${phase?.bis}`);
        }
      });
    }

    if (msg.length > 0) {
      setMessageFromApi({
        status: 'info',
        info: msg
      });
    }
    setVertrags((curV) =>
      curV.map((v) => {
        if (v.id === vertrag_id) {
          v.vertrags_phases = phasen;
        }
        return v;
      })
    );
    hide();
  };

  const changeArbeitszeitenInVertrag = (
    arbeitszeiten: TVertragsArbeitszeit[],
    vertrag_id: number,
    fixed: TVertragsArbeitszeit[] = []
  ) => {
    if (!mounted) return;
    const msg: string[] = [];
    if (fixed.length > 0) {
      fixed.forEach((arbeitszeit) => {
        msg.push(`Vertragsarbeitszeit ${arbeitszeit?.id} angepasst zu ${arbeitszeit?.von} - ${arbeitszeit?.bis}`);
      });
    } else {
      const first = arbeitszeiten?.[0];
      [first?.updatedBeforeArbeitszeit, first?.updatedAfterArbeitszeit].forEach((arbeitszeit) => {
        if (arbeitszeit) {
          msg.push(`Vertragsarbeitszeit ${arbeitszeit?.id} angepasst zu ${arbeitszeit?.von} - ${arbeitszeit?.bis}`);
        }
      });
    }
    if (msg.length > 0) {
      setMessageFromApi({
        status: 'info',
        info: msg
      });
    }
    setVertrags((curV) =>
      curV.map((v) => {
        if (v.id === vertrag_id) {
          v.vertrags_arbeitszeits = arbeitszeiten;
        }
        return v;
      })
    );
    hide();
  };

  const update = (formData: FormData, route: string, callback: (data: any) => void) => {
    const entries = [...formData.entries()];
    const params: object = { ...Object.fromEntries(entries), mitarbeiter_id };
    hainsOAuth.api(route, 'post', params).then(callback, returnError);
  };

  const updateVertrag = (formData: FormData) => {
    update(formData, 'vertragsupdate', (vertraege: TVertrag[]) => {
      mounted &&
        setVertrags((curV) => {
          const filtered = curV.filter((cv) => !vertraege.find((v) => v.id === cv.id));
          return [...filtered, ...vertraege];
        });
      hide();
    });
  };

  const updatePhase = (formData: FormData) => {
    const vertrag_id = formConfig?.vertrag.id || 0;
    update(formData, 'phasenupdate', (phasen: TVertragsPhase[]) => {
      changePhasenInVertrag(phasen, vertrag_id);
    });
  };

  const updateArbeitszeit = (formData: FormData) => {
    const vertrag_id = formConfig?.vertrag.id || 0;
    update(formData, 'vertrag_arbeitszeitupdate', (arbeitszeiten: TVertragsArbeitszeit[]) => {
      changeArbeitszeitenInVertrag(arbeitszeiten, vertrag_id);
    });
  };

  const deleteArbeitszeit = (arbeitszeitId: number) => {
    hainsOAuth
      .api('db_delete', 'post', {
        id: arbeitszeitId,
        routeBase: 'vertrag_arbeitszeit'
      })
      .then(
        (res: {
          info: string;
          data: TVertragsArbeitszeit[];
          destroyed?: boolean;
          vertrag_id: number;
          fixed: TVertragsArbeitszeit[];
        }) => {
          if (!mounted) return;
          if (res.destroyed) {
            changeArbeitszeitenInVertrag(res.data, res.vertrag_id, res.fixed);
          } else alert(res.info);
        },
        returnError
      );
  };

  const deletePhase = (phaseId: number) => {
    hainsOAuth
      .api('db_delete', 'post', {
        id: phaseId,
        routeBase: 'phase'
      })
      .then(
        (res: {
          info: string;
          data: TVertragsPhase[];
          destroyed?: boolean;
          vertrag_id: number;
          fixed: TVertragsPhase[];
        }) => {
          if (!mounted) return;
          if (res.destroyed) {
            console.log(res);
            changePhasenInVertrag(res.data, res.vertrag_id, res.fixed);
          } else alert(res.info);
        },
        returnError
      );
  };

  const deleteVertrag = (vertragId: number) => {
    hainsOAuth
      .api('db_delete', 'post', { id: vertragId, routeBase: 'vertrag' })
      .then((res: { destroyed?: boolean; info: string }) => {
        if (!mounted) return;
        if (res.destroyed) {
          setVertrags((cur) => cur.filter((v) => v.id !== vertragId));
        } else {
          alert(res.info);
        }
      }, returnError);
  };

  const fetchVertragsDaten = () => {
    hainsOAuth.api('getVertrags', 'get', { id: mitarbeiter_id }).then((_data: any) => {
      mounted && setVertrags(_data.vertrags as TVertrag[]);
    }, returnError);
  };

  useEffect(() => {
    fetchVertragsDaten();
  }, []);

  const providerValue = useMemo(
    () => ({
      vertrags,
      show,
      hide,
      showPopup,
      formConfig,
      rentenEintrittDe,
      vertragsTyp,
      updateVertrag,
      updatePhase,
      updateArbeitszeit,
      dienste,
      zeitraumkategorie,
      deleteArbeitszeit,
      deletePhase,
      deleteVertrag,
      mitarbeiter_id
    }),
    [vertrags, vertragsTyp, dienste, zeitraumkategorie, showPopup, formConfig, rentenEintrittDe, mitarbeiter_id]
  );

  return <VertragContext.Provider value={providerValue}>{children}</VertragContext.Provider>;
}

export { VertragProvider, VertragContext };
