import React, { useState, useContext } from 'react';
import {
  FaRegEdit,
  FaRegStickyNote,
  FaStar,
  FaSync,
  FaUser
} from 'react-icons/fa';

import CustomButton from '../components/utils/custom-button/CustomButton';

import styles from './app.module.css';
import TabBar from '../components/utils/tab-bar/TabBar';
import SectionRotationenFreigaben from '../components/mitarbeiterinfo/SectionRotationenFreigaben';
import SectionRating from '../components/mitarbeiterinfo/SectionRating';
import SectionNote from '../components/mitarbeiterinfo/SectionNote';
import SectionDienstwunsch from '../components/mitarbeiterinfo/SectionDienstwunsch';
import PopupRotation from '../components/mitarbeiterinfo/popup/PopupRotation';

import {
  ApiContext,
  TInitialData
} from '../context/mitarbeiterinfo/ApiProvider';
import { DataContext } from '../context/mitarbeiterinfo/DataProvider';

import { NotesProvider } from '../context/mitarbeiterinfo/NotesProvider';
import { DienstwunschPopupProvider } from '../context/mitarbeiterinfo/DienstwunschPopupProvider';
import PopupDienstwunsch from '../components/mitarbeiterinfo/popup/PopupDienstwunsch';
import SectionInformation from '../components/mitarbeiterinfo/SectionInformation';
import { numericLocaleCompare } from '../helper/util';

function Details() {
  const [tabIx, setTabIx] = useState(0);

  const {
    mitarbeiterData,
    kontingente,
    rotationen,
    freigabenRotationen,
    rotationData,
    setRotationData,
    mitarbeiter_id
  } = useContext(ApiContext);

  const { data, changeView } = useContext(DataContext);
  const [mName, setMName] = useState(mitarbeiterData?.mitarbeiter?.planname);

  const onChangeMitarbeiter = (val: string) => {
    changeView({ view: 'detail', id: Number(val) });
  };

  const goToTable = () => {
    changeView({ view: 'table', id: undefined });
  };

  const tmpArr = ['aktive', 'inaktiv'];
  const aktivMitarbeiters = data.mitarbeiters.sort((a, b) =>
    numericLocaleCompare(a?.planname || '', b?.planname || '')
  );
  const inaktivMitarbeiters = data.all_mitarbeiters
    .filter((m) => !m.aktiv)
    .sort((a, b) => numericLocaleCompare(a?.planname || '', b?.planname || ''));

  return (
    <div className={styles.details_page}>
      <div className={styles.details_header}>
        <div className={styles.select_mitarbeiter}>
          <h2>
            <span onClick={goToTable}>Mitarbeiterinfo:</span> {mName}{' '}
          </h2>
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
              const inactive = optgroupName !== 'aktive';
              const mArr =
                optgroupName === 'aktive'
                  ? aktivMitarbeiters
                  : inaktivMitarbeiters;
              if (inactive && !mArr.find((op: any) => op.id === mitarbeiter_id))
                return null;
              return (
                <optgroup
                  key={`optiongroup_${optgroupName}`}
                  label={optgroupName}
                  className={styles.optgroup}
                >
                  {mArr.map((op: any) => {
                    if (inactive && op.id !== mitarbeiter_id) return null;
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
        <div className={styles.row}>
          <CustomButton
            clickHandler={() => {
              if (!mitarbeiter_id) return;
              changeView({ view: 'vertrag', id: Number(mitarbeiter_id) });
            }}
            className="primary"
          >
            Verträge und Absprachen
          </CustomButton>
        </div>
      </div>
      <div className="details-content">
        <TabBar
          onSelected={(obj) => setTabIx(obj.index)}
          tabs={[
            { name: 'Rotationen und Freigaben', icon: <FaSync /> },
            { name: 'Dienstwünsche', icon: <FaRegEdit /> },
            { name: 'Präferenzen', icon: <FaStar /> },
            { name: 'Notizen', icon: <FaRegStickyNote /> },
            { name: 'Mitarbeiterdetails', icon: <FaUser /> }
          ]}
        />
        {tabIx === 0 && (
          <SectionRotationenFreigaben
            mitarbeiterData={mitarbeiterData}
            rotationen={rotationen || []}
            freigabenRotationen={freigabenRotationen || {}}
            kontingente={kontingente}
            setRotationData={setRotationData}
          />
        )}
        {tabIx === 1 && (
          <DienstwunschPopupProvider>
            <SectionDienstwunsch />
            <PopupDienstwunsch />
          </DienstwunschPopupProvider>
        )}
        {tabIx === 2 && <SectionRating />}
        {tabIx === 3 && (
          <NotesProvider
            mitarbeiter={(mitarbeiterData as TInitialData)?.mitarbeiter}
          >
            <SectionNote />
          </NotesProvider>
        )}
        {tabIx === 4 && <SectionInformation />}
        {rotationData && (
          <PopupRotation kontingente={kontingente} data={rotationData} />
        )}
      </div>
    </div>
  );
}
export default Details;
