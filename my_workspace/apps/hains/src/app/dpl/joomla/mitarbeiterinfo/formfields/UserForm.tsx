import React, { useContext } from 'react';

import styles from '../app.module.css';
import LoginGroup from './LoginGroup';
import PersonalsGroup from './PersonalsGroup';
import BusinessGroup from './BusinessGroup';
import CertificateGroup from './CertificateGoup';

import { DataContext } from '../../context/mitarbeiterinfo/DataProvider';

function UserForm() {
  const { accountInfo, data } = useContext(DataContext);

  const mitarbeiters = data.mitarbeiters;
  const mitarbeiterInfos = data?.mitarbeiter_infos;
  const funktionen = data.funktionen;
  const dateiTyps = data.datei_typs;
  const vertragsTyps = data.vertrags_typ;
  const hainsGroups = data.hains_groups;
  const dateis = accountInfo?.mitarbeiter?.dateis;

  return (
    <div className={styles.grid}>
      <LoginGroup
        mitarbeiterInfos={mitarbeiterInfos}
        mitarbeiters={mitarbeiters}
        accountInfo={accountInfo}
        hainsGroups={hainsGroups}
      />
      <PersonalsGroup accountInfo={accountInfo} />
      <BusinessGroup
        accountInfo={accountInfo}
        funktionen={funktionen}
        vertragsTyps={vertragsTyps}
      />
      <CertificateGroup dateis={dateis} dateiTyps={dateiTyps} />
    </div>
  );
}

export default UserForm;
