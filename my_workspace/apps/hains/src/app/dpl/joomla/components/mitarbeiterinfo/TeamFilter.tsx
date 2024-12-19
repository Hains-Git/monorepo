import React, { useState, useEffect, useRef, useContext } from 'react';
import Select from './form/Select';
import Input from './form/Input';

import { TTeam } from '../utils/table/types/teams';
import { TData } from '../../mitarbeiterinfo/types';

import { UseMounted } from '../../hooks/use-mounted';
import { AccountInfo } from '../utils/table/types/accountinfo';

import { OAuthContext } from '../../context/OAuthProvider';

type TProps = {
  teams: TTeam[];
  setMitarbeiterInfos: (data: AccountInfo[]) => void;
  initialData: TData['mitarbeiter_infos'];
};

const today = new Date().toLocaleDateString('en-Ca');
let prevDate = today;

export default function TeamFilter({
  teams,
  initialData,
  setMitarbeiterInfos
}: TProps) {
  const [date, setDate] = useState(today);
  const [teamId, setTeamId] = useState('');

  const teamsData = [{ id: '', name: 'Alle Teams' }, ...teams];

  const mounted = UseMounted();
  const isInitialMount = useRef(true);
  const { hainsOAuth, returnError } = useContext(OAuthContext);

  const filterByTeams = (data: any) => {
    if (!data.mitarbeiter && !data.mitarbeiter_ids.length) {
      setMitarbeiterInfos(Object.values(initialData));
      return;
    }
    if (!data.mitarbeiter_ids.length && data.mitarbeiter) {
      const changed = Object.values(initialData).map((accInfo) => {
        const newVkGruppe = data.mitarbeiter?.[accInfo?.mitarbeiter_id];
        if (newVkGruppe) {
          accInfo.mitarbeiter.vk_and_vgruppe_am = newVkGruppe;
        }
        return accInfo;
      });
      setMitarbeiterInfos(changed);
      return;
    }
    const filtered = Object.values(initialData).filter((accInfo) => {
      const newVkGruppe = data.mitarbeiter?.[accInfo?.mitarbeiter_id];
      if (data.mitarbeiter) {
        if (newVkGruppe) {
          accInfo.mitarbeiter.vk_and_vgruppe_am = newVkGruppe;
        }
      }
      return data.mitarbeiter_ids.includes(accInfo.mitarbeiter_id);
    });
    setMitarbeiterInfos(filtered);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    const params = {
      team_id: teamId,
      date,
      update_infos: String(!(date === prevDate))
    };

    prevDate = date;

    hainsOAuth
      .api('get_employee_ids_by_teamid', 'post', params)
      .then((_data: any) => {
        if (typeof _data === 'object' && mounted) {
          filterByTeams(_data);
        }
      }, returnError);
  }, [date, teamId]);

  const onChangeTeam = (val: string) => {
    isInitialMount.current = false;
    setTeamId(val);
  };

  const onChangeDate = (label: string, val: string) => {
    isInitialMount.current = false;
    setDate(val);
  };

  return (
    <>
      <Input label="" callback={onChangeDate} value={date} type="date" />
      <Select
        data={teamsData}
        callback={onChangeTeam}
        keyExtractor="id"
        optionText="name"
        label=""
      />
    </>
  );
}
