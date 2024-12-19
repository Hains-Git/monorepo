import React, { useEffect, useState } from 'react';
import { FaSave, FaTrash, FaUndo } from 'react-icons/fa';
import { Reason, User } from '../../helper/ts_types';
import { DBModel } from '../../datenbank/models';
import { TableData } from '../utils/table/types/table';

import styles from './datenbank.module.css';
import { DBGetterGroupedRequest } from '../../helper/api_helper';
import { returnError } from '../../helper/hains';
import { getFormDataAsObject, getNestedAttr } from '../../helper/util';
import Loader from '../utils/loader/Loader';
import CustomButton from '../utils/custom-button/CustomButton';
import { development } from '../../helper/flags';

function Form({
  user,
  hainsOauth,
  model,
  row,
  reset,
  removeRow,
  showForm,
  addRows
}: {
  user: User;
  hainsOauth: any;
  model: DBModel;
  row: TableData | null;
  reset: () => void;
  removeRow: (row: TableData) => void;
  addRows: (row: TableData[]) => void;
  showForm: boolean;
}) {
  const isAdmin = user?.is_admin;
  const validRow = model?.createData || row?.id;
  const canDelete = model?.showLoeschen && row?.id;
  const [formSelectOptions, setFormSelectOptions] = useState<any>({});
  const [showLoader, setShowLoader] = useState(false);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (!validRow) return;
    const form = evt.currentTarget;
    const data = new FormData(form);
    const formDataObject = getFormDataAsObject(data);
    if (hainsOauth?.api && model?.getForm) {
      if (development) console.log('formDataObject', formDataObject, form);
      setShowLoader(() => true);
      hainsOauth.api(
        'db_update',
        'post',
        { ...formDataObject, routeBase: model.routeBase },
        (res: any) => {
          if (Array.isArray(res)) {
            addRows(res as TableData[]);
          } else {
            let msg = 'Es gab Probleme mit dem Speichern!';
            if (typeof res?.data === 'string') msg = res.data;
            else if (typeof res?.error === 'string') msg = res.error;
            alert(msg);
          }
          setShowLoader(() => false);
        },
        (err: Reason) => {
          setShowLoader(() => false);
          returnError(err);
        }
      );
    }
  };

  const deleteHandler = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined
  ) => {
    if (!canDelete || !evt) return;
    const target = evt.currentTarget;
    let parent = target.parentElement;
    while (parent && parent.tagName !== 'FORM') {
      parent = parent.parentElement;
    }
    if (parent && parent.tagName === 'FORM') {
      const data = new FormData(parent as HTMLFormElement);
      const id = data.get('id');
      const currentRow = row;
      const valid = currentRow && hainsOauth?.api && model?.getForm && id;
      if (
        valid &&
        window.confirm('Soll der Eintrag wirklich gelöscht werden?')
      ) {
        setShowLoader(() => true);
        hainsOauth.api(
          'db_delete',
          'post',
          { routeBase: model.routeBase, id },
          (res: any) => {
            if (res?.destroyed) {
              reset();
              removeRow(currentRow);
            } else {
              alert(res?.info || 'Eintrag konnte nicht entfernt werden!');
            }
            setShowLoader(() => false);
          },
          (err: Reason) => {
            setShowLoader(() => false);
            returnError(err);
          }
        );
      } else if (!valid) {
        alert(`Löschen der ID: ${id} nicht möglich!`);
      }
    }
  };

  useEffect(() => {
    if (isAdmin && hainsOauth?.api && model?.formSelectOptions) {
      setShowLoader(() => true);
      DBGetterGroupedRequest(hainsOauth, model.formSelectOptions, (res) => {
        setFormSelectOptions(() => res);
        setShowLoader(() => false);
      });
    }
    return () => {
      setFormSelectOptions(() => ({}));
    };
  }, [user, hainsOauth, model]);

  if (!isAdmin || !model?.getForm || !showForm || !validRow) return null;
  const id = getNestedAttr(row, 'id');
  const name = getNestedAttr(row, 'planname') || getNestedAttr(row, 'name');
  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <div className={styles.form_head}>
        {model.showSpeichern && (
          <CustomButton title="Speichern" type="submit">
            <FaSave size="1.2rem" />
          </CustomButton>
        )}
        {model.showreset && (
          <CustomButton title="Reset" clickHandler={reset}>
            <FaUndo size="1.2rem" />
          </CustomButton>
        )}
        {canDelete && (
          <CustomButton
            className={styles.delete_button}
            title="Löschen"
            clickHandler={deleteHandler}
          >
            <FaTrash size="1.2rem" />
          </CustomButton>
        )}
        {showLoader && <Loader />}
        <input type="hidden" name="id" value={row?.id || '0'} />
      </div>
      {id && (
        <p className={styles.form_edit_hint}>
          Sie bearbeiten den Eintrag mit ID: {id} {name ? `(${name})` : ''}
        </p>
      )}
      <div className={styles.form_body}>
        {model.getForm(row, formSelectOptions)}
      </div>
    </form>
  );
}

export default Form;
