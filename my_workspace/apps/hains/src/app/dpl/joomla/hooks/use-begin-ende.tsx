import { useState } from 'react';

export function UseBeginEnde() {
  const [beginn, setBeginn] = useState('');
  const [ende, setEnde] = useState('');

  const onChangeBeginn = (label: string, val: string) => {
    setBeginn(val);
  };

  const onChangeEnde = (label: string, val: string) => {
    setEnde(val);
  };
  return {
    beginn,
    ende,
    onChangeBeginn,
    onChangeEnde
  };
}
