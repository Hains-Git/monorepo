import { Suspense } from 'react';
import Panel from '../../components/utils/panel/Panel';
import Spinner from '../../components/utils/spinner/Spinner';

import Table from '../../components/urlaubsliste/Table';
import SettingsOverlay from '../../components/urlaubsliste/settings-overlay/SettingsOverlay';

import Mtable from '../../models/urlaubsliste/Mtable';
import { useUrlaubsliste } from '../../hooks/use-urlaubsliste';

function Urlaubsliste({ user, appModel }) {
  const [urlaubsliste] = useUrlaubsliste({ user, appModel, init: true });

  const loader = (text) => <Spinner showText text={text} />;

  const getPage = () => {
    if (!user) return loader('Session wird geprüft...');
    if (!urlaubsliste) {
      return loader('Daten werden geladen...');
    }

    const tablemodel = new Mtable(appModel, urlaubsliste);

    return (
      <Suspense fallback={loader('Seite wird geladen...')}>
        <Table tablemodel={tablemodel} urlaubsliste={urlaubsliste}>
          Urlaubsliste.
        </Table>
        <SettingsOverlay urlaubsliste={urlaubsliste} tablemodel={tablemodel} />
      </Suspense>
    );
  };
  return <Panel>{getPage()}</Panel>;
}
export default Urlaubsliste;
