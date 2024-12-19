import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isObject } from '../../../tools/types';
import { shortwait, throttle } from '../../../tools/debounce';
import styles from './height-adjust-wrapper.module.css';

const addEvent = (e, func) => document.body.addEventListener(e, func);
const removeEvent = (e, func) => document.body.removeEventListener(e, func);

function HeightAdjustWrapper({ children, className = '', style = false }) {
  const setStyle = (height) =>
    isObject(style)
      ? {
          ...style,
          height
        }
      : {
          height
        };
  const [height, setHeight] = useState(setStyle('45vh'));
  const thisRef = useRef(null);
  const [resize, setResize] = useState(false);
  const maxHeight = 85;

  const resizeHeight = useCallback(
    throttle((evt) => {
      if (resize) {
        if (evt) evt.stopPropagation();
        const { clientY } = evt;
        const size = thisRef.current.getBoundingClientRect();
        const diff = clientY - size.top;
        let newHeight = Math.floor(
          ((size.height - diff) / window.innerHeight) * 100
        );
        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newHeight < 10) newHeight = 10;
        setHeight(() => setStyle(`${newHeight}vh`));
      }
    }, shortwait),
    [resize, thisRef]
  );

  const removeMouseMove = useCallback(
    (evt) => {
      if (evt) evt.stopPropagation();
      removeEvent('mousemove', resizeHeight);
      setResize(() => false);
    },
    [resize, thisRef]
  );

  const startResizeHeight = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    setResize(() => true);
  };

  useEffect(() => {
    if (resize && thisRef.current) addEvent('mousemove', resizeHeight);
    else removeEvent('mousemove', resizeHeight);
    return () => {
      removeEvent('mousemove', resizeHeight);
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
    <div
      className={`${styles.wrapper} ${className}`}
      style={height}
      ref={thisRef}
    >
      <div className={styles.bar} onMouseDown={startResizeHeight} />
      {children}
    </div>
  );
}

export default HeightAdjustWrapper;
