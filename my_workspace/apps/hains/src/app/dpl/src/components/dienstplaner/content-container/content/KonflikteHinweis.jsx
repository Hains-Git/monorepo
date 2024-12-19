import React, { useEffect, useState } from 'react';
import { UseTooltip } from '../../../../hooks/use-tooltip';
import styles from '../contentcontainer.module.css';
import { addClassNames } from '../../../../util_func/util';

function KonflikteHinweis({ konflikte = false }) {
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [showMarker, setShowMarker] = useState(false);
  const show = () =>
    (showMarker && (title?.trim?.() || title?.length || className?.trim?.())) ||
    null;

  const [onOver, onOut] = UseTooltip(title);

  useEffect(() => {
    setTitle(() => konflikte?.title || '');
    setClassName(() => konflikte?.className || '');
    setShowMarker(() => !!konflikte?.showMarker);
  }, [konflikte]);

  if (!konflikte) return null;
  return (
    show() && (
      <span
        className={`${styles.konfliktspan} ${addClassNames(
          className,
          styles
        )}`.trim()}
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        !
      </span>
    )
  );
}

export default KonflikteHinweis;
