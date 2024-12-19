import React, { useState, useEffect, memo, useContext } from 'react';
import { FaTrash, FaEye, FaInfo } from 'react-icons/fa';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { UseRegister } from '../../../hooks/use-register';
import { isArray } from '../../../tools/types';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';
import SuggestionInputVerteiler from '../../utils/suggestion-input/SuggestionInputVerteiler';
import { pushToMitarbeiterDetails } from '../../../util_func/util';

function Employee({
  employee,
  cssClass,
  po_dienst,
  searchBoxClb,
  be_id,
  fieldId,
  einteilung,
  dayCol,
  bereich_id
}) {
  const { verteiler, employeesRoom } = useContext(VerteilerFastContext);
  const [conflictObj, setConflictObj] = useState('');
  const update = UseRegister(employee?._push, employee?._pull, employee);

  const getTitle = () => {
    const arr = isArray(conflictObj?.title) ? [...conflictObj.title] : [];

    const kontextKommentar = einteilung?.context_comment;
    const kontext =
      einteilung?.einteilungskontext?.name || einteilung?.einteilungskontext_id;
    if (kontextKommentar || kontext) {
      arr.unshift({ txt: `Kontext: ${kontext}\n${kontextKommentar}\n` });
    }
    return arr;
  };

  const [onOver, onOut] = UseTooltip(getTitle());

  useEffect(() => {
    const data = verteiler.data;
    if (einteilung?.feld?.getStyle && data) {
      const conflict = data.addEmployeeToNichtVerteilt(einteilung?.feld);
      setConflictObj(() => conflict);
    }
    return () => {
      onOut();
    };
  }, [einteilung, po_dienst, employee, verteiler, update]);

  const dragOver = (e) => {
    e.preventDefault();
  };

  const setFoundItem = (cbData) => {
    const tag = dayCol;
    const isOpt = cssClass.includes('opt');
    const obj = {
      mitarbeiter: cbData.listItem,
      einteilung: null,
      po_dienst,
      be_id,
      tag,
      fieldId: cbData.fieldId,
      isOpt
    };
    searchBoxClb(obj);
  };

  const draggable = cssClass !== 'no-drag' && !!employee?.id;

  const handleClick = (event) => {
    if (event.detail === 2) {
      pushToMitarbeiterDetails(employee?.id || 0);
    }
  };

  const removeEinteilung = async () => {
    const ok = window.confirm('Einteilung aufheben?');
    if (!ok) return;
    const isDeleted = await verteiler.removeEinteilung(einteilung, be_id);
    if (isDeleted) {
      const eId = einteilung?.id;
      const tag = einteilung?.tag;
      if (employeesRoom?.[tag]?.[eId]) {
        delete employeesRoom[tag][eId];
      }
    }
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

  const openVorschlaege = () => {
    verteiler?.mitarbeiterVorschlaege?.set?.(
      dayCol,
      po_dienst.id,
      be_id,
      bereich_id
    );
  };

  return (
    <div
      id={`employee-${employee?.id || 0}`}
      className={`${verteiler.getComClassName(
        'employee',
        cssClass,
        conflictObj?.className
      )}`}
      onDragOver={dragOver}
      data-bereich_id={bereich_id}
    >
      {employee?.id ? (
        <div
          onClick={handleClick}
          className={`fake-input ${cssClass}`}
          onMouseOver={onOver}
          onMouseOut={onOut}
        >
          <p
            draggable={draggable}
            data-mid={employee?.id}
            data-eid={einteilung?.id}
            data-fid={employee?.funktion_id}
          >
            {employee.planname} {isNotPublic() && <span>**</span>}
          </p>
          <div className="action-btns">
            {isNotPublic() && (
              <span onClick={updateStatusId} className="status-icon">
                <FaEye color="rgba(129,129,129, 0.6)" />
              </span>
            )}
            <span onClick={removeEinteilung} className="trash-icon">
              <FaTrash color="rgba(178,35,34, 0.6)" />
            </span>
            <span
              onClick={(evt) =>
                verteiler.setEinteilungFeldInfo(einteilung, be_id, evt)
              }
            >
              <FaInfo color="rgba(129,129,129, 0.6)" />
            </span>
          </div>
        </div>
      ) : (
        <>
          <SuggestionInputVerteiler
            data={verteiler.mitarbeiters}
            valName={employee?.planname ? employee.planname : ''}
            searchKeys={['planname', 'name']}
            setFoundItem={setFoundItem}
            cssClass={cssClass}
            fieldId={fieldId}
            onDoubleClick={openVorschlaege}
          />
          <div className="action-btns">
            <span
              onClick={(evt) =>
                verteiler.setEinteilungFeldInfo(einteilung, be_id, evt)
              }
            >
              <FaInfo color="rgba(129,129,129, 0.6)" />
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(Employee);
