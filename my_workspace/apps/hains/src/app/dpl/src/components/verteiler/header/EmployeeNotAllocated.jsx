import React, { useCallback, useContext } from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';
import { debounce, wait } from '../../../tools/debounce';
import { UseMounted } from '../../../hooks/use-mounted';
import { pushToMitarbeiterDetails } from '../../../util_func/util';

function EmployeeNotAllocated({ mitarbeiter, dateStr }) {
  const mounted = UseMounted();
  const { useVerteilerFastContextFields } = useContext(VerteilerFastContext);
  const { showForm, newEinteilung } = useVerteilerFastContextFields([
    'showForm',
    'newEinteilung'
  ]);
  const getTitle = useCallback(
    () => mitarbeiter.rotationenTitleAm(dateStr),
    [mitarbeiter, dateStr]
  );

  const [onOver, onOut] = UseTooltip(getTitle, true);

  const dragOver = (e) => {
    e.preventDefault();
  };

  const debouncedClick = useCallback(
    debounce((callback) => {
      callback();
    }, wait),
    []
  );

  const showFormOnClick = (evt) => {
    evt.stopPropagation();
    debouncedClick(() => {
      if (!mounted) return;
      if (evt.detail > 1) {
        pushToMitarbeiterDetails(mitarbeiter?.id || 0);
      } else if (evt.shiftKey && mitarbeiter?.setInfo) {
        mitarbeiter.setInfo(evt);
      } else {
        const blankEinteilung = {
          bereich_id: 0,
          einteilung: undefined,
          mitarbeiter,
          po_dienst: { id: 0 },
          tag: dateStr,
          dateStr
        };
        showForm.set(true);
        newEinteilung.set(blankEinteilung);
      }
    });
  };

  const wunsch = mitarbeiter?.getWunschAm?.(dateStr);
  const name = mitarbeiter?.getName?.();
  const wunschInitialien = wunsch?.getInitialien?.();
  const wunschColor = wunsch?.getColor?.();
  return (
    <p
      draggable
      onDragOver={dragOver}
      onMouseOver={onOver}
      onMouseOut={onOut}
      onClick={showFormOnClick}
      data-mid={mitarbeiter?.id}
    >
      {mitarbeiter.planname}
      {wunsch ? (
        <span
          style={
            wunschColor
              ? {
                  color: wunschColor
                }
              : {}
          }
          title={name || ''}
        >
          {` (${wunschInitialien || ''})`}
        </span>
      ) : null}
    </p>
  );
}
export default EmployeeNotAllocated;
