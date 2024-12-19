import React from 'react';
import { FaTrash } from 'react-icons/fa';
import CustomButton from './CustomButton';

function DeleteButton({
  className = '',
  addStyles = '',
  style = null,
  id = '',
  clickHandler = null,
  doubleClickHandler = null,
  disable = false,
  title = '',
  spinner = {},
  scalable = false
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
    >
      <FaTrash />
    </CustomButton>
  );
}

export default DeleteButton;
