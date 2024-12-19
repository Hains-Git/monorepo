import React from 'react';
import { IconContext } from 'react-icons';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdReply,
  MdReplyAll
} from 'react-icons/md';

export const contenxtStyle = { style: { transform: 'scale(-1, 1)' } };
export const reply = (
  <IconContext.Provider value={contenxtStyle}>
    <MdReply />
  </IconContext.Provider>
);
export const replyAll = (
  <IconContext.Provider value={contenxtStyle}>
    <MdReplyAll />
  </IconContext.Provider>
);
export const trash = <FaTrash />;
export const checkAllBox = <MdOutlineCheckBox />;
export const uncheckAllBox = <MdOutlineCheckBoxOutlineBlank />;
export const search = <FiSearch />;
export const toggleOn = <FaToggleOn />;
export const toggleOff = <FaToggleOff />;
