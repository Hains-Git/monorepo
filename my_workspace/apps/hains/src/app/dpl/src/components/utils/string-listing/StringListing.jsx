import React from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';
import Stringitem from '../string-item/StringItem';

function StringListing({
  str = '',
  seperator = '\n',
  className = '',
  label = '',
  title = ''
}) {
  const thisStr = str.toString();

  const arr = (strToSplit) => strToSplit.split(seperator);

  const [onOver, onOut] = UseTooltip(title);

  const getLabel = () => (
    <div>
      <p>{label}</p>
    </div>
  );

  const getBlock = () => (
    <div>
      {thisStr &&
        arr(thisStr).map((el, i) => (
          <Stringitem key={`${el}_${i}`} label={el} />
        ))}
    </div>
  );

  return (
    <div className={className} onMouseOver={onOver} onMouseOut={onOut}>
      {label !== '' ? getLabel() : null}
      {getBlock()}
    </div>
  );
}

export default StringListing;
