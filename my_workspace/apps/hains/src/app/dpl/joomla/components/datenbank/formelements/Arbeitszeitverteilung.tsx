import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import SelectInput from './SelectInput';
import TimeInput, { timePattern } from './TimeInput';
import { getNestedAttr } from '../../../helper/util';
import styles from '../datenbank.module.css';
import CustomButton from '../../utils/custom-button/CustomButton';

type Arbeitszeit = {
  typ_id: string;
  von: string;
  bis: string;
  indexVon: number;
  indexBis: number;
};

const defaultArbeitszeiten = [
  {
    typ_id: '',
    von: '00:00',
    bis: '00:00',
    indexVon: 0,
    indexBis: 1
  }
];

const checkTag = (arbeitszeit: Arbeitszeit, tag: number) => {
  if (
    parseInt(arbeitszeit.von.split(':').join(''), 10) >=
    parseInt(arbeitszeit.bis.split(':').join(''), 10)
  ) {
    return tag + 1;
  }
  return tag;
};

type ArbeitszeitenInfos = {
  elements: ReactElement[];
  tag: number;
};

function Arbeitszeitverteilung({
  row,
  formSelectOptions,
  setDauer,
  max
}: {
  row: any;
  formSelectOptions: any;
  setDauer: React.Dispatch<React.SetStateAction<number>>;
  max: number;
}) {
  const [arbeitszeiten, setArbeitszeiten] = useState<Arbeitszeit[]>([]);
  const [arbeitszeitenInfos, setArbeitszeitenInfos] =
    useState<ArbeitszeitenInfos>({
      elements: [],
      tag: 1
    });

  const arbeitszeittypen = Array.isArray(
    formSelectOptions?.arbeitszeittypen?.data
  )
    ? formSelectOptions.arbeitszeittypen.data
    : [];

  useEffect(() => {
    const zeittypen = getNestedAttr(row, 'zeittypen') || [];
    const verteilung = getNestedAttr(row, 'verteilung') || [];
    const arbeitszeittypDetails =
      getNestedAttr(row, 'arbeitszeittypDetails') || [];
    if (
      Array.isArray(arbeitszeittypDetails) &&
      Array.isArray(zeittypen) &&
      Array.isArray(verteilung)
    ) {
      const typenHash = arbeitszeittypDetails.reduce(
        (
          acc: {
            [key: string]: any;
          },
          typ: any
        ) => {
          const id = getNestedAttr(typ, 'id')?.toString?.() || '';
          acc[id] = typ;
          return acc;
        },
        {}
      );
      const _arbeitszeiten = zeittypen.reduce(
        (acc: Arbeitszeit[], zeittyp_id: any, index: number) => {
          const typ = typenHash[zeittyp_id];
          const von = verteilung[index] || '';
          const bis = verteilung[index + 1] || '';
          if (typ && von.match(timePattern) && bis.match(timePattern)) {
            acc.push({
              typ_id: zeittyp_id,
              von,
              bis,
              indexVon: index,
              indexBis: index + 1
            });
          }
          return acc;
        },
        []
      );
      setArbeitszeiten(() =>
        _arbeitszeiten.length ? _arbeitszeiten : defaultArbeitszeiten
      );
    } else {
      setArbeitszeiten(() => defaultArbeitszeiten);
    }
  }, [row, formSelectOptions]);

  const setArbeitszeitenAttr = useCallback(
    (key: keyof Arbeitszeit, value: string, index: number) => {
      setArbeitszeiten((prev) => {
        const newArbeitszeiten = [...prev];
        if (
          newArbeitszeiten[index] &&
          key !== 'indexVon' &&
          key !== 'indexBis'
        ) {
          newArbeitszeiten[index][key] = value;
          if (key === 'bis' && newArbeitszeiten[index + 1]) {
            newArbeitszeiten[index + 1].von = value;
          }
        }
        return newArbeitszeiten;
      });
    },
    []
  );

  const createArbeitszeit = () => {
    const l = arbeitszeiten.length - 1;
    return arbeitszeiten.reduce(
      (acc: ArbeitszeitenInfos, arbeitszeit, i) => {
        const element = (
          <div key={i}>
            <SelectInput
              required={false}
              label=""
              title="Arbeitszeittyp"
              row={row}
              elKey={`zeittypen.${arbeitszeit.indexVon}`}
              name={`zeittypen[${i}]`}
              optionLabelKey="name"
              optionValueKey="id"
              options={arbeitszeittypen}
              onChange={(value) => {
                setArbeitszeitenAttr('typ_id', value, i);
              }}
            />
            <div>
              <p>Tag {acc.tag}</p>
              {i < 1 ? (
                <TimeInput
                  required={false}
                  label=""
                  row={row}
                  elKey={`verteilung.${arbeitszeit.indexVon}`}
                  name={`verteilung[${i}]`}
                  labelBack=""
                  onChange={(value) => {
                    setArbeitszeitenAttr('von', value, i);
                  }}
                />
              ) : (
                <p> {arbeitszeit.von}</p>
              )}
              <TimeInput
                required={false}
                label="-"
                row={row}
                elKey={`verteilung.${arbeitszeit.indexBis}`}
                name={`verteilung[${i + 1}]`}
                labelBack="Uhr"
                onChange={(value) => {
                  setArbeitszeitenAttr('bis', value, i);
                }}
              />
            </div>
          </div>
        );
        if (i < l) {
          acc.tag = checkTag(arbeitszeit, acc.tag);
        }
        if (acc.tag > max) return acc;
        acc.elements.push(element);
        return acc;
      },
      {
        elements: [],
        tag: 1
      }
    );
  };

  useEffect(() => {
    const _arbeitszeitenInfos = createArbeitszeit();
    setDauer(() => _arbeitszeitenInfos.tag);
    setArbeitszeitenInfos(() => _arbeitszeitenInfos);
  }, [arbeitszeiten]);

  return (
    <fieldset>
      <p title={`Maximal ${max} Tage gestattet`}>Arbeitszeit</p>
      <div className={styles.arbeitszeiten}>{arbeitszeitenInfos.elements}</div>
      <div className={styles.add_remove_button}>
        {arbeitszeitenInfos.tag < max ? (
          <CustomButton
            clickHandler={() => {
              setArbeitszeiten((prev) => {
                const newArbeitszeiten = [...prev];
                const l = newArbeitszeiten.length;
                newArbeitszeiten.push({
                  typ_id: '',
                  von: l ? newArbeitszeiten[l - 1].bis : '00:00',
                  bis: '00:00',
                  indexVon: l,
                  indexBis: l + 1
                });
                return newArbeitszeiten;
              });
            }}
          >
            +
          </CustomButton>
        ) : null}
        <CustomButton
          clickHandler={() => {
            setArbeitszeiten((prev) =>
              prev.length > 1 ? prev.slice(0, -1) : prev
            );
          }}
        >
          -
        </CustomButton>
      </div>
    </fieldset>
  );
}

export default Arbeitszeitverteilung;
