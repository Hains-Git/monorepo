import React from 'react';
import { UseRegister } from '../../../hooks/use-register';
import { UseTooltip } from '../../../hooks/use-tooltip';
import CustomButton from '../../utils/custom_buttons/CustomButton';

function FilterField({ field }) {
  const { id, checked, title, label, button } = field;

  const [onOver, onOut] = UseTooltip(title);
  UseRegister(field?._push, field?._pull, field);

  const handleChange = (evt, setLoading) => {
    field.debouncedHandleCheck(!checked, true, true);
    setLoading?.(() => false);
  };

  return button ? (
    <div className="filter-vorlage-option">
      <CustomButton
        spinner={{ show: true }}
        title={title}
        clickHandler={handleChange}
        className="filter-vorlage-button"
      >
        {label}
      </CustomButton>
    </div>
  ) : (
    <div className="filter-vorlage-option">
      <input
        type="checkbox"
        name={id}
        id={id}
        onChange={handleChange}
        checked={checked}
      />
      <label htmlFor={id} onMouseOver={onOver} onMouseOut={onOut}>
        {label}
      </label>
    </div>
  );
}

export default FilterField;
