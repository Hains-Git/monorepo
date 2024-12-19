import React, { useEffect, useRef, useState } from 'react';
import { UseRegister } from '../../../hooks/use-register';
import StringListing from '../string-listing/StringListing';

// Tooltip message kann ein String sein oder ein Array mit Objekten der Form
// [{txt: "fdsv", className: "ncvjfoös"}], className ist optional
function Tooltip({ appModel }) {
  UseRegister(appModel?._push, appModel?._pull, appModel);
  const [position, setPosition] = useState({ visibility: 'hidden' });
  const tooltip = appModel?.tooltip;
  const thisRef = useRef(null);

  const onOut = () => {
    appModel?.setToolTip?.(false);
  };

  useEffect(() => {
    setPosition(() => tooltip?.position || { visibility: 'hidden' });
  }, [tooltip]);

  useEffect(() => {
    const ref = thisRef?.current;
    if (tooltip && ref) {
      const rel = tooltip.diff;
      const target = tooltip.target;
      const mouse = tooltip.mouse;
      if (rel && target && mouse) {
        const { x, y, bottom, width, height } = ref.getBoundingClientRect();
        const taPos = target.getBoundingClientRect();
        const result = {};
        const scrollBorder = 25;
        const xW = window.innerWidth - scrollBorder;
        const yW = window.innerHeight - scrollBorder;
        let currentX = x + rel.x;
        let currentY = y + rel.y;
        const diffX = xW - (currentX + width);
        const diffY = yW - (currentY + height);
        if (diffX < 0) currentX += diffX;
        if (currentX < scrollBorder) currentX = scrollBorder;
        // Setzt das Tooltip nach oben, falls es zu groß ist
        if (diffY < 0) {
          const diffBottom = taPos.y - 5 - bottom;
          currentY += diffBottom;
        }
        if (currentY < scrollBorder) currentY = scrollBorder;
        const mouseX = mouse.x;
        const mouseY = mouse.y;
        // Verschiebt das Tooltip zur Seite, wenn die Maus auf dem Tooltip liegt
        const xInSquare = mouseX >= currentX && mouseX <= currentX + width;
        const yInSquaere = mouseY >= currentY && mouseY <= currentY + height;
        if (xInSquare && yInSquaere) {
          const newLeftX = currentX + mouseX - currentX + 10;
          // Nach Rechts verschieben
          if (newLeftX + width <= xW) currentX = newLeftX;
          else {
            // Nach Links verschieben
            currentX = currentX + mouseX - currentX - width - 10;
          }
        }
        // Verschiebt das Tooltip nach rechts, wenn es über den Rand hinausgeht
        result.left = `${currentX}px`;
        result.top = `${currentY}px`;
        setPosition(() => result);
        tooltip.diff = false;
      }
    }
  }, [thisRef, position]);

  return tooltip?.msg && position ? (
    <div
      ref={thisRef}
      className="custom-tooltip"
      style={position}
      onMouseOut={onOut}
    >
      {typeof tooltip.msg === 'string' ? (
        <StringListing str={tooltip.msg} seperator={'\n'} />
      ) : (
        tooltip.msg.map((obj, i) => (
          <StringListing
            key={`tooltip-paragraph-${i}`}
            str={obj.txt}
            seperator={'\n'}
            className={obj.className}
          />
        ))
      )}
    </div>
  ) : null;
}

export default Tooltip;
