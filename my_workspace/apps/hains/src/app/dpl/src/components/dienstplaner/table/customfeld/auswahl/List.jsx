import React, { useEffect, useState } from "react";
import { UseDropdown } from "../../../../../hooks/use-dropdown";
import ShowCounter from "./ShowCounter";

function List({
  customFelder, update, setShowParent, showParent
}) {
  const feld = customFelder?.feld;
  if (!feld) return null;
  const [showForm, setShowForm] = useState(false);

  const {
    caret,
    show,
    handleClick
  } = UseDropdown(false, false);

  const clickHandler = (evt) => {
    setShowParent(() => (show ? 0 : 1));
    handleClick(evt);
  };

  useEffect(() => {
    if (showParent !== 1 && show) {
      handleClick();
    }
  }, [showParent]);

  return (
    <div onClick={clickHandler}>
      <p className="table-custom-feld-auswahl-label">
        Zähler
        <span className="caret">{caret}</span>
      </p>
      {show && showParent === 1 && (
      <div>
        {feld?.getAllCounter && feld.getAllCounter((c, i) => (
          <ShowCounter
            key={`${c.id}_${i}`}
            pos={`${i}`}
            counter={c}
            customFelder={customFelder}
            update={update}
            setShowForm={setShowForm}
            showForm={showForm}
          />
        ), true)}
      </div>
      )}
    </div>
  );
}

export default List;
