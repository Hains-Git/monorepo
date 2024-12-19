import React from 'react';
import { UseRegister } from '../../../../hooks/use-register';
import { debounce, wait } from '../../../../tools/debounce';
import CustomButton from '../../../utils/custom_buttons/CustomButton';

function ToggleBody({ table = false }) {
  const body = table?.body;
  const toggleFkt = debounce((value, callback) => {
    body?.setVisible?.(value, true);
    callback?.();
  }, wait);
  UseRegister(body?._push, body?._pull, body);

  if (!body) return null;
  return (
    <div className="table-menue-bodyvisible-button">
      <CustomButton
        title="Klappe den Tabellenkörper ein/aus"
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          evt.stopPropagation();
          toggleFkt(!body?.visible, () => setLoading?.(() => false));
        }}
      >
        {body?.visible ? 'Einklappen' : 'Ausklappen'}
      </CustomButton>
    </div>
  );
}

export default ToggleBody;
