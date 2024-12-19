import React, { useCallback, useContext, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';
import Gruppe from './vertragstyp/Gruppe';
import CustomButton from '../../utils/custom-button/CustomButton';
import { OAuthContext } from '../../../context/OAuthProvider';
import styles from './vertragstyp/vertragstyp.module.css';
import { TVertragsgruppe, TVertragsvariante } from '../../../helper/api_data_types';

function Vertragsgruppen({ row }: { row: TableData | null }) {
  const { hainsOAuth } = useContext(OAuthContext);
  const [gruppenToAdd, setGruppenToAdd] = React.useState<TVertragsgruppe[]>([]);
  const gruppen: TVertragsgruppe[] = getNestedAttr(row, 'vertragsgruppes') || [];
  const varianten: TVertragsvariante[] = getNestedAttr(row, 'vertrags_variantes') || [];

  useEffect(() => {
    setGruppenToAdd(() => []);
  }, [row]);

  const removeGruppe = useCallback(
    (gruppe: TVertragsgruppe) => {
      if (!gruppe.id) {
        setGruppenToAdd((curr) => curr.filter((g) => g !== gruppe));
      } else {
        const check = window.confirm('Wollen Sie die Gruppe wirklich löschen?');
        if (check) {
          console.log('removeGruppe', gruppe);
        }
      }
    },
    [hainsOAuth, setGruppenToAdd]
  );

  return (
    <div className={styles.vertragsgruppen}>
      <p>Gruppen</p>
      <div>
        {gruppen.map((g: TVertragsgruppe) => (
          <Gruppe
            key={g.id}
            gruppe={g}
            removeGruppe={removeGruppe}
            nameBase={`vertragsgruppen.${g.id}`}
            varianten={varianten}
          />
        )) || []}
        {gruppenToAdd.map((g: TVertragsgruppe, i: number) => (
          <Gruppe
            key={`${g.id}-${i}`}
            gruppe={g}
            removeGruppe={removeGruppe}
            nameBase={`vertragsgruppen.${g.id}_${i}`}
            varianten={varianten}
          />
        )) || []}
        <CustomButton
          className="as_icon"
          title="Gruppe hinzufügen"
          clickHandler={() => {
            setGruppenToAdd((curr) => [
              ...curr,
              { id: 0, name: '', vertragstyp_id: parseInt(row?.id, 10) || 0, vertragsstuves: [] }
            ]);
          }}
        >
          <FaPlus />
        </CustomButton>
      </div>
    </div>
  );
}

export default Vertragsgruppen;
