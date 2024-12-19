import React from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';

function FormConflictListItem({ message, className }) {
  const [onOver, onOut] = UseTooltip([message]);
  return (
    <span
      className={className.trim()}
      key={message.typ}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {message.typ}
    </span>
  );
}
export default FormConflictListItem;
