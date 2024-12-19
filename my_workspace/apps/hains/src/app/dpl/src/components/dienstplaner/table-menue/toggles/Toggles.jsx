import React from 'react';
import { UseRegister } from '../../../../hooks/use-register';
import Toggle from './Toggle';

function Toggles({ table }) {
  UseRegister(table?._push, table?._pull, table);

  if (!table) return null;
  return (
    <>
      <Toggle
        title="Zeige nur Tage aus dem Planungszeitraum an"
        label="Nur Hauptmonat anzeigen"
        checked={table?.onlyPlanungszeitraum}
        toggleChecked={() =>
          table?.setOnlyPlanungszeitraum?.(!table?.onlyPlanungszeitraum)
        }
      />
      <Toggle
        title="Einteilungen nach Einteilungsstatus markieren?"
        label="Einteilungsstatus markieren"
        checked={table?.markEinteilungsstatus}
        toggleChecked={() =>
          table?.setMarkEinteilungsstatus?.(!table?.markEinteilungsstatus)
        }
      />
      <Toggle
        title="Arbeitszeit nicht eingeteilter Arbeitstage als Regeldienst behandeln"
        label="Regeldienstzeit auffüllen"
        checked={table?.emptyAsRegeldienst}
        toggleChecked={() =>
          table?.setEmptyAsRegeldienst?.(!table?.emptyAsRegeldienst)
        }
      />
      {table?.showToggleDienste && (
        <Toggle
          title="Zeige nur Dienste aus der Vorlage an"
          label="Nur Vorlage-Dienste"
          checked={table?.onlyVorlageDienste}
          toggleChecked={() =>
            table?.setOnlyVorlageDienste?.(!table?.onlyVorlageDienste)
          }
        />
      )}
      {table?.showToggleWuensche && (
        <Toggle
          title="Wünsche anzeigen/verstecken"
          label="Wünsche zeigen"
          checked={table?.addWuensche}
          toggleChecked={() => table?.setAddWuensche?.(!table?.addWuensche)}
        />
      )}
    </>
  );
}

export default Toggles;
