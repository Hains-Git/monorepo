import { useState, useEffect } from 'react';
import styles from '../urlaubsliste.module.css';
import SuggestionInput from '../../utils/suggestion-input/SuggestionInput';
import CustomButton from '../../utils/custom_buttons/CustomButton';

import { UseRegisterKey } from '../../../hooks/use-register';

function isDateInvalid(curInput, counterObj) {
  const name = curInput.name;
  const val = curInput.value;
  if (name === 'von' && counterObj.bis !== '') {
    return val > counterObj.bis;
  }
  if (name === 'bis' && counterObj.von !== '') {
    return val < counterObj.von;
  }
}

function isInvalidData(data) {
  let invalid = false;
  const values = Object.values(data);
  for (let i = 0; i <= values.length; i++) {
    const val = values[i];
    if (val === '') {
      invalid = true;
      break;
    }
  }
  return invalid;
}

function Counter({ tablemodel, urlaubsliste }) {
  const [newCounter, setNewCounter] = useState({
    planname: '',
    description: '',
    po_dienst_id: '',
    von: '',
    bis: ''
  });

  const counterUpdate = UseRegisterKey(
    'counterUpdate',
    urlaubsliste.push,
    urlaubsliste.pull,
    urlaubsliste
  );

  // useEffect(() => {
  //   setNewCounter({
  //     planname: '',
  //     description: '',
  //     po_dienst_id: '',
  //     von: '',
  //     bis: ''
  //   });
  // }, [counterUpdate]);

  const setFoundItem = (obj) => {
    const po_dienst = obj.listItem;
    setNewCounter((prev) => ({
      ...prev,
      po_dienst_id: po_dienst.id
    }));
  };

  const onChangeInputs = (e) => {
    const input = e.target;
    const name = input.name;
    const val = input.value;

    if (name === 'von' || name === 'bis') {
      if (isDateInvalid(input, newCounter)) {
        alert('Invalid Date');
        return;
      }
    }

    setNewCounter((prev) => ({
      ...prev,
      [name]: val
    }));
  };

  const createNewCounter = (e, setLoading) => {
    if (isInvalidData(newCounter)) {
      alert('Alle Felder müssen ausgefüllt werden.');
      setLoading(false);
      return;
    }
    urlaubsliste.addNewCounter(newCounter, setLoading);
  };

  const po_dienste = urlaubsliste._po_dienste._each(false, (dienst) => {
    return !dienst.hasBedarf;
  }).arr;

  return (
    <div className={styles.counter_wrapper}>
      <div className={styles.buttons}>
        <CustomButton
          spinner={{ show: true }}
          clickHandler={createNewCounter}
          className="primary"
        >
          Add
        </CustomButton>
      </div>
      <div className={styles.fields}>
        <fieldset>
          <label htmlFor="counter-name">Zählername:</label>
          <input
            onChange={onChangeInputs}
            name="planname"
            value={newCounter.planname}
            maxLength="3"
            type="text"
            id="counter-name"
          />
        </fieldset>
        <fieldset>
          <label htmlFor="counter-desc">Zählerbeschreibung:</label>
          <input
            onChange={onChangeInputs}
            name="description"
            value={newCounter.description}
            type="text"
            id="counter-desc"
          />
        </fieldset>
        <fieldset>
          <label htmlFor="po-dienst">Po Dienst:</label>
          <SuggestionInput
            id="mitarbeiter"
            data={po_dienste}
            pageModel={tablemodel}
            valName=""
            searchKeys={['planname']}
            setFoundItem={setFoundItem}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="counter-von">Von:</label>
          <input
            onChange={onChangeInputs}
            name="von"
            value={newCounter.von}
            type="date"
            id="counter-von"
          />
        </fieldset>
        <fieldset>
          <label htmlFor="counter-bis">Bis:</label>
          <input
            onChange={onChangeInputs}
            name="bis"
            value={newCounter.bis}
            type="date"
            id="counter-bis"
          />
        </fieldset>
      </div>
    </div>
  );
}
export default Counter;
