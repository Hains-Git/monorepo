import React, { useEffect, useState } from 'react';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import StandardSelectField from '../../../../utils/standard-select-field/StandardSelectField';
import CheckBox from './form/CheckBox';
import CounterOptionen from './form/CounterOptionen';
import NumberInput from './form/NumberInput';
import RadioButton from './form/RadioButton';
import CounterColoring from './form/CounterColoring';
import { UseRegister } from '../../../../../hooks/use-register';
import { deleteBtnClass } from '../../../../../styles/basic';
import SaveButton from '../../../../utils/custom_buttons/SaveButton';
import DeleteButton from '../../../../utils/custom_buttons/DeleteButton';

function CounterForm({
  customFelder,
  update,
  counter = false,
  toggleDropDown = false
}) {
  const [thisCounter, setThisCounter] = useState(false);
  UseRegister(thisCounter._push, thisCounter._pull, thisCounter);

  useEffect(() => {
    setThisCounter(() => customFelder?.newCounter?.(counter));
  }, [counter, update]);

  const createOptions = (el) => {
    const {
      isTitle,
      isButton,
      isCheckbox,
      isRadio,
      label,
      title,
      key,
      getChecked,
      getOptions,
      onClick,
      radiogroup,
      radiovalue,
      isNumber,
      getNumber
    } = el;
    if (isTitle) {
      return (
        <CounterOptionen
          key={key}
          name={label}
          title={title}
          getChildren={getOptions}
        />
      );
    }
    if (isButton) {
      return (
        <CustomButton
          key={key}
          spinner={{ show: true }}
          clickHandler={onClick}
          title={title}
        >
          {label}
        </CustomButton>
      );
    }
    if (isCheckbox) {
      return (
        <CheckBox
          key={key}
          label={label}
          onChange={onClick}
          checked={getChecked()}
          parent={el}
          name={`dienstplan-checkbox-${key}`}
          id={`dienstplan-checkbox-${key}`}
          title={title}
        />
      );
    }
    if (isRadio) {
      return (
        <RadioButton
          key={key}
          label={label}
          onChange={onClick}
          value={radiovalue}
          checked={getChecked()}
          name={radiogroup}
          parent={el}
          id={`dienstplan-radiobtn-${key}`}
          title={title}
        />
      );
    }
    if (isNumber) {
      return (
        <NumberInput
          key={key}
          label={label}
          onChange={onClick}
          getNumber={getNumber}
          name={`dienstplan-number-${key}`}
          parent={el}
          id={`dienstplan-radiobtn-${key}`}
          title={title}
        />
      );
    }
    return null;
  };

  if (!thisCounter) return false;

  const {
    id,
    cell_id,
    cellId,
    zugehoerigkeit,
    name,
    beschreibung,
    act_as_funktion,
    evaluate_seperate,
    empty_as_regeldienst,
    hidden,
    row,
    countIndex,
    countAuswahl,
    isArbeitszeitCounter
  } = thisCounter;

  const getLabelIfItExists = (label, name) =>
    label ? (
      <p key={`counter-form-counter-label-${name}`}>{`${name}: ${label}`}</p>
    ) : null;

  return (
    <div
      onClick={(evt) => {
        evt.stopPropagation();
      }}
      className="table-custom-feld-auswahl-form"
    >
      <div className="table-custom-feld-auswahl-counter-head">
        <div>
          {[
            getLabelIfItExists(id, 'ID'),
            getLabelIfItExists(cell_id, 'Rel. Cell-Id'),
            getLabelIfItExists(cellId, 'Abs. Cell-Id'),
            getLabelIfItExists(row ? 'Zeile' : 'Spalte', 'Typ'),
            getLabelIfItExists(zugehoerigkeit, 'Zugehörigkeit')
          ]}
        </div>
        <div>
          <label htmlFor={`counter-name_${id}`}>Name: </label>
          <input
            id={`counter-name_${id}`}
            onChange={(evt) => {
              thisCounter.setName(evt.target.value);
              thisCounter._update();
            }}
            value={name}
            maxLength={100}
          />
        </div>
        <div>
          <label htmlFor={`counter-beschreibung_${id}`}>Beschreibung: </label>
          <textarea
            id={`counter-beschreibung_${id}`}
            onChange={(evt) => {
              thisCounter.setBeschreibung(evt.target.value);
              thisCounter._update();
            }}
            value={beschreibung}
            maxLength={300}
          />
        </div>
      </div>

      <div className="table-custom-feld-auswahl-form-radio-container">
        <CheckBox
          label="Verstecken"
          onChange={(evt) => {
            thisCounter.setHidden(evt.target.checked);
            thisCounter._update();
          }}
          checked={hidden}
          name="dienstplan-hide_counter"
          id="dienstplan-hide_counter"
          title="Zähler kann in Funktionen genutzt werden, wird aber nicht in der Tabelle angezeigt."
        />
        <RadioButton
          label="Zählen"
          onChange={(evt) => {
            thisCounter.setActAsFunktion(!evt.target.checked);
            thisCounter._update();
          }}
          value="act_as_counter"
          checked={!act_as_funktion}
          name="dienstplan-act_as"
          id="dienstplan-act_as_counter"
          title="Zählt Eigenschaften aus dem Dienstplan"
        />
        {false && (
          <RadioButton
            label="Funktion"
            onChange={(evt) => {
              thisCounter.setActAsFunktion(evt.target.checked);
              thisCounter._update();
            }}
            value="act_as_funktion"
            checked={act_as_funktion}
            name="dienstplan-act_as"
            id="dienstplan-act_as_funktion"
            title="Berechnet Werte anhand von mathematischen Funktionen"
          />
        )}
        <CheckBox
          label={row ? 'Spaltenweise' : 'Zeilenweise'}
          onChange={(evt) => {
            thisCounter.setEvaluateSeperate(evt.target.checked);
            thisCounter._update();
          }}
          checked={evaluate_seperate}
          name="dienstplan-act_as_row_column"
          id="dienstplan-act_as_row_column"
          title={`Ermittelt die Eigenschaften für jede ${
            row ? 'Spalte' : 'Zeile'
          } einzeln`}
        />
        {isArbeitszeitCounter ? (
          <CheckBox
            title="Arbeitszeit nicht eingeteilter Arbeitstage als Regeldienst behandeln"
            label="Regeldienstzeit auffüllen"
            onChange={(evt) => {
              thisCounter.setEmptyAsRegeldienst(evt.target.checked);
              thisCounter._update();
            }}
            checked={empty_as_regeldienst}
            name="dienstplan-empty_as_regeldienst"
            id="dienstplan-empty_as_regeldienst"
          />
        ) : null}
      </div>

      {!act_as_funktion && (
        <StandardSelectField
          name="Zähle"
          options={countAuswahl}
          optionKey="id"
          itemHandler={(item) => {
            thisCounter.setCount(item);
            thisCounter._update();
          }}
          start={countIndex}
          readOnly
          title="Welche Eigenschaft soll gezählt werden?"
        />
      )}

      <CounterColoring counter={thisCounter} />
      {thisCounter.getMitarbeiter(createOptions)}
      {thisCounter.getDienste(createOptions)}
      {thisCounter.getTage(createOptions)}

      {act_as_funktion && false && (
        <div className="table-custom-feld-auswahl-counter-funktion">
          <div className="table-custom-feld-auswahl-counter-funktion-warn-container">
            {thisCounter.funktionWarn.map((txt, i) => (
              <li
                key={`table-custom-feld-auswahl-counter-funktion-warn_${i}`}
                className="table-custom-feld-auswahl-counter-funktion-warn"
              >
                {txt}
              </li>
            ))}
          </div>
          <textarea
            value={thisCounter.funktion}
            onChange={(evt) => {
              thisCounter.setFunktion(evt.target.value);
              thisCounter._update();
            }}
            maxLength={thisCounter.funktionMax}
          />
        </div>
      )}

      <div className="table-custom-feld-auswahl-form-buttons">
        <SaveButton
          spinner={{ show: true }}
          clickHandler={(evt, setLoading) => {
            evt.stopPropagation();
            thisCounter.save((bool) => {
              if (toggleDropDown && bool) toggleDropDown();
              thisCounter._update();
              counter?._update?.();
              setLoading?.(() => false);
            });
          }}
        />
        {counter && (
          <DeleteButton
            spinner={{ show: true }}
            className={deleteBtnClass}
            clickHandler={(evt, setLoading) => {
              evt.stopPropagation();
              thisCounter.remove((bool) => {
                if (toggleDropDown && bool) toggleDropDown();
                thisCounter._update();
                counter?._update?.();
                setLoading?.(() => false);
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

export default CounterForm;
