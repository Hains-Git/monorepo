import React from 'react';

import { useScrollWindow } from '../../../hooks/use-scroll-window';

function ScrollWindow() {
  const { scrollThrough, dragLeave } = useScrollWindow();

  return (
    <div
      className="scrolling-window"
      onDragOver={scrollThrough}
      onDragLeave={dragLeave}
    />
  );
}

export default ScrollWindow;
