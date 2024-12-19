import React from 'react';
import { User } from '../helper/ts_types';
import Page from './Page';

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  return (
    <div>
      {user ? (
        <Page hainsOAuth={hainsOAuth} user={user} />
      ) : (
        <p>Bitte einloggen!</p>
      )}
    </div>
  );
}

export default App;
