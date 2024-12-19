import React, { useState } from 'react';
import { TbSchool } from 'react-icons/tb';
import { UseRegister } from '../../../hooks/use-register';
import { UseTooltip } from '../../../hooks/use-tooltip';
import { abwesendClass } from '../../../styles/basic';
import WunschHinweis from '../../dienstplaner/einteilung-auswahl/helper/WunschHinweis';
import FreigabenHinweis from '../../dienstplaner/einteilung-auswahl/helper/FreigabenHinweis';
import KonflikteHinweis from '../../dienstplaner/content-container/content/KonflikteHinweis';
import styles from './mitarbeitervorschlaege.module.css';
import InfoButton from '../../utils/info-button/InfoButton';
import { addClassNames } from '../../../util_func/util';
import Rating from '../../dienstplaner/einteilung-auswahl/helper/Rating';
import { getVorschlaegeGroupTitle } from '../../../tools/helper';
import Sonderrotation from '../../dienstplaner/einteilung-auswahl/helper/Sonderrotation';

function MitarbeiterVorschlag({
  mitarbeiter,
  feld,
  score: { value = 0, title = '', props = false },
  verteiler
}) {
  UseRegister(mitarbeiter?._push, mitarbeiter?._pull, mitarbeiter);
  const [groupTitle, setGroupTitle] = useState('');
  const [onOver, onOut] = UseTooltip(title);

  const extraClass = `${mitarbeiter?.class || ''} ${
    props?.anwesend ? '' : abwesendClass
  }`;

  const einteilen = () => {
    verteiler?.setEinteilungThroughMitarbeiterVorschlag?.(mitarbeiter, feld);
  };

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
      >
        <td
          className={addClassNames(extraClass, styles).trim()}
          onClick={einteilen}
        >
          {mitarbeiter.planname}
        </td>
        <td onMouseOver={onOver} onMouseOut={onOut}>
          ({value.toString()})
        </td>
        <td aria-label="freigabe">
          <FreigabenHinweis freigaben={mitarbeiter?.getFreigaben?.(feld)} />
        </td>
        <td aria-label="konflikt">
          <KonflikteHinweis konflikte={feld?.getKonflikt?.(mitarbeiter)} />
        </td>
        <td aria-label="info">
          <InfoButton parent={feld} title="Informationen zu dem Vorschlag" />
        </td>
        <td aria-label="rating">
          <Rating rating={mitarbeiter?.getRatingByDienstId?.(feld?.dienstId)} />
        </td>
        <td aria-label="sonderrotation">
          {props?.rotationen?.hasSonderroration ? <Sonderrotation /> : null}
        </td>
        <td aria-label="wunsch">
          <WunschHinweis wunsch={feld?.wunschSuccess?.(mitarbeiter, true)} />
        </td>
      </tr>
    </>
  );
}

export default MitarbeiterVorschlag;
