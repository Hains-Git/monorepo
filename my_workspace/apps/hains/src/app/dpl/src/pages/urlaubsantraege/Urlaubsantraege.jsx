import React, { Suspense, useState, useEffect } from 'react';
import Spinner from '../../components/utils/spinner/Spinner';
import Panel from '../../components/utils/panel/Panel';
import ContentContainer from '../../components/urlaubsantraege/content-container/ContentContainer';

import '../../css/antraege.css';
import { apiGetAntraege } from '../../tools/helper';
import { UseMounted } from '../../hooks/use-mounted';

function Urlaubsantraege({ user, appModel }) {
  const loader = (text) => <Spinner showText text={text} />;
  const [antraege, setAntraege] = useState(false);
  const mounted = UseMounted();

  const getAntraege = async () => {
    const params = {
      init: true
    };
    apiGetAntraege(params, (response) => {
      if (user && appModel && mounted) {
        appModel.init({
          pageName: 'urlaubsantraege',
          pageData: response,
          state: {}
        });
        const tmpAntraege = appModel.page;
        setAntraege(() => tmpAntraege);
      }
    });
  };

  useEffect(() => {
    setAntraege(() => false);
    if (user && appModel && mounted) {
      getAntraege();
    }
  }, [user, appModel, mounted]);

  const getPage = () => {
    if (!user) return loader('Session wird geprüft...');
    if (!antraege) return loader('Daten werden geladen...');
    return (
      <Suspense fallback={loader('Seite wird geladen...')}>
        <div className="urlaubsantraege-wrapper">
          <ContentContainer antraege={antraege} />
          {loader('in Bearbeitung...')}
        </div>
      </Suspense>
    );
  };

  return <Panel>{getPage()}</Panel>;
}

export default Urlaubsantraege;
