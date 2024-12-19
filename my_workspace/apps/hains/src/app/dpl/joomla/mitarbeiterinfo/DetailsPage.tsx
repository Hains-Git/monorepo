import React, { useContext } from 'react';

import { ApiProvider } from '../context/mitarbeiterinfo/ApiProvider';
import Details from './Details';
import { DataContext } from '../context/mitarbeiterinfo/DataProvider';
import { AbsprachePopupProvider } from '../context/mitarbeiterinfo/AbsprachePopupProvider';
import VertragsPage from './VertragsPage';

export default function DetailsPage() {
  const { config } = useContext(DataContext);
  if (!config.id) return null;

  return (
    <ApiProvider mitarbeiter_id={config.id}>
      <AbsprachePopupProvider mitarbeiter_id={config.id}>
        {config.view === 'detail' && <Details />}
        {config.view === 'vertrag' && (
          <VertragsPage mitarbeiter_id={config.id} />
        )}
      </AbsprachePopupProvider>
    </ApiProvider>
  );
}
