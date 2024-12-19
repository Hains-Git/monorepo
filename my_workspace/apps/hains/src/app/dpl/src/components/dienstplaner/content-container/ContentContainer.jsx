import React, { useEffect, useState } from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { UseRegister } from '../../../hooks/use-register';
import { UseTooltip } from '../../../hooks/use-tooltip';
import ShowMore from './content/ShowMore';
import Einteilung from './content/Einteilung';
import Add from './content/Add';
import { UseMounted } from '../../../hooks/use-mounted';

function ContentContainer({
  el,
  className = '',
  style = null,
  limit = 3,
  title = ''
}) {
  const update = UseRegister(el?._push, el?._pull, el);
  const [content, setContent] = useState([]);
  const [addField, setAddField] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const { caret, show, handleClick } = UseDropdown(false, false);
  const [onOver, onOut] = UseTooltip(title);
  const mounted = UseMounted();

  const getContent = () => {
    if (!mounted) return;
    setShowMore(() => false);
    const contentArr = [];
    let add = null;
    el?.setRenderedContent?.([]);
    el?.getContent?.((feld, type = 'mitarbeiter') => {
      let result = feld;
      if (feld?.isAddFeld) {
        result = <Add key={`${feld.id}-${type}`} feld={feld} />;
        add = result;
      } else {
        result = (
          <Einteilung key={`${feld.id}-${type}`} feld={feld} type={type} />
        );
        contentArr.push(result);
      }
      return result;
    });
    const l = contentArr?.length || 0;
    setShowMore(() => limit > 0 && l > limit);
    const renderedContent = show ? contentArr : contentArr.slice(0, limit);
    el?.setRenderedContent?.(
      add?.props?.feld?.shouldSetFocus
        ? [...renderedContent, add]
        : renderedContent
    );
    setAddField(() => add);
    setContent(() => renderedContent);
  };

  useEffect(() => {
    getContent();
    return () => el?.setRenderedContent?.(false);
  }, [el, show, update, mounted]);

  if (!el) return null;
  return (
    <div
      className={`dienstplan-content-container ${className}`}
      style={style}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      {content}
      {showMore && (
        <ShowMore show={show} clickHandler={handleClick} caret={caret} />
      )}
      {addField}
    </div>
  );
}

export default ContentContainer;
