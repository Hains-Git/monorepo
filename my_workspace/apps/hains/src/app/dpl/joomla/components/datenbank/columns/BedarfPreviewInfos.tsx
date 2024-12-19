import React, { ReactElement, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Bedarf, Schichten } from '../../utils/table/types/datenbank';

function BedarfPreviewInfos({ bedarf }: { bedarf: Bedarf }) {
  const [showInfos, setShowInfos] = useState(false);
  const name = bedarf.bereich.name;
  const min = bedarf.min || 0;
  const opt = bedarf.opt || 0;
  const arbeitszeitverteilung = bedarf?.arbeitszeitverteilung;
  const arbeitszeiten = arbeitszeitverteilung?.arbeitszeit;
  const avName = arbeitszeitverteilung?.name || '';

  const getZeiten = (zeiten: Schichten, label: string) => {
    const defaultP = <p key={`label_${label}`}>{label}:</p>;
    if (typeof zeiten === 'object') {
      const result = Object.entries(zeiten).reduce(
        (acc: ReactElement[], [key, schicht]) => {
          if (Array.isArray(schicht)) {
            schicht.forEach((el, index) => {
              acc.push(
                <p key={`${key}_${index}`}>
                  Tag: {(parseInt(key, 10) || 0) + 1} {el?.typ} {el?.von}-
                  {el?.bis}
                </p>
              );
            });
          }
          return acc;
        },
        []
      );
      return result.length ? [defaultP, ...result] : [];
    }
    return [];
  };

  return (
    <div>
      <p
        onClick={() => setShowInfos((prev) => !prev)}
        title={`Bereich: ${name}\nMin. Bedarf: ${min}\nOpt. Bedarf: ${opt}`}
      >
        {name} ({min}, {opt})
        <span>{showInfos ? <FaCaretUp /> : <FaCaretDown />}</span>
      </p>
      {showInfos && (
        <div>
          <p title={`Arbeitszeitverteilung: ${avName}`}>{avName}</p>
          <div>{getZeiten(arbeitszeiten?.schichten, 'Arbeitszeiten')}</div>
          <div>{getZeiten(arbeitszeiten?.freizeiten, 'Freizeiten')}</div>
        </div>
      )}
    </div>
  );
}

export default BedarfPreviewInfos;
