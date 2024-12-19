import React, { useContext } from 'react';
import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import Absprachen from './Absprachen';
import { HeadRow } from '../utils/table/types/table';

const headRow: HeadRow = {
  columns: [
    { title: 'Dienst', dataKey: 'po_dienst.planname' },
    { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
    { title: 'Von', dataKey: 'von' },
    { title: 'Bis', dataKey: 'bis' },
    { title: 'Tage (Task)', dataKey: 'days' }
  ]
};

function AutomatischeEinteilungen() {
  const { automatische_einteilungen } = useContext(ApiContext);

  return (
    <Absprachen
      absprachen={automatische_einteilungen}
      label="Automatische Einteilungen"
      type="automatischeeinteilungen"
      headRow={headRow}
    />
  );
}

export default AutomatischeEinteilungen;
