import React from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import { addClassNames } from '../../../../util_func/util';
import styles from '../einteilungauswahl.module.css';

function FreigabenHinweis({ freigaben = false }) {
  const [onOver, onOut] = UseTooltip(freigaben?.msg || '');

  if (!freigaben?.className) return null;
  return (
    <span
      className={`${styles.counter} ${addClassNames(freigaben?.className, styles)}`}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      F
    </span>
  );
}

export default FreigabenHinweis;
