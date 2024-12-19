import React, { useState } from 'react';

function Select({ filter, filterItemCb }) {
  const val =
    filter.initial_val === undefined || filter.initial_val === null
      ? ''
      : filter.initial_val;

  const changeSelect = (e) => {
    const val = e.target.value;
    filterItemCb({ filter, val });
  };

  return (
    <fieldset>
      {filter?.label && <label htmlFor={filter.key}>{filter?.label}</label>}
      <select id={filter.key} value={val} onChange={changeSelect}>
        {filter.options.map((option, ix) => (
          <option
            value={option.id}
            key={`${filter.key}-${option.id}-${option.name}`}
          >
            {option.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}

export default Select;
