import React from 'react';
import { SlSizeFullscreen } from 'react-icons/sl';
import CustomButton from '../custom_buttons/CustomButton';

/**
 * Positionen != 0 sind für feste Postionierungen gedacht
 * @param {Object} param0
 * @returns React Component
 */
function TabContainer({
  parent,
  children,
  startMove,
  closeHandler,
  containerSize,
  thisRef,
  startResize,
  resizableLeft = false,
  resizableRight = false,
  resizableBottom = false
}) {
  const { x, y, width, height } = containerSize;
  const style = {};
  if (resizableLeft || resizableRight) {
    style.width = width;
  }
  if (resizableBottom) {
    style.height = height;
  }
  if (!parent.tabPosition) {
    style.top = `${y}px`;
    style.left = `${x}px`;
  }

  return (
    <div className="my-tab-container" style={style} ref={thisRef}>
      <div className="my-tab-head">
        <div className="my-tab-head-title-container" onMouseDown={startMove}>
          <p className="my-tab-head-title">{parent.infoTitle}</p>
        </div>
        <div className="my-tab-head-btns">
          {parent?.positions || null}
          <CustomButton
            spinner={{ show: true }}
            title="Tab schließen."
            clickHandler={closeHandler}
          >
            {' X '}
          </CustomButton>
        </div>
      </div>

      <div className="my-tab-body-container">
        {resizableLeft ? (
          <div
            className="my-tab-body-left"
            title="Container-Breite ändern"
            onMouseDown={startResize}
          />
        ) : null}
        <div className="my-tab-body">{children}</div>
      </div>

      <div className="my-tab-foot">
        <div className="my-tab-foot-info">{parent?.footInfo || ''}</div>
        {resizableRight || resizableBottom ? (
          <div className="my-tab-foot-btns">
            <div onMouseDown={startResize}>
              <SlSizeFullscreen />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TabContainer;
