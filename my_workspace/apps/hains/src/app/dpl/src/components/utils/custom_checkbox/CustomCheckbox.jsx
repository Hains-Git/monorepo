import PropTypes from 'prop-types';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { checkmark, nonBreakSpace } from '../../../tools/htmlentities';

function CustomCheckbox({
  handleCheckbox = null,
  checked = false,
  className = '',
  thisRef,
  title = ''
}) {
  const [onOver, onOut] = UseTooltip(title);

  return (
    <span
      ref={thisRef}
      className={`custom-checkbox ${className}`}
      onClick={handleCheckbox}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {checked ? checkmark : nonBreakSpace}
    </span>
  );
}

export default CustomCheckbox;

CustomCheckbox.propTypes = {
  handleCheckbox: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string
};
