import React from 'react';
import { User } from '../helper/ts_types';
import { OAuthProvider } from '../context/OAuthProvider';

import styles from './app.module.css';

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  return (
    <div>
      <OAuthProvider hainsOAuth={hainsOAuth} user={user}>
        {user ? (
          <p>Dies ist eine Standard Joomla Komponente</p>
        ) : (
          <p>Bitte einloggen!</p>
        )}
      </OAuthProvider>
    </div>
  );
}

export default App;
