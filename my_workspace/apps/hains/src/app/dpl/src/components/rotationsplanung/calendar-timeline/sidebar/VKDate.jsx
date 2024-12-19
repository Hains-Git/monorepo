import React, { useState } from 'react';

function VKDate({ rotationsplan }) {
  const [vkDate, setVkDate] = useState(rotationsplan.vkDate);

  return (
    <div className="fieldset column inline">
      <label>VK datum:</label>
      <input
        type="date"
        value={vkDate}
        name="date-from"
        onChange={(evt) => {
          const date = evt.target.value;
          setVkDate(() => rotationsplan.setVKDate(date, true));
        }}
      />
    </div>
  );
}

export default VKDate;
