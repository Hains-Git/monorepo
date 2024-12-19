import React, { useEffect } from "react";
import { UseDropdown } from "../../../../../hooks/use-dropdown";
import CounterForm from "./CounterForm";

function Add({
  customFelder, update, setShowParent, showParent
}) {
  const {
    caret,
    show,
    handleClick
  } = UseDropdown(false, false);

  const clickHandler = (evt) => {
    setShowParent(() => (show ? 0 : -1));
    handleClick(evt);
  };

  useEffect(() => {
    if (showParent !== -1 && show) {
      handleClick();
    }
  }, [showParent]);

  return (
    <div onClick={clickHandler}>
      <p className="table-custom-feld-auswahl-label">
        Zähler hinzufügen
        <span className="caret">{caret}</span>
      </p>
      {show && showParent === -1 && (
      <CounterForm
        update={update}
        toggleDropDown={clickHandler}
        customFelder={customFelder}
      />
      )}
    </div>
  );
}

export default Add;
