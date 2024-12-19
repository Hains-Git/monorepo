import React, { useContext } from 'react';
import { FaSave } from 'react-icons/fa';
import styles from '../../../mitarbeiterinfo/app.module.css';
import CustomButton from '../../utils/custom-button/CustomButton';

import { AbsprachePopupContext } from '../../../context/mitarbeiterinfo/AbsprachePopupProvider';
import AutoEinteilenFields from '../form/AutoEinteilenFields';
import {
  TArbeitszeitAbspracheForm,
  TAutoEinteilungForm,
  TNichtEinteilenAbspracheForm
} from '../../../helper/api_data_types';
import AbreitszeitAbsprachenFields from '../form/ArbeitszeitAbsprachenFields';
import NichteinteilenAbsprachenFields from '../form/NichteinteilenAbsprachenFields';
import { DataContext } from '../../../context/mitarbeiterinfo/DataProvider';
import { numericLocaleCompare } from '../../../helper/util';

function AbsprachePopup() {
  const { close, handleSubmit, editData, title } = useContext(
    AbsprachePopupContext
  );
  const { data } = useContext(DataContext);

  if (!editData) return null;

  const dienste = data.dienste.sort((a, b) =>
    numericLocaleCompare(a.planname, b.planname)
  );
  const zeitraumkategorie = data.zeitraumkategorie.sort((a, b) =>
    numericLocaleCompare(a.name, b.name)
  );

  const themen = data.themen.sort((a, b) =>
    numericLocaleCompare(a.name, b.name)
  );

  const standorte = data.standorte.sort((a, b) =>
    numericLocaleCompare(a.name, b.name)
  );

  const getFields = () => {
    switch (editData.type) {
      case 'automatischeeinteilungen':
        return (
          <AutoEinteilenFields
            editData={editData as TAutoEinteilungForm}
            dienste={dienste}
            zeitraumkategorie={zeitraumkategorie}
          />
        );
      case 'arbeitszeitabsprachen':
        return (
          <AbreitszeitAbsprachenFields
            editData={editData as TArbeitszeitAbspracheForm}
            zeitraumkategorie={zeitraumkategorie}
          />
        );
      case 'nichteinteilenabsprachen':
        return (
          <NichteinteilenAbsprachenFields
            themen={themen}
            standorte={standorte}
            editData={editData as TNichtEinteilenAbspracheForm}
            zeitraumkategorie={zeitraumkategorie}
          />
        );
    }
  };

  return (
    <div className={styles.popup_wrapper}>
      <div className={styles.popup_content}>
        <div className={styles.popup_header}>
          <h2>{title}</h2>
          <CustomButton clickHandler={close}>X</CustomButton>
        </div>
        <div className={styles.absprache_popup_body}>
          <form onSubmit={handleSubmit}>
            {getFields()}
            <CustomButton type="submit" className="primary">
              <FaSave />
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AbsprachePopup;
