import React from 'react';
import { UseTab } from '../../../hooks/use-tab';
import CustomButton from '../custom_buttons/CustomButton';
import TabContainer from './TabContainer';

/**
 * Position 0 entspricht einem Floating Tab,
 * andere Positionen sind für feste Postionierungen gedacht
 * @param {Object} param0
 * @returns React Component
 */
function Tab({
  children,
  button = true,
  parent = { infoTitle: '', tabPosition: 0 },
  checkPosition = 0,
  className = '',
  resizableLeft = false,
  resizableRight = true,
  resizableBottom = true
}) {
  const isInPosition = checkPosition === parent?.tabPosition;
  const [
    startMove,
    closeHandler,
    containerSize,
    thisRef,
    startResize,
    openHandler,
    show
  ] = UseTab(parent, resizableLeft, resizableRight, resizableBottom);

  if (!parent) return null;
  return (
    <>
      {button && (
        <div className={`my-tab ${className}`}>
          <CustomButton spinner={{ show: true }} clickHandler={openHandler}>
            {parent.infoTitle}
          </CustomButton>
        </div>
      )}
      {isInPosition && show && (
        <TabContainer
          parent={parent}
          startMove={startMove}
          closeHandler={closeHandler}
          containerSize={containerSize}
          thisRef={thisRef}
          startResize={startResize}
          resizableLeft={resizableLeft}
          resizableRight={resizableRight}
          resizableBottom={resizableBottom}
        >
          {children}
        </TabContainer>
      )}
    </>
  );
}

export default Tab;
