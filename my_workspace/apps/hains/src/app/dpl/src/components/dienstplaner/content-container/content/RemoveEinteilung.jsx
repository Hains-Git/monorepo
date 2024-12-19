import { FaTrash } from 'react-icons/fa';
import { UseTooltip } from '../../../../hooks/use-tooltip';

import CustomButton from '../../../utils/custom_buttons/CustomButton';

function RemoveEinteilung({
  feld = false,
  style = { padding: '2px 3px', fontSize: '0.55rem' },
  className = ''
}) {
  const [onOver, onOut] = UseTooltip('Entfernt die Einteilung');

  if (!feld) return null;
  return (
    <CustomButton
      clickHandler={() => {
        feld?.remove?.(true);
      }}
      className={`red ${className}`.trim()}
      style={style}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      <FaTrash />
    </CustomButton>
  );
}

export default RemoveEinteilung;
