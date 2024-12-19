import React from "react";

function Radio({dienstplan, anfang, getChecked, onChange}) {
  if (!dienstplan?.id) return null;
  const id = dienstplan.id;
  return (
    <label 
      htmlFor={`dienstplan-auswahl-radio-${id}`}
      className="diensplan-auswahl-radio"
      title={`${dienstplan.name} (${id.toString()})`}
    >
      <input
      id={`dienstplan-auswahl-radio-${id}`}
      type="radio"
      name={`dienstplan-${anfang}-${id}`}
      value={id}
      checked={getChecked}
      onChange={onChange}
    />
    {dienstplan.name}
  </label>
  );
}

export default Radio;