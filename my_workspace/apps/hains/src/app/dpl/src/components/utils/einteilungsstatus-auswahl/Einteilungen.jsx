import { useEffect, useState, useRef } from 'react';
import { FaEye } from 'react-icons/fa';
import { UseDropdown } from '../../../hooks/use-dropdown';
import CustomButton from '../custom_buttons/CustomButton';
import InfoButton from '../info-button/InfoButton';
import { reply, trash } from './icons';
import styles from './einteilungsstatus-auswahl.module.css';
import { UseTooltip } from '../../../hooks/use-tooltip';

function Einteilungen({ parent, auswahl, onlyDoubles }) {
  const { caret, show, handleClick } = UseDropdown(!!parent?.show, false);

  const status = parent?.einteilungsstatus?.name || 'Error';
  const isPublic = !!parent?.einteilungsstatus?.public;
  const count = (parent?.einteilungen?.length || 0).toString();
  const statusName = auswahl?.einteilungsstatus?.name || '';

  const countMehrfacheEinteilungen = (
    parent?.mehrfacheEnteilungen?.einteilungen?.length || 0
  ).toString();

  const isCurrentStatus =
    parent?.einteilungsstatus.id === auswahl.einteilungsstatus_id;

  const [content, setContent] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [onOver, onOut] = UseTooltip(
    `Nicht veröffentlichte Einteilungen: ${count}\n
     Mehrfache Einteilungen: ${countMehrfacheEinteilungen}`
  );

  const elementRef = useRef(null);

  const getContent = () => {
    const arr = [];
    const einteilungen = onlyDoubles
      ? parent?.mehrfacheEnteilungen?.einteilungen
      : parent?.einteilungen;
    einteilungen?.forEach?.((einteilung) => {
      const isDouble =
        !!auswahl?.einteilungen?.mehrfacheEnteilungenKeys?.[
          einteilung?.checkMehrfacheEinteilungKey
        ]?.isDouble;
      arr.push(
        <div
          key={einteilung.id}
          className={`${styles.status_item} ${
            isDouble ? styles.doppelte_einteilung : ''
          }`}
        >
          <p className={styles.status_item_text}>
            <span onDoubleClick={() => einteilung?.date?.setInfo?.()}>
              {einteilung.date.label}
            </span>
            <span onDoubleClick={() => einteilung?.dienst?.setInfo?.()}>
              , {einteilung.dienst.planname}
            </span>
            <span onDoubleClick={() => einteilung?.mitarbeiter?.setInfo?.()}>
              , {einteilung.mitarbeiter.cleanedPlanname}
            </span>
          </p>
          <p className={styles.action_btns}>
            {!isCurrentStatus && (
              <CustomButton
                clickHandler={(evt, setLoading) =>
                  auswahl.publish(
                    { einteilungen: [einteilung] },
                    false,
                    setLoading
                  )
                }
                title="Ändert den Status der Einteilung."
                className="as_icon primary"
                spinner={{ show: true }}
              >
                {reply}
              </CustomButton>
            )}
            <CustomButton
              className="red as_icon"
              clickHandler={(evt, setLoading) => {
                auswahl.remove([einteilung], setLoading);
              }}
              title="Aufheben der Einteilung."
              spinner={{ show: true }}
            >
              {trash}
            </CustomButton>
            <InfoButton
              className="as_icon"
              title="Informationen zur Einteilung."
              parent={einteilung}
            />
          </p>
        </div>
      );
    });
    return arr;
  };

  useEffect(() => {
    if (show) {
      setContent(() => getContent());
    }
  }, [parent, auswahl, show, onlyDoubles]);

  useEffect(() => {
    setShowLoader(() => !show);
  }, [content, show]);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 640) {
          entry.target.classList.add('columns');
        } else {
          entry.target.classList.remove('columns');
        }
      }
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const getCurrentContent = () => {
    if (!show) return null;
    if (showLoader) return '... Daten werden überprüft ...';
    if (!content?.length)
      return 'Keine überschreibbaren Einteilungen gefunden.';
    return content;
  };

  return (
    <div id={parent.id} ref={elementRef} className="einteilungsstatus-auswahl">
      <p
        onClick={(evt) => {
          const showNow = handleClick(evt);
          parent.show = !!showNow;
        }}
        className={styles.body_headline}
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        {isPublic && <FaEye />}
        {status}
        {!isCurrentStatus && ` ändern zu ${statusName}`}
        <span className="caret">{caret}</span>
        {!isCurrentStatus && (
          <CustomButton
            clickHandler={(evt, setLoading) => {
              evt.stopPropagation();
              auswahl.publish(parent, false, setLoading);
            }}
            title={`Ändert den Status aller Einteilungen mit Status ${status} zu ${statusName}.`}
            className="as_icon primary"
            spinner={{ show: true }}
          >
            {reply}
          </CustomButton>
        )}
        {onlyDoubles
          ? `${countMehrfacheEinteilungen}` !== '0' && (
              <CustomButton
                className="red as_icon"
                clickHandler={(evt, setLoading) => {
                  evt.stopPropagation();
                  auswahl.remove(
                    parent?.mehrfacheEnteilungen?.einteilungen || [],
                    setLoading
                  );
                }}
                title={`Aufheben der angezeigten doppelten ${status} Einteilungen.`}
                spinner={{ show: true }}
              >
                {trash}
              </CustomButton>
            )
          : auswahl?._user?.isAdmin && (
              <CustomButton
                className="red as_icon"
                clickHandler={(evt, setLoading) => {
                  evt.stopPropagation();
                  if (
                    window.confirm(
                      'Sind Sie sicher, dass Sie alle Einteilungen löschen möchten?'
                    )
                  ) {
                    auswahl.remove(parent?.einteilungen || [], setLoading);
                  } else {
                    setLoading(false);
                  }
                }}
                title={`Aufheben der angezeigten ${status} Einteilungen.`}
                spinner={{ show: true }}
              >
                {trash}
              </CustomButton>
            )}
      </p>
      <div className={styles.status_item_wrapper}>{getCurrentContent()}</div>
    </div>
  );
}

export default Einteilungen;
