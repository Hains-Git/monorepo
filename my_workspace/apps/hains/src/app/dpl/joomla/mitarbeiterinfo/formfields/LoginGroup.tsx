import React, { useState } from 'react';

import styles from '../app.module.css';
import Input from '../../components/mitarbeiterinfo/form/Input';
import PlannameField from './PlannameField';
import Select from '../../components/mitarbeiterinfo/form/Select';

type TProps = {
  mitarbeiterInfos: any;
  hainsGroups: any;
  accountInfo: any;
  mitarbeiters: any;
};

function LoginGroup({ mitarbeiterInfos, hainsGroups, accountInfo, mitarbeiters }: TProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [titleInfo, setTitleInfo] = useState('');
  const vorname = accountInfo?.vorname || '';
  const nachname = accountInfo?.nachname || '';
  const nameKurz = accountInfo?.nameKurz || '';
  const email = accountInfo?.user?.email || '';
  const admin = accountInfo?.user?.admin || '';
  const login = accountInfo?.user?.login || '';
  const platzhalter = accountInfo?.mitarbeiter?.platzhalter || '';
  const gruppes = accountInfo?.user?.gruppes || [];

  const checkGroup = (id: number) => {
    const checked = gruppes.some((_group: typeof gruppes) => _group.id === id);
    return checked;
  };

  const selectAdmin = [
    { value: false, text: 'Nein' },
    { value: true, text: 'Ja' }
  ];

  const selectPlatzhalter = [
    { value: false, text: 'Nein' },
    { value: true, text: 'Ja' }
  ];

  return (
    <div className={`${styles.group}`}>
      <h4>Login</h4>
      <PlannameField
        mitarbeiterInfos={mitarbeiterInfos}
        vorname={vorname}
        nachname={nachname}
        nameKurz={nameKurz}
        accountInfo={accountInfo}
        mitarbeiters={mitarbeiters}
        setMessages={setMessages}
        setTitleInfo={setTitleInfo}
      />
      <fieldset className={styles.columns}>
        {accountInfo && (
          <Input
            preName="user"
            label="Login"
            value={login}
            title="Login-Name, typischerweise Nachname und Vorname zusammen und kleingeschrieben. Z.B. muellerhans für Hans Mueller"
            required
          />
        )}
        <Input
          preName="user"
          type="email"
          value={email}
          label="Email"
          title="Mitarbeiter Email, erhält eine Willkommensnachricht."
          required
        />
        <Select
          preName="user"
          label="Admin"
          data={selectAdmin}
          keyExtractor="value"
          optionText="text"
          title="Ist Mitarbeiter Administrator?"
          value={admin}
        />
        <Select
          preName="user"
          label="Platzhalter"
          data={selectPlatzhalter}
          keyExtractor="value"
          optionText="text"
          title="Ist Mitarbeiter nur ein Platzhalter?"
          value={platzhalter}
        />
      </fieldset>
      <fieldset title={titleInfo} className={styles.message}>
        {messages.length > 0 && <div>{messages && messages.map((msg) => <p key={msg}>{msg}</p>)}</div>}
      </fieldset>
      <fieldset className={styles.user_groups}>
        {hainsGroups.map((group: typeof hainsGroups) => {
          return (
            <Input
              key={group.id}
              name={`user_groups[${group?.id}]`}
              value={group.id}
              preName="user"
              label={group.name}
              type="checkbox"
              showHidden={false}
              isChecked={checkGroup(group?.id)}
            />
          );
        })}
      </fieldset>
    </div>
  );
}
export default LoginGroup;
