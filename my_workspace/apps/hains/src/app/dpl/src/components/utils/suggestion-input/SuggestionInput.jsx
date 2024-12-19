import React, { useState, useEffect, useRef } from 'react';
import styles from './suggestion-input.module.css';

import { UseRegisterKey } from '../../../hooks/use-register';

function SuggestionInput({
  pageModel,
  data,
  valName,
  searchKeys,
  setFoundItem,
  onReset,
  cssClass = '',
  fieldId,
  inputName = '',
  id = '',
  disabled = false,
  onDoubleClick = null
}) {
  const [searchData, setSearchData] = useState(data);
  const [showSearchbox, setShowSearchbox] = useState(false);
  const [name, setName] = useState(valName);
  const hideList = useRef(null);
  const [showList, setShowList] = useState(false);

  const resetName = UseRegisterKey(
    `empty_${fieldId}_sug`,
    pageModel?.data?.push,
    pageModel?.data?.pull
  );

  useEffect(() => {
    if (valName !== name) {
      setName(() => valName);
    }
  }, [valName]);

  useEffect(() => {
    if (fieldId && fieldId === resetName.id) {
      // console.log('AS', fieldId, resetName);
      setName(() => resetName.name);
    }
  }, [resetName]);

  const inputFocus = () => {
    setShowList(true);
    setSearchData(() => data.filter((m) => m.planname === valName));
  };

  const itemClick = (listItem) => {
    setFoundItem({ listItem, fieldId: { id: fieldId, name: valName } });
    setName(() => listItem[searchKeys[0]]);
    setShowSearchbox(false);
    hideList.current.classList.add('hide');
    setShowList(false);
  };

  const filterData = (e) => {
    const inputVal = e.target.value.toLowerCase();
    const origInputVal = e.target.value;
    let exactName = '';

    const dataFiltered = data.filter((_record) => {
      const trimedVal = inputVal.trim();
      for (let i = 0; i < searchKeys.length; i++) {
        const key = searchKeys[i];
        const recordKey = _record[key]?.toLowerCase();
        if (trimedVal === recordKey) {
          exactName = _record[searchKeys[0]];
          setFoundItem({
            listItem: _record,
            fieldId: { id: fieldId, name: valName }
          });
          setShowSearchbox(false);
          hideList.current.classList.add('hide');
          return _record;
        }
        if (recordKey.indexOf(trimedVal.toLowerCase()) !== -1) {
          return _record;
        }
      }
      return null;
    });

    hideList.current.classList.remove('hide');
    setSearchData(() => dataFiltered);
    setName(() => exactName || origInputVal);
    setShowSearchbox(() => !exactName);
    if (dataFiltered.length !== 1) {
      // onReset();
    }
  };

  const toggleBox = (e) => {
    setShowSearchbox(!showSearchbox);
    if (e.target.tagName === 'SPAN' || e.target.tagName === 'P') {
      e.target.closest('p.close').classList.toggle('hide');
      setShowList(false);
      setName(() => valName);
      // onReset();
    }
  };

  const selectByEnter = (e, m) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      itemClick(m);
    }
  };

  return (
    <div className={`searchbox ${cssClass} ${styles.searchbox}`}>
      <input
        required
        className={`search-input ${styles.searchbox_input}`}
        type="text"
        value={name}
        disabled={disabled}
        name={inputName}
        id={id}
        onChange={disabled ? null : filterData}
        onFocus={disabled ? null : inputFocus}
        onDoubleClick={onDoubleClick || null}
      />
      {showList && !disabled && (
        <p
          className={`close hide ${styles.close}`}
          ref={hideList}
          onClick={toggleBox}
        >
          <span />
          <span />
        </p>
      )}
      {showSearchbox && !disabled && (
        <div className={`searchbox-list ${styles.searchbox_list}`}>
          <ul role="tablist" aria-label="tablist">
            {searchData.map((_data, ix) => (
              <li
                key={_data.planname}
                role="tab"
                tabIndex="0"
                onClick={() => itemClick(_data)}
                onKeyUp={(e) => selectByEnter(e, _data)}
              >
                {' '}
                {_data.planname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default SuggestionInput;
