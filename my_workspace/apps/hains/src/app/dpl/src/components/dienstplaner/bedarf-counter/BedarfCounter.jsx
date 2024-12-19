import React from 'react';
import { UseRegister } from '../../../hooks/use-register';

function BedarfCounter({ el }) {
  UseRegister(el?._push, el?._pull);
  const label = el?.getCurrentBedarf?.() || 0;
  return label > 0 && <p className="bedarf-counter">{label}</p>;
}

export default BedarfCounter;
