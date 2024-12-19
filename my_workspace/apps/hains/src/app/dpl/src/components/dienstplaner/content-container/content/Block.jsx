import React, { useEffect, useState } from 'react';
import CustomCheckbox from '../../../utils/custom_checkbox/CustomCheckbox';
import { UseRegister } from '../../../../hooks/use-register';

function Block({ feld = false, readOnly = false }) {
  const [checked, setChecked] = useState(false);
  const update = UseRegister(
    feld?.pushInStartBedarf,
    feld?.pullFromStartBedarf,
    feld
  );
  const blockMsg = checked
    ? 'Einteilung wird für den ganzen Block ausgeführt'
    : 'Einteilungen des Blockes werden separat behandelt';

  const handleCheckbox = readOnly
    ? null
    : () => {
        feld?.setBlockChecked?.(!checked, true);
        if (checked) {
          feld?.remove?.(true);
        }
      };

  useEffect(() => {
    setChecked(() => feld?.blockChecked);
  }, [update]);

  if (!feld?.isBlock) return null;
  return (
    <CustomCheckbox
      className={readOnly ? 'disabled' : ''}
      checked={checked}
      handleCheckbox={handleCheckbox}
      title={blockMsg}
    />
  );
}

export default Block;
