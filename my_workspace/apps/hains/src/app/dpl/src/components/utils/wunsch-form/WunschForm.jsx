import React, { useEffect } from 'react';
import styles from './wunsch-form.module.css';
import CustomButton from '../custom_buttons/CustomButton';
import SaveButton from '../custom_buttons/SaveButton';
import { hainsOAuth } from '../../../tools/helper';
import { returnError } from '../../../tools/hains';

function WunschForm({
  closeDropDown,
  mitarbeiter = [],
  dienstkategorien = [],
  callBack = () => {}
}) {
  const [disabled, setDisabled] = React.useState(false);
  const [currentMitarbeiter, setCurrentMitarbeiter] = React.useState(
    mitarbeiter?.[0] || null
  );
  const [tag, setTag] = React.useState(false);

  useEffect(() => {
    setCurrentMitarbeiter(() => mitarbeiter?.[0] || null);
  }, [mitarbeiter]);

  const checkFormData = (formData) => {
    const entries = formData.entries().toArray();
    if (entries.length !== 3) return false;
    for (const [key, value] of entries) {
      if (!value) return false;
    }
    return true;
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    setDisabled(() => true);
    const formData = new FormData(evt.target);
    if (!checkFormData(formData)) return;
    hainsOAuth?.api?.('set_wunsch', 'post', formData)?.then(
      (res) => {
        callBack(res);
        setDisabled(() => false);
      },
      (err) => {
        returnError(err);
        callBack(null);
        setDisabled(() => false);
      }
    );
  };

  const wunsch = currentMitarbeiter?.getWunschAm?.(tag);

  return (
    <form className={styles.wunsch_form} onSubmit={onSubmit}>
      <p>
        Wunsch Formular{' '}
        <CustomButton clickHandler={closeDropDown}>X</CustomButton>
      </p>
      <div>
        <fieldset>
          <label>
            Mitarbeiter:{' '}
            <select
              name="mitarbeiter_id"
              required
              onChange={(evt) => {
                const id = parseInt(evt.target.value, 10);
                setCurrentMitarbeiter(() =>
                  mitarbeiter.find((m) => parseInt(m?.id, 10) === id)
                );
              }}
            >
              {mitarbeiter.map((m) => (
                <option key={m.id} title={m?.name || ''} value={m.id}>
                  {m?.cleanedPlanname || m.planname}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        <fieldset>
          <label>
            Tag:{' '}
            <input
              name="tag"
              type="date"
              required
              onChange={(evt) => {
                setTag(() => evt.target.value);
              }}
            />
          </label>
        </fieldset>
        <fieldset>
          <label>
            Wunsch:{' '}
            <select name="dienstkategorie_id" required>
              {dienstkategorien.map((d) => (
                <option
                  key={d.id}
                  title={`${d?.name} ${d?.beschreibung ? `\nBeschreibung:\n${d.beschreibung}` : ''}`}
                  value={d.id}
                >
                  {d.poppix_name || d.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        {wunsch ? (
          <p title={wunsch?.getName?.() || ''}>
            Vorhandener Wunsch: {wunsch?.getInitialien?.() || ''}
          </p>
        ) : null}
        <SaveButton disable={disabled} className="primary" type="submit" />
      </div>
    </form>
  );
}

export default WunschForm;
