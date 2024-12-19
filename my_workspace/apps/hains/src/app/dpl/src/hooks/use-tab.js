import {
  useCallback, useEffect, useRef, useState
} from "react";
import { shortwait, throttle } from "../tools/debounce";
import { UseRegister } from "./use-register";

/**
 * Ermöglicht das Anzeigen, Verschieben und Vergrößern von Tabs.
 * @param {Object} parent Entspricht einem Modell
 * @returns startMove, closeHandler, containerSize, thisRef, startResize, openHandler, show
 */
export const UseTab = (
  parent, 
  resizableLeft = false,
  resizableRight = true,
  resizableBottom = true
) => {
  const thisRef = useRef(null);
  // Get References rectangle
  const getRefRect = () => (thisRef && thisRef.current
    ? thisRef.current.getBoundingClientRect() : false);

  // Gibt die DefaultPosition bezogen auf das Fenster zurück
  const defaultPosition = () => {
    const h = window.innerHeight;
    const w = window.innerWidth;

    return {
      x: w / 10,
      y: h / 10,
      width: 400,
      height: 400
    };
  };

  // Gibt die DefaultDownPosition zurück
  const defaultDownPos = () => ({
    x: 0,
    y: 0,
    move: false,
    resize: false,
    rect: getRefRect()
  });

  const [containerSize, setContainerSize] = useState(defaultPosition());
  const [downPosition, setDownPosition] = useState(defaultDownPos());
  const [show, setShow] = useState(false);
  const update = UseRegister(parent?._push, parent?._pull, parent);

  // Handle Body EventListeners
  const addEvent = (e, func) => document.body.addEventListener(e, func);
  const removeEvent = (e, func) => document.body.removeEventListener(e, func);

  // Update Größe des Containers
  const updateContainerSize = (x, y, w, h) => {
    setContainerSize(() => {
      const minX = 0;
      const minY = minX;
      const maxX = window.innerWidth;
      const maxY = window.innerHeight;
      const minW = 200;
      const minH = 100;
      const newSize = {};
      newSize.x = downPosition.rect.x;
      newSize.y = downPosition.rect.y;
      newSize.width = downPosition.rect.width;
      newSize.height = downPosition.rect.height;
      if (x !== false) {
        newSize.x += x - downPosition.x;
        if (newSize.x < minX) newSize.x = minX;
        else if (newSize.x + newSize.width > maxX) newSize.x = maxX - newSize.width;
      }

      if (y !== false) {
        newSize.y += y - downPosition.y;
        if (newSize.y < minY) newSize.y = minY;
        else if (newSize.y + newSize.height > maxY) newSize.y = maxY - newSize.height;
      }

      if (w !== false) {
        const factor = resizableLeft ? -1 : 1;
        newSize.width += (w - downPosition.x) * factor;
        if (newSize.width + newSize.x > maxX && !resizableLeft) newSize.width = maxX - newSize.x;
        if (newSize.width < minW) newSize.width = minW;
        if (newSize.width > maxX) newSize.width = maxX;
      }

      if (h !== false) {
        newSize.height += h - downPosition.y;
        if (newSize.height + newSize.y > maxY) newSize.height = maxY - newSize.y;
        if (newSize.height < minH) newSize.height = minH;
        if (newSize.height > maxY) newSize.height = maxY;
      }
      if (newSize.y < minY) newSize.y = minY;
      if (newSize.height > maxY) newSize.height = maxY;

      return newSize;
    });
  };

  // Handler um die Breite und Höhe des Containers anpassen
  const resizeContainer = useCallback(throttle((evt) => {
    evt.stopPropagation();
    window.getSelection().removeAllRanges();
    updateContainerSize(false, false, (resizableLeft || resizableRight) && evt.clientX, resizableBottom && evt.clientY);
  }, shortwait), [downPosition]);

  // Wenn sich die document size ändert, wird die Funktion neu instantiiert
  const mouseMoveHandler = useCallback(throttle((evt) => {
    evt.stopPropagation();
    window.getSelection().removeAllRanges();
    updateContainerSize(evt.clientX, evt.clientY, false, false);
  }, shortwait), [downPosition]);

  // Entfernt alle MouseMove eventListener
  const removeMouseMove = useCallback((evt) => {
    if (evt) evt.stopPropagation();
    removeEvent("mousemove", resizeContainer);
    removeEvent("mousemove", mouseMoveHandler);
    setDownPosition(() => (defaultDownPos()));
  }, [downPosition]);

  // USE EFFECTS --------------------------------------------------------------------------
  // Ermöglicht das triggern der Anzeige aus dem Modell heraus
  useEffect(() => {
    if (parent.infoFkt !== undefined) {
      setShow(() => (!!parent.infoFkt));
    }
  }, [update, parent]);

  // Wenn die Funktion neu instantiert wird, wird der Handler neu angelegt und der alte entfernt
  useEffect(() => {
    addEvent("mouseleave", removeMouseMove);
    addEvent("mouseup", removeMouseMove);
    const rect = getRefRect();
    if (rect) {
      setContainerSize(() => ({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }));

      setDownPosition(() => (defaultDownPos()));
    }

    return () => {
      removeMouseMove();
      removeEvent("mouseleave", removeMouseMove);
      removeEvent("mouseup", removeMouseMove);
    };
  }, [thisRef]);

  // Anpassen der Positionen
  useEffect(() => {
    if (downPosition.move && downPosition.rect) addEvent("mousemove", mouseMoveHandler);
    else removeEvent("mousemove", mouseMoveHandler);
    if (downPosition.resize && downPosition.rect) addEvent("mousemove", resizeContainer);
    else removeEvent("mousemove", resizeContainer);

    return () => {
      removeEvent("mousemove", mouseMoveHandler);
      removeEvent("mousemove", resizeContainer);
    };
  }, [downPosition]);

  // EventHandler ----------------------------------------------------------------------------
  // Startet das Verschieben des Tabs
  const startMove = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const rect = getRefRect();
    if (rect) {
      setDownPosition(() => ({
        x: evt.clientX,
        y: evt.clientY,
        move: true,
        resize: false,
        rect
      }));
    }
  };

  // Startet das Verändern der Größe des Tabs
  const startResize = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    const rect = getRefRect();
    if (rect) {
      setDownPosition(() => ({
        x: evt.clientX,
        y: evt.clientY,
        move: false,
        resize: true,
        rect
      }));
    }
  };

  // Schließt das Tab
  const closeHandler = (evt, setLoading) => {
    evt.stopPropagation();
    parent?.setInfo?.();
    setShow(() => false);
    setDownPosition(() => (defaultDownPos()));
    setLoading?.(() => false);
  };

  // Öffnet das Tab
  const openHandler = (evt, setLoading) => {
    evt.stopPropagation();
    setShow(() => true);
    parent?.setInfoFkt?.(true);
    setLoading?.(() => false);
  };

  return [
    startMove,
    closeHandler,
    containerSize,
    thisRef,
    startResize,
    openHandler,
    show
  ];
};
