import { useState, useEffect, useContext, useCallback } from 'react';
import { UseRegisterKey } from '../../hooks/use-register';
import Panel from '../../components/utils/panel/Panel';
import UserLayout from '../../components/verteiler/user-layout/UserLayout';
import Header from '../../components/verteiler/header/Header';
import SettingsView from '../../components/verteiler/settings-view/SettingsView';
import UserSettingsView from '../../components/verteiler/user-settings/UserSettingsView';
import InfoTable from '../../components/verteiler/info-table/InfoTable';
import ScrollWindow from '../../components/verteiler/utils/ScrollWindow';

import '../../css/verteiler.css';
import Info from '../../components/utils/info/Info';
import Tab from '../../components/utils/tab/Tab';
import MitarbeiterVorschlaege from '../../components/verteiler/mitarbeiter-vorschlaege/MitarbeiterVorschlaege';
import Vorlagen from '../../components/verteiler/vorlagen/Vorlagen';
import { UseMounted } from '../../hooks/use-mounted';
import { VerteilerSearchContext } from '../../contexts/verteiler';
import Search from '../../components/utils/search/Search';
import FormWrapper from '../../components/verteiler/form/FormWrapper';
import { firefoxWorkaroundForDragging } from '../../util_func/util';

import { VerteilerFastContext } from '../../contexts/VerteilerFastProvider';
import VorlageAuswahl from '../../components/verteiler/vorlagen/VorlageAuswahl';

firefoxWorkaroundForDragging();
const groups = {};

function Verteiler({ pageName }) {
  const { verteiler, user } = useContext(VerteilerFastContext);

  const [search, setSearch] = useState('');
  const isRendered = UseRegisterKey(
    'fullUpdate',
    verteiler?.push,
    verteiler?.pull,
    verteiler
  );
  const mounted = UseMounted();

  useEffect(() => {
    if (isRendered) {
      verteiler.renderEmptyWorkSpots();
    }
  }, [isRendered]);

  const searchCallback = (input) => {
    mounted && setSearch(() => input);
  };

  const getPage = useCallback(() => {
    return (
      <VerteilerSearchContext.Provider value={search}>
        <div
          className={`verteiler-wrapper ${pageName} user-layout ${
            pageName === 'tagesverteiler'
              ? verteiler.data.user_settings.funktion_box
              : 'top'
          }`}
        >
          <Info parent={verteiler} />
          <Header />
          {verteiler?.hasDienstplaene && (
            <div className="verteiler-body">
              <Tab parent={verteiler?.mitarbeiterVorschlaege} button={false}>
                <MitarbeiterVorschlaege verteiler={verteiler} />
              </Tab>
              <div className="verteiler-body-header">
                <Search search={searchCallback} groups={groups} />
                <VorlageAuswahl vorlagen={verteiler?.vorlagen} />
              </div>
              <UserLayout verteiler={verteiler} />
              {pageName === 'tagesverteiler' && user?.isAdmin && (
                <SettingsView />
              )}
              <UserSettingsView />
              <Vorlagen />
              <InfoTable />
              <FormWrapper />
              <ScrollWindow />
            </div>
          )}
        </div>
      </VerteilerSearchContext.Provider>
    );
  }, [verteiler, search]);

  return <Panel>{getPage()}</Panel>;
}

export default Verteiler;
