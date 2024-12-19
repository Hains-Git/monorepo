import React, { useContext } from 'react';
import { FaTrash, FaEye, FaInfo } from 'react-icons/fa';
import styles from './content-container.module.css';
import { VerteilerSearchContext } from '../../../contexts/verteiler';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function OneColList({ employee, einteilung, be_id }) {
  const { verteiler } = useContext(VerteilerFastContext);
  const search = useContext(VerteilerSearchContext);

  const dragOver = (e) => {
    e.preventDefault();
  };

  const removeEinteilung = () => {
    const ok = window.confirm('Einteilung aufheben?');
    if (!ok) return;
    verteiler.removeEinteilung(einteilung, be_id);
  };

  const updateStatusId = async () => {
    const err = await verteiler.updateEinteilungsStatusId(einteilung.id);
    if (err) alert(err);
  };

  const isNotPublic = () => {
    const einteilungsstatus_id = einteilung.einteilungsstatus_id;
    const status = verteiler.getStatus(einteilungsstatus_id);
    return !status?.public;
  };

  if (!employee) return null;

  const isInSearch = () => {
    const name = employee?.planname?.toLowerCase?.() || '';
    if (!search || typeof search !== 'string') return false;
    return name.includes(search.toLowerCase());
  };

  return (
    <p
      className={isInSearch() ? styles.highlight : ''}
      draggable
      onDragOver={dragOver}
      onDoubleClick={(evt) => {
        verteiler.setEinteilungFeldInfo(einteilung, be_id, evt);
      }}
      data-eid={einteilung?.id}
      data-mid={employee?.id}
      data-fid={employee?.funktion_id}
    >
      <span>
        {employee?.planname} {isNotPublic() && <span>**</span>}
      </span>
      <span className="action-btns">
        {isNotPublic() && (
          <span onClick={updateStatusId} className="status-icon">
            <FaEye color="rgba(129,129,129, 0.6)" />
          </span>
        )}
        <span
          onClick={(evt) =>
            verteiler.setEinteilungFeldInfo(einteilung, be_id, evt)
          }
        >
          <FaInfo color="rgba(129,129,129, 0.6)" />
        </span>

        <span onClick={removeEinteilung} className="trash-icon">
          <FaTrash color="rgba(178,35,34, 0.6)" />
        </span>
      </span>
    </p>
  );
}

export default OneColList;
