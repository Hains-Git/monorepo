import React, { useCallback, useEffect } from 'react';
import { User } from '../helper/ts_types';
import { returnError } from '../helper/hains';
import {
  Context,
  defaultMailerContext,
  MailerAddresse,
  MailerContext,
  MailerData
} from '../helper/mailer_context_types';
import EditAddresse from './EditAddresse';
import EditContext from './EditContext';

import styles from './app.module.css';
import { OAuthProvider } from '../context/OAuthProvider';
import { deepClone } from '../helper/util';

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const [tool, setTool] = React.useState<number>(-1);
  const [contexts, setContexts] = React.useState<Context[]>([]);
  const [mailerContexts, setMailerContexts] = React.useState<MailerContext[]>(
    []
  );
  const [mailerAddresses, setMailerAddresses] = React.useState<
    MailerAddresse[]
  >([]);

  const setData = useCallback(
    (data: MailerData) => {
      setContexts(() => (Array.isArray(data?.contexte) ? data.contexte : []));
      const defaultMailerContexts: MailerContext[] = Array.isArray(
        data?.contexte
      )
        ? data.contexte.map((c) => ({
            ...deepClone(defaultMailerContext),
            context: c.context
          }))
        : [];
      const _mailerContexts = Array.isArray(data?.mailer_contexts)
        ? data.mailer_contexts
        : [];
      setMailerContexts(() => [..._mailerContexts, ...defaultMailerContexts]);
      setMailerAddresses(() =>
        Array.isArray(data?.mailer_addresses) ? data.mailer_addresses : []
      );
      if (data.reason) {
        alert(data.reason);
      }
    },
    [setContexts, setMailerContexts, setMailerAddresses]
  );

  useEffect(() => {
    if (user?.is_admin && hainsOAuth) {
      setTool(() => -1);
      hainsOAuth
        .api('get_list_mailer_context', 'get')
        .then(setData, returnError);
    }
    return () => {
      setTool(() => -1);
      setContexts(() => []);
      setMailerContexts(() => []);
      setMailerAddresses(() => []);
    };
  }, [user, hainsOAuth]);

  const mal = !!mailerAddresses.length;
  return (
    <div>
      <OAuthProvider hainsOAuth={hainsOAuth} user={user}>
        {user?.is_admin ? (
          <div className={styles.db_mail}>
            <h1>Willkommen in DB Mail</h1>
            <label>
              Bearbeite:
              <select
                onChange={(evt) =>
                  setTool(() => parseInt(evt.target.value, 10))
                }
              >
                <option value="-1">Mail Adressen</option>
                {mal &&
                  contexts.map((c, index) => (
                    <option key={index} value={index}>
                      &quot;{c.context}&quot;
                    </option>
                  ))}
              </select>
            </label>
            {tool < 0 ? (
              <EditAddresse
                key={tool}
                mailerAddresses={mailerAddresses}
                setData={setData}
              />
            ) : (
              <EditContext
                key={tool}
                id={tool}
                contexts={contexts}
                mailerContexts={mailerContexts}
                mailerAddresses={mailerAddresses}
                setData={setData}
              />
            )}
          </div>
        ) : (
          <p>Bitte einloggen!</p>
        )}
      </OAuthProvider>
    </div>
  );
}

export default App;
