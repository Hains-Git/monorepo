import React from 'react';

import MitarbeiterInfo from './MitarbeiterInfo';
import { DataProvider } from '../context/mitarbeiterinfo/DataProvider';
import { OAuthProvider } from '../context/OAuthProvider';
import User from '../../src/models/user';

type TProps = {
  hainsOAuth: any;
  user: User;
};

function Page({ hainsOAuth, user }: TProps) {
  return (
    <OAuthProvider hainsOAuth={hainsOAuth} user={user}>
      {user && (
        <DataProvider>
          <MitarbeiterInfo />
        </DataProvider>
      )}
    </OAuthProvider>
  );
}
export default Page;
