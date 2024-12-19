import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function Saldo({ saldo, title }) {
  const [onOver, onOut] = UseTooltip(title);
  return (
    <td onMouseOver={onOver} onMouseOut={onOut}>
      {saldo.toString()}
    </td>
  );
}

export default Saldo;
