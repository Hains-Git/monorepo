import React, { useContext, useState } from 'react';

import Vertrag from './Vertrag';
import { VertragProvider } from '../context/mitarbeiterinfo/VertragProvider';
import AutomatischeEinteilungen from '../components/mitarbeiterinfo/AutomatischeEinteilungen';
import ArbeitszeitAbsprachen from '../components/mitarbeiterinfo/ArbeitszeitAbsprachen';
import NichtEinteilenAbsprachen from '../components/mitarbeiterinfo/NichtEinteilenAbsprachen';
import { AbsprachenWrapper } from '../components/mitarbeiterinfo/Absprachen';
import { ApiContext } from '../context/mitarbeiterinfo/ApiProvider';
import { DataContext } from '../context/mitarbeiterinfo/DataProvider';
import styles from './app.module.css';
import { numericLocaleCompare } from '../helper/util';
import CustomButton from '../components/utils/custom-button/CustomButton';

type TProps = {
  mitarbeiter_id: number;
};

function VertragsPage({ mitarbeiter_id }: TProps) {
  const { data, changeView } = useContext(DataContext);
  const { mitarbeiterData } = useContext(ApiContext);
  const [mName, setMName] = useState(mitarbeiterData?.mitarbeiter?.planname);

  const onChangeMitarbeiter = (val: string) => {
    changeView({ view: 'vertrag', id: Number(val) });
  };

  const tmpArr = ['aktive', 'inaktiv'];
  const aktivMitarbeiters = data.mitarbeiters.sort((a, b) => numericLocaleCompare(a.planname, b.planname));
  const inaktivMitarbeiters = data.all_mitarbeiters
    .filter((m) => !m.aktiv)
    .sort((a, b) => numericLocaleCompare(a.planname, b.planname));

  return (
    <div className={styles.vertrags_page}>
      <VertragProvider mitarbeiter_id={mitarbeiter_id}>
        <div className={styles.details_header}>
          <div className={styles.select_mitarbeiter}>
            <h2>Verträge und Absprachen von {mName} </h2>
            <select
              id="mitarbeiters"
              value={mitarbeiter_id}
              onChange={(e) => {
                const val = e.target.value;
                const text = e.target.textContent;
                onChangeMitarbeiter(val);
                text && setMName(text);
              }}
            >
              {tmpArr.map((optgroupName: any) => {
                const mArr = optgroupName === 'aktive' ? aktivMitarbeiters : inaktivMitarbeiters;
                return (
                  <optgroup key={`optiongroup_${optgroupName}`} label={optgroupName} className={styles.optgroup}>
                    {mArr.map((op: any) => {
                      return (
                        <option
                          key={`option-mitarbeiter-${op.id}`}
                          value={op.id}
                          className={styles.option}
                          title={op?.name}
                        >
                          {op?.planname}
                        </option>
                      );
                    })}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <CustomButton
            clickHandler={() => {
              if (!mitarbeiter_id) return;
              changeView({ view: 'detail', id: Number(mitarbeiter_id) });
            }}
            className="primary"
          >
            Mitarbeiterinfo
          </CustomButton>
        </div>
        <Vertrag />
        <AbsprachenWrapper>
          <AutomatischeEinteilungen />
          <ArbeitszeitAbsprachen />
          <NichtEinteilenAbsprachen />
        </AbsprachenWrapper>
      </VertragProvider>
    </div>
  );
}
export default VertragsPage;
