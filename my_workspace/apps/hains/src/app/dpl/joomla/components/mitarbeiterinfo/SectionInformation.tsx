import React, { useContext, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import CardWrapper from './CardWrapper';

import PlaceholderImage from '../utils/placceholder-image/PlaceholderImage';

import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';

import Table from '../utils/table/Table';
import { HeadRow } from '../utils/table/types/table';
import { convertDateInGermanDateTimeFormat } from '../../helper/util';

import styles from '../../mitarbeiterinfo/app.module.css';
import { TRole } from '../../helper/api_data_types';
import AutomatischeEinteilungen from './AutomatischeEinteilungen';
import ArbeitszeitAbsprachen from './ArbeitszeitAbsprachen';
import NichtEinteilenAbsprachen from './NichtEinteilenAbsprachen';

export default function SectionInformation() {
  const { mitarbeiterData } = useContext(ApiContext);
  const [showRoles, setShowRoles] = useState(false);

  if (!mitarbeiterData) {
    return null;
  }

  const renderDownloadIconFile = (row: any) => {
    const fileUrl = row.file_url;
    return (
      <a aria-label="Zertifikate herunterladen" href={fileUrl}>
        <FaDownload />
      </a>
    );
  };

  const renderFormatDate = (row: any) => {
    const formatedDate = convertDateInGermanDateTimeFormat(
      row.created_at,
      false
    );
    return `${formatedDate}`;
  };

  const headRows: HeadRow[] = [
    {
      columns: [
        { title: 'Typ', dataKey: 'datei_typ.name' },
        { title: 'Datei', bodyRender: renderDownloadIconFile },
        {
          title: 'Hochgeladen',
          dataKey: 'created_at',
          bodyRender: renderFormatDate
        }
      ]
    }
  ];

  return (
    <div className={styles.wrapper_columns}>
      <CardWrapper>
        <div className={styles.profile_img_wrapper}>
          {mitarbeiterData?.accountInfo?.file_preview ? (
            <div className={styles.profile_img}>
              <img
                alt="profile"
                src={mitarbeiterData.accountInfo.file_preview}
              />
            </div>
          ) : (
            <PlaceholderImage />
          )}
          <div>
            <h2>Mitarbeiter</h2>
            <p>{mitarbeiterData.accountInfo.ueber_mich}</p>
          </div>
        </div>
        <div className={styles.columns}>
          <div>
            <p>
              <span>Name:</span>
              <span>{`${mitarbeiterData.accountInfo.vorname} ${mitarbeiterData.accountInfo.nachname}`}</span>
            </p>
            <p>
              <span>Planname:</span>
              <span>{`${mitarbeiterData.accountInfo.nameKurz} (${mitarbeiterData.accountInfo.id})`}</span>
            </p>
            <p>
              <span>Straße:</span>
              <span>{`${mitarbeiterData.accountInfo.adresseStrasse}`}</span>
            </p>
            <p>
              <span>PLZ:</span>
              <span>{`${mitarbeiterData.accountInfo.adressePlz}`}</span>
            </p>
            <p>
              <span>Stadt:</span>
              <span>{`${mitarbeiterData.accountInfo.adresseOrt}`}</span>
            </p>
            <p>
              <span>E-Mail Privat:</span>
              <span>
                <a
                  href={`mailto:${mitarbeiterData.accountInfo.privateEmail}`}
                >{`${mitarbeiterData.accountInfo.privateEmail}`}</a>
              </span>
            </p>
          </div>
          <div>
            <p>
              <span>E-Mail:</span>
              <span>
                <a
                  href={`mailto: ${mitarbeiterData.accountInfo.dienstEmail}`}
                >{`${mitarbeiterData.accountInfo.dienstEmail}`}</a>
              </span>
            </p>
            <p>
              <span>Dienst Tel:</span>
              <span>{`${mitarbeiterData.accountInfo.dienstTelefon}`}</span>
            </p>
            <p>
              <span>Privat:</span>
              <span>{`${mitarbeiterData.accountInfo.privateTelephone}`}</span>
            </p>
            <p>
              <span>Mobil:</span>
              <span>{`${mitarbeiterData.accountInfo.mobileTelefon}`}</span>
            </p>
            <p>
              <span>Anästhesie seit:</span>
              <span>{`${mitarbeiterData.mitarbeiter.a_seit}`}</span>
            </p>
            <p>
              <span>Weiterbildungsjahr:</span>
              <span>{`${mitarbeiterData.mitarbeiter.weiterbildungsjahr}`}</span>
            </p>
            <p>
              <span>Team:</span>
              <span>{`${mitarbeiterData.team_am.name} (${mitarbeiterData.team_am.id})`}</span>
            </p>
          </div>
        </div>
        <div>
          <p className={styles.bold}>
            <span>Kommentar:</span>
          </p>
          <p>{mitarbeiterData.mitarbeiter.zeit_kommentar}</p>
        </div>
        <div className={styles.accordion_wrapper}>
          <div className={`${styles.my_accordion} ${showRoles ? 'open' : ''}`}>
            <h4 onClick={() => setShowRoles((cur) => !cur)}>
              Rollen <span className={styles.arrows} />
            </h4>
            {showRoles && (
              <div className={styles.accordion_content}>
                <ul>
                  {mitarbeiterData.rollen.map((role: TRole) => {
                    return <li key={role.id}>{role.name}</li>;
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardWrapper>
      <CardWrapper>
        <h2>Zertifikate</h2>
        <Table
          options={{
            className: `${styles.full_width} ${styles.cell_left} table_noborder`
          }}
          data={mitarbeiterData.dateien}
          headRows={headRows}
        />
      </CardWrapper>
    </div>
  );
}
