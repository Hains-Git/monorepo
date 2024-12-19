import React, { useEffect, useState, useRef } from 'react';
import { UseRegisterKey } from '../../../../hooks/use-register';

import styles from '../contentcontainer.module.css';
import SuggestionInput from '../../../utils/suggestion-input/SuggestionInput';
import Saldi from '../saldi/Saldi';

function AddAntrag({ antraege, pageTableModel, sendToApi }) {
  const [formDataState, setFormDataState] = useState({});
  const [einteilungenToReplace, setEinteilungenToReplace] = useState({});
  const statuse = pageTableModel.antragsstatus;
  const typs = pageTableModel.antragstyp;
  const mitarbeiters = pageTableModel._mitarbeiters._each(
    false,
    (m) => m.aktiv && !m.platzhalter
  ).arr;
  const showPdf = [2, 4];
  const einteilungen_select_div = useRef();

  const updateView = UseRegisterKey(
    'einteilungenToReplace',
    antraege.push,
    antraege.pull
  );

  const updateFormData = (e) => {
    const name = e.target.name;
    const shouldParse = ['antragsstatus_id', 'antragstyp_id', 'mitarbeiter_id'];
    const val = shouldParse.includes(name)
      ? parseInt(e.target.value, 10)
      : e.target.value;
    setFormDataState(() => ({
      ...formDataState,
      [name]: val
    }));
  };

  const setFoundItem = (item) => {
    setFormDataState(() => ({
      ...formDataState,
      mitarbeiter_id: item?.listItem?.id || 0
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in formDataState) {
      const val = formDataState[key];
      if (key === 'antrag_file') {
        // Bei dateien wichtig den file namen im FormData anzugeben
        console.log(key, val, val.name);
        formData.append(key, val, val.name);
      } else {
        formData.append(key, val);
      }
    }

    formData.append(
      'einteilungenToCreateForDates',
      JSON.stringify(antraege.einteilungenToCreateForDates)
    );

    sendToApi('add_antrag', formData);
  };

  const fileChoosed = async (e) => {
    const file = e.target.files[0];
    setFormDataState(() => ({
      ...formDataState,
      antrag_file: file
    }));
  };

  useEffect(() => {
    antraege?.getSaldi?.(formDataState);
    antraege?.getEinteilungen(formDataState);
  }, [formDataState]);

  useEffect(() => {
    if (antraege.einteilungenToReplace) {
      setEinteilungenToReplace(antraege.einteilungenToReplace);
    }
  }, [updateView]);

  const onChangeDienst = (e) => {
    const _date = e.target.name.split('_')[1];
    const po_dienst_id = parseInt(e.target.value, 10);
    antraege.updateEinteilungenForDates(_date, po_dienst_id);
  };

  return (
    <div className="add-antrag form-antrag">
      <div className="header">
        <h2>Neuer Antrag</h2>
        <button
          className="cancle"
          type="button"
          onClick={() => pageTableModel.changeView('overview')}
        >
          Zurück
        </button>
      </div>
      <div className="column2">
        <div className="col">
          <form
            onSubmit={handleSubmit}
            method="post"
            encType="multipart/form-data"
          >
            <fieldset>
              <label htmlFor="antragsstatus_id">Status*:</label>
              <select
                name="antragsstatus_id"
                id="antragsstatus_id"
                required
                value={formDataState.antragsstatus_id || ''}
                onChange={updateFormData}
              >
                <option key="antragsstatus_id_0" value="">
                  Bitte wählen
                </option>
                {Object.values(statuse).map((status, ix) => (
                  <option key={`${status.name}-${ix}`} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <label htmlFor="antragstyp_id">Art des Antrags*:</label>
              <select
                name="antragstyp_id"
                required
                value={formDataState.antragstyp_id || ''}
                onChange={updateFormData}
              >
                <option key="antragstyp_id_0" value="">
                  Bitte wählen
                </option>
                {Object.values(typs).map((typ, ix) => (
                  <option key={`${typ.name}-${ix}`} value={typ.id}>
                    {typ.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <label htmlFor="mitarbeiter_id">Antragsteller*:</label>
              <SuggestionInput
                pageModel={pageTableModel}
                data={mitarbeiters}
                valName=""
                searchKeys={['planname', 'name']}
                setFoundItem={setFoundItem}
                cssClass=""
              />
            </fieldset>
            <fieldset>
              <label htmlFor="start">Von*:</label>
              <input
                type="date"
                name="start"
                required
                onChange={updateFormData}
                value={formDataState.start || ''}
                max={formDataState.ende || null}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="ende">Bis*:</label>
              <input
                type="date"
                name="ende"
                required
                onChange={updateFormData}
                value={formDataState.ende || ''}
                min={formDataState.start || null}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="ende">Abgesprochen mit:</label>
              <input
                type="text"
                name="abgesprochen"
                onChange={updateFormData}
                value={formDataState.abgesprochen || ''}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="kommentar">Kommentar:</label>
              <textarea name="kommentar" onChange={updateFormData} />
            </fieldset>
            {showPdf.includes(formDataState.antragstyp_id) && (
              <fieldset>
                <label htmlFor="pdf">PDF:</label>
                <input
                  type="file"
                  id="id"
                  name="pdf"
                  accept=".pdf"
                  onChange={fileChoosed}
                />
              </fieldset>
            )}
            <fieldset>
              <button type="submit">Senden</button>
            </fieldset>
          </form>
        </div>
        <div className="col">
          <div
            ref={einteilungen_select_div}
            className={styles.container_einteilung}
          >
            {Object.keys(einteilungenToReplace).map((date) => {
              const dataObj = einteilungenToReplace[date];
              const holiday = dataObj.holiday;
              const holiday_day = dataObj?.feiertag?.name || '';
              return (
                <div key={date} className={styles.einteilung_content}>
                  <p
                    title={holiday_day}
                    style={{ color: holiday ? 'gray' : 'initial' }}
                  >
                    <span>{dataObj.week_day}.</span>
                    <span>{date}</span>
                    {dataObj.select.length > 2 ? '*' : ''}
                  </p>
                  <select
                    onChange={(e) => onChangeDienst(e)}
                    name={`replace-dienst-for-date_${date}`}
                    className={styles.einteilung_select}
                    value={antraege.einteilungenToCreateForDates[date]}
                  >
                    {dataObj.select.map((einteilung) => {
                      return (
                        <option
                          key={`${date}-${einteilung.po_dienst_id}`}
                          value={einteilung.po_dienst_id}
                        >
                          {einteilung.planname}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>

          {showPdf.includes(formDataState.antragstyp_id) && (
            <div className="pdf">
              <h3>Zusätzliches Formular benötigt</h3>
              <p>
                {' '}
                Bei Dienstreisen oder Fortbildungen müssen Sie noch ein
                zusätzliches Formular ausfüllen.
                <br />
                Bitte laden Sie folgendes PDF herunter und füllen es aus:
                <br />
                <a
                  id="dienst"
                  href="https://hains.info/hains/downloads/send/3-formulare/3-antrag-für-dienstreise.html"
                  download=""
                  style={{ display: 'none' }}
                >
                  Dienstreise-PDF
                </a>
                <a
                  id="fort"
                  href="https://hains.info/hains/downloads/send/3-formulare/42-antrag-auf-fort-oder-weiterbildung.html"
                  download=""
                  style={{ display: 'block' }}
                >
                  Fortbildung-PDF
                </a>
                <br />
                Anschließend fügen Sie bitte das ausgefüllte PDF hier hinzu.
                Scannen oder Fotografieren genügt.
                <br />
                Sie können das PDF allerdings auch zu gegebener Zeit über
                &apos;Meine Anträge&apos; nachreichen.
              </p>
            </div>
          )}
        </div>
      </div>
      <Saldi
        getMitarbeiterId={() => formDataState?.mitarbeiter_id}
        antraege={antraege}
      />
    </div>
  );
}

export default AddAntrag;
