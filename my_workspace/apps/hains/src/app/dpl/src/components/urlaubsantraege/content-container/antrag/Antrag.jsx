import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GenericTable from '../../../generic-table/GenericTable';
import { UseRegisterKey } from '../../../../hooks/use-register';
import Saldi from '../saldi/Saldi';
import EinteilungenCheck from '../einteilungen-check/EinteilungenCheck';
import SuggestionInput from '../../../utils/suggestion-input/SuggestionInput';
import SpinnerIcon from '../../../utils/spinner-icon/SpinnerIcon';
import styles from '../contentcontainer.module.css';
import { getFullDate } from '../../../../tools/dates';

function Antrag({
  antraege,
  pageTableModel,
  sendToApi,
  setErrMsg,
  newAntrag,
  className = '',
  title = 'Antrag'
}) {
  const dataRow = pageTableModel.dataRow;
  const history = useHistory();
  const [formDataState, setFormDataState] = useState({});
  const [showLoader, setShowLoader] = useState(false);

  const antragstyps = pageTableModel.antragstyp;
  const statuse = pageTableModel.antragsstatus;
  const mitarbeiters = pageTableModel._mitarbeiters._each(
    false,
    (m) => m.aktiv && !m.platzhalter
  ).arr;
  const showPdf = [2, 4];

  const historyTableModel = pageTableModel.historyTableModel;
  UseRegisterKey('updateTable', historyTableModel.push, historyTableModel.pull);

  useEffect(() => {
    if (!newAntrag && dataRow?.id) {
      setFormDataState(() => ({
        antragsstatus_id: dataRow.antragsstatus.id,
        antragstyp_id: dataRow.antragstyp.id,
        kommentar: '',
        start: dataRow.start,
        ende: dataRow.ende,
        mitarbeiter_id: dataRow.mitarbeiter.id,
        abgesprochen: dataRow.abgesprochen
      }));
    } else {
      setFormDataState(() => ({
        antragstyp_id: Object.values(antragstyps)[0]?.id || 0,
        antragsstatus_id: Object.values(statuse)[0]?.id || 0,
        kommentar: '',
        abgesprochen: ''
      }));
    }
  }, [antraege, dataRow, newAntrag]);

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

  const formatDate = (str) => {
    const date = new Date(str);
    return date.toLocaleDateString('de-De', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const hasValueChanged = () => {
    if (newAntrag) return true;
    let changed = false;
    if (dataRow) {
      for (const key in formDataState) {
        const val = formDataState[key];
        changed = val !== dataRow[key];
        if (key === 'antragstyp_id') {
          changed = val !== dataRow.antragstyp.id;
        } else if (key === 'antragsstatus_id') {
          changed = val !== dataRow.antragsstatus.id;
        }
        if (changed) break;
      }
    }

    return changed;
  };

  const getWeiteres = () => {
    let weiteres = '';
    weiteres +=
      formDataState.start !== dataRow.start
        ? `Begin: ${getFullDate(dataRow.start)} zu ${getFullDate(formDataState.start)}<br/>`
        : '';
    weiteres +=
      formDataState.ende !== dataRow.ende
        ? `Ende: ${getFullDate(dataRow.ende)} zu ${getFullDate(formDataState.ende)}<br/>`
        : '';
    weiteres +=
      formDataState.antragstyp_id !== dataRow.antragstyp.id
        ? `Antragsart: ${antragstyps[dataRow.antragstyp.id].name} zu ${
            antragstyps[formDataState.antragstyp_id].name
          }<br/>`
        : '';
    return weiteres;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg('');
    setShowLoader(() => true);

    const newFormDataState = { ...formDataState };
    if (!newAntrag && dataRow) {
      newFormDataState.weiteres = getWeiteres();
      newFormDataState.antraege_id = dataRow?.id || 0;
    }

    const formData = new FormData();
    for (const key in newFormDataState) {
      const val = newFormDataState[key];
      if (key === 'antrag_file') {
        formData.append(key, val, val.name);
      } else {
        formData.append(key, val);
      }
    }
    formData.append(
      'einteilungenToCreateForDates',
      JSON.stringify(antraege.einteilungenToCreateForDates)
    );

    const antragstyp = antragstyps[formDataState?.antragstyp_id];
    const antragsstatus = statuse[formDataState?.antragsstatus_id];
    let invalid = false;
    const errorStrArr = [];
    if (antragsstatus?.name === 'Genehmigt') {
      const einteilungenDates = antraege.einteilungenToCreateForDates;
      Object.keys(einteilungenDates).forEach((date) => {
        const obj = einteilungenDates[date];
        const dienst_id = obj?.dienst_id?.toString?.() || '';
        const holiday = obj?.holiday;
        if (holiday && !dienst_id === '0') return;
        const is = (name) => {
          const id = antragstyp?.[name]?.toString?.();
          return !!(id && dienst_id === id);
        };
        const isValidOption =
          holiday || is('po_dienst_id') || is('alternative_po_dienst_id');
        if (!isValidOption) {
          errorStrArr.push(date);
          invalid = true;
        }
      });
    }

    if (invalid) {
      setShowLoader(() => false);
      alert(`Folgende Tage ${errorStrArr.join(', ')} müssen ersetzt werden.`);
    } else if (hasValueChanged()) {
      sendToApi(
        newAntrag ? 'add_antrag' : 'add_antrag_in_history',
        formData,
        () => {
          setFormDataState((curr) => ({ ...curr }));
          setShowLoader(() => false);
        }
      );
    }
  };

  const createHyperLinkAbwesenheitsliste = () => {
    if (!formDataState.start) return null;
    const linkTo = `${document.location.origin}/dpl/abwesentheitsliste?date=${formDataState.start}`;
    return (
      <p>
        <a rel="noreferrer" target="_blank" href={linkTo}>
          Abwesentheitsliste
        </a>
      </p>
    );
  };

  const createHyperLinkMitarbeiterInfo = () => {
    if (!formDataState.mitarbeiter_id) return null;
    const linkTo = `${document.location.origin}/hains/component/antraege/index.php?option=com_dienstplaner&view=mitarbeiterdetails&refresh=1&id=${formDataState.mitarbeiter_id}`;
    return (
      <p>
        <a target="_blank" href={linkTo} rel="noreferrer">
          Mitarbeiter Info
        </a>
      </p>
    );
  };

  const fileChoosed = async (e) => {
    const file = e.target.files[0];
    setFormDataState(() => ({
      ...formDataState,
      antrag_file: file
    }));
  };

  if (!newAntrag && !dataRow?.id) return <p>Ungültiger Antrag</p>;
  return (
    <>
      <div className={`${className} form-antrag`}>
        <form
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <div className="header">
            <h2>{title}</h2>
            <div className="action-btns">
              <button
                className="cancle"
                type="button"
                onClick={() => {
                  setErrMsg('');
                  history.push(`${history.location.pathname}`);
                  pageTableModel.changeView('overview');
                }}
              >
                Zurück
              </button>
              <button type="submit" disabled={showLoader}>
                {showLoader ? (
                  <SpinnerIcon color="#00427a" padding={0} />
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
          <div className="antrag-info">
            {newAntrag ? null : <h3>Antrag Nr.: {dataRow.id}</h3>}
            <div className="right-side">
              {createHyperLinkMitarbeiterInfo()}
              {createHyperLinkAbwesenheitsliste()}
            </div>
          </div>
          <div className="column2">
            <div className="col">
              <fieldset>
                <label htmlFor="antragsstatus_id">Status*:</label>
                <select
                  name="antragsstatus_id"
                  id="antragsstatus_id"
                  required
                  value={formDataState.antragsstatus_id || ''}
                  onChange={updateFormData}
                >
                  {Object.values(statuse).map((status, ix) => {
                    return (
                      <option key={`${status.name}-${ix}`} value={status.id}>
                        {status.name}
                      </option>
                    );
                  })}
                </select>
              </fieldset>
              <fieldset>
                <label htmlFor="antragstyp_id">Art des Antrags*:</label>
                <select
                  name="antragstyp_id"
                  id="antragstyp_id"
                  required
                  value={formDataState.antragstyp_id || ''}
                  onChange={updateFormData}
                >
                  {Object.values(antragstyps).map((typ, ix) => {
                    return (
                      <option key={`${typ.name}-${ix}`} value={typ.id}>
                        {typ.name}
                      </option>
                    );
                  })}
                </select>
              </fieldset>
              <fieldset>
                <label
                  htmlFor="name"
                  title={
                    dataRow?.mitarbeiter
                      ? `Planname: ${dataRow.mitarbeiter.planname || ''}\nID: ${dataRow.mitarbeiter.id || ''}`
                      : ''
                  }
                >
                  Angestellter*:
                </label>
                <SuggestionInput
                  pageModel={pageTableModel}
                  disabled={!newAntrag}
                  inputName="name"
                  id="name"
                  data={mitarbeiters}
                  valName={newAntrag ? '' : dataRow.mitarbeiter.name || ''}
                  searchKeys={['planname', 'name']}
                  setFoundItem={setFoundItem}
                  onReset={() => setFoundItem()}
                  cssClass={styles.searchbox}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="start">Von*:</label>
                <input
                  type="date"
                  name="start"
                  id="start"
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
                  id="ende"
                  required
                  onChange={updateFormData}
                  value={formDataState.ende || ''}
                  min={formDataState.start || null}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="abgesprochen">Abgesprochen mit*:</label>
                <input
                  type="text"
                  disabled={!newAntrag}
                  name="abgesprochen"
                  id="abgesprochen"
                  onChange={newAntrag ? updateFormData : null}
                  value={formDataState.abgesprochen || ''}
                />
              </fieldset>
              <fieldset>
                <label htmlFor="kommentar">Kommentar Hinzufügen:</label>
                <textarea
                  name="kommentar"
                  value={formDataState.kommentar || ''}
                  onChange={updateFormData}
                />
              </fieldset>

              {newAntrag ? (
                showPdf.includes(formDataState.antragstyp_id) && (
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
                )
              ) : (
                <>
                  <fieldset>
                    <label htmlFor="eingereicht">Eingereicht am:</label>
                    <input
                      type="text"
                      name="eingereicht"
                      id="eingereicht"
                      disabled
                      value={formatDate(dataRow.created_at) || ''}
                    />
                  </fieldset>
                  {dataRow.kommentar ? (
                    <fieldset>
                      <label htmlFor="kommentar_prev">Kommentar:</label>
                      <textarea
                        name="kommentar_prev"
                        id="kommentar_prev"
                        disabled
                        value={dataRow.kommentar}
                      />
                    </fieldset>
                  ) : null}
                  {dataRow.file_url && (
                    <fieldset className="columns">
                      <label htmlFor="datei">Datei</label>
                      <p>
                        <a href={`${dataRow.file_url}`}>Download</a>
                      </p>
                    </fieldset>
                  )}
                </>
              )}
            </div>

            <div className="col">
              <EinteilungenCheck
                antraege={antraege}
                formDataState={formDataState}
              />

              {newAntrag
                ? showPdf.includes(formDataState.antragstyp_id) && (
                    <div className="pdf">
                      <h3>Zusätzliches Formular benötigt</h3>
                      <p>
                        {' '}
                        Bei Dienstreisen oder Fortbildungen müssen Sie noch ein
                        zusätzliches Formular ausfüllen.
                        <br />
                        Bitte laden Sie folgendes PDF herunter und füllen es
                        aus:
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
                        Anschließend fügen Sie bitte das ausgefüllte PDF hier
                        hinzu. Scannen oder Fotografieren genügt.
                        <br />
                        Sie können das PDF allerdings auch zu gegebener Zeit
                        über &apos;Meine Anträge&apos; nachreichen.
                      </p>
                    </div>
                  )
                : null}
            </div>
          </div>
        </form>
      </div>
      <Saldi
        getMitarbeiterId={() => dataRow?.mitarbeiter?.id}
        formDataState={formDataState}
        antraege={antraege}
      />
      {newAntrag ? null : (
        <>
          <h3>Bearbeitet von:</h3>
          <GenericTable pageTableModel={historyTableModel} />
        </>
      )}
    </>
  );
}

export default Antrag;
