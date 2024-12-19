import React, { ReactElement } from 'react';
import { getNestedAttr } from '../../../helper/util';
import { TableData } from '../../utils/table/types/table';

function Arbeitszeitverteilung({ row }: { row: TableData }) {
  const verteilung = getNestedAttr(row, 'verteilung');
  const zeittypen = getNestedAttr(row, 'zeittypen');
  const details = getNestedAttr(row, 'arbeitszeittypDetails');

  if (!(Array.isArray(zeittypen) && Array.isArray(verteilung) && Array.isArray(details))) return '';

  return (
    <div>
      {
        zeittypen.reduce(
          (
            acc: {
              arr: ReactElement[];
              tag: number;
            },
            el,
            index
          ) => {
            const anfang = verteilung[index];
            const ende = verteilung[index + 1] || '??';
            const typ = details.find((e) => e.id === el)?.name || '??';
            acc.arr.push(<p key={index}>{`Tag ${acc.tag}: ${anfang} - ${ende} Uhr ${typ}`}</p>);
            const anfangZahl = parseInt(anfang.split(':').join(''), 10);
            const endeZahl = parseInt(ende.split(':').join(''), 10);
            if (anfangZahl >= endeZahl) acc.tag++;
            return acc;
          },
          { arr: [], tag: 1 }
        ).arr
      }
    </div>
  );
}

export default Arbeitszeitverteilung;
