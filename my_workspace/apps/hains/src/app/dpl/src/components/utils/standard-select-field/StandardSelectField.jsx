import React, { useEffect, useRef, useState } from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseMounted } from '../../../hooks/use-mounted';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { debounce, wait } from '../../../tools/debounce';
import CustomInput from '../custom-input/CustomInput';
import StandardDropdown from './standard-dropdown/StandardDropdown';

import styles from './standard-select-field.module.css';

function StandardSelectField({
  name,
  options,
  optionKey,
  itemHandler = () => {},
  start = 0,
  readOnly = false,
  title = '',
  className = ''
}) {
  const [onOver, onOut] = UseTooltip(title);
  const { caret, show, handleClick, closeDropDown } = UseDropdown(false, true);

  const getStartOption = (startToGet) => {
    const startOption = options?.[startToGet];
    const startLabel = startOption?.[optionKey] || '';
    const startTitle = startOption?.title || '';

    return {
      startOption,
      startLabel,
      startTitle
    };
  };

  const thisRef = useRef(null);
  const [label, setLabel] = useState('');
  const [labelTitle, setLabelTitle] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const mounted = UseMounted();
  const thisClassName = `custom-select-field ${className}`;

  useEffect(() => {
    const { startOption, startLabel, startTitle } = getStartOption(start);
    setLabel(() => startLabel);
    setLabelTitle(() => startTitle);
    itemHandler(startOption, start);
  }, [start]);

  const setNewLabel = (el, i) => {
    const thisLabel = el[optionKey];
    itemHandler(el, i);
    setLabel(() => thisLabel);
    setLabelTitle(() => (el.title ? el.title : ''));
  };

  const handleOnClick = (evt) => {
    const value = evt.target.value;
    options.find((o, i) => {
      const result = o.id.toString() === value.toString();
      if (result) setNewLabel(o, i);
      return result;
    });

    closeDropDown();
  };

  const filter = (value = '') => {
    const trimedLowerCaseValue = value.trim().toLowerCase();
    if (!mounted) return;
    let result = options;
    if (trimedLowerCaseValue !== '')
      result = options.filter(
        (o) => o[optionKey].toLowerCase().indexOf(trimedLowerCaseValue) >= 0
      );
    const l = result.length;
    if (l === 0) result = options;
    setFilteredOptions(() => result);

    if (
      l === 1 &&
      trimedLowerCaseValue === result[0][optionKey].trim().toLowerCase()
    ) {
      setNewLabel(result[0]);
      closeDropDown();
    }
  };

  const debouncedFilterVorlage = debounce(filter, wait);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setLabel(() => value);
    if (!show) handleClick();
    debouncedFilterVorlage(value);
  };

  useEffect(() => {
    setFilteredOptions(() => options);
  }, [options]);

  return (
    <div className={`standard-select-field ${thisClassName}`} ref={thisRef}>
      <div className={`custom-select-field-label ${styles.field_label}`}>
        {name && (
          <p
            className="standard-select-field-label"
            onMouseOver={onOver}
            onMouseOut={onOut}
          >
            {name}:
          </p>
        )}
        <CustomInput
          onChange={handleChange}
          value={label}
          readOnly={readOnly}
          onClick={readOnly ? handleClick : null}
          title={labelTitle}
        />
        <span className={`caret ${styles.caret}`} onClick={handleClick}>
          {caret}
        </span>
      </div>
      {show ? (
        <StandardDropdown
          options={filteredOptions}
          optionKey={optionKey}
          handleOnClick={handleOnClick}
        />
      ) : null}
    </div>
  );
}

export default StandardSelectField;
