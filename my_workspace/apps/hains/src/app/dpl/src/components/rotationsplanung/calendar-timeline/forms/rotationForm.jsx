import React, { useState } from 'react';

import MitarbeiterSelect from '../../utils/mitarbeiter-select';
import KontingentSelect from '../../utils/kontingente-select';

function RotationForm({
  updateRotationApi,
  deleteRotationApi,
  showRotationForm,
  setShowRotationForm,
  rotationsplan
}) {
  let kontingentName = '';
  let mitarbeiterObj = {};
  let von = '';
  let bis = '';
  let kommentarStr = '';
  const kontingentObj = {};
  let position = 0;
  let prioritaet = 1;
  const id = showRotationForm.id;
  let isPublic = false;

  if (rotationsplan.timeline.view === 'contingent') {
    kontingentName =
      rotationsplan.data.kontingente[showRotationForm.kontingent_id].name;
  }

  if (showRotationForm.id) {
    const rotation = rotationsplan.data.rotationen[id];
    const mitarbeiter_id = rotation.mitarbeiter_id;

    if (rotationsplan.timeline.view === 'mitarbeiter') {
      kontingentName =
        rotationsplan.data.kontingente[rotation.kontingent_id].name;
    }

    von = rotation.von;
    bis = rotation.bis;
    mitarbeiterObj = rotationsplan.data.mitarbeiter[mitarbeiter_id];
    prioritaet = rotation.prioritaet || 0;
    position = rotation.position || 0;
    kommentarStr = rotation.kommentar;
    isPublic = rotation.published;
  } else {
    const dateStr = showRotationForm.date.split('-');
    const year = dateStr[0];
    const month = (parseInt(dateStr[1], 10) + 1).toString().padStart(2, 0);
    von = `${year}-${month}-01`;
    const bisDays = new Date(year, month, 0).getDate();
    bis = `${year}-${month}-${bisDays}`;
    if (rotationsplan.timeline.view === 'mitarbeiter') {
      mitarbeiterObj =
        rotationsplan.data.mitarbeiter[showRotationForm.employee_id];
    }
  }

  const [mitarbeiter, setMitarbeiter] = useState(mitarbeiterObj);
  const [kontingent, setKontingent] = useState(kontingentObj);

  const [vonDate, setVonDate] = useState(von);
  const [bisDate, setBisDate] = useState(bis);
  const [pos, setPos] = useState(position);
  const [prio, setPrio] = useState(prioritaet);
  const [kommentar, setKommentar] = useState(kommentarStr);
  const [publicRotation, setPublicRotation] = useState(isPublic);
  const [errMsg, setErrMsg] = useState('');

  const onSave = (e) => {
    e.preventDefault();
    let kontingent_id = 0;
    if (rotationsplan.timeline.view === 'contingent') {
      kontingent_id = parseInt(showRotationForm.kontingent_id, 10);
    } else {
      kontingent_id = showRotationForm.kontingent_id
        ? parseInt(showRotationForm.kontingent_id, 10)
        : kontingent.id;
    }
    if (!mitarbeiter.id || !kontingent_id) {
      setErrMsg(() => 'Mitarbeiter oder Kontingent existiert nicht.');
      return null;
    }
    const rotation = {
      id: parseInt(showRotationForm.id, 10),
      kommentar,
      kontingent_id,
      mitarbeiter_id: mitarbeiter.id,
      mitarbeiter_planname: mitarbeiter.planname,
      position: parseInt(pos, 10),
      prioritaet: parseInt(prio, 10),
      published: publicRotation,
      von: vonDate,
      bis: bisDate
    };
    if (!(vonDate < bisDate)) {
      setErrMsg(() => 'Bis Datum nicht valide');
      return null;
    }
    setErrMsg(() => '');
    // setShowRotationForm(false);
    updateRotationApi(rotation);
  };

  const onDelete = (evt) => {
    evt.preventDefault();
    // const hash = (Math.random() + 1).toString(36).substring(7);
    const userRes = window.confirm(
      'Sind Sie sicher Sie wollen die Rotation löschen?'
    );
    if (!userRes) return;

    let kontingent_id = 0;
    if (rotationsplan.timeline.view === 'contingent') {
      kontingent_id = parseInt(showRotationForm.kontingent_id, 10);
    } else {
      kontingent_id = showRotationForm.kontingent_id
        ? parseInt(showRotationForm.kontingent_id, 10)
        : kontingent.id;
    }
    const rotation = {
      kontingent_id,
      mitarbeiter_id: mitarbeiter.id,
      id: parseInt(showRotationForm.id, 10)
    };
    // setShowRotationForm(false);
    deleteRotationApi(rotation);
  };

  const getInfo = () => {
    const result = [];
    if (mitarbeiter?.id) {
      const arr = rotationsplan?.kontingenteEingeteilt(mitarbeiter.id);
      arr?.forEach?.(({ txt, key }) => {
        result.push(<p key={key}>{txt}</p>);
      });
    }
    return result;
  };

  return (
    <form className="add-edit-rotation" onSubmit={onSave}>
      <fieldset>
        <label>Kontingent:</label>
        {id || rotationsplan.timeline.view === 'contingent' ? (
          <p className="fake-input">{kontingentName}</p>
        ) : (
          <KontingentSelect
            rotationsplan={rotationsplan}
            setKontingent={setKontingent}
          />
        )}
      </fieldset>
      <fieldset>
        <label>Mitarbeiter:</label>
        {id || rotationsplan.timeline.view === 'mitarbeiter' ? (
          <p className="fake-input">{mitarbeiter.planname}</p>
        ) : (
          <MitarbeiterSelect
            rotationsplan={rotationsplan}
            setMitarbeiter={setMitarbeiter}
          />
        )}
      </fieldset>
      <fieldset className="inline">
        <fieldset>
          <label>Von:</label>
          <input
            type="date"
            required
            name="von"
            value={vonDate}
            onChange={(e) => setVonDate(e.target.value.trim())}
          />
        </fieldset>
        <fieldset>
          <label>Bis:</label>
          <input
            type="date"
            required
            name="bis"
            value={bisDate}
            onChange={(e) => setBisDate(e.target.value.trim())}
          />
        </fieldset>
      </fieldset>
      <fieldset>
        <label>Kommentar:</label>
        <textarea
          name="kommentar"
          value={kommentar}
          onChange={(e) => setKommentar(e.target.value.trim())}
        />
        <input
          type="checkbox"
          name="published"
          checked={publicRotation}
          value={publicRotation}
          onChange={(e) => setPublicRotation(e.target.checked)}
        />
        <label>Veröffentlicht</label>
      </fieldset>
      <fieldset className="inline">
        {/* <fieldset>
          <label>Position:</label>
          <input type="number" min="0" required name="position"
            value={pos} onChange={(e) => setPos(e.target.value.trim())}/>
        </fieldset> */}
        <fieldset>
          <label>Priorität:</label>
          <input
            type="number"
            min="0"
            name="prioritaet"
            value={prio}
            onChange={(e) => setPrio(e.target.value.trim())}
          />
        </fieldset>
      </fieldset>
      <fieldset>{getInfo()}</fieldset>
      <fieldset>{errMsg && <p className="errMsg">{errMsg}</p>}</fieldset>
      <fieldset className="buttons">
        <button type="submit" name="save" className="save">
          Speichern
        </button>
        <button
          type="button"
          name="cancel"
          onClick={() =>
            setShowRotationForm({
              show: false,
              rotation: { rotation_id: 0, kontingent_id: 0, mitarbeiter_id: 0 }
            })
          }
          className="cancel"
        >
          {' '}
          Abbrechen
        </button>
      </fieldset>
      {showRotationForm.id > 0 && (
        <fieldset>
          <button
            type="button"
            className="delete"
            name="delete"
            onClick={onDelete}
          >
            Löschen
          </button>
        </fieldset>
      )}
    </form>
  );
}

export default RotationForm;
