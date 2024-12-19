import React, { useContext } from 'react';
import Input from './Input';
import { VertragContext } from '../../../context/mitarbeiterinfo/VertragProvider';
import CustomButton from '../../utils/custom-button/CustomButton';
import { sortVertragsstufen } from '../../../helper/util';
import { sortVertragsPhasenOrArbeitszeitenByVonBisId } from '../../../helper/vertrags_zeitraum';
import styles from '../../../mitarbeiterinfo/app.module.css';
import Select from './Select';

function PhaseForm() {
  const { formConfig, updatePhase, vertragsTyp } = useContext(VertragContext);

  if (!formConfig) return null;
  const vertrag = formConfig.vertrag;
  const phase = formConfig.phase;

  const typen = vertragsTyp.filter((typ) => {
    typ.vertragsstuves?.sort?.(sortVertragsstufen);
    return typ.id === vertrag.vertragstyp_id;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const _form: HTMLFormElement = event.currentTarget;
    const _formData = new FormData(_form);
    _formData.append('id', phase.id.toString());
    _formData.append('vertrag_id', vertrag.id.toString());
    _formData.append('origin_id', formConfig.originPhase?.id.toString() || '');
    updatePhase(_formData);
  };
  const phasen = vertrag?.vertrags_phases
    ? [...vertrag.vertrags_phases].sort(sortVertragsPhasenOrArbeitszeitenByVonBisId)
    : [];

  let isFirstChild = !phasen.length;
  if (!isFirstChild) {
    isFirstChild = phasen?.[0]?.id === phase.id;
  }

  let isLastChild = !phasen.length;
  if (!isLastChild) {
    isLastChild = phasen?.slice(-1)?.[0]?.id === phase.id;
  }

  const von = isFirstChild ? vertrag?.anfang || phase?.von : phase?.von || vertrag?.anfang;
  const bis = isLastChild ? vertrag?.ende || phase?.bis : phase?.bis || vertrag?.ende;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Von"
        name="von"
        value={von || ''}
        min={vertrag?.anfang || undefined}
        max={vertrag?.ende || undefined}
        type="date"
        required
        readOnly={isFirstChild}
      />
      <Input
        label="Bis"
        name="bis"
        value={bis || ''}
        min={vertrag?.anfang || undefined}
        max={vertrag?.ende || undefined}
        type="date"
        required
        readOnly={isLastChild}
      />
      <Select
        label="Stufe"
        name="vertragsstufe_id"
        data={typen}
        keyExtractor="id"
        optionText="name"
        optgroup={{
          keyExtractor: 'id',
          optionText: ['vertragsgruppe.name', 'stufe', 'von_bis'],
          accessKey: 'vertragsstuves',
          visiblePattern: 'ShowParentInChild'
        }}
        value={phase.vertragsstufe_id}
        required
      />
      <CustomButton type="submit" className={`primary ${styles.btn}`}>
        Speichern
      </CustomButton>
    </form>
  );
}
export default PhaseForm;
