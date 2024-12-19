import React, { useEffect, useState } from 'react';
import { UseRegister } from '../../../../hooks/use-register';
import { nonBreakSpace } from '../../../../tools/htmlentities';
import Counter from './Counter';
import styles from './customfeld.module.css';

function CustomCounter({ customFelder, feld, cell, rowIndex, colIndex }) {
  const update = UseRegister(feld?._push, feld?._pull, feld);
  const getCounter = () => {
    return (
      feld?.getCounter?.(cell, (c, i) => {
        const key = `${cell?.id}_${c?.id}_${i}`;
        return <Counter key={key} counter={c} cell={cell} update={update} />;
      }) || null
    );
  };

  const [counter, setCounter] = useState(getCounter());
  const openSettings = () => {
    customFelder?.setInfo?.(feld, cell, rowIndex, colIndex);
  };

  useEffect(() => {
    setCounter(() => getCounter());
  }, [update]);

  if (!feld?.getCounter || !cell) return null;
  return (
    <div className={styles.table_custom_counter} onDoubleClick={openSettings}>
      {counter}
      <p className={styles.empty_table_custom_counter}>{nonBreakSpace}</p>
    </div>
  );
}

export default CustomCounter;
