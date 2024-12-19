import React, { useEffect } from 'react';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function ColorField({
  label,
  id,
  handleChange,
  handleCheckbox,
  title = '',
  farbgruppen = false,
  getFields = false,
  colorPicker = false,
  setColorPicker = () => {}
}) {
  const { caret, show, handleClick, closeDropDown } = UseDropdown(false, true);

  const [onOver, onOut] = UseTooltip(title);

  const clickHandler = (evt) => {
    if (!show) setColorPicker(() => id);
    handleClick(evt);
  };

  useEffect(() => {
    if (show && colorPicker !== id) {
      closeDropDown();
    }
  }, [colorPicker]);

  if (!farbgruppen) return null;
  return (
    <div className="farbgruppen-colorfield">
      <div className="farbgruppen-colorfield-head">
        <input
          type="checkbox"
          checked={farbgruppen?.getGruppenShow(id)}
          onChange={handleCheckbox}
        />
        <input
          type="color"
          value={farbgruppen?.getGruppenColor(id)}
          onChange={handleChange}
        />
        <p onMouseOver={onOver} onMouseOut={onOut} onClick={clickHandler}>
          {label} <span className="caret">{caret}</span>
        </p>
      </div>
      {show && getFields && (
        <div className="farbgruppen-colorfield-body">{getFields(id)}</div>
      )}
    </div>
  );
}

export default ColorField;
