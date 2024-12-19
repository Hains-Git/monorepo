import React, { useState } from 'react';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { abwesendClass } from '../../../styles/basic';
import Block from '../content-container/content/Block';
import KonflikteHinweis from '../content-container/content/KonflikteHinweis';
import EinteilungenInfos from './helper/EinteilungenInfo';
import FreigabenHinweis from './helper/FreigabenHinweis';
import WunschHinweis from './helper/WunschHinweis';
import InfoButton from '../../utils/info-button/InfoButton';
import { UseRegister } from '../../../hooks/use-register';
import Bedarfe from './helper/bedarfe';
import styles from './einteilungauswahl.module.css';
import { addClassNames } from '../../../util_func/util';
import Rating from './helper/Rating';
import { getVorschlaegeGroupTitle } from '../../../tools/helper';
import Sonderrotation from './helper/Sonderrotation';

function AuswahlRow({
  feld,
  mitarbeiter,
  type = 'mitarbeiter',
  closeDropDown = () => {},
  score: { value = 0, title = '', props = false },
  showBedarfe = false,
  infoParent = false,
  readOnly = false,
  oldFeld = false
}) {
  UseRegister(mitarbeiter?._push, mitarbeiter?._pull, mitarbeiter);
  const [groupTitle, setGroupTitle] = useState('');
  const [onOver, onOut] = UseTooltip(title);

  /**
   * Auswahl einteilen
   * @param {Object} evt
   */
  const einteilen = (evt) => {
    evt.stopPropagation();
    if (readOnly) return;
    const writable =
      feld?.writable && mitarbeiter?.writable?.(feld?.tag, feld?.dienstId);
    if (!writable) return;
    oldFeld?.writable && oldFeld?.remove?.(true);
    feld.debouncedEinteilen({
      value: mitarbeiter.id,
      post: true,
      eachFeld: true
    });
    closeDropDown();
  };

  if (!feld || !mitarbeiter) return null;

  const isMitarbeiterType = type === 'mitarbeiter';
  const extraClass = `${mitarbeiter?.class || ''} ${
    props?.anwesend ? '' : abwesendClass
  }`;

  return (
    <>
      {groupTitle ? (
        <tr className={`ignore_check_row ${styles.group_title}`}>
          <td colSpan={15}>{groupTitle}</td>
        </tr>
      ) : null}
      <tr
        ref={(ref) => {
          const gTitle = getVorschlaegeGroupTitle(ref);
          if (gTitle === 'ignore') return;
          setGroupTitle(() => gTitle);
        }}
        data-aktiv={mitarbeiter?.aktivAm?.(feld?.tag || '')}
        data-abwesend={!props?.anwesend}
        data-not-dienstteam={
          !mitarbeiter?.isTrulyInTeam?.(
            feld?.dienst?.team || false,
            feld?.tag || ''
          )
        }
        onClick={einteilen}
      >
        {showBedarfe && <Bedarfe feld={feld} />}
        <td
          className={`${styles.label} ${addClassNames(
            extraClass,
            styles
          ).trim()}`}
        >
          {`${
            isMitarbeiterType
              ? mitarbeiter.cleanedPlanname
              : feld?.getAuswahlLabel?.(type) || ''
          } `}
        </td>
        <td onMouseOver={onOver} onMouseOut={onOut}>
          ({value.toString()})
        </td>
        {!isMitarbeiterType && !!readOnly && feld?.isBlock && (
          <td aria-label="block">
            <Block feld={feld} />
          </td>
        )}
        <td aria-label="wunsch">
          <WunschHinweis wunsch={feld?.wunschSuccess?.(mitarbeiter, true)} />
        </td>
        <td aria-label="freigabe">
          <FreigabenHinweis
            className={styles.counter}
            freigaben={mitarbeiter?.getFreigaben?.(feld)}
          />
        </td>
        <td aria-label="konflikte">
          <KonflikteHinweis konflikte={feld?.getKonflikt?.(mitarbeiter)} />
        </td>
        {isMitarbeiterType ? (
          <EinteilungenInfos einteilungen={props?.einteilungenInfoScore} />
        ) : null}
        <td aria-label="info">
          <InfoButton
            parent={infoParent || feld}
            title="Informationen zu der Auswahl"
          />
        </td>
        <td aria-label="rating">
          <Rating rating={mitarbeiter?.getRatingByDienstId?.(feld?.dienstId)} />
        </td>

        <td aria-label="sonderrotation">
          {props?.rotationen?.hasSonderroration ? <Sonderrotation /> : null}
        </td>
      </tr>
    </>
  );
}

export default AuswahlRow;
