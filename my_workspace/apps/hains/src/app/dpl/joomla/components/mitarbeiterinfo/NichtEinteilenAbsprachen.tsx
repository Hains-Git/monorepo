import React, { useContext } from 'react';
import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import Absprachen from './Absprachen';
import styles from '../../mitarbeiterinfo/app.module.css';
import { TNichtEinteilenAbsprache } from '../../helper/api_data_types';
import { HeadRow } from '../utils/table/types/table';

const headRow: HeadRow = {
  columns: [
    {
      title: 'Standorte und Themen',
      dataKey: 'nicht_einteilen_standort_themens',
      bodyRender: (absprache) => {
        const nichteinteilenabsprache = absprache as TNichtEinteilenAbsprache;
        const standorteThemen =
          nichteinteilenabsprache.nicht_einteilen_standort_themens.reduce(
            (
              acc: {
                [standort: string]: {
                  id: number;
                  standort: string;
                  themen: string[];
                };
              },
              nest
            ) => {
              if (!acc[nest.standort.id]) {
                acc[nest.standort.id] = {
                  id: nest.standort.id,
                  standort: nest.standort.name,
                  themen: [nest.thema.name]
                };
              } else {
                acc[nest.standort.id].themen.push(nest.thema.name);
              }
              return acc;
            },
            {}
          );
        return (
          <div className={styles.standorte_themen}>
            {' '}
            {Object.values(standorteThemen).map((obj) => (
              <div key={obj.id}>
                <p>
                  {obj.standort} ({obj.themen.join(', ')})
                </p>
              </div>
            ))}
          </div>
        );
      }
    },
    { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
    { title: 'Von', dataKey: 'von' },
    { title: 'Bis', dataKey: 'bis' }
  ]
};

function NichtEinteilenAbsprachen() {
  const { nicht_einteilen_absprachen } = useContext(ApiContext);

  return (
    <Absprachen
      absprachen={nicht_einteilen_absprachen}
      label="Nicht einteilen Absprachen"
      type="nichteinteilenabsprachen"
      headRow={headRow}
    />
  );
}

export default NichtEinteilenAbsprachen;
