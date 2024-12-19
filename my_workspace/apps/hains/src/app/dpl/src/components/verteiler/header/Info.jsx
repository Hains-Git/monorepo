import { useContext } from 'react';
import ColumnFunktion from './ColumnFunktion';
import { UseRegisterKey } from '../../../hooks/use-register';
import { throttle } from '../../../tools/debounce';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function Info({ teamsFiltered }) {
  const { verteiler } = useContext(VerteilerFastContext);
  UseRegisterKey('fullUpdate', verteiler.push, verteiler.pull);
  UseRegisterKey(
    'not-allowcated-employee',
    verteiler.data.push,
    verteiler.data.pull
  );

  const funktionen = verteiler._funktionen._each(
    false,
    (funktion) => funktion
  ).arr;
  const funktion_ids = verteiler.data.user_settings.funktion_ids;

  const dragOver = (e) => {
    e.preventDefault();
    const elem = e.target.closest('div.not-allocated');
    elem.style.border = '1px dashed #000';
  };

  const dragLeave = (e) => {
    e.preventDefault();
    const elem = e.target.closest('div.not-allocated');
    elem.style.border = '1px solid transparent';
  };

  const dropped = (e) => {
    e.preventDefault();
    const elem = e.target.closest('div.not-allocated');
    elem.style.border = '1px solid transparent';

    const einteilungsId = parseInt(e.dataTransfer.getData('einteilungsId'), 10);
    const mitarbeiterId = parseInt(e.dataTransfer.getData('mitarbeiterId'), 10);

    if (!einteilungsId || !mitarbeiterId) return;

    verteiler.data.einteilungAufheben(einteilungsId).then(() => {
      verteiler.uiUpdate();
    });
  };

  return verteiler.data?.eachVerteilerDate?.((dateStr, ix) => {
    const formattedDate = verteiler.germanDate(dateStr);
    const isholiday = verteiler.data.dates?.[dateStr]?.isFeiertag
      ? 'holiday'
      : '';
    return (
      <div
        key={`daycol-header-${dateStr}`}
        className={`daycol-header daycol-header-${ix} ${isholiday}`}
      >
        {verteiler.pageName !== 'tagesverteiler' && (
          <p className="date">
            <span>{formattedDate.name}</span>
            <span>{formattedDate.dateDe}</span>
          </p>
        )}
        <div className="info">
          <div
            className="not-allocated"
            onDrop={dropped}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            // onDrag={drag}
            // onDragEnd={dragEnd}
          >
            {funktionen.map((funktion) => {
              if (funktion_ids.includes(funktion.id)) {
                return (
                  <ColumnFunktion
                    key={`${dateStr}-${funktion.id}`}
                    funktion={funktion}
                    dateStr={dateStr}
                    verteiler={verteiler}
                    teamsFiltered={teamsFiltered}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  });
}
export default Info;
