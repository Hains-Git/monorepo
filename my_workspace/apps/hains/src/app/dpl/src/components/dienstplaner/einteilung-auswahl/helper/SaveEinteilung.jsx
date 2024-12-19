import React from 'react';
import { FaSave } from 'react-icons/fa';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import CustomButton from '../../../utils/custom_buttons/CustomButton';

function SaveEinteilung({
  feld = false,
  style = { padding: '2px 3px', fontSize: '0.55rem' },
  className = ''
}) {
  const [onOver, onOut] = UseTooltip('Speichert die Einteilung');

  const save = (evt) => {
    evt.stopPropagation();
    if (!feld?.writable) return;
    feld.debouncedEinteilen({
      value: feld.value,
      post: true,
      eachFeld: true
    });
  };

  if (!feld) return null;

  return (
    <CustomButton
      clickHandler={save}
      className={`primary ${className}`.trim()}
      style={style}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      <FaSave />
    </CustomButton>
  );
}

export default SaveEinteilung;
