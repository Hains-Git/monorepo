import React, { createContext, useState, useMemo } from 'react';

import { TRotation } from '../../helper/api_data_types';

type TPopupContext = {
  closePopup: () => void;
  saveRotation: (rot: TRotation) => void;
  deleteRotation: (rot: TRotation) => void;
  errorMsg: string;
};

const PopupContext = createContext<TPopupContext>({
  closePopup: () => {},
  saveRotation: () => {},
  deleteRotation: () => {},
  errorMsg: ''
});

interface Props {
  children: React.ReactNode;
  hainsOAuth: any;
  returnError: any;
  setRotationen: React.SetStateAction<any>;
  setRotationData: React.SetStateAction<any>;
}

const PopupProvider: React.FC<Props> = ({
  children,
  hainsOAuth,
  returnError,
  setRotationen,
  setRotationData
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const closePopup = () => {
    setRotationData(null);
  };

  const saveRotation = (rotation: TRotation) => {
    hainsOAuth.api('rotationsupdate', 'post', rotation).then(
      (resData: any) => {
        setRotationen((cur: any) => {
          let rots = cur;
          if (resData.id === rotation.id) {
            rots = cur.filter((rot: TRotation) => rot.id !== resData.id);
          }
          return [...rots, resData];
        });
        setRotationData(null);
      },
      (err: any) => {
        setErrorMsg('Something went wrong!');
        returnError(err);
      }
    );
  };

  const deleteRotation = (rotation: TRotation) => {
    const rotation_id = rotation.id;
    hainsOAuth.api('removerotation', 'post', { rotation_id }).then(
      () => {
        setRotationen((cur: TRotation[]) => {
          const filtered = cur.filter(
            (rot: TRotation) => rot.id !== rotation_id
          );
          return filtered;
        });
        setRotationData(null);
      },
      (err: any) => {
        setErrorMsg('Something went wrong!');
        returnError(err);
      }
    );
  };

  const providerValue = useMemo(
    () => ({
      closePopup,
      saveRotation,
      deleteRotation,
      errorMsg
    }),
    []
  );

  return (
    <PopupContext.Provider value={providerValue}>
      {children}
    </PopupContext.Provider>
  );
};

export { PopupContext, PopupProvider };
