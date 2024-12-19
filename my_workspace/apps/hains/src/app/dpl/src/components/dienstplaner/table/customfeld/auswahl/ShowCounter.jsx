import React, { useEffect } from "react";
import { UseDropdown } from "../../../../../hooks/use-dropdown";
import { UseRegister } from "../../../../../hooks/use-register";
import { UseTooltip } from "../../../../../hooks/use-tooltip";
import CounterForm from "./CounterForm";

function ShowCounter({
  counter,
  customFelder,
  update,
  setShowForm,
  showForm,
  pos
}) {
  const updateThroughCounter = UseRegister(counter?._push, counter?._pull, counter);

  const {
    label,
    title
  } = counter || {};

  const [
    onOver,
    onOut
  ] = UseTooltip(title);

  const {
    caret,
    show,
    handleClick
  } = UseDropdown(showForm === pos, false);

  useEffect(() => {
    if (showForm !== pos && show) {
      handleClick();
    }
  }, [showForm]);

  if (!counter || !customFelder) return null;
  return (
    <div
      className="table-custom-feld-auswahl-show-counter"
      onClick={(evt) => {
        handleClick(evt);
        setShowForm((current) => (current === pos ? false : pos));
      }}
    >
      <p
        className="table-custom-feld-auswahl-label"
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        {label}
        {' '}
        <span
          className="caret"
        >
          {caret}
        </span>
      </p>
      {show && showForm === pos && (
      <CounterForm
        update={update}
        showForm={showForm}
        toggleDropDown={() => setShowForm(() => false)}
        updateThroughCounter={updateThroughCounter}
        customFelder={customFelder}
        counter={counter}
      />
      )}
    </div>
  );
}

export default ShowCounter;
