import React from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';
import InfoButton from '../../utils/info-button/InfoButton';

function Label({
  name = '',
  className = '',
  style = null,
  title = '',
  parent = false,
  onDoubleClick = null
}) {
  const [onOver, onOut] = UseTooltip(title);

  return (
    <div
      className={`custom-label-text ${className}`}
      onMouseOver={onOver}
      onMouseOut={onOut}
      style={style || null}
    >
      <p
        onDoubleClick={onDoubleClick}
        className="custom-label-text-p"
        style={
          onDoubleClick
            ? {
                cursor: 'pointer'
              }
            : null
        }
      >
        {name}
      </p>
      <InfoButton
        className="primary custom-info-button"
        parent={parent}
        title="Zeigt weitere Informationen an"
      />
    </div>
  );
}

export default Label;
