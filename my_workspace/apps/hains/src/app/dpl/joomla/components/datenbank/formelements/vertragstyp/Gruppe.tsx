import React, { useCallback, useContext, useEffect } from 'react';
import { FaCaretDown, FaCaretUp, FaPlus, FaTrash } from 'react-icons/fa';
import TextInput from '../TextInput';
import CustomButton from '../../../utils/custom-button/CustomButton';
import styles from './vertragstyp.module.css';
import Stufe from './Stufe';
import { OAuthContext } from '../../../../context/OAuthProvider';
import {
  TVertragsgruppe,
  TVertragsstufe,
  TVertragsvariante
} from '../../../../helper/api_data_types';

function Gruppe({
  gruppe,
  removeGruppe,
  nameBase,
  varianten
}: {
  gruppe: TVertragsgruppe;
  removeGruppe: (gruppe: TVertragsgruppe) => void;
  nameBase: string;
  varianten: TVertragsvariante[];
}) {
  const { hainsOAuth } = useContext(OAuthContext);
  const [stufenToAdd, setStufenToAdd] = React.useState<TVertragsstufe[]>([]);
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    setStufenToAdd(() => []);
    setShow(() => false);
  }, [gruppe]);

  const removeStufe = useCallback(
    (stufe: TVertragsstufe) => {
      if (!stufe.id) {
        setStufenToAdd((curr) => curr.filter((s) => s !== stufe));
      } else {
        const check = window.confirm('Wollen Sie die Stufe wirklich löschen?');
        if (check) {
          console.log('removeGruppe', gruppe);
        }
      }
    },
    [hainsOAuth, setStufenToAdd]
  );

  return (
    <div className={styles.vertragsgruppe}>
      <div>
        <input type="hidden" name={`${nameBase}.id`} value={gruppe.id} />
        <CustomButton
          className="as_icon"
          clickHandler={() => setShow((curr) => !curr)}
        >
          {show ? <FaCaretUp /> : <FaCaretDown />}
        </CustomButton>
        <TextInput
          required
          label=""
          row={gruppe}
          elKey="name"
          name={`${nameBase}.name`}
        />
        <CustomButton
          clickHandler={() => removeGruppe(gruppe)}
          className="red as_icon"
        >
          <FaTrash />
        </CustomButton>
      </div>
      <div
        className={
          show ? styles.vertragsstufen_show : styles.vertragsstufen_hide
        }
      >
        <div className={styles.vertragsstufen_head}>
          <p>Stufen</p>
          <CustomButton
            className="as_icon"
            title="Stufe hinzufügen"
            clickHandler={() =>
              setStufenToAdd((curr) => [
                ...curr,
                {
                  id: 0,
                  stufe: 1,
                  nach_jahren: 0,
                  nach_monaten: 0,
                  vertragsgruppe_id: gruppe.id,
                  vertrags_variante_id: 0
                }
              ])
            }
          >
            <FaPlus />
          </CustomButton>
        </div>
        {gruppe.vertragsstuves &&
          gruppe.vertragsstuves.map((stufe) => (
            <Stufe
              key={stufe.id}
              stufe={stufe}
              baseName={`${nameBase}.vertragsstufen.${stufe.id}`}
              removeStufe={removeStufe}
              varianten={varianten}
            />
          ))}
        {stufenToAdd.map((stufe, i) => (
          <Stufe
            key={`${stufe.id}-${i}`}
            stufe={stufe}
            baseName={`${nameBase}.vertragsstufen.${stufe.id}_${i}`}
            removeStufe={removeStufe}
            varianten={varianten}
          />
        ))}
      </div>
    </div>
  );
}

export default Gruppe;
