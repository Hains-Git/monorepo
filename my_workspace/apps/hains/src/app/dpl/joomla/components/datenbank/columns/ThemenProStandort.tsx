import React, { ReactElement } from 'react';
import styles from '../datenbank.module.css';
import { getNestedAttr } from '../../../helper/util';

function ThemenProStandort({
  standorteThemen
}: {
  standorteThemen: {
    standort: { id: number; name: string };
    thema: { name: string };
  }[];
}) {
  if (!Array.isArray(standorteThemen)) return '';
  return (
    <div>
      {Object.values(
        standorteThemen.reduce(
          (
            acc: {
              standorte: { [id: number]: ReactElement };
              themenProStandort: { [id: number]: string[] };
            },
            el
          ) => {
            const standortId = getNestedAttr(el, 'standort.id') as number;
            const standortName = getNestedAttr(el, 'standort.name');
            const themaName = getNestedAttr(el, 'thema.name');
            if (acc.themenProStandort[standortId]) {
              acc.themenProStandort[standortId].push(themaName);
            } else {
              acc.themenProStandort[standortId] = [themaName];
            }
            acc.standorte[standortId] = (
              <p key={standortId}>
                <span className={styles.standort_span}>{standortName}:</span>
                <span> {acc.themenProStandort[standortId].join(', ')}</span>
              </p>
            );
            return acc;
          },
          {
            standorte: {},
            themenProStandort: {}
          }
        ).standorte
      )}
    </div>
  );
}

export default ThemenProStandort;
