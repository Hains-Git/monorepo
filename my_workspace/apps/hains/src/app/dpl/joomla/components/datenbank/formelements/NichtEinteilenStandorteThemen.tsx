import React, { ReactElement, useEffect, useState } from 'react';
import SelectPerGroup from './SelectPerGroup';
import CustomButton from '../../utils/custom-button/CustomButton';
import { deepClone, getNestedAttr } from '../../../helper/util';
import { TNichtEinteilenAbspracheForm } from '../../../helper/api_data_types';

type StandorteThemenPreselect = {
  [key: string | number]: { index: number; themen_ids: string[]; standortId: string; indizes: number[] };
};

function NichtEinteilenStandorteThemen({
  row,
  formSelectOptions,
  className
}: {
  row: TNichtEinteilenAbspracheForm;
  formSelectOptions: any;
  className?: string;
}) {
  const [count, setCount] = useState<number>(0);
  const [clonedRow, setClonedRow] = useState<TNichtEinteilenAbspracheForm>(deepClone(row));
  const [preSelectedStandorteThemen, setPreSelectedStandorteThemen] = useState<StandorteThemenPreselect>({});

  const standorte = Array.isArray(formSelectOptions?.standorte?.data) ? formSelectOptions.standorte.data : [];
  const themen = Array.isArray(formSelectOptions?.themen?.data) ? formSelectOptions.themen.data : [];

  useEffect(() => {
    setClonedRow(() => deepClone(row));
  }, [row]);

  useEffect(() => {
    const standorteThemen = getNestedAttr(clonedRow, 'nicht_einteilen_standort_themens') || {};
    if (Array.isArray(standorteThemen)) {
      const standorteThemenPreselect = standorteThemen.reduce((acc: StandorteThemenPreselect, standortThema, index) => {
        const standortId = getNestedAttr(standortThema, 'standort_id')?.toString?.() || '';
        const themaId = getNestedAttr(standortThema, 'thema_id')?.toString?.() || '';
        if (!standortId || !themaId || acc?.[standortId]?.themen_ids?.includes?.(themaId)) return acc;
        if (acc[standortId]) {
          acc[standortId].themen_ids.push(themaId);
          acc[standortId].indizes.push(index);
        } else {
          acc[standortId] = { index, themen_ids: [themaId], standortId, indizes: [index] };
        }
        return acc;
      }, {});
      setPreSelectedStandorteThemen(() => standorteThemenPreselect);
      setCount(() => Object.keys(standorteThemenPreselect).length);
    } else {
      setCount(() => 0);
      setPreSelectedStandorteThemen(() => ({}));
    }
  }, [clonedRow]);

  const createStandorteThemen = () => {
    const result: ReactElement[] = [];
    console.log(preSelectedStandorteThemen);
    const preselectedValues = Object.values(preSelectedStandorteThemen).sort((a, b) => a.index - b.index);
    for (let i = 0; i < count; i++) {
      const preselected = preselectedValues[i];
      const elKey = preselected ? `nicht_einteilen_standort_themens.${preselected.index}.standort_id` : '';
      result.push(
        <SelectPerGroup
          key={i}
          label=""
          row={clonedRow}
          required={false}
          elKey={elKey}
          name="standorte_themen"
          groups={standorte.filter(
            (standort: any) =>
              !preSelectedStandorteThemen[standort?.id] || preselected === preSelectedStandorteThemen[standort?.id]
          )}
          groupsValueKey="id"
          groupsLabelKey="name"
          groupOptions={themen}
          groupOptionsValueKey="id"
          groupOptionsLabelKey="name"
          defaultOptions={preselected?.themen_ids || []}
          titleGroups="Standort"
          titleGroupOptions="Themen auswählen"
          onChange={(value) => {
            const standortId = parseInt(value, 10) || 0;
            setClonedRow((prev) => {
              const cloned = deepClone(prev);
              if (preselected) {
                if (preselected.standortId === value) return prev;
                cloned.nicht_einteilen_standort_themens = cloned.nicht_einteilen_standort_themens.map((item) => {
                  if (`${item.standort_id}` === preselected.standortId) {
                    item.standort_id = standortId;
                    item.thema_id = 0;
                  }
                  return item;
                });
              } else {
                cloned.nicht_einteilen_standort_themens.push({
                  standort_id: parseInt(value, 10) || 0,
                  absprache_id: cloned.id,
                  thema_id: 0
                });
              }
              return cloned;
            });
          }}
          onChangeGroup={(value, group) => {
            setClonedRow((prev) => {
              if (!preselected) return prev;
              const cloned = deepClone(prev);
              preselected.indizes.forEach((index) => {
                const id = value.shift();
                if (!id) return;
                cloned.nicht_einteilen_standort_themens[index].thema_id = parseInt(id, 10) || 0;
              });
              value.forEach((id) => {
                cloned.nicht_einteilen_standort_themens.push({
                  standort_id: parseInt(group, 10) || 0,
                  absprache_id: cloned.id,
                  thema_id: parseInt(id, 10) || 0
                });
              });
              return cloned;
            });
          }}
        />
      );
    }
    return result;
  };

  if (!standorte.length || !themen.length) return null;

  return (
    <fieldset className={className}>
      <p>Nicht einteilen (Standorte und Themen)</p>
      <div>{createStandorteThemen()}</div>
      <div>
        <CustomButton clickHandler={() => setCount((prev) => (prev < standorte.length - 1 ? prev + 1 : prev))}>
          +
        </CustomButton>
        <CustomButton clickHandler={() => setCount((prev) => (prev > 0 ? prev - 1 : prev))}>-</CustomButton>
      </div>
    </fieldset>
  );
}

export default NichtEinteilenStandorteThemen;
