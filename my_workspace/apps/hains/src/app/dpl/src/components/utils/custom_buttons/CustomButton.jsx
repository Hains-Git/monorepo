import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UseTooltip } from '../../../hooks/use-tooltip';

import styles from './custom-button.module.css';
import { addClassNames } from '../../../util_func/util';
import SpinnerIcon from '../spinner-icon/SpinnerIcon';

import { UseMounted } from '../../../hooks/use-mounted';
import { isFunction } from '../../../tools/types';

const defaultSpinner = {};

function CustomButton({
  className = '',
  addStyles = '',
  style = null,
  id = '',
  clickHandler = null,
  doubleClickHandler = null,
  disable = false,
  title = '',
  spinner = defaultSpinner,
  scalable = false,
  type = 'button',
  dataInfo = '',
  children
}) {
  const [onOver, onOut] = UseTooltip(title);
  const [loading, setLoading] = useState(!!spinner?.default);
  const mounted = UseMounted();
  const ref = useRef();

  useEffect(() => {
    if (spinner?.default === undefined) return;
    setLoading(() => !!spinner?.default);
  }, [spinner?.default]);

  const onClickBtn = (e) => {
    if (!isFunction(clickHandler)) return;
    mounted && setLoading(() => true);
    clickHandler(e, (val) => mounted && setLoading((current) => (isFunction(val) ? val(current) : !!val)));
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
      type={type === 'submit' ? 'submit' : 'button'}
      ref={ref}
      className={`${styles.standard} ${addClassNames(className, styles)} ${addStyles} ${
        showSpinner ? styles.hide_bg : ''
      }`.trim()}
      id={id}
      style={style}
      onClick={onClickBtn}
      onDoubleClick={doubleClickHandler}
      disabled={disable || showSpinner}
      onMouseOver={onOver}
      onMouseOut={onOut}
      data-info={dataInfo}
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

CustomButton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape({}),
  clickHandler: PropTypes.func,
  doubleClickHandler: PropTypes.func,
  disable: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.object)])
};
