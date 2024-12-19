import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isObject } from '../../../tools/types';
import { shortwait, throttle } from '../../../tools/debounce';
import styles from './size-adjust-wrapper.module.css';
import { nonBreakSpace } from '../../../tools/htmlentities';

const addEvent = (e, func) => document.body.addEventListener(e, func);
const removeEvent = (e, func) => document.body.removeEventListener(e, func);

function SizeAdjustWrapper({
  top = false,
  bottom = false,
  left = false,
  right = false,
  className = '',
  style = false,
  children
}) {
  const [currentStyle, setCurrentStyle] = useState(
    isObject(style) ? style : {}
  );
  const thisRef = useRef(null);
  const [resize, setResize] = useState(false);

  const resizeFkt = useCallback(
    throttle((evt) => {
      if (resize) {
        if (evt) evt.stopPropagation();
        const { clientY, clientX } = evt;
        const newSize = { ...currentStyle };
        const size = thisRef.current.getBoundingClientRect();
        ['top', 'left', 'right', 'bottom'].forEach((dir) => {
          if (resize.includes(dir)) {
            console.log(clientX, clientY, size, dir, newSize);
          }
        });

        // const diff = clientY - size.top;
        // let newHeight = Math.floor(
        //   ((size.height - diff) / window.innerHeight) * 100
        // );
        // if (newHeight > maxHeight) newHeight = maxHeight;
        // if (newHeight < 10) newHeight = 10;
        // setHeight(() => setStyle(`${newHeight}vh`));
      }
    }, shortwait),
    [resize, thisRef]
  );

  const removeMouseMove = useCallback(
    (evt) => {
      if (evt) evt.stopPropagation();
      removeEvent('mousemove', resizeFkt);
      setResize(() => false);
    },
    [resize, thisRef]
  );

  const startResize = (evt, type) => {
    evt.stopPropagation();
    evt.preventDefault();
    setResize(() => type);
  };

  useEffect(() => {
    if (resize && thisRef.current) addEvent('mousemove', resizeFkt);
    else removeEvent('mousemove', resizeFkt);
    return () => {
      removeEvent('mousemove', resizeFkt);
    };
  }, [resize, thisRef]);

  useEffect(() => {
    addEvent('mouseleave', removeMouseMove);
    addEvent('mouseup', removeMouseMove);
    return () => {
      removeMouseMove();
      removeEvent('mouseleave', removeMouseMove);
      removeEvent('mouseup', removeMouseMove);
    };
  }, []);

  return (
    <div className={`${className}`} style={currentStyle} ref={thisRef}>
      <div className={styles.row}>
        <div
          className={styles.topleft}
          onMouseDown={(e) => top && startResize(e, 'top left')}
        >
          {nonBreakSpace}
        </div>
        <div
          className={styles.top}
          onMouseDown={(e) => top && left && startResize(e, 'top')}
        >
          {nonBreakSpace}
        </div>
        <div
          className={styles.topright}
          onMouseDown={(e) => top && right && startResize(e, 'top right')}
        >
          {nonBreakSpace}
        </div>
      </div>

      <div className={styles.row}>
        <div
          className={styles.left}
          onMouseDown={(e) => left && startResize(e, 'left')}
        >
          {nonBreakSpace}
        </div>

        <div className={styles.center}>{children}</div>

        <div
          className={styles.right}
          onMouseDown={(e) => right && startResize(e, 'right')}
        >
          {nonBreakSpace}
        </div>
      </div>

      <div className={styles.row}>
        <div
          className={styles.bottomleft}
          onMouseDown={(e) => bottom && left && startResize(e, 'bottom left')}
        >
          {nonBreakSpace}
        </div>
        <div
          className={styles.bottom}
          onMouseDown={(e) => bottom && startResize(e, 'bottom')}
        >
          {nonBreakSpace}
        </div>
        <div
          className={styles.bottomright}
          onMouseDown={(e) => bottom && right && startResize(e, 'bottom right')}
        >
          {nonBreakSpace}
        </div>
      </div>
    </div>
  );
}

export default SizeAdjustWrapper;
