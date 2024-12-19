import React, { useState } from 'react';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import styles from '../../../mitarbeiterinfo/app.module.css';

import { isFunction } from '../../../helper/types';
import Input from './Input';

type Props = {
  nameKurz: string;
  preName?: string;
  callback?: (val: any) => void | undefined;
  title?: string;
};

let planname = '';

function PlannameInput({
  nameKurz,
  preName = '',
  callback,
  title = ''
}: Props) {
  const [readOnly, setReadOnly] = useState(true);
  const toggleLock = () => {
    setReadOnly((oldVal) => !oldVal);
  };

  const onBlur = () => {
    setReadOnly(true);
    if (isFunction?.(callback)) {
      callback && callback(planname);
    }
  };

  const callBackFromInput = (label: string, val: string) => {
    planname = val;
  };

  return (
    <div className={styles.planname}>
      <Input
        onBlur={onBlur}
        label="Planname"
        aria-label="planname"
        readOnly={readOnly}
        value={nameKurz}
        preName="user"
        required
        callback={callBackFromInput}
        title={title}
      />
      <span data-testid="planname_lock" onClick={toggleLock}>
        {readOnly ? (
          <FaLock style={{ fill: '#ddd' }} />
        ) : (
          <FaLockOpen style={{ fill: '#ddd' }} />
        )}
      </span>
    </div>
  );
}

export default PlannameInput;
