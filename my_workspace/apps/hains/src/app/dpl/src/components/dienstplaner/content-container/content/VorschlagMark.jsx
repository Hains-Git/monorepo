import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function VorschlagMark({ title = 'Vorschlag', label = '*' }) {
  const [onOver, onOut] = UseTooltip(title);
  return (
    <span onMouseOver={onOver} onMouseOut={onOut} style={{ cursor: 'default' }}>
      {label}
    </span>
  );
}

export default VorschlagMark;
