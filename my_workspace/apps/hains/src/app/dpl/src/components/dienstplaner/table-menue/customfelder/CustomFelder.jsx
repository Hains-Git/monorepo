import React from 'react';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import { UseRegister } from '../../../../hooks/use-register';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import CustomButton from '../../../utils/custom_buttons/CustomButton';

function CustomFelder({ label, el, row = true, title = '', tooltip = '' }) {
  if (!el) return;
  UseRegister(el?._push, el?._pull, el);

  const { caret, show, handleClick } = UseDropdown(false, true);

  const [onOver, onOut] = UseTooltip(tooltip);

  const add = (evt, setLoading) => {
    evt.stopPropagation();
    el.throttledAdd?.(row);
    setLoading?.(() => false);
  };

  const remove = (evt, setLoading) => {
    evt.stopPropagation();
    el.throttledRemove?.(row);
    setLoading?.(() => false);
  };

  return (
    <div className="custom-dienstplanfelder-container">
      <div className="custom-dienstplanfelder-header" onClick={handleClick}>
        <p
          className="custom-dienstplanfelder-label"
          onMouseOver={onOver}
          onMouseOut={onOut}
        >
          <span>{label}</span>
          <span className="caret">{caret}</span>
        </p>
      </div>
      {show && (
        <div className="custom-dienstplanfelder-optionen">
          <CustomButton
            spinner={{ show: true }}
            title={`Erstellt eine neue benutzerdefinierte ${title}`}
            disable={
              row
                ? el?.customRowLimitReached?.()
                : el?.customColumnLimitReached?.()
            }
            clickHandler={add}
          >
            +
          </CustomButton>
          <CustomButton
            spinner={{ show: true }}
            title={`Löscht die letzte benutzerdefinierte ${title}`}
            disable={row ? el?.hasNoCustomRows?.() : el?.hasNoCustomColumns?.()}
            clickHandler={remove}
          >
            -
          </CustomButton>
        </div>
      )}
    </div>
  );
}

export default CustomFelder;
