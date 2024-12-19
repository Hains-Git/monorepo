import React from "react";

function ShowMore({ clickHandler, caret }) {
  return (
    <div
      onClick={clickHandler}
      style={{
        cursor: "pointer",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <span>...</span>
      <span>{caret}</span>
    </div>
  );
}

export default ShowMore;
