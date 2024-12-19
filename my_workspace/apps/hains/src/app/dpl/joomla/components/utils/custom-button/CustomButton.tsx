import React, { useState, useRef, useEffect } from 'react';

import styles from './custom-button.module.css';
import { addClassNames } from '../../../helper/util';
import SpinnerIcon from '../spinner-icon/SpinnerIcon';

import { UseMounted } from '../../../hooks/use-mounted';

type TSpinner = {
  show?: boolean;
  default?: boolean;
};

export type TSetLoading = (value: boolean | ((bool: boolean) => boolean)) => void;

type TProps = {
  className?: string;
  addStyles?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: undefined | React.CSSProperties;
  id?: string;
  title?: string;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement> | undefined, setLoadingVar: TSetLoading) => void;
  doubleClickHandler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disable?: boolean;
  spinner?: TSpinner;
  scalable?: boolean;
  children: string | React.ReactNode | React.JSX.Element | React.JSX.Element[];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const defaultSpinner = {};

/**
 * @param {string} className - some_classname od styles.some_classname or (primary, as_icon, red)
 * @param {string} addStyles - some_classname or styles.some_classname
 * @param {object} style - javascript object with css properties
 * @param {boolean} disable
 * @param {object} spinner
 * @property {number} spinner.width
 * @property {number} spinner.height
 * @property {string} spinner.color
 * @property {string} spinner.borderWidth - "0.8rem"
 * @property {boolean} spinner.show - ob der spinner angezeigt werden soll
 */
function CustomButton({
  className = '',
  addStyles = '',
  style = undefined,
  id = '',
  clickHandler = undefined,
  doubleClickHandler = undefined,
  disable = false,
  spinner = defaultSpinner,
  scalable = false,
  children,
  type,
  title = '',
  ...rest
}: TProps) {
  const [loading, setLoading] = useState(!!spinner?.default);
  const mounted = UseMounted();
  const ref = useRef({} as HTMLButtonElement);

  useEffect(() => {
    if (spinner?.default === undefined) return;
    setLoading(() => !!spinner?.default);
  }, [spinner?.default]);

  const onClickBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!clickHandler) return;
    mounted && setLoading(() => true);
    clickHandler(
      e,
      (val) =>
        mounted &&
        setLoading((current) => {
          if (typeof val === 'boolean') {
            return val;
          }
          console.log('mounted 1', mounted, val, typeof val);
          return val(current);
        })
    );
  };
  const spinnerSettings = {
    width: 15,
    height: 15,
    color: '#00427a',
    borderWidth: '0.15rem',
    show: false,
    ...spinner
  };

  if (scalable && ref?.current) {
    ref.current.style.setProperty('font-size', `calc(1rem * var(--mult-size))`);
  }

  const showSpinner = spinner?.show && loading;
  return (
    <button
      type={type || 'button'}
      ref={ref}
      title={title}
      className={`${styles.standard} ${addClassNames(className, styles)} ${addStyles} ${
        showSpinner ? styles.hide_bg : ''
      }`.trim()}
      id={id}
      style={style}
      onClick={onClickBtn}
      onDoubleClick={doubleClickHandler}
      disabled={disable || showSpinner}
      {...rest}
    >
      {showSpinner ? (
        <SpinnerIcon
          width={spinnerSettings.width || 20}
          height={spinnerSettings.height || 20}
          borderWidth={spinnerSettings.borderWidth || '0.15rem'}
          color={spinnerSettings.color || '#00427'}
        />
      ) : (
        children
      )}
    </button>
  );
}

export default CustomButton;
