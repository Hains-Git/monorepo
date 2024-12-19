import React, { useContext } from 'react';
import { UseFeld } from '../../../../hooks/use-feld';
import { preventDefault } from '../../../../styles/basic';
import CustomInput from '../../../utils/custom-input/CustomInput';
import InfoButton from '../../../utils/info-button/InfoButton';
import Block from './Block';
import Dropdown from './Dropdown';
import KonflikteHinweis from './KonflikteHinweis';
import RemoveEinteilung from './RemoveEinteilung';
import VorschlagMark from './VorschlagMark';
import { DienstplanContext } from '../../../../contexts/dienstplan';

function Einteilung({ feld, type = 'mitarbeiter' }) {
  const {
    value,
    className,
    style,
    title,
    refInput,
    vorschlaege,
    konflikte,
    focusOnInput,
    handleFocus,
    handleBlur,
    handleChange,
    onKeyDown,
    focusedIndex,
    isVorschlag,
    isNotPublic
  } = UseFeld(feld, type);
  const { currentFeld } = useContext(DienstplanContext);
  if (!feld?.visible) return null;

  const mitarbeiterType = type === 'mitarbeiter';

  let mark = '';
  if (feld?.markEinteilungsstatus) {
    if (isVorschlag()) mark = <VorschlagMark label="*" title="Vorschlag" />;
    else if (isNotPublic()) {
      mark = <VorschlagMark label="**" title="Nicht öffentlich" />;
    }
  }

  return (
    <div
      style={style}
      className={`${className} ${feld.optionalClass} ${currentFeld === feld ? 'active' : ''}`.trim()}
      data-id={feld.id}
      onClick={focusOnInput}
    >
      <CustomInput
        title={title}
        inputRef={refInput}
        value={value}
        onChange={handleChange}
        onFocus={(evt) => handleFocus(evt, false)}
        onDoubleClick={(evt) => handleFocus(evt, true)}
        readOnly={!feld?.writable}
        onBlur={handleBlur}
        onKeyDown={mitarbeiterType ? onKeyDown : null}
        className={`dienstplan-einteilung-label ${preventDefault}`}
      />
      {!feld?.default && (
        <>
          {mark}
          <KonflikteHinweis konflikte={konflikte} />
          <div className="dienstplan-einteilung-extras">
            {feld?.isBlock && <Block feld={feld} readOnly={!feld?.writable} />}
            <InfoButton parent={feld} className="primary" title="Zeigt weitere Informationen an" />
            {feld?.writable && <RemoveEinteilung feld={feld} type={type} />}
          </div>
          {mitarbeiterType && <Dropdown focusedIndex={focusedIndex} vorschlaege={vorschlaege} />}
        </>
      )}
    </div>
  );
}

export default Einteilung;
