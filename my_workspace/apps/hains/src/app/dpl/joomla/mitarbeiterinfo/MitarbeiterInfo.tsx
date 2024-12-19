import React, { useEffect, useState, useContext } from 'react';

import { FaUserEdit, FaUser, FaUserSlash, FaUserPlus, FaSave, FaHandSparkles } from 'react-icons/fa';
import { MdLockReset } from 'react-icons/md';

import { HeadRow, TableData, Column } from '../components/utils/table/types/table';
import CustomButton from '../components/utils/custom-button/CustomButton';
import styles from './app.module.css';
import UserForm from './formfields/UserForm';
import MitarbeiterInfoTable from './MitarbeiterInfoTable';

import Loader from '../components/utils/loader/Loader';
import { AccountInfo } from '../components/utils/table/types/accountinfo';
import DetailsPage from './DetailsPage';
import { DataContext } from '../context/mitarbeiterinfo/DataProvider';
import Check from '../components/datenbank/columns/Check';
import { getNestedAttr } from '../helper/util';

const renderBoolean = (row: TableData, column: Column) => (
  <Check checked={!!getNestedAttr(row, column?.dataKey || '')} />
);

const headObjRows: HeadRow[] = [
  {
    columns: [
      { title: 'ID', dataKey: 'mitarbeiter_id' },
      {
        title: 'Funktion',
        dataKey: 'mitarbeiter.funktion.planname'
      },
      { title: 'Anrede', dataKey: 'anrede' },
      { title: 'Titel', dataKey: 'titelPraefix' },
      { title: 'Nachname', dataKey: 'nachname' },
      { title: 'Vorname', dataKey: 'vorname' },
      { title: 'Planname', dataKey: 'mitarbeiter.planname' },
      { title: 'VK', dataKey: 'mitarbeiter.vk_and_vgruppe_am.vk' },
      { title: 'V-Gruppe', dataKey: 'mitarbeiter.vk_and_vgruppe_am.vgruppe' },
      {
        title: 'Weiterbildungsjahr',
        dataKey: 'mitarbeiter.weiterbildungsjahr'
      },
      { title: 'Dienst Telefon', dataKey: 'dienstTelefon' },
      { title: 'Mobil', dataKey: 'mobileTelefon' },
      { title: 'Sekundär', dataKey: 'privateTelephone' },
      { title: 'Email Dienstlich', dataKey: 'dienstEmail' },
      { title: 'Email', dataKey: 'user.email' },
      { title: 'Straße', dataKey: 'adresseStrasse' },
      { title: 'PLZ', dataKey: 'adressePlz' },
      { title: 'Stadt', dataKey: 'adresseOrt' },
      { title: 'Geburtsdatum', dataKey: 'geburtsdatum' },
      { title: 'Personalnummer', dataKey: 'mitarbeiter.personalnummer' },
      {
        title: 'Aktiv',
        dataKey: 'mitarbeiter.aktiv',
        bodyRender: renderBoolean
      },
      { title: 'AcInfo ID', dataKey: 'id' }
    ]
  }
];

function MitarbeiterInfo() {
  const [headRows, setHeadRows] = useState<HeadRow[]>(headObjRows);
  const {
    data,
    handleSubmit,
    messageFromApi,
    showSpinner,
    setMessageFromApi,
    errorMsg,
    accountInfo,
    config,
    changeView,
    changeActivity,
    passwordReset,
    welcomeNewUser,
    user
  } = useContext(DataContext);

  const canViewForm = user?.is_admin || user?.roles?.includes?.('Benutzerverwaltung');

  const renderEditBtn = (row: TableData) => {
    const aRow = row as AccountInfo;

    return (
      <div
        data-testid={`edit_btn_${aRow.mitarbeiter_id}`}
        className={styles.edit_btn}
        onClick={(evt) => {
          evt.stopPropagation();
          changeView({ view: 'edit', id: aRow.mitarbeiter_id });
        }}
      >
        <FaUserEdit />
      </div>
    );
  };

  useEffect(() => {
    const newHeaderRows = [
      {
        columns: [
          {
            title: 'Prio',
            hoverTitle: 'Sortiert nach Funktion Prio',
            bodyRender: canViewForm ? renderEditBtn : undefined,
            dataKey: 'mitarbeiter.funktion.prio'
          },
          ...headObjRows[0].columns
        ]
      }
    ];
    setHeadRows(() => newHeaderRows);
  }, [data]);

  if (!data) {
    return <Loader />;
  }

  if (errorMsg) {
    return <p className={styles.error}>{errorMsg}</p>;
  }

  const renderActivity = () => {
    if (!accountInfo) return;
    const mitarbeiterAktiv = accountInfo?.mitarbeiter?.aktiv;
    const comp = mitarbeiterAktiv ? <FaUserSlash fill="red" /> : <FaUser fill="green" />;
    return comp;
  };

  return (
    <div className={styles.content_container}>
      {messageFromApi?.status !== '' && (
        <div className={styles.info_box}>
          {messageFromApi?.info.length && (
            <>
              <div className={styles.info_status}>
                {messageFromApi.info.map((msg) => {
                  return (
                    <p className={messageFromApi.status === 'error' ? styles.api_err : ''} key={msg}>
                      {msg}
                    </p>
                  );
                })}
              </div>
              <span onClick={() => setMessageFromApi(undefined)} className={styles.close}>
                X
              </span>
            </>
          )}
        </div>
      )}
      {config.view === 'table' && (
        <MitarbeiterInfoTable
          headRows={headRows}
          canViewForm={canViewForm}
          mitarbeiterInfosArr={data.mitarbeiterInfosArr}
        />
      )}
      {config.view === 'edit' && (
        <form onSubmit={handleSubmit}>
          <div className={styles.content_header}>
            <div className={styles.headline}>
              <h2>{!accountInfo ? 'Benutzer anlegen' : 'Mitarbeiterdetails'}</h2>
            </div>
            <div className={styles.buttons}>
              {accountInfo && (
                <>
                  <CustomButton
                    title="Willkommensmail senden"
                    spinner={{ show: true }}
                    clickHandler={(e, showSpinner) => welcomeNewUser(showSpinner)}
                  >
                    <FaHandSparkles size="1.0em" />
                  </CustomButton>
                  <CustomButton
                    title="Passwort zurücksetzen"
                    spinner={{ show: true }}
                    clickHandler={(e, showSpinner) => passwordReset(showSpinner)}
                  >
                    <MdLockReset size="1.5em" />
                  </CustomButton>
                  <CustomButton
                    spinner={{ show: true }}
                    clickHandler={(e, showSpinner) => changeActivity(e, showSpinner)}
                  >
                    {renderActivity()}
                  </CustomButton>
                </>
              )}
              <CustomButton spinner={{ show: showSpinner }} type="submit" data-testid="save_user_btn">
                {!accountInfo ? <FaUserPlus /> : <FaSave fill="#00427a" />}
              </CustomButton>
            </div>
          </div>
          <UserForm />
        </form>
      )}
      {(config.view === 'detail' || config.view === 'vertrag') && <DetailsPage />}
    </div>
  );
}

export default MitarbeiterInfo;
