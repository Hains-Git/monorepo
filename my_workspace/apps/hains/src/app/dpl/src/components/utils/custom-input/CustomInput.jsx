import PropTypes from 'prop-types';
import { UseTooltip } from '../../../hooks/use-tooltip';
import styles from './custom-input.module.css';

function CustomInput({
  title = '',
  onChange = null,
  onFocus = null,
  onClick = null,
  value = '',
  readOnly = false,
  className = '',
  style = null,
  id = '',
  type = 'text',
  name = '',
  placeholder = '',
  inputRef = null,
  onDoubleClick = null,
  onBlur = null,
  onKeyUp = null,
  onKeyDown = null
}) {
  const [onOver, onOut] = UseTooltip(title);

  return (
    <div className={`my-custom-input-container ${styles.container}`}>
      <span className={`${styles.span} ${className}`}>{value}</span>
      <input
        ref={inputRef}
        className={`${styles.input} ${className}`}
        style={style}
        type={type}
        onChange={onChange}
        onFocus={onFocus}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        value={value}
        readOnly={readOnly}
        onBlur={onBlur}
        id={id}
        name={name}
        onMouseOver={onOver}
        onMouseOut={onOut}
        placeholder={placeholder}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default CustomInput;

CustomInput.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array
  ]),
  value: PropTypes.string,
  type: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func
};
