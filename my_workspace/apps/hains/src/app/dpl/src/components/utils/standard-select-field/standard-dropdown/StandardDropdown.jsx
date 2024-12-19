import React from 'react';
import StandardDropdownItem from './items/Item';
import styles from './standard-dropdown.module.css';

function StandardDropdown({ options, handleOnClick = () => {}, optionKey }) {
  const className =
    'custom-select-button custom-select-buttons-text standard-select-dropdown-items';

  return (
    <div
      className={`custom-select-field-dropdown standard-select-dropdown ${styles.dropdown_container}`}
    >
      {options.map((option, i) => {
        const value = option.id;
        const text = option[optionKey];
        return (
          <StandardDropdownItem
            key={`el_${value}-${i}`}
            className={`${className} ${styles.dropdown_item}`}
            value={value}
            handleOnClick={handleOnClick}
            title={option.title ? option.title : ''}
            text={text}
          />
        );
      })}
    </div>
  );
}

export default StandardDropdown;
