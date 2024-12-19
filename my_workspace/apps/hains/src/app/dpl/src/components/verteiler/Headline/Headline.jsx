import React from 'react';

function Headline({ cssClass, text, bg = 'inherit', gridLabel, doubleClickHandler = null }) {
  return (
    <div
      style={{ gridArea: gridLabel, backgroundColor: bg }}
      className={cssClass}
      onDoubleClick={doubleClickHandler}
    >
      <p>{text}</p>
    </div>
  );
}
export default Headline;
