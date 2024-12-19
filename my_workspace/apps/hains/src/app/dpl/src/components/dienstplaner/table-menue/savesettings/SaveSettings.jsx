import React from 'react';
import SaveButton from '../../../utils/custom_buttons/SaveButton';

function SaveSettings({ table }) {
  return (
    <div className="table-menue-bodyvisible-button">
      <SaveButton
        title="Speichert die zu markierenden Konflikte, die Farbgruppen und die Einstellungen zur Anzeige von Diensten und Wünschen"
        spinner={{ show: true }}
        clickHandler={(evt, setLoading) => {
          evt.stopPropagation();
          table?.saveSettings(() => {
            setLoading?.(() => false);
          });
        }}
      />
    </div>
  );
}

export default SaveSettings;
