import React, { useState } from 'react';

function Input({ filter, filterItemCb }) {
  const [searchText, setSearchText] = useState(filter.initial_val);

  const changeInput = (e) => {
    const val = e.target.value;
    setSearchText(() => val);
    getSearchResult(val);
  };

  function debounce(callback, delay = 1000) {
    let time;
    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }
  const getSearchResult = debounce((val) => {
    filterItemCb({ filter, val });
  }, 375);

  return (
    <>
      {filter?.label && <label htmlFor={filter.key}>{filter?.label}</label>}
      {filter.type === 'date' ? (
        <input
          id={filter?.key}
          onChange={changeInput}
          type={filter?.type || 'text'}
          name={filter?.key}
          value={filter?.initial_val || ''}
          placeholder={filter?.placeholder || ''}
        />
      ) : (
        <input
          id={filter.key}
          onChange={changeInput}
          value={searchText}
          type={filter?.type || 'text'}
          name={filter?.key}
          placeholder={filter?.placeholder || ''}
        />
      )}
    </>
  );
}

export default Input;
