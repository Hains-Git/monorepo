import { zIndexes } from "../../../../styles/basic";
import { longwait, throttle } from "../../../../tools/debounce";
import Basic from "../../../basic";

class Column extends Basic {
  constructor(obj = {}, id = "0", appModel = false) {
    super(appModel);
    this._set("id", id);
    this._set("className", obj?.className || "");
    this._setObject("style", obj?.style);
    this._set("sticky", !!obj?.sticky);
    this._preventExtension();
  }

  /**
   * Bestimmt die stickyPosition der Column.
   * Wird von jeder entsprechenden Zelle der Column aufgerufen, deshalb im Thorttle-Modus
   * @param {Object} el
   */
  getStickyPosition = throttle((el) => {
    if (!this?.sticky) return;
    const siblings = el?.parentElement?.children;
    let width = 0;
    const arr = [];
    for (let i = 0; i < siblings?.length; i++) {
      const cell = siblings[i];
      if (cell === el) break;
      width += cell.getBoundingClientRect().width;
      arr.push(cell);
    }
    const left = `${width}px`;
    if (this?.style?.left !== left) {
      this._setObject("style", {
        position: "sticky",
        left,
        zIndex: zIndexes.z4
      });
      this._update();
    }
  }, longwait);
}

export default Column;
