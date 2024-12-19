import React from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseTooltip } from '../../../hooks/use-tooltip';
import Konflikt from './Konflikt';

function KonfliktFilter({
  label = 'Konflikte',
  konfliktFilter,
  showAllways = false
}) {
  const [onOver, onOut] = UseTooltip(
    'Filter, um Konflikt-Markierung zu de-/aktivieren'
  );

  const { caret, show, handleClick } = UseDropdown(false, true);

  if (!konfliktFilter?.getKonflikte) return null;
  return (
    <div className="konflikt-filter">
      <div className="konflikt-filter-head">
        <div className="konflikt-filter-label" onClick={handleClick}>
          <p onMouseOver={onOver} onMouseOut={onOut}>
            <span>{label}</span>
            <span className="caret">{caret}</span>
          </p>
        </div>
      </div>

      {(show || showAllways) && (
        <div
          className="konflikt-filter-optionen"
          onClick={(evt) => evt.stopPropagation()}
        >
          {konfliktFilter.getKonflikte((typ, key) => (
            <Konflikt key={key} konflikt={typ} />
          ))}
        </div>
      )}
    </div>
  );
}

export default KonfliktFilter;
