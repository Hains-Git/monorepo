import React from 'react';
import { FaSave } from 'react-icons/fa';
import CustomButton from './CustomButton';

function SaveButton({
  className = '',
  addStyles = '',
  style = null,
  id = '',
  clickHandler = null,
  doubleClickHandler = null,
  disable = false,
  title = '',
  spinner = {},
  scalable = false,
  type = 'button'
}) {
  return (
    <CustomButton
      className={className}
      addStyles={addStyles}
      style={style}
      id={id}
      clickHandler={clickHandler}
      doubleClickHandler={doubleClickHandler}
      disable={disable}
      title={title}
      spinner={spinner}
      scalable={scalable}
      type={type}
    >
      <FaSave />
    </CustomButton>
  );
}

export default SaveButton;
