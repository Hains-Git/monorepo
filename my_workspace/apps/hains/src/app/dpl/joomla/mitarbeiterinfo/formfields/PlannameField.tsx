import React, { useEffect, useState } from 'react';
import PlannameInput from '../../components/mitarbeiterinfo/form/PlannameInput';
import Input from '../../components/mitarbeiterinfo/form/Input';

import styles from '../app.module.css';
import { AccountInfo } from '../../components/utils/table/types/accountinfo';

type TMitarbeiter = {
  planname: string;
};

type TUser = {
  account_info_id: number | string;
  mitarbeiter_id: number | string;
  user_id?: number | string;
  planname: string;
};

type Props = {
  mitarbeiterInfos: AccountInfo[];
  vorname: string;
  nachname: string;
  nameKurz: string;
  accountInfo: AccountInfo;
  mitarbeiters: [];
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setTitleInfo: React.Dispatch<React.SetStateAction<string>>;
};

let count = 1;

function PlannameField({
  mitarbeiterInfos,
  vorname,
  nachname,
  nameKurz,
  mitarbeiters,
  setTitleInfo,
  setMessages,
  accountInfo
}: Props) {
  const [firstName, setFirstName] = useState(vorname);
  const [lastName, setLastName] = useState(nachname);
  const [planname, setPlanname] = useState(nameKurz);
  const account_info_id = accountInfo?.id || 0;
  const mitarbeiter_id = accountInfo?.mitarbeiter_id || 0;
  const user_id = accountInfo?.user?.id || 0;
  const [user, setUser] = useState<TUser>({
    planname,
    mitarbeiter_id,
    account_info_id,
    user_id
  });

  const callback = (label: string, val: string) => {
    // if (!accountInfo) {
    if (label === 'Vorname') setFirstName(val);
    if (label === 'Nachname') setLastName(val);
    // }
  };

  const getPlanname = () => {
    const lastname = lastName[0].toUpperCase() + lastName.slice(1);
    const firstname = firstName[0].toUpperCase() + firstName.slice(1);
    const plannameStr = `${lastname} ${firstname.substring(0, count)}`;
    return plannameStr;
  };

  const getMitarbeiter = (arr: any, _planname: string) => {
    const found = arr.find((mitarbeiter: TMitarbeiter) => {
      return mitarbeiter.planname.toLowerCase() === _planname.toLowerCase();
    });
    return found;
  };

  const isSameName = (name: string) => {
    const nameArr = name
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((item: string) => item);
    let same = false;
    if (
      nameArr[0] === firstName.toLowerCase() &&
      nameArr[1] === lastName.toLowerCase()
    ) {
      same = true;
    }
    return same;
  };

  const getMitarbeiterPlanname = (
    _planname: string
  ): [boolean, AccountInfo[]] => {
    let taken: AccountInfo[] = [];
    let connected = false;
    Object.values(mitarbeiterInfos).forEach((accInfo: AccountInfo) => {
      if (accInfo?.nameKurz?.includes(_planname)) {
        taken.push(accInfo);
        if (!accInfo?.user && isSameName(accInfo?.mitarbeiter?.name)) {
          connected = true;
          taken = [accInfo];
        }
      }
    });
    return [connected, taken];
  };

  const setConnected = (taken: AccountInfo) => {
    const message = `Mitarbeiter (${taken?.mitarbeiter?.name || ''}) mit dem Plannamen (${taken?.nameKurz}) wurde gefunden und wird verknüpft.`;
    setMessages((_prevMsg) => [..._prevMsg, message]);
    const _user = {
      planname: taken?.nameKurz,
      mitarbeiter_id: taken?.mitarbeiter_id,
      account_info_id: taken?.id
    };
    setPlanname(taken?.nameKurz);
    setUser(_user);
  };

  const setTitleForTakenMitarbeiters = (taken: AccountInfo[]) => {
    const titles: string[] = [];
    taken.forEach((item) => {
      const msg = `accId: ${item.id} planname: ${item.nameKurz} name: ${item?.mitarbeiter?.name} mitarbeiter_id: ${item.mitarbeiter_id}\n`;
      titles.push(msg);
    });
    setTitleInfo(titles.join(''));
  };

  const getAvaiblePlanname = (name = ''): string => {
    const _planname = name || getPlanname();
    const found = getMitarbeiter(mitarbeiters, _planname);
    if (found) {
      ++count;
      const message = `Planname (${found.planname}) schon vergeben durch Mitarbeiter ${found.name}.`;
      setMessages((_prevMsg) => [..._prevMsg, message]);
      return getAvaiblePlanname();
    }
    const message = `Planname (${_planname}) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.`;
    setMessages((_prevMsg) => [..._prevMsg, message]);

    return _planname;
  };

  const setAvaiblePlanname = (_planname: string) => {
    const newPlanname = getAvaiblePlanname(_planname);
    setPlanname(newPlanname);
  };

  const setNewMitarbeiter = (_planname: string) => {
    setMessages([]);
    setPlanname(_planname);
    const message = `Planname (${_planname}) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.`;
    setMessages((_prevMsg) => [..._prevMsg, message]);
  };

  const checkPlanname = (_planname: string = '') => {
    setMessages([]);
    setTitleInfo('');
    count = 1;
    const newPlanname = _planname || getPlanname();
    const [connected, taken] = getMitarbeiterPlanname(newPlanname);
    if (connected) {
      setConnected(taken[0]);
    } else if (!connected && taken?.length > 0) {
      setTitleForTakenMitarbeiters(taken);
      setAvaiblePlanname(newPlanname);
      setUser({ planname, mitarbeiter_id, account_info_id });
    } else {
      setNewMitarbeiter(newPlanname);
      setUser({ planname, mitarbeiter_id, account_info_id });
    }
  };

  const onBlur = () => {
    if (!firstName || !lastName) {
      return;
    }
    checkPlanname();
  };

  const callbackPlanname = (val: string) => {
    if (!val) return;
    checkPlanname(val);
  };

  return (
    <fieldset className={styles.columns}>
      <Input
        onBlur={onBlur}
        callback={callback}
        label="Vorname"
        aria-label="vorname"
        value={vorname}
        preName="user"
        title="Mitarbeiter Vorname"
        required
      />
      <Input
        onBlur={onBlur}
        callback={callback}
        label="Nachname"
        aria-label="nachname"
        value={nachname}
        preName="user"
        title="Mitarbeiter Nachname"
        required
      />
      <PlannameInput
        preName="user"
        callback={callbackPlanname}
        title="Mitarbeiter Planname, wird automatisch generiert und kann über Schloss-Symbol geändert werden."
        nameKurz={planname}
      />
      <input
        type="hidden"
        defaultValue={user?.mitarbeiter_id}
        name="user[mitarbeiter_id]"
      />
      <input
        type="hidden"
        defaultValue={user?.account_info_id}
        name="user[account_info_id]"
      />
      <input type="hidden" defaultValue={user?.user_id} name="user[user_id]" />
    </fieldset>
  );
}
export default PlannameField;
