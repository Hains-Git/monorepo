import React, { createContext, useEffect, useState } from 'react';
import { returnError } from '../helper/hains';
import { User } from '../helper/ts_types';

type TAuth = {
  hainsOAuth: any;
  returnError: any;
  user: User;
};

export const OAuthContext = createContext<TAuth>({
  hainsOAuth: {},
  returnError: {},
  user: {}
});

interface Props {
  children: React.ReactNode;
  hainsOAuth: any;
  user: User;
}

export const OAuthProvider: React.FC<Props> = ({
  children,
  hainsOAuth,
  user
}) => {
  const [state, setState] = useState<TAuth>({ hainsOAuth, returnError, user });

  useEffect(() => {
    setState({ hainsOAuth, returnError, user });
  }, [user, hainsOAuth]);

  return (
    <OAuthContext.Provider value={state}>{children}</OAuthContext.Provider>
  );
};
