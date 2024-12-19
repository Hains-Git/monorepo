import React, { useState, useRef } from 'react';

function MitarbeiterSelect({ rotationsplan, setMitarbeiter }) {
  const [data, setData] = useState(
    Object.values(rotationsplan.data.mitarbeiter).filter(
      (mitarbeiter) => mitarbeiter.aktiv === true
    )
  );
  const [showSearchbox, setShowSearchbox] = useState(false);
  const [mitarbeiterName, setMitarbeiterName] = useState('');
  const hideList = useRef(null);

  const inputFocus = (e) => {
    setData(() =>
      Object.values(rotationsplan.data.mitarbeiter).filter(
        (mitarbeiter) => mitarbeiter.aktiv === true
      )
    );
    setMitarbeiterName('');
    setShowSearchbox(true);
    hideList.current.classList.remove('hide');
  };

  const itemClick = (mitarbeiter) => {
    setMitarbeiter(mitarbeiter);
    setMitarbeiterName(() => mitarbeiter.planname);
    setShowSearchbox(false);
    hideList.current.classList.add('hide');
  };

  const filterMitarbeiters = (e) => {
    const inputVal = e.target.value.toLowerCase();

    const mitarbeitersFiltered = Object.values(
      rotationsplan.data.mitarbeiter
    ).filter((mitarbeiter) => {
      if (!mitarbeiter.aktiv) return false;
      if (
        inputVal.trim() === mitarbeiter.planname.toLowerCase() ||
        inputVal.trim() === mitarbeiter.name?.toLowerCase()
      ) {
        setMitarbeiter(mitarbeiter);
        setShowSearchbox(false);
        hideList.current.classList.add('hide');

        return mitarbeiter;
      }
      if (
        mitarbeiter?.name
          ?.toLowerCase()
          .indexOf(inputVal.toLowerCase().trim()) !== -1 ||
        mitarbeiter.planname
          .toLowerCase()
          .indexOf(inputVal.toLowerCase().trim()) !== -1
      ) {
        return mitarbeiter;
      }
      return false;
    });
    setData(() => mitarbeitersFiltered);
    setMitarbeiterName(inputVal);
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
        placeholder="Mitarbeiter wählen"
        value={mitarbeiterName}
        onChange={filterMitarbeiters}
        onFocus={inputFocus}
      />
      <p className="close hide" ref={hideList} onClick={toggleBox}>
        <span />
        <span />
      </p>
      {showSearchbox && (
        <div className="employee-searchbox-list">
          <ul>
            {data.map((mitarbeiter) => (
              <li
                key={mitarbeiter.planname}
                onClick={(e) => itemClick(mitarbeiter)}
              >
                {' '}
                {mitarbeiter.planname}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MitarbeiterSelect;
