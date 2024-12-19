import React, { useState, useRef } from 'react';

function KontingentSelect({ rotationsplan, setKontingent }) {
  const [data, setData] = useState(
    Object.values(rotationsplan.data.kontingente)
  );
  const [showSearchbox, setShowSearchbox] = useState(false);
  const [kontingentName, setKontingentName] = useState('');
  const hideList = useRef(null);

  const inputFocus = (e) => {
    setData(() => Object.values(rotationsplan.data.kontingente));
    setKontingentName('');
    setShowSearchbox(true);
    hideList.current.classList.remove('hide');
  };

  const itemClick = (kontingent) => {
    setKontingent(kontingent);
    setKontingentName(() => kontingent.name);
    setShowSearchbox(false);
    hideList.current.classList.add('hide');
  };

  const filterKontingente = (e) => {
    const inputVal = e.target.value.toLowerCase();

    const kontingenteFiltered = Object.values(
      rotationsplan.data.kontingente
    ).filter((kontingent) => {
      if (inputVal.trim() === kontingent.name?.toLowerCase()) {
        setKontingent(kontingent);
        setShowSearchbox(false);
        hideList.current.classList.add('hide');

        return kontingent;
      }
      if (
        kontingent?.name
          ?.toLowerCase()
          .indexOf(inputVal.toLowerCase().trim()) !== -1
      ) {
        return kontingent;
      }
      return false;
    });
    setData(() => kontingenteFiltered);
    setKontingentName(inputVal);
    setShowSearchbox(true);
  };

  const toggleBox = (e) => {
    setShowSearchbox(!showSearchbox);
    if (e.target.tagName === 'SPAN') {
      e.target.parentNode.classList.toggle('hide');
    }
  };

  return (
    <div className="employee-searchbox">
      <input
        required
        className="employee-search-input"
        type="text"
        placeholder="Kontingent wählen"
        value={kontingentName}
        onChange={filterKontingente}
        onFocus={inputFocus}
      />
      <p className="close hide" ref={hideList} onClick={toggleBox}>
        <span />
        <span />
      </p>
      {showSearchbox && (
        <div className="employee-searchbox-list">
          <ul>
            {data.map((kontingent) => (
              <li key={kontingent.name} onClick={(e) => itemClick(kontingent)}>
                {' '}
                {kontingent.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default KontingentSelect;
