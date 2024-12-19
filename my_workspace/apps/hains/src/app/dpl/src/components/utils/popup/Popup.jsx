import React, { useEffect, useState } from 'react';
import { checkMainInfos, checkMoreInfos } from '../../../hooks/use-popup';
import { UseRegisterKey } from '../../../hooks/use-register';
import Stringitem from '../string-item/StringItem';
import StringListing from '../string-listing/StringListing';
import PopupDropdown from './popup-dropdown/PopupDropdown';
import { isFunction } from '../../../tools/types';

function Popup({ parent }) {
  const [mainInfos, setMainInfos] = useState(false);
  const [moreInfos, setMoreInfos] = useState(false);
  const update = UseRegisterKey('popup', parent?.push, parent?.pull, parent);

  const createElement = (key, info, type = 0, callbacks = false) => {
    switch (type) {
      case 1: {
        const label = info?.label?.toString?.() || '';
        return (
          <StringListing
            key={key}
            str={info?.value?.toString?.() || ''}
            seperator={'\n'}
            className={`popup-string-list ${info?.className?.trim?.() || ''}`}
            title={info?.title || ''}
            sort={info.sort}
            label={label ? `${label}: ` : label}
          />
        );
      }
      case 2:
        return (
          <PopupDropdown
            key={key}
            sort={info.sort}
            info={info}
            callbacks={callbacks}
          />
        );
      default:
        return (
          <Stringitem
            label={info?.label?.toString?.() || ''}
            title={info?.title || ''}
            sort={info.sort}
            key={key}
            className={`${info?.className?.trim?.() || ''}`}
          />
        );
    }
  };

  const mainCallbacks = {
    label: (key, info) => createElement(key, info, 1),
    value: (key, info) => createElement(key, info, 0)
  };

  const moreCallbacks = {
    label: (key, info) => createElement(key, info, 0),
    value: (key, info) => createElement(key, info, 1),
    dropdown: (key, info, callbacks) => createElement(key, info, 2, callbacks)
  };

  useEffect(() => {
    const infos = isFunction(parent?.infoFkt) && parent.infoFkt();
    const main = infos?.mainInfos || false;
    const more = infos?.popupInfos || false;
    setMainInfos(() => main);
    setMoreInfos(() => more);
  }, [parent, update]);

  if (!parent) return null;
  return (
    <div className="custom-popup">
      {mainInfos && (
        <div className="popup-main-info">
          {checkMainInfos(mainInfos, mainCallbacks).map((p) => p)}
        </div>
      )}

      {moreInfos && mainInfos && (
        <div>
          <hr />
        </div>
      )}

      {moreInfos && (
        <div className="popup-more-infos">
          {checkMoreInfos(moreInfos, moreCallbacks).map((p) => p)}
        </div>
      )}
    </div>
  );
}

export default Popup;
