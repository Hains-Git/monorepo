import React from 'react';
import { nonBreakSpace } from '../../../tools/htmlentities';
import Label from '../label/Label';
import { UseRegister } from '../../../hooks/use-register';
import { getFontColorByWhite } from '../../../../joomla/helper/util';

function WunschLabel({ wunsch }) {
  UseRegister(wunsch?.pushToPage, wunsch?.pullFromPage, wunsch);

  const wunschStyle = () => {
    const bgColor = wunsch?.getColor?.();
    if (!bgColor || bgColor === 'transparent') return null;
    const { color } = getFontColorByWhite(bgColor);
    return { backgroundColor: bgColor, color };
  };

  if (!wunsch) return null;
  return (
    <Label
      className="wunsch-label"
      name={wunsch?.getInitialien?.() || nonBreakSpace}
      title={wunsch?.getName?.() || ''}
      parent={false}
      style={wunschStyle()}
    />
  );
}

export default WunschLabel;
