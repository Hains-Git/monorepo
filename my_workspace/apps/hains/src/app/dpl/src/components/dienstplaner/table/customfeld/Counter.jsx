import React, { useEffect, useState } from 'react';
import { UseRegister } from '../../../../hooks/use-register';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function Counter({ counter, cell, update }) {
  const [counted, setCounted] = useState(null);
  const updateByCounter = UseRegister(counter?._push, counter?._pull, counter);
  const [onOver, onOut] = UseTooltip(counter?.title || '');

  useEffect(() => {
    setCounted(() => counter?.countFkt?.(cell)?.el || null);
  }, [update, updateByCounter]);

  if (!counter?.countFkt || !counted?.length) return null;
  return (
    <div onMouseOver={onOver} onMouseOut={onOut}>
      {counted}
    </div>
  );
}

export default Counter;
