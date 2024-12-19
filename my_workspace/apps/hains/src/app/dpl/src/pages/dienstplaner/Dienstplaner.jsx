import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Panel from '../../components/utils/panel/Panel';
import Spinner from '../../components/utils/spinner/Spinner';
import { UseDienstPlaner } from '../../hooks/use-dienstplaner';
import '../../css/dienstplaner.css';
import Alert from '../../components/dienstplaner/warn/Alert';
import Calendar from '../../components/utils/calendar/Calendar';
import DienstplanAuswahl from '../../components/utils/dienstplan-auswahl/DienstplanAuswahl';
import Zoom from '../../components/utils/zoom/Zoom';

import PageHeader from '../../components/page-header/PageHeader';
import CustomButton from '../../components/utils/custom_buttons/CustomButton';
import Actions from './Actions';
import { DienstplanProvider } from '../../contexts/dienstplan';

const Dienstplan = React.lazy(() => import('./dienstplan/Dienstplan'));
const DienstplanStatistic = React.lazy(() => import('./statistik/Statistic'));
const VorlagenManager = React.lazy(() => import('./vorlagen-manager/VorlagenManager'));
// const Screenshot = React.lazy(() => import('./screenshot/Screenshot'));

function Dienstplaner({ user, appModel }) {
  const [dienstplan, calendar, dateUpdated, dateConfirmed, showCalender, setShowCalender, changeSize] = UseDienstPlaner(
    appModel,
    user
  );
  const { name } = useParams();
  const loader = (text) => <Spinner showText text={text} />;

  const getSite = () => {
    appModel?.setTooltip?.(false);
    let result = <p>Seite nicht gefunden</p>;
    switch (name) {
      case 'monatsplanung':
        result = <Dienstplan dienstplan={dienstplan} user={user} />;
        break;
      case 'statistik':
        result = <DienstplanStatistic dienstplan={dienstplan} user={user} />;
        break;
      case 'vorlagen':
        result = <VorlagenManager user={user} dienstplan={dienstplan} />;
        break;
      // case 'screenshot':
      //   result = <Screenshot user={user} dienstplan={dienstplan} />;
      //   break;
    }

    return result;
  };

  const getDienstplan = () => {
    if (!user) return loader('Session wird geprüft...');
    if (!dienstplan) return calendar ? null : loader('Daten werden geladen...');
    return (
      <Suspense fallback={loader('Seite wird geladen...')}>
        <DienstplanProvider dienstplan={dienstplan} user={user}>
          {getSite()}
        </DienstplanProvider>
      </Suspense>
    );
  };

  return (
    <Panel className="dienstplaner_page">
      <PageHeader>
        <Zoom
          changeSize={changeSize}
          // undo={() => {
          //   dienstplan?.undo?.();
          // }}
        />
        {calendar && (
          <Calendar
            dateUpdated={dateUpdated}
            dateConfirmed={dateConfirmed}
            showCalender={showCalender}
            setShowCalender={setShowCalender}
            arrows
            calendar={calendar}
            updateLocation
          >
            <DienstplanAuswahl calendar={calendar} dateUpdated={dateUpdated} showAutoPlan>
              {dienstplan && user?.isAdmin && (
                <CustomButton
                  className="api-auto-einteilen-btn"
                  spinner={{ show: true }}
                  clickHandler={(evt, setLoading) => {
                    dienstplan?.autoEinteilen?.(setLoading);
                  }}
                  id="api-auto-einteilen-btn"
                  title="Automatisch Einteilungen ausführen"
                >
                  Automatisch Einteilen
                </CustomButton>
              )}
            </DienstplanAuswahl>
          </Calendar>
        )}
        <Actions dienstplan={dienstplan} />
      </PageHeader>
      <Alert dienstplan={dienstplan} />
      {getDienstplan()}
    </Panel>
  );
}

export default Dienstplaner;
