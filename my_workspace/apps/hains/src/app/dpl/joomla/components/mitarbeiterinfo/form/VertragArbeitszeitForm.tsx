import React, { useContext } from 'react';
import { VertragContext } from '../../../context/mitarbeiterinfo/VertragProvider';
import Select from './Select';
import Input from './Input';
import CustomButton from '../../utils/custom-button/CustomButton';
import styles from '../../../mitarbeiterinfo/app.module.css';
import { sortVertragsPhasenOrArbeitszeitenByVonBisId } from '../../../helper/vertrags_zeitraum';

function VertragArbeitszeitForm() {
  const { formConfig, updateArbeitszeit } = useContext(VertragContext);

  if (!formConfig) return null;
  const vertrag = formConfig.vertrag;
  const arbeitszeit = formConfig.arbeitszeit;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const _form: HTMLFormElement = event.currentTarget;
    const _formData = new FormData(_form);
    _formData.append('id', arbeitszeit.id.toString());
    _formData.append('vertrag_id', vertrag.id.toString());
    _formData.append('origin_id', formConfig.originArbeitszeit?.id.toString() || '');
    updateArbeitszeit(_formData);
  };

  const varbeitszeiten = vertrag?.vertrags_arbeitszeits
    ? [...vertrag.vertrags_arbeitszeits].sort(sortVertragsPhasenOrArbeitszeitenByVonBisId)
    : [];

  let isFirstChild = !varbeitszeiten.length;
  if (!isFirstChild) {
    isFirstChild = varbeitszeiten?.[0]?.id === arbeitszeit.id;
  }

  let isLastChild = !varbeitszeiten.length;
  if (!isLastChild) {
    isLastChild = varbeitszeiten?.slice(-1)?.[0]?.id === arbeitszeit.id;
  }

  const von = isFirstChild ? vertrag?.anfang || arbeitszeit?.von : arbeitszeit?.von || vertrag?.anfang;
  const bis = isLastChild ? vertrag?.ende || arbeitszeit?.bis : arbeitszeit?.bis || vertrag?.ende;

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Von"
        name="von"
        value={von || ''}
        min={vertrag.anfang || undefined}
        max={vertrag.ende || undefined}
        type="date"
        readOnly={isFirstChild}
        required
      />
      <Input
        label="Bis"
        name="bis"
        value={bis || ''}
        min={vertrag.anfang || undefined}
        max={vertrag.ende || undefined}
        type="date"
        readOnly={isLastChild}
        required
      />
      <Input label="Vk" name="vk" value={arbeitszeit.vk} type="number" min={0.01} max={1} step={0.01} required />
      <Select
        label="Tagewoche"
        aria-label="tagewoche"
        required
        name="tage_woche"
        title='Arbeitstage pro Woche "1-5"'
        data={[
          { id: 1, val: 1 },
          { id: 2, val: 2 },
          { id: 3, val: 3 },
          { id: 4, val: 4 },
          { id: 5, val: 5 }
        ]}
        value={arbeitszeit.tage_woche}
        keyExtractor="id"
        optionText="val"
      />
      <CustomButton type="submit" className={`primary ${styles.btn}`}>
        Speichern
      </CustomButton>
    </form>
  );
}

export default VertragArbeitszeitForm;
