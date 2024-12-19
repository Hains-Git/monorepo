import React, { useEffect } from 'react';
import { TbWand } from 'react-icons/tb';
import styles from './magic-einteilungen.module.css';
import CustomButton from '../custom_buttons/CustomButton';
import { numericLocaleCompare } from '../../../tools/helper';
import { UseMounted } from '../../../hooks/use-mounted';

function MagicForm({
  closeDropDown,
  minDate,
  maxDate,
  von,
  bis,
  callBack = () => {},
  kontingente = [],
  setShowLoader = () => {},
  showLoader = false
}) {
  const [formData, setFormData] = React.useState(null);
  const mounted = UseMounted();

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (showLoader || formData) return;
    setShowLoader(true);
    setFormData(() => evt.target);
  };

  useEffect(() => {
    if (!formData) return;
    // Diese Logik hilft dabei den Loader anzuzeigen.
    // Allerdings klappt das nicht in jedem Fall!!!!????
    if (formData instanceof FormData) {
      setFormData(() => null);
      callBack(formData, () => {
        if (!mounted) return;
        setShowLoader(false);
      });
    } else setFormData(() => new FormData(formData));
    return () => {
      setFormData(() => null);
    };
  }, [formData]);

  const check = (evt, bool) => {
    evt.stopPropagation();
    const checkboxes = document
      .getElementById('magic_einteilungen_form')
      .querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      cb.checked = !!bool;
    });
  };

  return (
    <form
      className={styles.magic_form}
      id="magic_einteilungen_form"
      onSubmit={onSubmit}
    >
      <div className={styles.magic_form_head}>
        <p>
          Automatisch Verteilen{' '}
          <CustomButton clickHandler={closeDropDown}>X</CustomButton>
        </p>
        <div>
          <fieldset className={styles.dates}>
            <label>
              Von:{' '}
              <input
                type="date"
                required
                name="von"
                min={minDate}
                max={bis || maxDate}
                defaultValue={von}
              />
            </label>
            <label>
              Bis:{' '}
              <input
                type="date"
                required
                name="bis"
                min={von || minDate}
                max={maxDate}
                defaultValue={bis}
              />
            </label>
          </fieldset>
        </div>
        <div>
          <CustomButton
            clickHandler={(evt) => {
              check(evt, true);
            }}
          >
            Alle
          </CustomButton>
          <CustomButton
            clickHandler={(evt) => {
              check(evt, false);
            }}
          >
            Keine
          </CustomButton>
        </div>
      </div>
      <div>
        <fieldset className={styles.kontingente_container}>
          {kontingente
            .reduce((arr, kontingent) => {
              const { count, dienste } = kontingent.diensteNamenAndPrio;
              if (!count) return arr;
              arr.push(
                <label
                  key={`${kontingent.name}_${count}_${kontingent.id}`}
                  title={`Kontingent: ${kontingent.name}\nBerücksichtigte Dienste: Anzahl = ${count}\n${dienste.join(', ')}`}
                >
                  <input
                    type="checkbox"
                    name="kontingente"
                    value={kontingent.id}
                  />
                  {` ${kontingent.name}`} ({count})
                </label>
              );
              return arr;
            }, [])
            .sort((a, b) => numericLocaleCompare(a.key, b.key))}
        </fieldset>
        <CustomButton
          spinner={{ show: true, default: showLoader }}
          className="primary magic-form-submit-btn"
          type="submit"
        >
          <TbWand />
        </CustomButton>
      </div>
    </form>
  );
}

export default MagicForm;
