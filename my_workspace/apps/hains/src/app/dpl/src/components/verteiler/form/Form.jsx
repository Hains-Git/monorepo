import React, { useState, useEffect, useContext } from 'react';

import FormConflict from './FormConflict';
import { UseRegisterKey } from '../../../hooks/use-register';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';
import SuggestionInputVerteiler from '../../utils/suggestion-input/SuggestionInputVerteiler';

function Form({ formConflict }) {
  const { useVerteilerFastContextFields, verteiler, employeesRoom } =
    useContext(VerteilerFastContext);
  const fields = useVerteilerFastContextFields(['newEinteilung', 'showForm']);

  const showForm = fields.showForm;
  const newEinteilung = fields.newEinteilung.get;
  const bedarf = verteiler?._bedarfseintraege?.[newEinteilung?.be_id];
  const optEinteilungenLength =
    bedarf?.felder?.filter((f) => f?.einteilung?.is_optional)?.length || 0;

  const showOpt = optEinteilungenLength < (bedarf?.opt || 0);

  const _employee =
    verteiler._mitarbeiters[newEinteilung?.mitarbeiter?.id] || 0;
  const dienst_id =
    verteiler._po_dienste[newEinteilung?.po_dienst?.id]?.id || 0;

  const tmpData = {
    einteilungs_id: parseInt(newEinteilung?.einteilung?.id, 10) || 0,
    einteilungskontext_id: 5,
    context_comment: '',
    mitarbeiter_id: newEinteilung.mitarbeiter.id,
    dienstplan_id:
      newEinteilung?.einteilung?.dienstplan_id ||
      verteiler.data.getDienstplanIdByTag(newEinteilung.tag),
    po_dienst_id: newEinteilung.po_dienst.id || 0,
    bereich_id: newEinteilung.bereich_id || 0,
    von: formConflict.von,
    bis: formConflict.bis,
    tag: newEinteilung.tag,
    prevIds: formConflict.prevIds,
    skipDay: formConflict.skipDay,
    einteilungsstatus_id:
      verteiler.einteilungsstatusAuswahl.einteilungsstatus_id,
    is_optional: newEinteilung?.is_optional || newEinteilung?.isOpt || false
  };

  const einteilungskontexte = verteiler._einteilungskontexte._each(
    false,
    (kontext) => kontext.tagesverteiler
  ).arr;

  const options = verteiler.createOptionsDienste(newEinteilung.tag);

  const mitarbeiters = verteiler._aktiveMitarbeiter;

  const [reason, setReason] = useState(verteiler._defaultEinteilungsKontextId);
  const [employee, setEmployee] = useState(_employee);
  const [dienst, setDienst] = useState(`${tmpData.bereich_id}_${dienst_id}`);
  const [comment, setComment] = useState('');
  const [isOptional, setIsOptional] = useState(tmpData.is_optional);

  const [foundItem, setFoundItem] = useState();
  const [errMsg, setErrMsg] = useState('');

  const [tmpEinteilung, setTmpEinteilung] = useState({ ...tmpData });

  const update = UseRegisterKey(
    'form-conflict',
    formConflict.push,
    formConflict.pull,
    formConflict
  );

  useEffect(() => {
    if (!foundItem) return;
    let mitarbeiter_id = null;
    if (Object.hasOwn(foundItem, 'listItem')) {
      setEmployee(() => foundItem?.listItem);
      formConflict.employeeChanged(foundItem?.listItem);
      mitarbeiter_id = parseInt(foundItem?.listItem?.id, 10);
    } else {
      setEmployee(() => foundItem);
      formConflict.employeeChanged(foundItem);
      mitarbeiter_id = parseInt(foundItem?.id, 10);
    }

    const felder = verteiler.getFelderFromEmployee(
      mitarbeiter_id,
      tmpEinteilung.tag
    );

    setTmpEinteilung((prev) => ({
      ...prev,
      mitarbeiter_id,
      prevEinteilung: felder?.map((feld) => feld?.einteilung)
    }));
  }, [foundItem]);

  const reasonChange = (evt) => {
    const val = parseInt(evt.target.value, 10);
    setReason(() => val);
    setTmpEinteilung((prev) => ({
      ...prev,
      einteilungskontext_id: val
    }));
  };

  const changeComment = (evt) => {
    const val = evt.target.value;
    setComment(() => val);
    setTmpEinteilung((prev) => ({
      ...prev,
      context_comment: val
    }));
  };

  const dienstChange = (evt) => {
    const val = evt.target.value;
    if (val === '0_0') {
      alert('Bitte wählen Sie einen Dienst aus.');
      return;
    }
    setDienst(() => val);
    const be_po_id = val?.split('_');
    const po_dienst_id = Number(be_po_id?.[1] || '0');
    const bereich_id = Number(be_po_id?.[0] || '0');

    formConflict.dienstChanged(val);
    setTmpEinteilung((prev) => ({
      ...prev,
      po_dienst_id,
      bereich_id
    }));
  };

  const validInputDate = (name, val) => {
    let valid = false;
    let vonMonth = new Date(formConflict.von).getMonth();
    let bisMonth = new Date(formConflict.bis).getMonth();
    if (name === 'von') {
      if (verteiler.isDateVonSmaller(val, formConflict.bis)) {
        valid = true;
        vonMonth = new Date(val).getMonth();
      }
    }
    if (name === 'bis') {
      if (verteiler.isDateVonSmaller(formConflict.von, val)) {
        valid = true;
        bisMonth = new Date(val).getMonth();
      }
    }
    if (!valid) alert('Ungueltiges Datum');

    if (vonMonth !== bisMonth)
      alert(
        'Konflikte koennen nur in einem Monat korrekt berechnet werden. Bitte ueberpruefen Sie selbststaendig die Konflikte in den anderen Monaten'
      );

    return valid;
  };

  const dateChange = (evt) => {
    const name = evt.target.name;
    const val = evt.target.value;
    if (!validInputDate(name, val)) return;

    if (name === 'von') {
      formConflict.vonChanged(val);
      setTmpEinteilung((prev) => ({
        ...prev,
        von: val
      }));
    } else {
      formConflict.bisChanged(val);
      setTmpEinteilung((prev) => ({
        ...prev,
        bis: val
      }));
    }
  };

  const isOptionalChange = (evt) => {
    const val = evt.target.checked;
    setIsOptional(val);
    setTmpEinteilung((prev) => ({
      ...prev,
      is_optional: val
    }));
    console.log({ val });
  };

  const save = async () => {
    if (reason === 0) {
      setErrMsg(() => 'Bitte Begruendung waehlen!');
    }

    if (dienst === '0_0') {
      alert('Bitte wählen Sie einen Dienst aus.');
      return;
    }

    if (newEinteilung?.fieldId) {
      verteiler.data.resetName(newEinteilung.fieldId);
    }

    const tmpNewEinteilung = {
      ...tmpEinteilung,
      einteilungsstatus_id:
        verteiler.einteilungsstatusAuswahl.einteilungsstatus_id,
      prevIds: formConflict.prevIds,
      skipDay: formConflict.skipDay
    };

    const status =
      verteiler && (await verteiler.createNewEinteilung(tmpNewEinteilung));
    if (status === 0) {
      alert(
        'Es ist ein Fehler aufgetreten, bitte überprüfen Sie alle Einteilungen die Sie machen wollten, ob diese auch erstellt worden sind.'
      );
    }

    const eId = newEinteilung?.einteilung?.id;
    const tag = newEinteilung?.einteilung?.tag;
    if (employeesRoom?.[tag]?.[eId]) {
      delete employeesRoom[tag][eId];
    }

    // verteiler.resetEmptyWorkSpots();
    showForm.set(false);
  };

  const cancel = () => {
    formConflict.resetFelder();

    setTmpEinteilung(() => ({ ...tmpData }));
    showForm.set(false);

    setErrMsg(() => '');
    if (newEinteilung?.fieldId) {
      verteiler.data.resetName(newEinteilung.fieldId);
    }
  };

  const changePrevIds = (e) => {
    const val = parseInt(e?.target?.value, 10);
    const checked = e?.target?.checked;
    if (checked) {
      formConflict.addToPrevIds(val);
    } else {
      formConflict.resetFelder();
      formConflict.removeFromPrevIds(val);
    }
  };

  const saveOnEnter = (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      evt.stopPropagation();
      save();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', saveOnEnter);
    return () => {
      document.removeEventListener('keyup', saveOnEnter);
    };
  }, [update, verteiler, formConflict, foundItem, newEinteilung]);

  return (
    <div className="popup-form">
      <div className="form-container">
        <fieldset>
          <label htmlFor="reason">Kontext:</label>
          <select id="reason" value={reason} onChange={reasonChange}>
            <option value={0}>Bitte wählen</option>
            {einteilungskontexte.map((kontext) => (
              <option key={kontext.id} value={kontext.id}>
                {kontext.name}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <label htmlFor="Kommentar">Kontextkommentar:</label>
          <textarea
            id="Kommentar"
            value={comment}
            onChange={changeComment}
            name="kontext_comment"
          />
        </fieldset>
        <fieldset>
          <label htmlFor="dienste">Dienst:</label>
          <select id="dienste" value={dienst} onChange={dienstChange}>
            <option value="0_0">.</option>
            {Object.values(options).map((option, index) => {
              return (
                <optgroup
                  key={`optiongroup_${option.label}_${index}`}
                  label={option.label}
                >
                  {option.options.map((op) => {
                    return (
                      <option
                        key={`option_${option.bereich_id}_${op.id}`}
                        value={`${option.bereich_id}_${op.id}`}
                        title={op?.planname}
                      >
                        {op?.planname}
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </fieldset>
        <fieldset>
          <label htmlFor="mitarbeiter">Mitarbeiter:</label>
          <SuggestionInputVerteiler
            id="mitarbeiter"
            data={mitarbeiters}
            pageModel={verteiler}
            valName={employee?.planname ? employee.planname : ''}
            searchKeys={['planname', 'name']}
            setFoundItem={setFoundItem}
          />
        </fieldset>
        <fieldset className="columns">
          <fieldset>
            <label htmlFor="von">Von:</label>
            <input
              id="von"
              type="date"
              name="von"
              value={formConflict.von}
              onChange={dateChange}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="bis">Bis:</label>
            <input
              id="bis"
              type="date"
              name="bis"
              value={formConflict.bis}
              onChange={dateChange}
            />
          </fieldset>
        </fieldset>
        {showOpt ? (
          <fieldset className="columns">
            <input
              type="checkbox"
              id="is_optional"
              name="is_optional"
              value={isOptional}
              checked={isOptional}
              onChange={isOptionalChange}
            />
            <label htmlFor="is_optional">Optionale Einteilung</label>
          </fieldset>
        ) : null}
        <fieldset className="columns">
          <button type="button" onClick={save}>
            Speichern
          </button>
          <button type="button" onClick={cancel}>
            Abbrechen
          </button>
        </fieldset>
        {errMsg && <p className="errMsg">{errMsg}</p>}
        <div>
          <p>
            <strong>Mitarbeiter:</strong> {employee?.planname}
          </p>
          {formConflict.otherEinteilungen.length > 0 && (
            <p style={{ marginTop: '5px' }}>
              <b>Einteilungen aufheben:</b>
            </p>
          )}

          {formConflict.otherEinteilungen.map((e) => {
            const _dienst = e.dienst;
            return (
              <fieldset key={e?.id} className="columns">
                <input
                  type="checkbox"
                  name={_dienst?.planname}
                  value={e?.id}
                  id={e?.id}
                  // checked={prevIds.includes(e?.id)}
                  checked={formConflict.prevIds.includes(e?.id)}
                  onChange={changePrevIds}
                />
                <label htmlFor={e?.id}>
                  {_dienst?.planname} ({e.tag})
                </label>
              </fieldset>
            );
          })}
        </div>

        {Object.keys(formConflict.conflicts).length ? (
          <FormConflict formConflict={formConflict} />
        ) : null}
      </div>
    </div>
  );
}

export default Form;
