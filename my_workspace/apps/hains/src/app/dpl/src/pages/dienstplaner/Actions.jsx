import React from 'react';
import EinteilungsstatusAuswahl from '../../components/utils/einteilungsstatus-auswahl/EinteilungsstatusAuswahl';
import Publish from '../../components/dienstplaner/tabellen-container/toolbar/publish/Publish';
import Export from '../../components/dienstplaner/tabellen-container/toolbar/export/Export';
import FarbenLegende from '../../components/dienstplaner/farben-legende/FarbenLegende';
import { UseRegisterKey } from '../../hooks/use-register';
import WunschBtn from '../../components/utils/wunsch-form/WunschBtn';
import ScoreWeights from '../../components/utils/score-weights/ScoreWeights';

function Actions({ dienstplan }) {
  UseRegisterKey('actions', dienstplan?.push, dienstplan?.pull, dienstplan);
  const einteilungsstatusAuswahl = dienstplan?.einteilungsstatusAuswahl;
  const table = dienstplan?.table;
  const dienstkategorien = dienstplan?.dienstkategorien || [];
  const mitarbeiter = dienstplan?.filteredMitarbeiter || [];

  return (
    <div className="actions">
      {table && (
        <>
          <EinteilungsstatusAuswahl
            auswahl={einteilungsstatusAuswahl}
            publishButton={
              <Publish
                table={table}
                title="Veröffentlicht die Tabelle als PDF und schreibt Einteilungen in die Datenbank"
              />
            }
          />

          <Export
            table={table}
            title="Exportiert die Tabelle als CSV-Datei (für Excel) oder als PDF"
          />
          <WunschBtn
            dienstkategorien={dienstkategorien}
            mitarbeiter={mitarbeiter}
            callBack={dienstplan?.wunschRequestCallback}
          />
          {dienstplan?._user?.isAdmin ? (
            <ScoreWeights
              scores={dienstplan?._scores}
              callback={() => {
                table?.auswahl?.debouncedUpdateFilter?.();
              }}
            />
          ) : null}
        </>
      )}
      <FarbenLegende id="table" />
    </div>
  );
}

export default Actions;
