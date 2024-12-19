import React from 'react';

function Panel(props) {
  const { children, className } = props;
  return (
    <div className={`panel-container ${className?.toString?.() || ''}`.trim()}>
      {children}
    </div>
  );
}

export default Panel;
