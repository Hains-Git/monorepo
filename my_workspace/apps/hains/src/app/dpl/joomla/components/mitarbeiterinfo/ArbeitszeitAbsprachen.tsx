import React, { useContext } from 'react';
import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import Absprachen from './Absprachen';
import { HeadRow } from '../utils/table/types/table';

const headRow: HeadRow = {
  columns: [
    {
      title: 'Arbeitszeit',
      dataKey: 'arbeitszeit_von_time'
    },
    {
      title: 'Arbeitszeit (Bis)',
      dataKey: 'arbeitszeit_bis_time'
    },
    { title: 'Pause (Min.)', dataKey: 'pause' },
    { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
    { title: 'Von', dataKey: 'von' },
    { title: 'Bis', dataKey: 'bis' },
    { title: 'Bemerkung', dataKey: 'bemerkung' }
  ]
};

function ArbeitszeitAbsprachen() {
  const { arbeitszeit_absprachen } = useContext(ApiContext);

  return (
    <Absprachen
      absprachen={arbeitszeit_absprachen}
      label="Arbeitszeit Absprachen"
      type="arbeitszeitabsprachen"
      headRow={headRow}
    />
  );
}

export default ArbeitszeitAbsprachen;
