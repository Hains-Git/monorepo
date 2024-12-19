import React, { useEffect, useState } from 'react';
import { booleanSearch, sortAuswahlDropdown } from '../../../tools/helper';
import CustomInput from '../../utils/custom-input/CustomInput';
import MitarbeiterVorschlag from './MitarbeiterVorschlag';
import { UseRegister } from '../../../hooks/use-register';
import styles from './mitarbeitervorschlaege.module.css';

function MitarbeiterVorschlaege({ verteiler }) {
  const mitarbeiterVorschlaege = verteiler?.mitarbeiterVorschlaege;
  const [input, setInput] = useState('');
  const [vorschlaege, setVorschlaege] = useState([]);
  const update = UseRegister(
    mitarbeiterVorschlaege?._push,
    mitarbeiterVorschlaege?._pull,
    mitarbeiterVorschlaege
  );

  const getVorschlaege = () => {
    const _vorschlaege =
      mitarbeiterVorschlaege?.getVorschlaege?.((mitarbeiter, feld, score) => (
        <MitarbeiterVorschlag
          key={mitarbeiter.id}
          mitarbeiter={mitarbeiter}
          feld={feld}
          score={score}
          verteiler={verteiler}
        />
      )) || [];
    const result = sortAuswahlDropdown(_vorschlaege, true);
    return result;
  };

  const handleInput = (evt) => {
    evt.stopPropagation();
    const value = evt.target.value;
    setInput(() => value);
  };

  useEffect(() => {
    setVorschlaege(() => getVorschlaege());
  }, [mitarbeiterVorschlaege, update, verteiler]);

  return (
    <div className={styles.container}>
      <CustomInput placeholder="Suche" onChange={handleInput} value={input} />
      <table className={styles.table}>
        <tbody>
          {vorschlaege.filter((v) =>
            booleanSearch(v.props.mitarbeiter.planname, input)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MitarbeiterVorschlaege;
