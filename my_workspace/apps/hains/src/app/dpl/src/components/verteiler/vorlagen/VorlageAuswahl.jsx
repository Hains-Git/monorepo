import React from 'react';
import { UseRegister } from '../../../hooks/use-register';
import StandardSelectField from '../../utils/standard-select-field/StandardSelectField';

function VorlageAuswahl({ vorlagen }) {
  UseRegister(vorlagen?._push, vorlagen?._pull, vorlagen);

  const itemHandler = (item) => {
    item?.fkt?.();
  };

  return (
    <StandardSelectField
      name="Vorlage"
      readOnly
      options={vorlagen.vorlagen}
      optionKey="name"
      itemHandler={itemHandler}
      start={vorlagen.vorlageIndex}
      title="Wähle den Einteilungsstatus für deine Einteilungen aus!"
    />
  );
}

export default VorlageAuswahl;
