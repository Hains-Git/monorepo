import React from 'react';

function Column({
  children,
  rotationsplan,
  columnWidth,
  id = '',
  spanClass = 'month',
  columnKey = '',
  columnIndex = '',
  year,
  text
}) {
  return (
    <div
      className="cct-column"
      data-columnkey={columnKey}
      data-columnindex={columnIndex}
      id={id}
      style={{ width: `${columnWidth}px` }}
    >
      {text && <span className={spanClass}>{text}</span>}
      {year && <span className="year">{year}</span>}
      {children}
    </div>
  );
}

export default Column;
