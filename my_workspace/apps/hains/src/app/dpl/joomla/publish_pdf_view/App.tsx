import React, { useEffect, useState } from 'react';
import { User } from '../helper/ts_types';

import styles from './app.module.css';
import { returnError } from '../helper/hains';
import DateInput, { GetData } from '../components/utils/date-input/DateInput';
import { today } from '../helper/dates';
import { development } from '../helper/flags';

type Option = {
  id: string;
  label: string;
  ansicht_name: string;
};

const defaultOption = {
  id: '0',
  label: '',
  ansicht_name: ''
};

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const [date, setDate] = useState<string>(today());
  const [options, setOptions] = useState<Option[][]>([[defaultOption]]);

  const getLink = (chosen: Option) => {
    const [path, id, ansicht_id] = chosen.id.split('-');
    if (!['monatsplan_pdf', 'verteiler_pdf'].includes(path)) return '';
    if (!(user?.is_admin && hainsOAuth?.getAuthResponse)) return '';
    const token: string =
      hainsOAuth.getAuthResponse()?.access_token?.toString?.() || '';
    if (!token) return '';
    const host = development ? 'http://localhost' : window.location.origin;
    const base = `${host}/api/dienstplaner/`;
    const end = `.pdf?access_token=${token}`;
    const pdfPath =
      path === 'monatsplan_pdf'
        ? `${base}monatsplan_pdf/${id}/${ansicht_id}/${date}${end}`
        : `${base}verteiler_pdf/${id}/${date}${end}`;
    return pdfPath;
  };

  useEffect(() => {
    if (!(user?.is_admin && hainsOAuth?.api)) return;
    hainsOAuth.api('list_pdf_layouts', 'get').then((data: any) => {
      if (!Array.isArray(data)) return;
      const newOptions: Option[][] = [[]];
      let last: Option = defaultOption;
      data.forEach((d) => {
        const id = d?.id?.toString?.() || '';
        const ansicht_name = d?.ansicht_name?.toString?.() || '';
        const label = d?.label?.toString?.() || '';
        if (!id || !ansicht_name) return;
        if (last.ansicht_name !== d?.ansicht_name) {
          newOptions.push([]);
        }
        last = {
          id,
          ansicht_name,
          label
        };
        newOptions[newOptions.length - 1].push(last);
      });
      setOptions(() => newOptions);
    }, returnError);
  }, [hainsOAuth, user]);

  const getData: GetData = (dates, finishLoading) => {
    setDate(() => dates.von);
    finishLoading();
  };

  return (
    <div>
      {user?.is_admin ? (
        <div>
          <DateInput getData={getData} withButton={false} />
          <div className={styles.container}>
            {options.map(
              (ogroup, i) =>
                ogroup[0] && (
                  <div key={`group-${i}`}>
                    <h3>{ogroup[0].ansicht_name}</h3>
                    {ogroup.map((o) => (
                      <a
                        key={o.id}
                        href={getLink(o)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {o.label}
                      </a>
                    ))}
                  </div>
                )
            )}
          </div>
        </div>
      ) : (
        <p>Bitte einloggen!</p>
      )}
    </div>
  );
}

export default App;
