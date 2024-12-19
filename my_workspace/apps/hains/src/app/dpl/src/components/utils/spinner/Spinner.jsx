import React from 'react';

function Spinner({ className = '', showText, text }) {
  return (
    <div className={`my-flex-spinner ${className}`}>
      <div>
        <div className="my-flex-spinner-border" role="status" />
      </div>
      {showText ? <p className="my-flex-spinner-text">{text}</p> : null}
    </div>
  );
}

export default Spinner;
