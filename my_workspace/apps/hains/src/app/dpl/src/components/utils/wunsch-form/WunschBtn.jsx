import React from 'react';
import { TbCrystalBall } from 'react-icons/tb';
import CustomButton from '../custom_buttons/CustomButton';
import { UseDropdown } from '../../../hooks/use-dropdown';
import WunschForm from './WunschForm';

function WunschBtn({
  mitarbeiter = [],
  dienstkategorien = [],
  callBack = () => {}
}) {
  const { show, handleClick, closeDropDown } = UseDropdown(false, false);
  return (
    <div>
      <CustomButton
        title="Wunsch für Mitarbeiter eintragen."
        className="as_icon"
        clickHandler={handleClick}
      >
        <TbCrystalBall />
      </CustomButton>
      {show ? (
        <WunschForm
          closeDropDown={closeDropDown}
          mitarbeiter={mitarbeiter}
          dienstkategorien={dienstkategorien}
          callBack={callBack}
        />
      ) : null}
    </div>
  );
}

export default WunschBtn;
