import React from 'react';
import { UseDropdown } from '../../../../hooks/use-dropdown';
import { checkMoreInfos } from '../../../../hooks/use-popup';

function PopupDropdown({ info, callbacks }) {
  const isLabelEmpty = info.label === '';
  const length = Object.keys(info.value).length > 0;

  const { caret, show, handleClick } = UseDropdown(false, false);

  return (
    (length || !isLabelEmpty) && (
      <div className="popup-dropdown-container">
        {length && !isLabelEmpty && (
          <p className="popup-more-infos-label" onClick={handleClick}>
            <span className="popup-more-infos-label-text">{`${
              info?.label?.toString?.() || ''
            }`}</span>
            <span className="popup-more-infos-label-caret">{caret}</span>
          </p>
        )}

        {!isLabelEmpty
          ? show && (
              <div className="popup-dropdown">
                {checkMoreInfos(info.value, callbacks, info.sorting).map(
                  (el) => el
                )}
              </div>
            )
          : length && (
              <div className="popup-dropdown">
                {checkMoreInfos(info.value, callbacks, info.sorting).map(
                  (el) => el
                )}
              </div>
            )}
      </div>
    )
  );
}

export default PopupDropdown;
