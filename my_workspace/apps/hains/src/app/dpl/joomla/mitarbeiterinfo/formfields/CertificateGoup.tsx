import React, { useState, useContext } from 'react';
import { FaTrash } from 'react-icons/fa';

import styles from '../app.module.css';
import Input from '../../components/mitarbeiterinfo/form/Input';
import { development } from '../../helper/flags';

import { OAuthContext } from '../../context/OAuthProvider';

function CertificateGroup({
  dateiTyps,
  dateis
}: {
  dateiTyps: any;
  dateis: any;
}) {
  const [dateien, setDateien] = useState(dateis);

  const { hainsOAuth, returnError } = useContext(OAuthContext);

  const deleteFile = (dateiObj: any) => {
    const id = dateiObj.id;
    if (!id) return;
    hainsOAuth.api('delete_datei', 'post', { id }).then((_data: any) => {
      if (_data.id !== id) {
        alert('Datei konnte nicht entfernt werden.');
        return;
      }
      const filtered = dateien.filter(
        (_dateiTyp: any) => _dateiTyp.id !== _data.id
      );
      setDateien(filtered);
    }, returnError);
  };

  const getFileUrl = (datei_typ_id: number | string) => {
    const filesByDateiTyp = dateien?.filter(
      (file: any) => datei_typ_id === file.datei_typ_id
    );
    if (!filesByDateiTyp) {
      return '';
    }
    return filesByDateiTyp.map((obj: any) => {
      return (
        <p key={obj.id} className={styles.delete_file}>
          <a
            target="_blank"
            href={
              development
                ? `http://localhost${obj.file_preview}`
                : obj.file_preview
            }
            rel="noreferrer"
          >
            Vorschau
          </a>
          <i onClick={() => deleteFile(obj)}>
            <FaTrash fill="firebrick" />
          </i>
        </p>
      );
    });
  };

  return (
    <div className={`${styles.group}`}>
      <h4>Zertifikate</h4>
      <fieldset className={`${styles.columns} ${styles.files}`}>
        {dateiTyps.map((dateiTyp: typeof dateiTyps) => {
          return (
            <fieldset className={styles.grid} key={dateiTyp.id}>
              <Input
                type="file"
                label={dateiTyp.name}
                preName="user"
                name={`files[${dateiTyp.id}]`}
              />
              <div>{getFileUrl(dateiTyp.id)}</div>
            </fieldset>
          );
        })}
      </fieldset>
    </div>
  );
}
export default CertificateGroup;
