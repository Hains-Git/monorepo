import React, { useState, createContext, useMemo, useContext } from 'react';

import { ApiContext } from './ApiProvider';
import { OAuthContext } from '../OAuthProvider';

import { deepClone, getFormDataAsObject } from '../../helper/util';
import {
  AbspracheType,
  TAbsprache,
  TAbspracheForm,
  TArbeitszeitAbspracheForm,
  TAutoEinteilungForm,
  TNichtEinteilenAbspracheForm
} from '../../helper/api_data_types';

type TContext = {
  mitarbeiter_id: number;
  close: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  editAbsprache: (absprache: TAbsprache, type: AbspracheType) => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  createAbsprache: (type: AbspracheType) => void;
  editData: TAbspracheForm | null;
  title: string;
};
const AbsprachePopupContext = createContext<TContext>({
  mitarbeiter_id: 0,
  close: () => {},
  handleSubmit: () => {},
  editAbsprache: () => {},
  setTitle: () => {},
  createAbsprache: () => {},
  editData: null,
  title: ''
});

type TProps = {
  children: React.ReactNode;
  mitarbeiter_id: number;
};

function AbsprachePopupProvider({ children, mitarbeiter_id }: TProps) {
  const [editData, setEditData] = useState<TAbspracheForm | null>(null);
  const [title, setTitle] = useState('');
  const { addAbsprache, getNewEinteilungen } = useContext(ApiContext);
  const { hainsOAuth, returnError } = useContext(OAuthContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editData) return;
    const _form: HTMLFormElement = event.currentTarget;
    const formData = new FormData(_form);
    const formDataObject = getFormDataAsObject(formData);
    formDataObject.mitarbeiter_id = mitarbeiter_id;
    formDataObject.id = editData.id;
    const type = editData.type;
    hainsOAuth
      .api('db_update', 'post', {
        ...formDataObject,
        routeBase: type
      })
      .then((res: any) => {
        if (type === 'automatischeeinteilungen') {
          const start = formDataObject.auto_einteilen_von;
          const end = formDataObject.auto_einteilen_bis;
          if (start && end) {
            getNewEinteilungen({
              start,
              end,
              id: mitarbeiter_id
            });
          }
        }

        if (Array.isArray(res)) {
          res.forEach((item: TAbsprache) => {
            addAbsprache(item, type);
          });
        }
        setEditData(null);
      }, returnError);
  };

  const editAbsprache = (absprache: TAbsprache, type: AbspracheType) => {
    const _data = { ...deepClone(absprache), type };
    setEditData(_data);
  };

  const createAbsprache = (type: AbspracheType) => {
    switch (type) {
      case 'automatischeeinteilungen':
        setEditData(() => {
          const _data: TAutoEinteilungForm = {
            id: 0,
            mitarbeiter_id,
            po_dienst_id: 0,
            von: '',
            bis: '',
            zeitraumkategorie_id: 0,
            days: 0
          };
          return { ..._data, type };
        });
        break;
      case 'arbeitszeitabsprachen':
        setEditData(() => {
          const _data: TArbeitszeitAbspracheForm = {
            id: 0,
            mitarbeiter_id,
            von: '',
            bis: '',
            zeitraumkategorie_id: 0,
            pause: 0,
            arbeitszeit_von: '',
            arbeitszeit_bis: '',
            arbeitszeit_bis_time: '',
            arbeitszeit_von_time: '',
            bemerkung: ''
          };
          return { ..._data, type };
        });
        break;
      case 'nichteinteilenabsprachen':
        setEditData(() => {
          const _data: TNichtEinteilenAbspracheForm = {
            id: 0,
            mitarbeiter_id,
            von: '',
            bis: '',
            zeitraumkategorie_id: 0,
            nicht_einteilen_standort_themens: []
          };
          return { ..._data, type };
        });
        break;
    }
  };

  const close = () => {
    setEditData(null);
  };

  const providerValue = useMemo<TContext>(
    () => ({
      mitarbeiter_id,
      handleSubmit,
      editAbsprache,
      setTitle,
      createAbsprache,
      editData,
      close,
      title
    }),
    [editData, title, mitarbeiter_id]
  );

  return (
    <AbsprachePopupContext.Provider value={providerValue}>
      {children}
    </AbsprachePopupContext.Provider>
  );
}

export { AbsprachePopupProvider, AbsprachePopupContext };
