import { Suspense, useEffect } from 'react';
import { useVerteiler } from '../../hooks/use-verteiler';
import Verteiler from './Verteiler';
import Spinner from '../../components/utils/spinner/Spinner';

import { VerteilerFastProvider } from '../../contexts/VerteilerFastProvider';

function VerteilerWrapper({ user, appModel, pageName }) {
  const loader = (text) => <Spinner showText text={text} />;
  const [verteiler] = useVerteiler({ appModel, user, pageName });

  useEffect(() => {
    if (verteiler) {
      document.documentElement.style.setProperty(
        '--mult-size',
        verteiler?.data?.user_settings?.zoom
      );
    }
  }, [verteiler]);

  if (!user) return loader('Session wird geprüft...');
  if (!verteiler) return loader('Daten werden geladen...');

  return (
    <Suspense fallback={loader('Seite wird geladen...')}>
      <VerteilerFastProvider verteiler={verteiler} user={user}>
        <Verteiler verteiler={verteiler} user={user} pageName={pageName} />
      </VerteilerFastProvider>
    </Suspense>
  );
}
export default VerteilerWrapper;
