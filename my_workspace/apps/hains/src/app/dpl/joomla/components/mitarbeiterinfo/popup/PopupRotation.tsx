import React, { useState, useEffect, useContext } from 'react';
import Input from '../form/Input';

import styles from './popup.module.css';
import Select from '../form/Select';
import CustomButton from '../../utils/custom-button/CustomButton';

import { PopupContext } from '../../../context/mitarbeiterinfo/PopupProvider';
import { TRotation } from '../../../helper/api_data_types';

type TProps = {
  data: any;
  kontingente: any;
};

export default function PopupRotation({ data, kontingente }: TProps) {
  const [rotation, setRotation] = useState(data);
  const { saveRotation, deleteRotation, errorMsg, closePopup } = useContext(PopupContext);

  useEffect(() => {
    setRotation(data);
  }, [data]);

  const onChangeKontingent = (val: string) => {
    const kontingent_id = Number(val);
    setRotation((cur: TRotation) => ({
      ...cur,
      kontingent_id
    }));
  };

  const onChangeInput = (label: string, val: string) => {
    const checkLabel = label.toLowerCase().trim();
    switch (checkLabel) {
      case 'beginn:':
        setRotation((cur: TRotation) => ({ ...cur, von: val }));
        break;
      case 'ende:':
        setRotation((cur: TRotation) => ({ ...cur, bis: val }));
        break;
      case 'prioritaet:':
        setRotation((cur: TRotation) => ({ ...cur, prioritaet: Number(val) }));
        break;
      case 'position:':
        setRotation((cur: TRotation) => ({ ...cur, position: Number(val) }));
        break;
      case 'kommentar:':
        setRotation((cur: TRotation) => ({ ...cur, kommentar: val }));
        break;
      case 'published:':
        setRotation((cur: TRotation) => ({
          ...cur,
          published: val === 'true'
        }));
        break;
    }
  };

  const handlerSaveRotation = () => {
    saveRotation(rotation);
  };

  const handlerDeleteRotation = () => {
    deleteRotation(rotation);
  };

  return (
    <div className={styles.popup_rotation_wrapper}>
      <div className={styles.popup_rotation}>
        {rotation.rotation_id === '' ? <h2>Neue Rotation</h2> : <h2>Rotation bearbeiten</h2>}
        <Select
          label="Kontingent:"
          data={kontingente.sort((a: any, b: any) => a.position - b.position)}
          keyExtractor="id"
          optionText="name"
          value={data.kontingent_id}
          callback={onChangeKontingent}
        />
        <Input label="Beginn:" type="date" value={rotation?.von} callback={onChangeInput} />
        <Input label="Ende:" type="date" value={rotation?.bis} callback={onChangeInput} />
        <Input label="Prioritaet:" value={`${rotation?.prioritaet}`} min={1} type="number" callback={onChangeInput} />
        <Input label="Position:" value={`${rotation?.position}`} min={0} type="number" callback={onChangeInput} />
        <Input callback={onChangeInput} label="Kommentar:" value={rotation?.kommentar} />
        <Input
          callback={onChangeInput}
          label="Published:"
          type="checkbox"
          isChecked={!!rotation?.published}
          value={rotation?.published}
        />
        <div className={styles.action_btns}>
          <CustomButton className="as_icon primary" style={{ padding: '4px 10px' }} clickHandler={closePopup}>
            Schließen
          </CustomButton>
          <CustomButton clickHandler={handlerSaveRotation} className="primary" style={{ padding: '4px 10px' }}>
            Speichern
          </CustomButton>
          {rotation.rotation_id && (
            <CustomButton className="red" clickHandler={handlerDeleteRotation}>
              Löschen
            </CustomButton>
          )}
        </div>
        {errorMsg && <p className={styles.err_msg}>{errorMsg}</p>}
      </div>
    </div>
  );
}
