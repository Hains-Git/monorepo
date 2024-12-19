import { useEffect, useState } from 'react';
import hello from 'hellojs/dist/hello.all';
import { useHistory } from 'react-router-dom';
import { hains } from '../tools/hains';
import User from '../models/user';
import { apiAppData, apiMe, hainsOAuth } from '../tools/helper';
import initAppModel from '../models/app.model';
import { AppModellGetter } from './app-modell-getter';
import { UseMounted } from './use-mounted';
import { development, showConsole } from '../tools/flags';
import appChannel from '../channels/app_channel';
import { UseChannel } from './use-channel';
import withAppModelData from '../pages/WithAppModelData';

/**
 * Mit diesem Hook wird die App initialisiert.
 * Hierbei wird sowohl das Login, als auch die Initialisierung des appModel (Singleton)
 * durchgeführt.
 * @returns user, history, loginOnClick, logoutOnClik, appModel
 */
export const UseApp = () => {
  const [user, setUser] = useState(false);
  const [appModel, setAppModel] = useState(false);
  const [lastSession, setLastSession] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  UseChannel(user, appModel, appChannel, appModel, 'app');
  const mounted = UseMounted();
  const history = useHistory();
  // Initialisiert die Oauth-Verbindung über hello.js
  const initOauth = (app) => {
    hains();
    hello.on('auth.login', () => {
      if (mounted) {
        // Ruft den Benutzer der OAuth-Verbindung auf
        apiMe({}, (profile) => {
          if (mounted) {
            setUser(() => new User(profile, app));
            // sessionStorage.setItem("user", JSON.stringify(profile));
          }
        });
      }
    });

    hello.on('auth.logout', () => {
      if (mounted) {
        setUser(() => false);
        // sessionStorage.removeItem("user");
        history.push('/');
      }
    });
  };

  // Ermöglicht login
  const loginOnClick = (evt) => {
    evt.stopPropagation();
    hainsOAuth.login();
  };

  // Ermöglicht logout
  const logoutOnClick = (evt) => {
    evt.stopPropagation();
    hainsOAuth.logout();
  };

  const getAppData = () => {
    if (user?.getAppData && appModel && mounted && !isLoadingData) {
      setIsLoadingData(() => true);
      apiAppData({}, (response) => {
        if (user?.getAppData && appModel && mounted) {
          if (showConsole) console.log('app data', response);
          if (development) setLastSession(() => ({ data: response, user }));
          user?.initMonatsplanungSettings?.(response?.monatsplanung_settings);
          appModel.init({ data: response });
          setDataLoaded(() => !!appModel?.data);
        }
      });
    }
  };

  // Oauth zu HAINS beim Mounten der App initialisieren
  useEffect(() => {
    if (development && lastSession) return;
    const app = initAppModel();
    AppModellGetter(initAppModel);
    setAppModel(() => app);
    initOauth(app);
    return () => {
      if (development) return false;
      setUser(() => false);
      setAppModel(() => false);
    };
  }, []);

  // Bei Wechsel der Benutzerin wird appModel zurückgesetzt
  useEffect(() => {
    appModel?.mount?.(user);
    if (development && lastSession) return;
    // Singleton reseten
    return () => {
      user?.unsubscribeAll?.();
      setDataLoaded(() => false);
      setIsLoadingData(() => false);
      appModel?.unmount?.();
      if (development) return;
      appModel?.reset?.(true);
    };
  }, [user, appModel]);

  return [
    user,
    history,
    loginOnClick,
    logoutOnClick,
    appModel,
    withAppModelData({
      isLoadingData,
      getAppData,
      user,
      appModel: dataLoaded && appModel
    })
  ];
};
