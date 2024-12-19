import { useEffect } from 'react';
import { getAppModel } from './app-modell-getter';
import { showConsole } from '../tools/flags';
import { isArray, isFunction } from '../tools/types';

/**
 * Ermöglicht Anzeigen des Tooltips in der App.
 * @param {String|Array|Function} title
 * @returns onOver, onOut
 */
export const UseTooltip = (title, doNotCloseOnOverlap = true) => {
  const checkTitle = (t) => {
    if (typeof t === 'string') {
      return t.trim() !== '';
    }
    if (isArray(t)) {
      return t.length > 0;
    }
    return false;
  };
  const hasTitle = () => checkTitle(isFunction(title) ? title() : title);

  // Hinweis, falls kein appModel existiert, existiert auch kein Tooltip
  const errorMsg = () => {
    const msg = 'App Model existiert nicht für das Tooltip';
    if (showConsole) console.log(msg, getAppModel);
    return false;
  };

  // Hover-Funktion -> Anzeigen und Positionieren des Tooltips
  const onOver = (evt) => {
    if (!hasTitle()) return;
    if (evt) evt.stopPropagation();
    const target = evt.target;
    const clX = evt.clientX;
    const clY = evt.clientY;
    const paX = evt.pageX;
    const paY = evt.pageY;
    const relX = paX - clX;
    const relY = paY - clY;
    const { x, bottom } = target.getBoundingClientRect();

    const appModel = getAppModel();
    if (!appModel?.setToolTip) {
      return errorMsg();
    }
    appModel.setToolTip({
      msg: isFunction(title) ? title() : title,
      position: {
        visibility: 'hidden',
        left: `${x + 5 + relX}px`,
        top: `${bottom + 5 + relY}px`,
        stop: false
      },
      diff: {
        x: relX,
        y: relY
      },
      target,
      mouse: {
        x: clX,
        y: clY
      }
    });
  };

  // Tooltip verstecken
  const onOut = (evt) => {
    if (!hasTitle()) return;
    if (evt) {
      evt.stopPropagation();
      if(doNotCloseOnOverlap) {
        const target = evt.target;
        const clX = evt.clientX;
        const clY = evt.clientY;
        const { left, right, bottom, top } = target.getBoundingClientRect();
        const isHorizontal = clX >= left && clX <= right;
        const isVertical = clY >= top && clY <= bottom;
        if (isHorizontal && isVertical) {
          return;
        }
      }
    }
    const appModel = getAppModel();
    if (!appModel?.setToolTip) {
      return errorMsg();
    }
    appModel.setToolTip(false);
  };

  useEffect(
    () => () => {
      onOut();
    },
    [title]
  );

  return [onOver, onOut];
};
