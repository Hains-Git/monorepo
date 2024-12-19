import React from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseRegister } from '../../../hooks/use-register';
import { UseTooltip } from '../../../hooks/use-tooltip';
import FilterField from './FilterField';
import { numericLocaleCompare } from '../../../tools/helper';

function FilterGroup({ group }) {
  const { label, showAlways, title, sort, hinweis, handleClick } = group || {};
  UseRegister(group?._push, group?._pull, group);

  const [onOver, onOut] = UseTooltip(title);

  const dropdown = UseDropdown(false, false);
  const caret = dropdown.caret;
  const show = dropdown.show;
  const toggleDropdown = dropdown.handleClick;

  const sortOptions = (a, b) => {
    const fieldA = a.props.field;
    const fieldB = b.props.field;
    const isAButton = fieldA.button;
    const isBButton = fieldB.button;
    const aLabel = fieldA.label;
    const bLabel = fieldB.label;

    let sortButton = 0;
    if (isAButton && !isBButton) {
      sortButton = -1;
    } else if (!isAButton && isBButton) {
      sortButton = 1;
    }

    const sortLabel = numericLocaleCompare(aLabel, bLabel);

    return sortButton === 0 ? sortLabel : sortButton;
  };

  const getOptions = () => {
    let fields = group?.getFields?.((field) => (
      <FilterField field={field} key={field.id} />
    ));
    if (sort) fields = fields?.sort?.(sortOptions);

    return fields || null;
  };

  if (!group) return null;
  return (
    <div className="filter-vorlage-group">
      {label ? (
        <div
          className="filter-vorlage-group-label"
          onMouseOver={onOver}
          onMouseOut={onOut}
          onClick={(evt) => {
            if (!showAlways) toggleDropdown(evt);
            if (handleClick) handleClick();
          }}
        >
          <p>
            <span>{label}</span>
            <span className="caret">{caret}</span>
          </p>
        </div>
      ) : null}

      {show || showAlways ? (
        <div className="filter-vorlage-group-container">
          {hinweis?.map &&
            hinweis.map((el, i) =>
              el !== '' ? (
                <div
                  key={`hinweis_${i}`}
                  className="filter-vorlage-group-hinweis"
                >
                  {el}
                </div>
              ) : null
            )}
          {getOptions()}
        </div>
      ) : null}
    </div>
  );
}

export default FilterGroup;
