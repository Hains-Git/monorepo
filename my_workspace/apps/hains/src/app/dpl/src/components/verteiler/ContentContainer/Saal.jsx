import React, { useContext } from 'react';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function Saal({ bereich_section, einteilung }) {
  const { verteiler, roomChange, employeesRoom } =
    useContext(VerteilerFastContext);
  let val = einteilung.arbeitsplatz_id > 1 ? einteilung.arbeitsplatz_id : 1;

  const plaetze = verteiler._arbeitsplaetze._each(
    false,
    (a) => a.bereich_id === bereich_section.bereich_id
  ).arr;

  const changeSelect = (evt) => {
    let cancel = false;
    const optVal = parseInt(evt.target.value, 10);
    const tag = einteilung?.tag;
    if (optVal > 1) {
      const found = Object.entries(employeesRoom[tag]).find(
        (arr) => arr[1] === optVal
      );
      if (found) {
        const planname =
          verteiler.data.einteilungen[found[0]].mitarbeiter.planname;
        const userInput = window.confirm(
          `Doppelte Saalbelegung mit ${planname}`
        );
        if (!userInput) cancel = true;
      }
    }
    if (cancel) return;
    val = optVal;
    roomChange(einteilung.id, optVal);
  };

  const getHoverTitle = (id) => {
    return plaetze.find((platz) => platz?.id === id)?.name || '';
  };

  return (
    <div className="select-field" title={getHoverTitle(val)}>
      <select value={val} onChange={changeSelect}>
        <option value="1">-</option>
        {plaetze.map((platz) => (
          <option key={platz.id} value={platz.id}>
            {platz.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Saal;
