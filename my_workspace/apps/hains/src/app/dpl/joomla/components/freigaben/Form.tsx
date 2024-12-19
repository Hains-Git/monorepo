import React, { useEffect, useState } from 'react';
import { Freigabestatus } from '../utils/table/types/freigaben';
import { TableData } from '../utils/table/types/table';
import { UseMounted } from '../../hooks/use-mounted';
import Loader from '../utils/loader/Loader';
import styles from './freigaben.module.css';
import { resetElementPosition } from '../../helper/util';
import CustomButton from '../utils/custom-button/CustomButton';

export type FormData = {
  row: TableData;
  mitarbeiter_id: number;
  freigabetyp_id: number;
  freigabestatus_id: number;
  freigabe_id: number;
  planname: string;
  freigabetyp: string;
  position: number[];
} | null;

function Form({
  formData,
  freigabestatuse,
  formHandler,
  closeForm
}: {
  formData: FormData;
  formHandler: (
    freigabestatus_id: number,
    setLoader: (bool: boolean) => void
  ) => void;
  closeForm: () => void;
  freigabestatuse: Freigabestatus[];
}) {
  const [showLoader, setShowLoader] = useState(false);
  const [style, setStyle] = useState({ left: '0px', top: '0px' });
  const mounted = UseMounted();

  useEffect(() => {
    if (formData) {
      setStyle({
        left: `${formData.position[0]}px`,
        top: `${formData.position[1]}px`
      });
    }
  }, [formData]);

  if (!formData) return null;
  return (
    <form
      className={styles.form}
      style={style}
      onClick={(evt) => {
        evt.stopPropagation();
      }}
      ref={(el) => el && resetElementPosition<HTMLFormElement>(el)}
    >
      <div>
        {showLoader && <Loader />}
        <p>
          {formData.planname}, {formData.freigabetyp}
        </p>
        <CustomButton clickHandler={closeForm}>X</CustomButton>
      </div>

      <select
        value={formData.freigabestatus_id}
        onChange={(evt) => {
          const value = parseInt(evt.target.value, 10);
          setShowLoader(() => true);
          formHandler(value, (bool) => {
            mounted && setShowLoader(() => bool);
          });
        }}
      >
        {freigabestatuse.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </form>
  );
}

export default Form;
