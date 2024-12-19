import React, { useEffect, useState } from 'react';
import hello from 'hellojs/dist/hello.all';
import { hains, returnError } from '../helper/hains';
import { development } from '../helper/flags';
import { User } from '../helper/ts_types';

type LoginReturn = {
  user: User;
  hainsOAuth: any;
  loginOnClick: React.MouseEventHandler<HTMLButtonElement>;
  logoutOnClick: React.MouseEventHandler<HTMLButtonElement>;
};

const hainsOAuth = hello('hains');

/**
 * Mit diesem Hook wird die App initialisiert.
 * Hierbei wird das Login und Logout über Oauth zu HAINS initialisiert.
 * @returns {LoginReturn} - Die App-Initialisierung
 * @example
 * const { user, loginOnClick, logoutOnClick } = UseLogin();
 */
export const UseLogin = (): LoginReturn => {
  const [user, setUser] = useState(false);

  // Initialisiert die Oauth-Verbindung über hello.js
  const initOauth = () => {
    hains();
    hello.on('auth.login', () => {
      hainsOAuth.api('me').then((data: User) => {
        setUser(() => data);
      }, returnError);
    });

    hello.on('auth.logout', () => {
      setUser(() => false);
    });
  };

  // Ermöglicht login
  const loginOnClick: React.MouseEventHandler<HTMLButtonElement> = (evt?: any) => {
    evt?.stopPropagation?.();
    hainsOAuth.login();
  };

  // Ermöglicht logout
  const logoutOnClick: React.MouseEventHandler<HTMLButtonElement> = (evt?: any) => {
    evt?.stopPropagation?.();
    hainsOAuth.logout();
  };

  // Oauth zu HAINS beim Mounten der App initialisieren
  useEffect(() => {
    initOauth();
    if(!development) {
      hainsOAuth.login();
    }
    return () => {
      setUser(() => false);
    };
  }, []);

  return { hainsOAuth, user, loginOnClick, logoutOnClick };
};
