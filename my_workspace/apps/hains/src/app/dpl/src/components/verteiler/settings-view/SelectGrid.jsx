import React, { useRef } from 'react';

import styles from './settings-view.module.css';

function SelectGrid({
  options,
  selectedVal,
  rowIx,
  colIx,
  onChangeSelect,
  setTableCoordinates,
  setShowTablePopup,
  setSettingsBtn
}) {
  const btn = useRef(null);

  const onClickBtn = () => {
    setTableCoordinates(() => ({
      rowIx,
      colIx
    }));
    setShowTablePopup(() => true);
    setSettingsBtn(() => btn.current);
  };

  return (
    <div className={styles.selectDiv}>
      <select
        onChange={(evt) => {
          onChangeSelect(rowIx, colIx, evt.target.value);
        }}
        value={selectedVal}
        title={selectedVal}
      >
        <option value=".">.</option>
        {Object.values(options).map((option, index) => {
          return (
            <optgroup key={`optiongroup_${index}`} label={option.label}>
              {option.options.map((op, i) => {
                return (
                  <option
                    key={`option_${i}`}
                    value={op.planname}
                    title={op.planname}
                  >
                    {op.label}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
      <div ref={btn} className="select-settings">
        <button
          type="button"
          className={styles.settings_btn}
          onClick={onClickBtn}
        >
          &#9881;
        </button>
      </div>
    </div>
  );
}
export default SelectGrid;
