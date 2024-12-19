import React, { useCallback, useContext, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';
import { OAuthContext } from '../../../context/OAuthProvider';
import Variante from './vertragstyp/Variante';
import CustomButton from '../../utils/custom-button/CustomButton';
import { today } from '../../../helper/dates';
import styles from './vertragstyp/vertragstyp.module.css';
import { TVertragsvariante } from '../../../helper/api_data_types';

function Vertragsvarianten({ row }: { row: TableData | null }) {
  const { hainsOAuth } = useContext(OAuthContext);
  const [variantenToAdd, setVariantenToAdd] = React.useState<TVertragsvariante[]>([]);
  const varianten = getNestedAttr(row, 'vertrags_variantes') || [];

  useEffect(() => {
    setVariantenToAdd(() => []);
  }, [row]);

  const removeVariante = useCallback(
    (variante: TVertragsvariante) => {
      if (!variante.id) {
        setVariantenToAdd((curr) => curr.filter((v) => v !== variante));
      } else {
        const check = window.confirm('Wollen Sie die Variante wirklich löschen?');
        if (check) {
          console.log('removeVariante', variante);
        }
      }
    },
    [hainsOAuth, setVariantenToAdd]
  );
  return (
    <div className={styles.vertrags_varianten}>
      <p>Varianten</p>
      <div>
        {varianten.map((v: TVertragsvariante) => (
          <Variante key={v.id} variante={v} removeVariante={removeVariante} baseName={`vertrags_varianten.${v.id}`} />
        ))}
        {variantenToAdd.map((v: TVertragsvariante, i: number) => (
          <Variante
            key={`${v.id}-${i}`}
            variante={v}
            removeVariante={removeVariante}
            baseName={`vertrags_varianten.${v.id}_${i}`}
          />
        ))}
        <CustomButton
          className="as_icon"
          title="Variante hinzufügen"
          clickHandler={() =>
            setVariantenToAdd((curr) => [
              ...curr,
              { id: 0, name: '', vertragstyp_id: parseInt(row?.id, 10) || 0, wochenstunden: 0, von: today(), bis: '' }
            ])
          }
        >
          <FaPlus />
        </CustomButton>
      </div>
    </div>
  );
}

export default Vertragsvarianten;
