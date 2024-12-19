import React from 'react';
import { TbWand } from 'react-icons/tb';
import CustomButton from '../custom_buttons/CustomButton';
import { UseDropdown } from '../../../hooks/use-dropdown';
import MagicForm from './MagicForm';
import { UseMounted } from '../../../hooks/use-mounted';
import SpinnerIcon from '../spinner-icon/SpinnerIcon';

function MagicBtn({
  minDate,
  maxDate,
  von,
  bis,
  callBack = () => {},
  kontingente = []
}) {
  const { show, handleClick, closeDropDown } = UseDropdown(false, false);
  const [showLoader, setShowLoader] = React.useState(false);
  const mounted = UseMounted();

  const setLoader = (value) => mounted && setShowLoader(() => value);

  return (
    <div>
      <CustomButton
        title="Kontingente automatisch einteilen."
        className="as_icon"
        clickHandler={handleClick}
      >
        {showLoader ? (
          <SpinnerIcon
            width="1rem"
            height="1rem"
            borderWidth="0.15rem"
            color="#00427"
          />
        ) : (
          <TbWand />
        )}
      </CustomButton>
      {show ? (
        <MagicForm
          closeDropDown={closeDropDown}
          kontingente={kontingente}
          callBack={callBack}
          minDate={minDate}
          maxDate={maxDate}
          von={von}
          bis={bis}
          showLoader={showLoader}
          setShowLoader={setLoader}
        />
      ) : null}
    </div>
  );
}

export default MagicBtn;
