import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './suggestion-input.module.css';

import { UseRegisterKey } from '../../../hooks/use-register';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function SuggestionInputVerteiler({
  data,
  valName,
  searchKeys,
  setFoundItem,
  cssClass = '',
  fieldId,
  inputName = '',
  id = '',
  disabled = false,
  onDoubleClick = null
}) {
  const { verteiler, searchInSuggestionInput } =
    useContext(VerteilerFastContext);
  const [searchData, setSearchData] = useState(data);
  const [showSearchbox, setShowSearchbox] = useState(false);
  const [name, setName] = useState(valName);
  const hideList = useRef(null);
  const [showList, setShowList] = useState(false);

  const resetName = UseRegisterKey(
    `empty_${fieldId}_sug`,
    verteiler?.data?.push,
    verteiler?.data?.pull
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

    const { mFilteredData, found } = searchInSuggestionInput({
      data,
      searchKeys,
      inputVal
    });

    if (found) {
      setFoundItem({
        listItem: mFilteredData[0],
        fieldId: { id: fieldId, name: valName }
      });
      exactName = mFilteredData[0].planname;
      setShowList(false);
    }

    hideList.current.classList.remove('hide');
    setSearchData(() => mFilteredData);
    setName(() => exactName || origInputVal);
    setShowSearchbox(() => !found);
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
export default SuggestionInputVerteiler;
