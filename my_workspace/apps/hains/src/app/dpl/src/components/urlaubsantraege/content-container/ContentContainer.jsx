/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import GenericTable from '../../generic-table/GenericTable';

import { UseRegisterKey } from '../../../hooks/use-register';
import Antrag from './antrag/Antrag';
import { UseGenericTableURL } from '../../../hooks/use-url';

function ContentContainer({ antraege }) {
  const pageTableModel = antraege.urlaubs_antraege_table;
  const view = pageTableModel.view;
  const [errMsg, setErrMsg] = useState([]);
  const [errClass, setErrClass] = useState('error');
  const history = useHistory();
  UseRegisterKey('updateView', pageTableModel.push, pageTableModel.pull);
  UseGenericTableURL(pageTableModel);

  const sendToApi = async (url, formData, callback) => {
    const data = await pageTableModel.addNewAntrag(url, formData);
    const msg = [];
    if (data?.msg) {
      msg.push(data.msg);
    }
    if (data?.mail) {
      msg.push(data.mail);
    }
    setErrMsg(() => msg);
    let errClassName = 'error';
    switch (data?.success) {
      case 'success':
        errClassName = 'success';
        break;
      case 'error':
        errClassName = 'error';
        break;
      default:
        errClassName = 'warning';
    }
    setErrClass(() => errClassName);
    if (errClassName === 'success') {
      history.push(`${history.location.pathname}`);
      pageTableModel.changeView('overview');
    }
    callback();
  };

  const deleteAntraege = async () => {
    const ids = pageTableModel.deleteAntraegeIds;
    if (ids && !ids.length) {
      alert('Bitte zuerst eine Auswahl in der Liste vornehmen!');
      return;
    }
    const answer = window.confirm(
      'Sind Sie sicher, dass Sie diese Anträge löschen möchten?'
    );
    if (!answer) return;

    const msg = await pageTableModel.deleteAntraege();
    const success = !msg || msg.toLowerCase() === 'ok';
    setErrMsg(() => [success ? 'Anträge wurde erfolgreich gelöscht' : msg]);
    setErrClass(() => (success ? 'success' : 'error'));
  };

  return (
    <div className="content-container">
      <div className="info-box">
        <div className="info">
          <h3>Hinweis:</h3>
          <p>
            In Bearbeitung, In Klärung und Rücksprache werden alle Anträge
            angezeigt.
          </p>
          <p>
            Genehmigt, Nicht Genehmigt, Von mir bearbeitet und Abgeschlossen
            werden nur die letzten 3 Monate angezeigt.
          </p>
          <p>
            Um Anträge zu sehen die länger als 3 Monate her sind, bitte den
            Kalender benutzen.
          </p>
          <p>
            Einteilungen werden bei Statusänderung nicht automatisch
            aktualisiert, wenn der Einteilungstag kleiner dem heutigen Tag ist.
          </p>
        </div>
      </div>
      {errMsg?.length ? (
        <div className={`errMsg-container ${errClass}`}>
          <div className="errMsg">
            {errMsg.map((msg, i) => (
              <p key={`err-msg-${i}`} className="errMsg">
                {msg}
              </p>
            ))}
          </div>
          <span onClick={() => setErrMsg([])} title="Schließen">
            X
          </span>
        </div>
      ) : null}

      {view === 'new' || view === 'edit' ? (
        <div className="urlaubsanträge-anträge-wrapper">
          <Antrag
            antraege={antraege}
            pageTableModel={pageTableModel}
            sendToApi={sendToApi}
            setErrMsg={setErrMsg}
            className={view === 'new' ? 'add-antrag' : 'edit-antrag'}
            title={view === 'new' ? 'Neuer Antrag' : 'Details'}
            newAntrag={view === 'new'}
          />
        </div>
      ) : (
        <GenericTable
          pageTableModel={antraege.urlaubs_antraege_table}
          header={
            <div className="top-row">
              <h2>Alle Anträge</h2>
              <div className="action-btns">
                <button
                  type="button"
                  onClick={() =>
                    antraege.urlaubs_antraege_table.changeView('new')
                  }
                >
                  Neu
                </button>
                <button type="button" onClick={deleteAntraege} className="del">
                  Löschen
                </button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
export default ContentContainer;
