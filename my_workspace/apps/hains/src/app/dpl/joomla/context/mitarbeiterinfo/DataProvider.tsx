import React, {
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext
} from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { OAuthContext } from '../OAuthProvider';
import { UseMounted } from '../../hooks/use-mounted';
import { TableData } from '../../components/utils/table/types/table';
import { TData, TApiResult } from '../../mitarbeiterinfo/types';
import { AccountInfo } from '../../components/utils/table/types/accountinfo';
import { deepClone } from '../../helper/util';

type TProps = {
  children: React.ReactNode;
};

type TContext = {
  data: TData;
  mitarbeiterInfos: any;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  setMitarbeiterInfos: React.Dispatch<React.SetStateAction<TableData[]>>;
  updateData: (data: any) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  showSpinner: boolean;
  messageFromApi: TApiResult | undefined;
  setMessageFromApi: React.Dispatch<
    React.SetStateAction<TApiResult | undefined>
  >;
  accountInfo: AccountInfo | undefined;
  errorMsg: string;
  config: { view: string; id: number | undefined };
  changeView: (config: { view: string; id: number | undefined }) => void;
  changeActivity: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    showSpinner: any
  ) => void;
  passwordReset: (showSpinner: any) => void;
  welcomeNewUser: (showSpinner: any) => void;
  queryMerkmale: (mId: number) => any;
  user: any;
};

const defaultData: TData = {
  all_mitarbeiters: [],
  hains_groups: [],
  vertrags_typ: [],
  mitarbeiters: [],
  datei_typs: [],
  mitarbeiterInfosArr: [],
  mitarbeiter_infos: {},
  mailer_contexts_deactivate: [],
  mailer_contexts_reactivate: [],
  funktionen: [],
  teams: [],
  dienste: [],
  zeitraumkategorie: [],
  standorte: [],
  themen: []
};

const DataContext = createContext<TContext>({
  data: defaultData,
  mitarbeiterInfos: [],
  setData: () => {},
  setMitarbeiterInfos: () => {},
  updateData: () => {},
  handleSubmit: () => {},
  showSpinner: false,
  messageFromApi: undefined,
  setMessageFromApi: () => {},
  accountInfo: undefined,
  errorMsg: '',
  config: { view: 'table', id: undefined },
  changeView: () => {},
  changeActivity: () => {},
  passwordReset: () => {},
  welcomeNewUser: () => {},
  queryMerkmale: () => {},
  user: {}
});

function DataProvider({ children }: TProps) {
  const [data, setData] = useState<TData>(deepClone(defaultData));
  const [mitarbeiterInfos, setMitarbeiterInfos] = useState<TableData[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [messageFromApi, setMessageFromApi] = useState<TApiResult>();
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [errorMsg, setErrorMsg] = useState('');
  const [config, setConfig] = useState<{
    view: string;
    id: undefined | number;
  }>({ view: 'table', id: undefined });

  const { hainsOAuth, returnError, user } = useContext(OAuthContext);
  const mounted = UseMounted();
  const history = useHistory();
  const location = useLocation();

  const updateData = (_data: any) => {
    // console.log('--Data', _data);
    const arr: AccountInfo[] = Object.values(
      _data.mitarbeiter_infos
    ) as AccountInfo[];
    const mitarbeiterInfosArr: TableData[] = arr.filter(
      (m) => m.mitarbeiter.aktiv
    );
    setData({ ..._data, mitarbeiterInfosArr });
    setMitarbeiterInfos(mitarbeiterInfosArr);
  };

  const updateDataByResponse = (res: any) => {
    if (!res?.data) return;
    const updatedAccountInfo = res.data;
    const id = updatedAccountInfo.id;
    const updatedMitarbeiterInfos = {
      ...data?.mitarbeiter_infos,
      [id]: updatedAccountInfo
    };
    const newData = { ...data, mitarbeiter_infos: updatedMitarbeiterInfos };
    updateData(newData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowSpinner(true);
    const _form: HTMLFormElement = event.currentTarget;
    const formData = new FormData(_form);

    for (const pair of [...formData.entries()]) {
      if (pair[0].includes('datei_typ_id')) {
        const file: File = pair[1] as File;
        if (file.name) {
          formData.set(pair?.[0], file, file.name);
        } else {
          formData.delete(pair[0]);
        }
      }
    }

    hainsOAuth.api('create_new_user', 'post', formData).then(
      (res: any) => {
        updateDataByResponse(res);
        setMessageFromApi(res);
        setShowSpinner(false);
      },
      (err: any) => {
        returnError(err);
        setShowSpinner(false);
      }
    );
  };

  const getAccountInfo = (mId: number | undefined) => {
    return !mId
      ? undefined
      : Object.values(data.mitarbeiter_infos).find(
          (acc) => acc.mitarbeiter_id === Number(mId)
        );
  };

  const setUrlParams = (obj: { view: string; id: number | undefined }) => {
    const currentParams = new URLSearchParams(location.search);
    const sameView = currentParams.get('view') === obj.view;
    const sameId = currentParams.get('id') === String(obj.id);
    if (sameView && sameId) {
      return;
    }

    history.push(
      `${history.location.pathname}?view=${obj.view}${
        obj?.id !== undefined ? `&id=${obj.id}` : ''
      }`
    );
  };

  const changeView = (obj: { view: string; id: number | undefined }) => {
    const accInfo = getAccountInfo(obj.id);
    setAccountInfo(accInfo);
    setConfig({ view: obj.view, id: obj.id });
    setUrlParams(obj);
  };

  const changeMitarbeiterActivity = (
    url: string,
    params: any,
    showSpinner: any
  ) => {
    hainsOAuth.api(url, 'post', params).then(
      (res: any) => {
        if (res.status === 'error') {
          setMessageFromApi(res);
          showSpinner(false);
          return;
        }
        updateDataByResponse(res);
        setMessageFromApi(res);
        showSpinner(false);
        changeView({ view: 'table', id: undefined });
      },
      (err: any) => {
        returnError(err);
        setShowSpinner(false);
      }
    );
  };

  const getMailerMsg = (deaktivieren: boolean) => {
    const mailer = deaktivieren
      ? data?.mailer_contexts_deactivate
      : data?.mailer_contexts_reactivate;
    const msg = `Welche Mails sollen gesendet werden? (Bsp. 1,2)
    0: Keine Mails senden
    ${
      mailer?.length
        ? mailer.map((mc) => {
            return `${mc.id}: Mail "${mc.subject}"${mc.to.length ? ` an ${mc.to.map((to) => to.name).join('\n')}` : ''}`;
          })
        : ''
    }`;
    return msg;
  };

  const changeActivity = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
    showSpinner: any
  ) => {
    if (!accountInfo) return;
    const mitarbeiterAktiv = accountInfo?.mitarbeiter?.aktiv;
    const msg = `Mitarbeiter ${mitarbeiterAktiv ? 'deaktivieren' : 'aktivieren'}`;
    const ok = window.prompt(`${msg}\n${getMailerMsg(mitarbeiterAktiv)}`);
    const ids = (ok?.toString() || '').split(',').map((id) => Number(id) || 0);
    if (!ok) {
      showSpinner(false);
      return;
    }
    const params = {
      mitarbeiter_id: accountInfo.mitarbeiter_id,
      account_info_id: accountInfo.id,
      mailer_context_ids: ids
    };
    if (mitarbeiterAktiv) {
      changeMitarbeiterActivity('set_employee_inactive', params, showSpinner);
    } else {
      changeMitarbeiterActivity('set_employee_active', params, showSpinner);
    }
  };

  const welcomeNewUser = (showSpinner: any) => {
    const params = { user_id: accountInfo?.user.id };
    hainsOAuth.api('welcome_new_user', 'post', params).then(
      (res: any) => {
        showSpinner(false);
        setMessageFromApi(res);
      },
      (err: any) => {
        showSpinner(false);
        console.log('welcomeNewUser', err);
      }
    );
  };

  const passwordReset = (showSpinner: any) => {
    const params = { user_id: accountInfo?.user.id };
    hainsOAuth.api('password_reset', 'post', params).then(
      (res: any) => {
        showSpinner(false);
        setMessageFromApi(res);
      },
      (err: any) => {
        showSpinner(false);
        console.log('passwordReset', err);
      }
    );
  };

  const queryMerkmale = async (mId: number) => {
    let data = null;
    try {
      data = await hainsOAuth.api('get_merkmale', 'get', { id: mId });
    } catch (err) {
      console.error('Something went wrong', err);
      returnError();
    }
    return data;
  };

  useEffect(() => {
    if (!data) return;
    setErrorMsg('');
    const queryParams = new URLSearchParams(location.search);
    const pView = queryParams.get('view');
    if (pView !== 'edit' && pView !== 'detail' && pView !== 'vertrag') {
      setConfig({ view: 'table', id: undefined });
      setAccountInfo(undefined);
      return;
    }
    const mId = queryParams.get('id');
    const regex = /^[0-9]*$/;

    if (mId === null || mId === undefined || !regex.test(mId)) {
      return;
    }

    changeView({ view: pView, id: Number(mId) });
  }, [data, location]);

  useEffect(() => {
    hainsOAuth.api('get_all_user_data', 'get').then((_data: any) => {
      if (typeof _data === 'object' && mounted) {
        updateData(_data);
      }
    }, returnError);
  }, []);

  const providerValue = useMemo<TContext>(
    () => ({
      data,
      mitarbeiterInfos,
      setData,
      setMitarbeiterInfos,
      updateData,
      handleSubmit,
      showSpinner,
      messageFromApi,
      setMessageFromApi,
      accountInfo,
      errorMsg,
      config,
      changeView,
      changeActivity,
      passwordReset,
      welcomeNewUser,
      user,
      queryMerkmale
    }),
    [
      data,
      mitarbeiterInfos,
      showSpinner,
      messageFromApi,
      errorMsg,
      config,
      accountInfo,
      user
    ]
  );

  return (
    <DataContext.Provider value={providerValue}>
      {children}
    </DataContext.Provider>
  );
}

export { DataProvider, DataContext };
